const axios = require('axios');

const sanitizeHint = (text = '') => {
  const withoutCodeBlocks = text.replace(/```[\s\S]*?```/g, '').trim();
  return withoutCodeBlocks || 'I could not generate a hint right now. Please try again.';
};

const generateHint = async (req, res) => {
  try {
    const ollamaEndpoint = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
    const ollamaModel = process.env.OLLAMA_MODEL || 'gemma3:4b';

    const { title, description, level = 1 } = req.body;
    const hintLevel = Number(level);

    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields: title or description' });
    }

    if (![1, 2, 3].includes(hintLevel)) {
      return res.status(400).json({ message: 'Hint level must be 1, 2, or 3' });
    }

    const levelGuidance = {
      1: 'Subtle hint: give a gentle nudge, mention the likely technique or observation, and keep it very brief.',
      2: 'Medium guidance: give a clearer directional breakdown with 3-5 bullet points, but do not reveal the final algorithm or code.',
      3: 'Strong guidance: give a detailed roadmap and key pitfalls, but still stop before the complete solution and never provide code.'
    };

    const systemPrompt = `You are an AI hint generator for a LeetCode-style coding platform.

Rules:
- Provide ONLY educational hints.
- Never provide complete solutions, code, pseudo-code, or line-by-line implementation.
- Never reveal the final answer.
- Stay strictly focused on the current problem.
- Use concise markdown.
- Keep the response under 120 words if possible.

Hint level behavior:
- Level 1: subtle, gentle nudge.
- Level 2: medium guidance with a few structured clues.
- Level 3: strong guidance with a clear roadmap, but still no solution.

Response style:
- Start directly with the hint.
- Prefer short paragraphs or bullet points.
- If you mention an algorithm, only hint at it; do not explain it fully.
- Do not include code fences or sample code.`;

    const userPrompt = `Problem Title: ${title}
Problem Description: ${description}
Requested Hint Level: ${hintLevel}

Guidance to follow: ${levelGuidance[hintLevel]}`;

    const chatResponse = await axios.post(
      ollamaEndpoint,
      {
        model: ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: {
          temperature: 0.35,
          num_predict: 256
        }
      },
      {
        timeout: 120000
      }
    );

    const hint = sanitizeHint(chatResponse.data?.message?.content || 'I could not generate a hint right now.');

    res.status(200).json({
      level: hintLevel,
      hint
    });
  } catch (error) {
    console.error('AI Hint Error:', error);

    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({
        message: 'Local AI service is not running. Please start Ollama and try again.'
      });
    }

    if (error.response?.status === 404) {
      return res.status(500).json({
        message: `Ollama model "${process.env.OLLAMA_MODEL || 'gemma3:4b'}" was not found. Please pull the model and try again.`
      });
    }

    if (error.response?.data?.error) {
      return res.status(500).json({
        message: error.response.data.error
      });
    }

    res.status(500).json({
      message: 'I could not generate a hint right now. Please try again in a moment.'
    });
  }
};

module.exports = generateHint;