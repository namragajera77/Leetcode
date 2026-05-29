const embeddingService = require('./embeddingService');
const vectorStore = require('./vectorStoreService');
const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || process.env.OLLAMA_MODEL || 'gemma3:4b';

const COLLECTION = 'interview_notes';

async function answerQuestion(question, docs = []) {
  // 1. embed question
  const qEmb = await embeddingService.embedText(question);

  // 2. query vector store
  const results = await vectorStore.queryCollection(COLLECTION, qEmb, 5);

  // parse results shape
  const retrieved = [];
  if (results && results.documents && results.metadatas) {
    const docsArr = results.documents;
    const metadatasArr = results.metadatas;
    for (let i = 0; i < docsArr.length; i++) {
      retrieved.push({ text: docsArr[i], metadata: metadatasArr[i] });
    }
  } else if (results?.documents) {
    // alternative shape
    for (let i = 0; i < results.documents.length; i++) {
      retrieved.push({ text: results.documents[i], metadata: results.metadatas?.[i] || {} });
    }
  } else if (results?.matches) {
    for (const m of results.matches) {
      retrieved.push({ text: m.document || m.payload?.text || m, metadata: m.metadata || {} });
    }
  }

  // Build context from top retrieved chunks
  const top = retrieved.slice(0, 5);
  const contextTexts = top.map((t, idx) => `Source ${idx + 1} (file: ${t.metadata?.filename || 'unknown'} chunk: ${t.metadata?.chunkIndex ?? '-' } ):\n${t.text}`).join('\n\n');

  // System prompt
  const systemPrompt = `You are an interview preparation assistant.\nAnswer only from the provided context.\nIf the answer is not available in the context, reply: "I could not find this information in the uploaded notes."\nDo not hallucinate.`;

  const userPrompt = `Context:\n${contextTexts}\n\nQuestion: ${question}\n\nProvide a concise answer and list the sources (filename and chunkIndex) used.`;

  // call Ollama chat
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    const resp = await axios.post(`${OLLAMA_API_URL}/chat`, { model: OLLAMA_CHAT_MODEL, messages }, { timeout: 120000 });
    const reply = resp.data?.choices?.[0]?.message?.content || resp.data?.message?.content || resp.data?.answer || (resp.data && typeof resp.data === 'string' ? resp.data : null);

    const answerText = (typeof reply === 'string') ? reply : JSON.stringify(reply);

    const sources = top.map((t) => ({ filename: t.metadata?.filename || 'unknown', chunkIndex: t.metadata?.chunkIndex ?? null }));

    return { answer: answerText, sources };
  } catch (err) {
    console.error('ragChatService error', err?.response?.data || err.message || err);
    throw new Error('Failed to generate answer from Ollama');
  }
}

module.exports = { answerQuestion };
