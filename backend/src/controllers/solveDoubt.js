const Groq = require('groq-sdk');

const solveDoubt = async(req, res) => {
    try {
        // Check if GROQ_API_KEY is configured
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                message: "AI service is not configured. Please contact administrator."
            });
        }

        const {messages, title, description, testCases, startCode} = req.body;
        
        // Validate required fields
        if (!messages || !title || !description) {
            return res.status(400).json({
                message: "Missing required fields: messages, title, or description"
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Prepare the conversation history
        const conversationHistory = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.parts
        }));

        // Create system prompt
        const systemPrompt = `You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT: 
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${JSON.stringify(testCases)}
[START_CODE]: ${JSON.stringify(startCode)}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:

### When user asks for HINTS:
- Break down the problem into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Suggest relevant data structures or techniques to consider

### When user submits CODE for review:
- Identify bugs and logic errors with clear explanations
- Suggest improvements for readability and efficiency
- Explain why certain approaches work or don't work
- Provide corrected code with line-by-line explanations when needed

### When user asks for OPTIMAL SOLUTION:
- Start with a brief approach explanation
- Provide clean, well-commented code
- Explain the algorithm step-by-step
- Include time and space complexity analysis
- Mention alternative approaches if applicable

### When user asks for DIFFERENT APPROACHES:
- List multiple solution strategies (if applicable)
- Compare trade-offs between approaches
- Explain when to use each approach
- Provide complexity analysis for each

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always respond in the language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems
- If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.`;

        // Prepare messages for Groq
        const groqMessages = [
            {
                role: "system",
                content: systemPrompt
            },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.parts[0].text
            }))
        ];

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile", // Fast and capable model
            temperature: 0.7,
            max_tokens: 2048,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";

        res.status(200).json({
            message: responseText
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Provide more specific error messages
        if (error.message.includes("API_KEY") || error.message.includes("API key")) {
            return res.status(500).json({
                message: "AI service configuration error. Please contact administrator.",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        
        if (error.message.includes("quota") || error.message.includes("rate limit")) {
            return res.status(429).json({
                message: "AI service is temporarily unavailable due to high usage. Please try again later."
            });
        }

        res.status(500).json({
            message: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = solveDoubt;