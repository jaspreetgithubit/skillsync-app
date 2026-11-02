const assert = require('node:assert/strict');
const { test } = require('node:test');
const { getAIConfig } = require('../config/resumeConfig');
const { createAIProvider } = require('../services/aiProviderFactory');

test('selects OpenAI, Gemini, and xAI adapters without cross-provider fallback', async () => {
  const selected = [];
  const factories = Object.fromEntries(['openai', 'gemini', 'xai'].map((provider) => [
    provider,
    async (config) => {
      selected.push({ provider, config });
      return { provider, generateStructuredOutput: async () => ({}) };
    }
  ]));

  for (const provider of ['openai', 'gemini', 'xai']) {
    const result = await createAIProvider({
      AI_PROVIDER: provider,
      AI_API_KEY: `${provider}-key`
    }, factories);
    assert.equal(result.provider, provider);
  }
  assert.deepEqual(selected.map((item) => item.provider), ['openai', 'gemini', 'xai']);
});

test('accepts grok as an xAI alias and keeps the selected API key private', () => {
  const result = getAIConfig({ AI_PROVIDER: 'grok', AI_API_KEY: 'secret-key' });
  assert.equal(result.provider, 'xai');
  assert.equal(result.apiKey, 'secret-key');
});

test('applies provider defaults and an optional model override centrally', () => {
  assert.equal(getAIConfig({ AI_PROVIDER: 'openai', AI_API_KEY: 'key' }).model, 'gpt-4o-mini');
  assert.equal(getAIConfig({ AI_PROVIDER: 'gemini', AI_API_KEY: 'key' }).model, 'gemini-2.5-flash');
  assert.equal(getAIConfig({ AI_PROVIDER: 'xai', AI_API_KEY: 'key' }).model, 'grok-4.7');
  assert.equal(getAIConfig({ AI_PROVIDER: 'openai', AI_API_KEY: 'key', AI_MODEL: 'custom-model' }).model, 'custom-model');
});

test('rejects missing keys, unknown providers, and invalid model strings without fallback', async () => {
  assert.throws(() => getAIConfig({ AI_PROVIDER: 'gemini' }), /AI_API_KEY is required/);
  assert.throws(() => getAIConfig({ AI_PROVIDER: 'other', AI_API_KEY: 'key' }), /AI_PROVIDER must be/);
  assert.throws(() => getAIConfig({ AI_PROVIDER: 'openai', AI_API_KEY: 'key', AI_MODEL: 'invalid model' }), /AI_MODEL/);

  const used = [];
  await assert.rejects(
    createAIProvider({ AI_PROVIDER: 'unknown', AI_API_KEY: 'key' }, {
      openai: async () => used.push('openai'),
      gemini: async () => used.push('gemini'),
      xai: async () => used.push('xai')
    }),
    /AI_PROVIDER must be/
  );
  assert.deepEqual(used, []);
});

test('does not silently fall back if the selected adapter is unavailable', async () => {
  const used = [];
  await assert.rejects(
    createAIProvider({ AI_PROVIDER: 'gemini', AI_API_KEY: 'key' }, {
      openai: async () => used.push('openai'),
      gemini: undefined,
      xai: async () => used.push('xai')
    }),
    /No adapter is registered/
  );
  assert.deepEqual(used, []);
});
