const { createSdkStructuredOutputAdapter } = require('../sdkStructuredOutputAdapter');

async function createOpenAIAdapter(config) {
  const { createOpenAI } = await import('@ai-sdk/openai');
  const client = createOpenAI({ apiKey: config.apiKey });
  return createSdkStructuredOutputAdapter({
    provider: 'openai',
    modelId: config.model,
    model: client(config.model),
    config
  });
}

module.exports = { createOpenAIAdapter };
