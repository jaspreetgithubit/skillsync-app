const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  classifyProviderError,
  createResumeProcessingService
} = require('../services/resumeProcessingService');
const { validProfile } = require('../test-support/resumeFixtures');

const config = {
  maxFileSizeBytes: 1024,
  maxPages: 10,
  maxTextChars: 30000,
  aiTimeoutMs: 30000,
  aiMaxRetries: 1,
  aiTemperature: 0
};
const document = { text: 'Ada Student worked with React and built a project.', filename: 'resume.pdf', fileType: 'pdf', pageCount: 1 };
const silentLogger = { info() {}, warn() {} };

test('returns one normalized profile schema with warnings and extraction metadata', async () => {
  const service = createResumeProcessingService({
    config,
    extract: async () => document,
    providerFactory: async () => ({
      generateStructuredOutput: async ({ systemPrompt, userPrompt, schemaName }) => {
        assert.match(systemPrompt, /untrusted data/);
        assert.match(userPrompt, /Ada Student/);
        assert.equal(schemaName, 'student_resume_profile');
        return { data: validProfile(), provider: 'gemini', model: 'gemini-test' };
      }
    }),
    logger: silentLogger
  });
  const result = await service.process({ buffer: Buffer.from('unused') }, { requestId: 'request-id' });

  assert.deepEqual(result.sectionsExtracted, ['personalInformation', 'skills', 'projects']);
  assert.equal(result.profileDraft.skills[0].name, 'React');
  assert.equal(result.profileDraft.projects[0].description, 'Original project description.');
  assert.deepEqual(result.metadata, {
    schemaVersion: '1.0',
    provider: 'gemini',
    model: 'gemini-test',
    pageCount: 1
  });
  assert.ok(Array.isArray(result.warnings));
});

test('rejects invalid provider output instead of returning an empty profile', async () => {
  const service = createResumeProcessingService({
    config,
    extract: async () => document,
    providerFactory: async () => ({
      generateStructuredOutput: async () => ({
        data: { skills: [{ name: 'React', proficiency: 'Guru' }] },
        provider: 'openai',
        model: 'model-test'
      })
    }),
    logger: silentLogger
  });

  await assert.rejects(
    service.process({ buffer: Buffer.from('unused') }),
    (error) => error.code === 'INVALID_AI_RESPONSE' && error.status === 502
  );
});

test('maps timeout, rate limit, malformed output, and outage errors safely', () => {
  assert.equal(classifyProviderError(Object.assign(new Error('private prompt'), { name: 'TimeoutError' })).code, 'AI_TIMEOUT');
  assert.equal(classifyProviderError(Object.assign(new Error('raw response'), { statusCode: 429 })).code, 'AI_RATE_LIMITED');
  assert.equal(classifyProviderError(Object.assign(new Error('raw response'), { code: 'INVALID_STRUCTURED_OUTPUT' })).code, 'INVALID_AI_RESPONSE');
  assert.equal(classifyProviderError(new Error('raw provider response')).code, 'AI_PROVIDER_UNAVAILABLE');
  assert.doesNotMatch(classifyProviderError(new Error('secret resume content')).message, /secret resume content/);
});

test('does not log resume text, names, email, or raw provider errors', async () => {
  const logEntries = [];
  const service = createResumeProcessingService({
    config,
    extract: async () => ({ ...document, text: 'PRIVATE RESUME TEXT Ada Student ada@example.edu' }),
    providerFactory: async () => ({
      provider: 'xai',
      model: 'grok-test',
      generateStructuredOutput: async () => {
        throw new Error('PRIVATE RESUME TEXT ada@example.edu');
      }
    }),
    logger: {
      info: (entry) => logEntries.push(entry),
      warn: (entry) => logEntries.push(entry)
    }
  });

  await assert.rejects(service.process({ buffer: Buffer.from('unused') }));
  assert.equal(logEntries.length, 1);
  assert.doesNotMatch(logEntries[0], /PRIVATE RESUME TEXT|Ada Student|ada@example\.edu/);
});
