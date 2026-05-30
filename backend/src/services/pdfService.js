const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const vectorStore = require('./vectorStoreService');
const embeddingService = require('./embeddingService');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MAX_EXTRACTED_CHARS = Number(process.env.RAG_MAX_EXTRACTED_CHARS || 2_000_000);
const MAX_CHUNKS = Number(process.env.RAG_MAX_CHUNKS || 3000);
const INDEX_BATCH_SIZE = Number(process.env.RAG_INDEX_BATCH_SIZE || 24);

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
      if (chunks.length >= MAX_CHUNKS) break;
    }

    if (end >= text.length) break;

    const nextStart = Math.max(0, end - chunkOverlap);
    if (nextStart <= start) {
      // Hard stop to avoid non-terminating overlap loops.
      break;
    }
    start = nextStart;
  }
  return chunks;
}

exports.extractPdf = async (filePath, filename) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer).catch((err) => {
    throw new Error('Failed to parse PDF: ' + err.message);
  });

  const text = (parsed.text || '').slice(0, MAX_EXTRACTED_CHARS);
  if (!text.trim()) throw new Error('PDF contains no extractable text');

  const chunks = chunkText(text, 1000, 200);
  return { text, chunks };
};

exports.indexPdf = async (filename, chunks) => {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error('No chunks available for indexing');
  }

  // Embed and store in bounded batches to avoid memory spikes on large PDFs.
  const collection = 'interview_notes';
  await vectorStore.ensureCollection(collection);

  for (let i = 0; i < chunks.length; i += INDEX_BATCH_SIZE) {
    const batch = chunks.slice(i, i + INDEX_BATCH_SIZE);
    const ids = [];
    const documents = [];
    const metadatas = [];
    const embeddings = [];

    for (const c of batch) {
      ids.push(`${Date.now()}-${Math.round(Math.random() * 1e9)}`);
      documents.push(c.text);
      metadatas.push({ filename, uploadDate: new Date().toISOString(), chunkIndex: c.chunkIndex });
      // Sequential embedding intentionally limits memory pressure.
      const emb = await embeddingService.embedText(c.text);
      embeddings.push(emb);
    }

    await vectorStore.addDocuments(collection, { ids, documents, metadatas, embeddings });
  }

  return { id: Date.now().toString(), name: filename, chunks: chunks.length };
};

exports.chunkText = chunkText;
