const { randomUUID } = require('node:crypto');
const { getResumeConfig } = require('../config/resumeConfig');
const { extractResumeText } = require('./resumeDocumentExtractor');
const { createAIProvider } = require('./aiProviderFactory');
const { resumeProfileSchema } = require('./resumeProfileSchema');
const { getExtractedSections, getProfileWarnings, normalizeResumeProfile } = require('./resumeNormalization');
const { createResumeExtractionPrompt, RESUME_EXTRACTION_SYSTEM_PROMPT } = require('./resumeExtractionPrompt');

class ResumeProviderError extends Error {
  constructor(code, message, status = 502) {
    super(message);
    this.name = 'ResumeProviderError';
    this.code = code;
    this.status = status;
  }
}

function classifyProviderError(error) {
  if (error?.code === 'INVALID_STRUCTURED_OUTPUT' || error?.name === 'NoOutputGeneratedError') {
    return new ResumeProviderError('INVALID_AI_RESPONSE', 'The AI provider returned an invalid response. Please retry.', 502);
  }
  if (error?.name === 'TimeoutError' || error?.name === 'AbortError' || error?.code === 'ETIMEDOUT') {
    return new ResumeProviderError('AI_TIMEOUT', 'Resume analysis timed out. Please try again.', 504);
  }
  const status = Number(error?.statusCode || error?.status);
  if (status === 429) {
    return new ResumeProviderError('AI_RATE_LIMITED', 'The AI provider is temporarily rate-limiting requests. Please retry later.', 503);
  }
  return new ResumeProviderError('AI_PROVIDER_UNAVAILABLE', 'Resume analysis is temporarily unavailable. Please try again later.', 503);
}

function createResumeProcessingService({
  config = getResumeConfig(),
  providerFactory = createAIProvider,
  extract = extractResumeText,
  logger = console
} = {}) {
  return {
    async process(file, { requestId } = {}) {
      const document = await extract(file, config);
      let provider;
      let result;
      const startedAt = Date.now();
      try {
        provider = await providerFactory();
        result = await provider.generateStructuredOutput({
          systemPrompt: RESUME_EXTRACTION_SYSTEM_PROMPT,
          userPrompt: createResumeExtractionPrompt(document.text),
          schema: resumeProfileSchema,
          schemaName: 'student_resume_profile'
        });
      } catch (error) {
        const safeError = classifyProviderError(error);
        logger.warn(JSON.stringify({
          event: 'resume_extraction_failed',
          requestId,
          provider: provider?.provider || 'unavailable',
          model: provider?.model || 'unavailable',
          category: safeError.code,
          latencyMs: Date.now() - startedAt
        }));
        throw safeError;
      }

      let profileDraft;
      try {
        profileDraft = normalizeResumeProfile(result.data);
      } catch (error) {
        logger.warn(JSON.stringify({
          event: 'resume_extraction_failed',
          requestId,
          provider: result.provider,
          model: result.model,
          category: 'INVALID_AI_RESPONSE',
          latencyMs: Date.now() - startedAt
        }));
        throw new ResumeProviderError('INVALID_AI_RESPONSE', 'The AI provider returned profile data that could not be validated. Please retry.', 502);
      }

      const sectionsExtracted = getExtractedSections(profileDraft);
      const warnings = getProfileWarnings(profileDraft);
      logger.info(JSON.stringify({
        event: 'resume_extraction_completed',
        requestId: requestId || randomUUID(),
        provider: result.provider,
        model: result.model,
        latencyMs: Date.now() - startedAt,
        sectionCount: sectionsExtracted.length,
        pageCount: document.pageCount
      }));

      return {
        profileDraft,
        warnings,
        sectionsExtracted,
        metadata: {
          schemaVersion: '1.0',
          provider: result.provider,
          model: result.model,
          pageCount: document.pageCount
        },
        document: { filename: document.filename, fileType: document.fileType }
      };
    }
  };
}

module.exports = {
  ResumeProviderError,
  classifyProviderError,
  createResumeProcessingService
};
