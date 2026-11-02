const { createSdkStructuredOutputAdapter } = require('../sdkStructuredOutputAdapter');

async function createXAIAdapter(config) {
  const { createXai } = await import('@ai-sdk/xai');
  const client = createXai({ apiKey: config.apiKey });
  return createSdkStructuredOutputAdapter({
    provider: 'xai',
    modelId: config.model,
    model: client(config.model),
    config
  });
}

module.exports = { createXAIAdapter };
