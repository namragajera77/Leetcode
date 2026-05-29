const { generateCodeReview } = require('../services/aiReviewService');

const reviewCode = async (req, res) => {
  try {
    const { title, description, code, language, judge0Result } = req.body;

    console.log('AI Review Request:', {
      title: title?.slice(0, 100),
      language,
      codeLength: code ? code.length : 0,
      hasJudge0: !!judge0Result,
    });

    if (!title || !description || !code || !language) {
      return res.status(400).json({
        message: 'Missing required fields: title, description, code, or language'
      });
    }

    const review = await generateCodeReview({
      title,
      description,
      code,
      language,
      judge0Result
    });

    return res.status(200).json(review);
  } catch (error) {
    console.error('AI Review Error:', error);

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

    return res.status(500).json({
      message: 'I could not review your code right now. Please try again in a moment.'
    });
  }
};

module.exports = reviewCode;