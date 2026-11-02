function createSdkStructuredOutputAdapter({ provider, modelId, model, config }) {
  return {
    async generateStructuredOutput({ systemPrompt, userPrompt, schema, schemaName }) {
      const { generateText, Output } = await import('ai');
      const result = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt,
        output: Output.object({ schema, name: schemaName }),
        temperature: config.aiTemperature,
        maxRetries: config.aiMaxRetries,
        abortSignal: AbortSignal.timeout(config.aiTimeoutMs)
      });

      if (!result.output) {
        const error = new Error('The provider returned no structured output');
        error.code = 'INVALID_STRUCTURED_OUTPUT';
        throw error;
      }

      return {
        data: result.output,
        provider,
        model: modelId,
        usage: {
          inputTokens: result.usage?.inputTokens,
          outputTokens: result.usage?.outputTokens
        }
      };
    }
  };
}

module.exports = { createSdkStructuredOutputAdapter };
