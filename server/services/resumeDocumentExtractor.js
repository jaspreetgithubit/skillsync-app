const { PDFParse, PasswordException } = require('pdf-parse');
const mammoth = require('mammoth');
const JSZip = require('jszip');

class ResumeProcessingError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'ResumeProcessingError';
    this.code = code;
    this.status = status;
  }
}

function sanitizeFilename(filename) {
  return String(filename || 'resume')
    .replace(/[\\/\u0000-\u001f\u007f]/g, '_')
    .replace(/[<>:"|?*]/g, '_')
    .slice(0, 120) || 'resume';
}

function validateResumeFile(file, maxFileSizeBytes) {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new ResumeProcessingError('FILE_REQUIRED', 'Choose a PDF or DOCX resume to continue.');
  }
  if (file.buffer.length === 0) {
    throw new ResumeProcessingError('EMPTY_FILE', 'The selected file is empty.');
  }
  if (file.buffer.length > maxFileSizeBytes) {
    throw new ResumeProcessingError('FILE_TOO_LARGE', 'The resume exceeds the configured file size limit.', 413);
  }

  const extension = sanitizeFilename(file.originalname).toLowerCase().split('.').pop();
  if (extension !== 'pdf' && extension !== 'docx') {
    throw new ResumeProcessingError('UNSUPPORTED_FILE_TYPE', 'Only PDF and DOCX resumes are supported.', 415);
  }

  const expectedMime = extension === 'pdf'
    ? 'application/pdf'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (file.mimetype !== expectedMime) {
    throw new ResumeProcessingError('MIME_TYPE_MISMATCH', 'The selected file type does not match its contents.', 415);
  }

  if (extension === 'pdf' && !file.buffer.subarray(0, 1024).includes(Buffer.from('%PDF-'))) {
    throw new ResumeProcessingError('INVALID_FILE_SIGNATURE', 'This file is not a valid PDF document.', 415);
  }
  if (extension === 'docx' && !(file.buffer[0] === 0x50 && file.buffer[1] === 0x4b)) {
    throw new ResumeProcessingError('INVALID_FILE_SIGNATURE', 'This file is not a valid DOCX document.', 415);
  }

  return { extension, filename: sanitizeFilename(file.originalname) };
}

async function extractPdfText(buffer, maxPages, PdfParser = PDFParse) {
  const parser = new PdfParser({ data: buffer });
  try {
    const info = await parser.getInfo();
    if (info.total > maxPages) {
      throw new ResumeProcessingError('PAGE_LIMIT_EXCEEDED', `The PDF has more than the ${maxPages}-page limit.`, 413);
    }
    const result = await parser.getText();
    const text = result.text || '';
    if (text.replace(/\s/g, '').length < 30) {
      throw new ResumeProcessingError(
        'SCANNED_PDF',
        'This PDF appears to be scanned or contains no usable embedded text. OCR is not currently available.'
      );
    }
    return { text, pageCount: info.total };
  } catch (error) {
    if (error instanceof ResumeProcessingError) throw error;
    if (error instanceof PasswordException || error?.name === 'PasswordException') {
      throw new ResumeProcessingError('PASSWORD_PROTECTED_PDF', 'This PDF is password-protected. Remove the password and try again.');
    }
    throw new ResumeProcessingError('CORRUPT_DOCUMENT', 'The PDF could not be read. Check the file and try again.');
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(buffer, config) {
  try {
    const archive = await JSZip.loadAsync(buffer, { createFolders: false });
    const entries = Object.values(archive.files).filter((entry) => !entry.dir);
    const uncompressedSize = entries.reduce((size, entry) => size + (entry._data?.uncompressedSize || 0), 0);
    const maxUncompressedSize = Math.max(config.maxTextChars * 50, config.maxFileSizeBytes);
    if (uncompressedSize > maxUncompressedSize) {
      throw new ResumeProcessingError(
        'DOCUMENT_EXPANSION_LIMIT',
        'The DOCX expands beyond safe processing limits. Save a simpler copy and try again.',
        413
      );
    }

    const documentEntry = archive.file('word/document.xml');
    if (!documentEntry) throw new Error('DOCX document body missing');
    const documentXml = await documentEntry.async('string');
    const appProperties = archive.file('docProps/app.xml');
    const appXml = appProperties ? await appProperties.async('string') : '';
    const pageMetadata = appXml.match(/<Pages>\s*(\d+)\s*<\/Pages>/i);
    const renderedPageBreaks = (documentXml.match(/<w:lastRenderedPageBreak\b|<w:br\b[^>]*w:type=["']page["']/g) || []).length;
    const pageCount = pageMetadata
      ? Number(pageMetadata[1])
      : (renderedPageBreaks > 0 ? renderedPageBreaks + 1 : null);
    if (pageCount !== null && pageCount > config.maxPages) {
      throw new ResumeProcessingError('PAGE_LIMIT_EXCEEDED', `The DOCX has more than the ${config.maxPages}-page limit.`, 413);
    }

    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';
    if (!text.trim()) {
      throw new ResumeProcessingError('EMPTY_DOCUMENT_TEXT', 'No readable text was found in the DOCX resume.');
    }
    return { text, pageCount };
  } catch (error) {
    if (error instanceof ResumeProcessingError) throw error;
    throw new ResumeProcessingError('CORRUPT_DOCUMENT', 'The DOCX could not be read. Check the file and try again.');
  }
}

async function extractResumeText(file, config, options = {}) {
  const { extension, filename } = validateResumeFile(file, config.maxFileSizeBytes);
  const extracted = extension === 'pdf'
    ? await extractPdfText(file.buffer, config.maxPages, options.PdfParser)
    : await extractDocxText(file.buffer, config);

  if (extracted.text.length > config.maxTextChars) {
    throw new ResumeProcessingError(
      'TEXT_LIMIT_EXCEEDED',
      `The extracted resume text exceeds the ${config.maxTextChars}-character limit. Shorten the resume and try again.`,
      413
    );
  }
  if (!extracted.text.trim()) {
    throw new ResumeProcessingError('EMPTY_DOCUMENT_TEXT', 'No readable text was found in the resume.');
  }

  return { ...extracted, filename, fileType: extension };
}

module.exports = {
  ResumeProcessingError,
  extractDocxText,
  extractPdfText,
  extractResumeText,
  sanitizeFilename,
  validateResumeFile
};
