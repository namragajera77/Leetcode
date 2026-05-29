const axios = require('axios');

const CHROMA_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';

async function ensureCollection(name) {
  try {
    // create collection if not exists
    await axios.post(`${CHROMA_URL}/collections`, { name }).catch(() => {});
  } catch (err) {
    // ignore - collection API may differ across Chroma versions
  }
}

async function addDocuments(collectionName, { ids, documents, metadatas, embeddings }) {
  try {
    const url = `${CHROMA_URL}/collections/${encodeURIComponent(collectionName)}/add`;
    const body = { ids, documents, metadatas, embeddings };
    const resp = await axios.post(url, body, { timeout: 120000 });
    return resp.data;
  } catch (err) {
    console.error('vectorStore addDocuments error', err?.response?.data || err.message || err);
    throw new Error('Failed to add documents to vector store');
  }
}

async function queryCollection(collectionName, queryEmbedding, topK = 5) {
  try {
    const url = `${CHROMA_URL}/collections/${encodeURIComponent(collectionName)}/query`;
    const body = { query_embeddings: [queryEmbedding], n_results: topK, include: ['metadatas', 'documents', 'distances'] };
    const resp = await axios.post(url, body, { timeout: 120000 });
    // resp.data should include results array
    if (resp.data?.results?.[0]) return resp.data.results[0];
    if (resp.data?.collections?.[0]?.documents) return resp.data;
    return resp.data;
  } catch (err) {
    console.error('vectorStore query error', err?.response?.data || err.message || err);
    throw new Error('Vector store query failed');
  }
}

module.exports = { ensureCollection, addDocuments, queryCollection };
