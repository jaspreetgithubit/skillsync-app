const assert = require('node:assert/strict');
const { test } = require('node:test');
const { MockLanguageModelV3 } = require('ai/test');
const { createSdkStructuredOutputAdapter } = require('../services/sdkStructuredOutputAdapter');
const { resumeProfileSchema } = require('../services/resumeProfileSchema');
const { validProfile } = require('../test-support/resumeFixtures');

const config = { aiTemperature: 0, aiMaxRetries: 0, aiTimeoutMs: 2000 };
const usage = {
  inputTokens: { total: 14, noCache: 14, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 24, text: 24, reasoning: 0 }
};

test('uses the shared structured-output contract with a local AI SDK mock', async () => {
  const model = new MockLanguageModelV3({
    provider: 'mock',
    modelId: 'mock-model',
    doGenerate: async () => ({
      content: [{ type: 'text', text: JSON.stringify(validProfile()) }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage,
      warnings: []
    })
  });
  const adapter = createSdkStructuredOutputAdapter({
    provider: 'gemini',
    modelId: 'gemini-test',
    model,
    config
  });

  const result = await adapter.generateStructuredOutput({
    systemPrompt: 'Extract only supported facts.',
    userPrompt: 'Resume text.',
    schema: resumeProfileSchema,
    schemaName: 'student_resume_profile'
  });

  assert.equal(result.provider, 'gemini');
  assert.equal(result.model, 'gemini-test');
  assert.equal(result.data.personalInformation.fullName, 'Ada Student');
  assert.deepEqual(result.usage, { inputTokens: 14, outputTokens: 24 });
  assert.equal(model.doGenerateCalls.length, 1);
});

test('does not return success when a provider generates no structured output', async () => {
  const model = new MockLanguageModelV3({
    doGenerate: async () => ({
      content: [],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage,
      warnings: []
    })
  });
  const adapter = createSdkStructuredOutputAdapter({
    provider: 'xai',
    modelId: 'xai-test',
    model,
    config
  });

  await assert.rejects(adapter.generateStructuredOutput({
    systemPrompt: 'system',
    userPrompt: 'user',
    schema: resumeProfileSchema,
    schemaName: 'student_resume_profile'
  }));
});
