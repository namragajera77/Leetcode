const axios = require('axios');

const DEFAULT_REVIEW = {
  logicAnalysis: 'Unable to generate review at the moment.',
  potentialBugs: 'Unable to generate review at the moment.',
  timeComplexity: 'Unable to generate review at the moment.',
  spaceComplexity: 'Unable to generate review at the moment.',
  optimizationSuggestions: 'Unable to generate review at the moment.',
  edgeCases: 'Unable to generate review at the moment.',
  strengths: [],
  improvements: [],
  interviewReadinessScore: 0,
};

const normalizeText = (value, fallback) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join('\n');
  }

  return fallback;
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const extractJsonObject = (text = '') => {
  const raw = String(text).trim();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
};

const normalizeReview = (payload = {}) => ({
  logicAnalysis: normalizeText(payload.logicAnalysis, DEFAULT_REVIEW.logicAnalysis),
  potentialBugs: normalizeText(payload.potentialBugs, DEFAULT_REVIEW.potentialBugs),
  timeComplexity: normalizeText(payload.timeComplexity, DEFAULT_REVIEW.timeComplexity),
  spaceComplexity: normalizeText(payload.spaceComplexity, DEFAULT_REVIEW.spaceComplexity),
  optimizationSuggestions: normalizeText(payload.optimizationSuggestions, DEFAULT_REVIEW.optimizationSuggestions),
  edgeCases: normalizeText(payload.edgeCases, DEFAULT_REVIEW.edgeCases),
  strengths: normalizeArray(payload.strengths) || DEFAULT_REVIEW.strengths,
  improvements: normalizeArray(payload.improvements) || DEFAULT_REVIEW.improvements,
  interviewReadinessScore: (() => {
    const v = payload.interviewReadinessScore ?? payload.interviewScore ?? DEFAULT_REVIEW.interviewReadinessScore;
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string') {
      const parsed = parseFloat(v.replace(/[^0-9\.]/g, ''));
      if (!Number.isNaN(parsed)) return parsed;
    }
    return DEFAULT_REVIEW.interviewReadinessScore;
  })(),
});

const buildReviewPrompt = ({ title, description, code, language, judge0Result }) => {
  const reviewContext = judge0Result ? `\n\nJudge0 Result Context:\n${JSON.stringify(judge0Result, null, 2)}` : '';

  return `You are a Senior Software Engineer and Technical Interviewer.

Analyze the user's code and provide concise, educational feedback suitable for a premium interview-prep platform.

You must return valid JSON only. Do NOT include any explanatory text outside the JSON object.

The JSON must match this exact schema:
{
  "logicAnalysis": "",                    // short paragraph
  "potentialBugs": "",                    // short paragraph
  "timeComplexity": "",                   // e.g. O(n log n)
  "spaceComplexity": "",                  // e.g. O(n)
  "optimizationSuggestions": "",          // short paragraph
  "edgeCases": "",                        // short paragraph
  "strengths": [],                          // array of short bullets
  "improvements": [],                       // array of short bullets
  "interviewReadinessScore": 0              // number between 1 and 10
}

Rules:
- Never provide full solution code or rewrite the entire solution.
- Focus on teaching: explain issues concisely and offer guidance.
- If Judge0 results are provided, use them to point out failing tests or runtime errors.
- Keep answers concise and prioritized.

Problem Title: ${title}
Problem Description: ${description}
Selected Language: ${language}

User Code:
${code}${reviewContext}`;
};

const generateCodeReview = async ({ title, description, code, language, judge0Result }) => {
  const ollamaEndpoint = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma3:4b';

  const chatResponse = await axios.post(
    ollamaEndpoint,
    {
      model: ollamaModel,
      messages: [
        {
          role: 'system',
          content: 'You must return only valid JSON and never include code or the full solution.'
        },
        {
          role: 'user',
          content: buildReviewPrompt({ title, description, code, language, judge0Result })
        }
      ],
      stream: false,
      format: 'json',
      options: {
        temperature: 0.2,
        num_predict: 700
      }
    },
    {
      timeout: 120000
    }
  );

  const rawContent = chatResponse.data?.message?.content || '';
  const parsed = extractJsonObject(rawContent);

  if (!parsed) {
    return normalizeReview(DEFAULT_REVIEW);
  }

  return normalizeReview(parsed);
};

module.exports = { generateCodeReview, normalizeReview };