const DEFAULT_MODELS = Object.freeze({
  openai: 'gpt-4o-mini',
  gemini: 'gemini-2.5-flash',
  xai: 'grok-4.7'
});

function readNumber(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be a number between ${min} and ${max}`);
  }
  return value;
}

function readInteger(env, name, fallback, min, max) {
  const value = readNumber(env, name, fallback, min, max);
  if (!Number.isInteger(value)) throw new Error(`${name} must be a whole number`);
  return value;
}

function getResumeConfig(env = process.env) {
  return {
    maxFileSizeBytes: readNumber(env, 'RESUME_MAX_FILE_SIZE_MB', 5, 1, 25) * 1024 * 1024,
    maxPages: readInteger(env, 'RESUME_MAX_PAGES', 10, 1, 50),
    maxTextChars: readInteger(env, 'RESUME_MAX_TEXT_CHARS', 30000, 1000, 100000),
    aiTimeoutMs: readNumber(env, 'AI_TIMEOUT_MS', 30000, 1000, 120000),
    aiMaxRetries: readInteger(env, 'AI_MAX_RETRIES', 1, 0, 3),
    aiTemperature: readNumber(env, 'AI_TEMPERATURE', 0, 0, 2),
    draftTtlMinutes: readInteger(env, 'ONBOARDING_DRAFT_TTL_MINUTES', 30, 5, 1440)
  };
}

function getAIConfig(env = process.env, { requireApiKey = true } = {}) {
  const configuredProvider = (env.AI_PROVIDER || 'gemini').trim().toLowerCase();
  const provider = configuredProvider === 'grok' ? 'xai' : configuredProvider;
  if (!Object.hasOwn(DEFAULT_MODELS, provider)) {
    throw new Error('AI_PROVIDER must be openai, gemini, or xai (grok is also accepted)');
  }

  const apiKey = (env.AI_API_KEY || '').trim();
  if (requireApiKey && !apiKey) {
    throw new Error(`AI_API_KEY is required for the selected ${provider} provider`);
  }

  const model = (env.AI_MODEL || '').trim() || DEFAULT_MODELS[provider];
  if (!/^[A-Za-z0-9_.:/-]{1,120}$/.test(model)) {
    throw new Error('AI_MODEL contains unsupported characters');
  }

  return { provider, apiKey, model };
}

module.exports = { DEFAULT_MODELS, getAIConfig, getResumeConfig };
