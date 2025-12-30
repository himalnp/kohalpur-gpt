const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Kohalpur GPT API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, language = 'en' } = req.body;
        
        const systemPrompt = `You are Kohalpur GPT, an AI assistant for Kohalpur Municipality in Nepal. 
        Respond in ${language === 'np' ? 'Nepali' : language === 'th' ? 'Tharu' : 'English'}.
        
        Provide accurate information about:
        1. Emergency services: Police 100, Ambulance 102, Fire 101
        2. Mayor: Purna Acharya, Office: Municipal Building, Phone: 082-560001
        3. Hospitals: Kohalpur Hospital (082-560456), City Hospital (082-560789)
        4. Tourist places: Bardiya National Park, Tharu cultural villages
        5. Municipal services and complaint procedures
        
        Keep responses concise and helpful. If unsure, suggest contacting the municipality office directly.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        res.json({
            answer: completion.choices[0].message.content,
            verified: true
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            answer: "Sorry, I'm having trouble connecting. Please try again.",
            verified: false
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
