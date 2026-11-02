const { getAIConfig, getResumeConfig } = require('../config/resumeConfig');
const { createOpenAIAdapter } = require('./providers/openaiAdapter');
const { createGeminiAdapter } = require('./providers/geminiAdapter');
const { createXAIAdapter } = require('./providers/xaiAdapter');

const ADAPTER_FACTORIES = Object.freeze({
  openai: createOpenAIAdapter,
  gemini: createGeminiAdapter,
  xai: createXAIAdapter
});

async function createAIProvider(env = process.env, adapterFactories = ADAPTER_FACTORIES) {
  const aiConfig = getAIConfig(env);
  const factory = adapterFactories[aiConfig.provider];
  if (!factory) throw new Error(`No adapter is registered for ${aiConfig.provider}`);
  return factory({ ...aiConfig, ...getResumeConfig(env) });
}

module.exports = { ADAPTER_FACTORIES, createAIProvider };
