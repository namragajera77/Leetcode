const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const vectorStore = require('./vectorStoreService');
const embeddingService = require('./embeddingService');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function chunkText(text, chunkSize = 1000, chunkOverlap = 200) {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  let idx = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length) {
      chunks.push({ text: chunk, chunkIndex: idx });
      idx += 1;
    }
    start = end - chunkOverlap;
    if (start < 0) start = 0;
  }
  return chunks;
}

exports.extractPdf = async (filePath, filename) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer).catch((err) => {
    throw new Error('Failed to parse PDF: ' + err.message);
  });

  const text = parsed.text || '';
  if (!text.trim()) throw new Error('PDF contains no extractable text');

  const chunks = chunkText(text, 1000, 200);
  return { text, chunks };
};

exports.indexPdf = async (filename, chunks) => {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error('No chunks available for indexing');
  }

  // embed and store chunks
  const collection = 'interview_notes';
  const ids = [];
  const documents = [];
  const metadatas = [];
  const embeddings = [];

  for (const c of chunks) {
    const id = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    ids.push(id);
    documents.push(c.text);
    metadatas.push({ filename, uploadDate: new Date().toISOString(), chunkIndex: c.chunkIndex });
    const emb = await embeddingService.embedText(c.text);
    embeddings.push(emb);
  }

  // persist to Chroma
  await vectorStore.ensureCollection(collection);
  await vectorStore.addDocuments(collection, { ids, documents, metadatas, embeddings });

  return { id: Date.now().toString(), name: filename, chunks: chunks.length };
};

exports.chunkText = chunkText;
