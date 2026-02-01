require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        
        console.log('Testing API Key:', process.env.GEMINI_KEY ? 'Present' : 'Missing');
        
        // Try different model names
        const modelNames = [
            'gemini-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-1.0-pro',
            'models/gemini-pro'
        ];

        for (const modelName of modelNames) {
            try {
                console.log(`\nTrying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say hello");
                const response = await result.response;
                console.log(`✅ SUCCESS with ${modelName}`);
                console.log('Response:', response.text().substring(0, 50));
                break; // Stop on first success
            } catch (err) {
                console.log(`❌ FAILED: ${err.message.substring(0, 100)}`);
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
