const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CHROMA_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';
const baseUrl = CHROMA_URL.replace(/\/$/, '');
const collectionIdCache = new Map();
let remoteAvailable = true;
const LOCAL_STORE_PATH = path.join(__dirname, '../../uploads/rag-local-store.json');

const ensureLocalStoreFile = () => {
  const dir = path.dirname(LOCAL_STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOCAL_STORE_PATH)) {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify({ collections: {} }, null, 2));
  }
};

const readLocalStore = () => {
  ensureLocalStoreFile();
  try {
    const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf8');
    return JSON.parse(raw || '{"collections":{}}');
  } catch (error) {
    return { collections: {} };
  }
};

const writeLocalStore = (store) => {
  ensureLocalStoreFile();
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
};

const cosineSimilarity = (a = [], b = []) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return -1;
  }
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return -1;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const addDocumentsLocal = (collectionName, { ids, documents, metadatas, embeddings }) => {
  const store = readLocalStore();
  if (!store.collections[collectionName]) store.collections[collectionName] = [];

  for (let i = 0; i < ids.length; i++) {
    store.collections[collectionName].push({
      id: ids[i],
      document: documents[i],
      metadata: metadatas[i] || {},
      embedding: embeddings[i] || [],
    });
  }

  writeLocalStore(store);
  return { local: true, inserted: ids.length };
};

const queryCollectionLocal = (collectionName, queryEmbedding, topK = 5) => {
  const store = readLocalStore();
  const items = store.collections[collectionName] || [];
  if (!items.length) return { documents: [], metadatas: [], distances: [] };

  const ranked = items
    .map((item) => ({
      item,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .filter((x) => x.score > -1)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return {
    documents: ranked.map((x) => x.item.document),
    metadatas: ranked.map((x) => x.item.metadata),
    distances: ranked.map((x) => 1 - x.score),
  };
};

async function tryPost(paths, body, timeout = 120000) {
  let lastError = null;
  for (const p of paths) {
    try {
      const resp = await axios.post(`${baseUrl}${p}`, body, { timeout });
      return resp.data;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

async function ensureCollection(name) {
  if (!remoteAvailable) return;
  try {
    const data = await tryPost([
      '/api/v1/collections',
      '/collections'
    ], { name }, 30000);

    const id = data?.id || data?.collection?.id || null;
    if (id) collectionIdCache.set(name, id);
  } catch (err) {
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') remoteAvailable = false;
    // creation may fail if it already exists; we'll rely on name/id fallbacks in add/query
  }
}

async function addDocuments(collectionName, { ids, documents, metadatas, embeddings }) {
  const localResult = addDocumentsLocal(collectionName, { ids, documents, metadatas, embeddings });
  if (!remoteAvailable) return { ...localResult, remote: false };
  try {
    const body = { ids, documents, metadatas, embeddings };
    const collectionId = collectionIdCache.get(collectionName);
    const paths = [
      `/collections/${encodeURIComponent(collectionName)}/add`,
      `/api/v1/collections/${encodeURIComponent(collectionName)}/add`,
    ];
    if (collectionId) paths.push(`/api/v1/collections/${encodeURIComponent(collectionId)}/add`);
    await tryPost(paths, body, 120000);
    return { ...localResult, remote: true };
  } catch (err) {
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') remoteAvailable = false;
    console.warn('vectorStore addDocuments remote error, falling back to local store:', err?.response?.data || err.message || err);
    return { ...localResult, remote: false };
  }
}

async function queryCollection(collectionName, queryEmbedding, topK = 5) {
  if (!remoteAvailable) {
    return queryCollectionLocal(collectionName, queryEmbedding, topK);
  }
  try {
    const body = { query_embeddings: [queryEmbedding], n_results: topK, include: ['metadatas', 'documents', 'distances'] };
    const collectionId = collectionIdCache.get(collectionName);
    const paths = [
      `/collections/${encodeURIComponent(collectionName)}/query`,
      `/api/v1/collections/${encodeURIComponent(collectionName)}/query`,
    ];
    if (collectionId) paths.push(`/api/v1/collections/${encodeURIComponent(collectionId)}/query`);
    const data = await tryPost(paths, body, 120000);

    // resp.data should include results array
    if (data?.results?.[0]) return data.results[0];
    if (data?.collections?.[0]?.documents) return data;
    if (Array.isArray(data?.documents) && data.documents.length) return data;
    return queryCollectionLocal(collectionName, queryEmbedding, topK);
  } catch (err) {
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') remoteAvailable = false;
    console.warn('vectorStore query remote error, using local store fallback:', err?.response?.data || err.message || err);
    return queryCollectionLocal(collectionName, queryEmbedding, topK);
  }
}

module.exports = { ensureCollection, addDocuments, queryCollection };

