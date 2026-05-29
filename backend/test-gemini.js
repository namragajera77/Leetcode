require('dotenv').config();
const axios = require('axios');

async function testOllama() {
    try {
        const endpoint = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
        const model = process.env.OLLAMA_MODEL || 'gemma3:4b';

        console.log('Testing Ollama endpoint:', endpoint);
        console.log('Testing model:', model);

        const response = await axios.post(endpoint, {
            model,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say hello in one short sentence.' }
            ],
            stream: false
        });

        console.log('✅ Ollama response:', response.data?.message?.content || 'No content returned');
    } catch (error) {
        console.error('❌ Ollama test failed:', error.response?.data || error.message);
    }
}

testOllama();
