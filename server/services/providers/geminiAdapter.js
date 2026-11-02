const { createSdkStructuredOutputAdapter } = require('../sdkStructuredOutputAdapter');

async function createGeminiAdapter(config) {
  const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
  const client = createGoogleGenerativeAI({ apiKey: config.apiKey });
  return createSdkStructuredOutputAdapter({
    provider: 'gemini',
    modelId: config.model,
    model: client(config.model),
    config
  });
}

module.exports = { createGeminiAdapter };
