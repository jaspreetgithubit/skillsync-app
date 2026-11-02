const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  ResumeProcessingError,
  extractResumeText,
  validateResumeFile
} = require('../services/resumeDocumentExtractor');
const { createDocx, createPdf } = require('../test-support/resumeFixtures');

const config = {
  maxFileSizeBytes: 1024 * 1024,
  maxPages: 2,
  maxTextChars: 1000
};
const pdfFile = (buffer, overrides = {}) => ({
  buffer,
  originalname: 'student.pdf',
  mimetype: 'application/pdf',
  ...overrides
});
const docxFile = (buffer, overrides = {}) => ({
  buffer,
  originalname: 'student.docx',
  mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ...overrides
});

test('extracts readable text and page count from a valid PDF', async () => {
  const result = await extractResumeText(pdfFile(createPdf('Ada Student React Node.js')), config);
  assert.match(result.text, /Ada Student React Node\.js/);
  assert.equal(result.pageCount, 1);
  assert.equal(result.fileType, 'pdf');
});

test('extracts readable text from a valid DOCX', async () => {
  const result = await extractResumeText(docxFile(createDocx('Ada Student built a React application')), config);
  assert.match(result.text, /Ada Student built a React application/);
  assert.equal(result.pageCount, 1);
});

test('reports an empty uploaded file', async () => {
  await assert.rejects(
    extractResumeText(pdfFile(Buffer.alloc(0)), config),
    (error) => error instanceof ResumeProcessingError && error.code === 'EMPTY_FILE'
  );
});

test('rejects a PDF with no extractable text as scanned/empty', async () => {
  await assert.rejects(
    extractResumeText(pdfFile(createPdf('')), config),
    (error) => error.code === 'SCANNED_PDF'
  );
});

test('reports corrupted PDF and DOCX documents', async () => {
  await assert.rejects(
    extractResumeText(pdfFile(Buffer.from('%PDF-1.4\nnot a document')), config),
    (error) => error.code === 'CORRUPT_DOCUMENT'
  );
  await assert.rejects(
    extractResumeText(docxFile(Buffer.from('PK\x03\x04invalid archive')), config),
    (error) => error.code === 'CORRUPT_DOCUMENT'
  );
});

test('reports password-protected PDFs without exposing parser errors', async () => {
  class PasswordParser {
    async getInfo() {
      const error = new Error('password required');
      error.name = 'PasswordException';
      throw error;
    }

    async destroy() {}
  }

  await assert.rejects(
    extractResumeText(pdfFile(createPdf('A sufficiently long resume text')), config, {
      PdfParser: PasswordParser
    }),
    (error) => error.code === 'PASSWORD_PROTECTED_PDF' && !error.message.includes('password required')
  );
});

test('rejects unsupported extensions and mismatched MIME types', () => {
  assert.throws(
    () => validateResumeFile(pdfFile(createPdf('Resume text'), { originalname: 'resume.txt' }), config.maxFileSizeBytes),
    (error) => error.code === 'UNSUPPORTED_FILE_TYPE'
  );
  assert.throws(
    () => validateResumeFile(pdfFile(createPdf('Resume text'), { mimetype: 'text/plain' }), config.maxFileSizeBytes),
    (error) => error.code === 'MIME_TYPE_MISMATCH'
  );
});

test('rejects file signatures that do not match the declared format', () => {
  assert.throws(
    () => validateResumeFile(pdfFile(Buffer.from('not pdf')), config.maxFileSizeBytes),
    (error) => error.code === 'INVALID_FILE_SIGNATURE'
  );
  assert.throws(
    () => validateResumeFile(docxFile(Buffer.from('not zip')), config.maxFileSizeBytes),
    (error) => error.code === 'INVALID_FILE_SIGNATURE'
  );
});

test('enforces file, page, and extracted-text limits without truncation', async () => {
  assert.throws(
    () => validateResumeFile(pdfFile(createPdf('Resume text')), 10),
    (error) => error.code === 'FILE_TOO_LARGE'
  );
  await assert.rejects(
    extractResumeText(pdfFile(createPdf('A sufficiently long resume text', 3)), config),
    (error) => error.code === 'PAGE_LIMIT_EXCEEDED'
  );
  await assert.rejects(
    extractResumeText(docxFile(createDocx('A sufficiently long resume text', 3)), config),
    (error) => error.code === 'PAGE_LIMIT_EXCEEDED'
  );
  await assert.rejects(
    extractResumeText(pdfFile(createPdf('Ada resume details. '.repeat(60))), { ...config, maxTextChars: 100 }),
    (error) => error.code === 'TEXT_LIMIT_EXCEEDED'
  );
});

test('sanitizes filenames used in draft metadata', () => {
  const file = pdfFile(createPdf('A sufficiently long resume text'), { originalname: '..\\private\\resume.pdf' });
  assert.equal(validateResumeFile(file, config.maxFileSizeBytes).filename, '.._private_resume.pdf');
});
