// Deterministic minimal document binaries for parser tests.
function createPdf(text, pageCount = 1) {
  const objects = new Map();
  const pageIds = Array.from({ length: pageCount }, (_, index) => 3 + index * 2);
  const fontId = 3 + pageCount * 2;
  objects.set(1, '<< /Type /Catalog /Pages 2 0 R >>');
  objects.set(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`);

  pageIds.forEach((pageId, index) => {
    const textContent = index === 0 ? text : `Second page ${index + 1}`;
    const escapedText = textContent.replace(/[\\()]/g, '\\$&');
    const stream = `BT /F1 12 Tf 72 720 Td (${escapedText}) Tj ET`;
    const contentId = pageId + 1;
    objects.set(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.set(contentId, `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  });
  objects.set(fontId, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  let document = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id <= fontId; id += 1) {
    offsets.push(Buffer.byteLength(document, 'binary'));
    document += `${id} 0 obj\n${objects.get(id)}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(document, 'binary');
  document += `xref\n0 ${fontId + 1}\n0000000000 65535 f \n`;
  document += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  document += `trailer\n<< /Size ${fontId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(document, 'binary');
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createStoredZip(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const [filename, value] of entries) {
    const name = Buffer.from(filename);
    const data = Buffer.from(value);
    const checksum = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, name);
    localOffset += localHeader.length + name.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(entries.length, 8);
  endRecord.writeUInt16LE(entries.length, 10);
  endRecord.writeUInt32LE(centralDirectory.length, 12);
  endRecord.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

function createDocx(text, pageCount = 1) {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p><w:sectPr/></w:body>
    </w:document>`;
  const typesXml = `<?xml version="1.0" encoding="UTF-8"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    </Types>`;
  const appXml = `<?xml version="1.0" encoding="UTF-8"?>
    <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
      <Pages>${pageCount}</Pages>
    </Properties>`;
  return createStoredZip([
    ['[Content_Types].xml', typesXml],
    ['word/document.xml', documentXml],
    ['docProps/app.xml', appXml]
  ]);
}

function validProfile(overrides = {}) {
  return {
    personalInformation: {
      fullName: 'Ada Student',
      email: 'ada@example.edu',
      phone: null,
      location: null,
      headline: null,
      professionalSummary: null
    },
    skills: [
      { name: 'React.js', originalName: null, category: 'Frontend', proficiency: null, evidence: 'Built a React.js app', confidence: 0.8 },
      { name: 'ReactJS', originalName: null, category: 'Frontend', proficiency: null, evidence: 'Used ReactJS', confidence: 0.7 },
      { name: 'Java', originalName: null, category: 'Language', proficiency: null, evidence: null, confidence: null },
      { name: 'JavaScript', originalName: null, category: 'Language', proficiency: null, evidence: null, confidence: null }
    ],
    education: [],
    experience: [],
    projects: [{
      title: 'Resume Parser',
      description: 'Original project description.',
      technologies: ['NodeJS', 'Mongo DB'],
      category: 'Academic',
      role: null,
      startDate: null,
      endDate: null,
      achievements: [],
      evidence: null
    }],
    certifications: [],
    achievements: [],
    languages: [],
    interests: [],
    ...overrides
  };
}

module.exports = { createDocx, createPdf, validProfile };
