const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

const getOllamaBaseUrl = () => OLLAMA_API_URL
  .replace(/\/api\/chat\/?$/i, '')
  .replace(/\/api\/embeddings\/?$/i, '')
  .replace(/\/api\/embed\/?$/i, '')
  .replace(/\/api\/?$/i, '')
  .replace(/\/chat\/?$/i, '')
  .replace(/\/embeddings\/?$/i, '')
  .replace(/\/embed\/?$/i, '')
  .replace(/\/$/, '');

const extractEmbeddingFromResponse = (data) => {
  if (Array.isArray(data?.embeddings) && Array.isArray(data.embeddings[0])) return data.embeddings[0];
  if (Array.isArray(data?.embeddings)) return data.embeddings;
  if (Array.isArray(data?.data?.[0]?.embedding)) return data.data[0].embedding;
  if (Array.isArray(data?.embedding)) return data.embedding;
  if (Array.isArray(data)) return data;
  return null;
};

async function tryEmbeddingRequests(baseUrl, text) {
  const attempts = [
    {
      url: `${baseUrl}/api/embed`,
      body: { model: EMBEDDING_MODEL, input: text },
    },
    {
      url: `${baseUrl}/api/embeddings`,
      body: { model: EMBEDDING_MODEL, prompt: text },
    },
    {
      url: `${baseUrl}/api/embeddings`,
      body: { model: EMBEDDING_MODEL, input: text },
    },
    {
      url: `${baseUrl}/embeddings`,
      body: { model: EMBEDDING_MODEL, input: text },
    },
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      const resp = await axios.post(attempt.url, attempt.body, { timeout: 120000 });
      const parsed = extractEmbeddingFromResponse(resp.data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Embedding request failed');
}

async function embedText(text) {
  if (!text) return [];
  try {
    const baseUrl = getOllamaBaseUrl();
    return await tryEmbeddingRequests(baseUrl, text);
  } catch (err) {
    console.error('embedText error', err?.response?.data || err.message || err);
    throw new Error('Embedding generation failed: ' + (err.message || 'unknown'));
  }
}

module.exports = { embedText };
