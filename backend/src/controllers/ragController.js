const path = require('path');
const pdfService = require('../services/pdfService');
const ragChatService = require('../services/ragChatService');

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const filePath = req.file.path;
    const filename = req.file.originalname;

    const { chunks } = await pdfService.extractPdf(filePath, filename);

    // index in the background so upload doesn't fail if Chroma/Ollama is temporarily unavailable
    setImmediate(() => {
      pdfService.indexPdf(filename, chunks).catch((error) => {
        console.error('RAG indexing failed for upload:', filename, error);
      });
    });

    return res.status(200).json({
      message: 'Uploaded',
      id: Date.now().toString(),
      name: filename,
      chunks: chunks.length,
      indexing: 'started',
    });
  } catch (err) {
    console.error('uploadPdf error:', err);
    return res.status(500).json({ message: err.message || 'Upload failed' });
  }
};

exports.chat = async (req, res) => {
  try {
    const { question, docs } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const result = await ragChatService.answerQuestion(question, Array.isArray(docs) ? docs : []);
    return res.status(200).json(result);
  } catch (err) {
    console.error('rag chat error:', err);
    return res.status(500).json({ message: err.message || 'Chat failed' });
  }
};
