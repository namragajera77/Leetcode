const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

async function embedText(text) {
  if (!text) return [];
  try {
    const payload = { model: EMBEDDING_MODEL, input: text };
    const resp = await axios.post(`${OLLAMA_API_URL}/embeddings`, payload, { timeout: 120000 });
    // try multiple possible response shapes
    if (resp.data?.data?.[0]?.embedding) return resp.data.data[0].embedding;
    if (resp.data?.embedding) return resp.data.embedding;
    if (Array.isArray(resp.data)) return resp.data;
    return resp.data;
  } catch (err) {
    console.error('embedText error', err?.response?.data || err.message || err);
    throw new Error('Embedding generation failed: ' + (err.message || 'unknown'));
  }
}

module.exports = { embedText };
