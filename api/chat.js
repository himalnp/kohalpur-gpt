// api/chat.js - Vercel Serverless Function
import { OpenAI } from 'openai';

// Initialize OpenAI with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, language = 'en' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        answer: "Please enter a message",
        verified: false
      });
    }

    console.log(`Processing: "${message.substring(0, 50)}..." in ${language}`);

    // If OpenAI key exists, use AI
    if (process.env.OPENAI_API_KEY) {
      const systemPrompt = `You are "Kohalpur GPT", an AI assistant for Kohalpur Municipality in Nepal.
      
Respond in ${language === 'np' ? 'Nepali (नेपाली)' : language === 'th' ? 'Tharu (थारु)' : 'English'}.

KEY INFORMATION:
- Emergency: Police 100, Ambulance 102, Fire 101, Women/Child 104
- Mayor: Purna Acharya, Phone: 082-560001
- Hospitals: Kohalpur Hospital (082-560456), City Hospital (082-560789)
- Tourism: Bardiya National Park, Tharu cultural villages

Be helpful and professional. If unsure, suggest contacting municipality office.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return res.status(200).json({
        answer: completion.choices[0].message.content,
        verified: true,
        source: 'openai'
      });
    }

    // If no OpenAI key, use mock responses
    const mockResponses = {
      'emergency': {
        'en': 'Emergency contacts in Kohalpur: Police - 100, Ambulance - 102, Fire - 101, Women & Child Helpline - 104. Kohalpur Police Station: 082-560123.',
        'np': 'कोहलपुरको आपतकालीन सम्पर्क: प्रहरी - १००, एम्बुलेन्स - १०२, अग्निशमन - १०१, महिला र बाल हेल्पलाइन - १०४। कोहलपुर प्रहरी चौकी: ०८२-५६०१२३।',
        'th': 'कोहलपुर को आपातकालीन सम्पर्क: प्रहरी - १००, एम्बुलेन्स - १०२, अग्निशमन - १०१, महिला र बाल हेल्पलाइन - १०४। कोहलपुर प्रहरी चौकी: ०८२-५६०१२३।'
      },
      'mayor': {
        'en': 'Mayor of Kohalpur Municipality: Purna Acharya. Office: Municipal Building, Main Road, Kohalpur. Phone: 082-560001. Email: mayor@kohalpur.gov.np',
        'np': 'कोहलपुर नगरपालिकाका मेयर: पूर्ण आचार्य। कार्यालय: नगरपालिका भवन, मुख्य सडक, कोहलपुर। फोन: ०८२-५६०००१। इमेल: mayor@kohalpur.gov.np',
        'th': 'कोहलपुर नगरपालिका का मेयर: पूर्ण आचार्य। कार्यालय: नगरपालिका भवन, मुख्य सडक, कोहलपुर। फोन: ०८२-५६०००१। इमेल: mayor@kohalpur.gov.np'
      },
      'hospital': {
        'en': 'Major hospitals in Kohalpur: 1. Kohalpur Hospital (082-560456) - 24/7 emergency 2. City Hospital (082-560789) - General care 3. Community Health Center',
        'np': 'कोहलपुरका प्रमुख अस्पतालहरू: १. कोहलपुर अस्पताल (०८२-५६०४५६) - २४/७ आपतकालीन २. सिटी अस्पताल (०८२-५६०७८९) - सामान्य सेवा ३. सामुदायिक स्वास्थ्य केन्द्र',
        'th': 'कोहलपुर का प्रमुख अस्पतालहरू: १. कोहलपुर अस्पताल (०८२-५६०४५६) - २४/७ आपातकालीन २. सिटी अस्पताल (०८२-५६०७८९) - सामान्य सेवा ३. सामुदायिक स्वास्थ्य केन्द्र'
      },
      'default': {
        'en': 'Hello! I am Kohalpur GPT. I can help with emergency contacts, mayor information, hospital locations, tourist places, and complaint procedures for Kohalpur Municipality.',
        'np': 'नमस्ते! म कोहलपुर जीपीटी हुँ। म कोहलपुर नगरपालिकाको आपतकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थान, पर्यटक स्थल, र शिकायत प्रक्रियाहरूमा मद्दत गर्न सक्छु।',
        'th': 'नमस्कार! म कोहलपुर जीपीटी हुँ। म कोहलपुर नगरपालिका को आपातकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थान, पर्यटक स्थल, र शिकायत प्रक्रियाहरू मा मद्दत गर्न सक्छु।'
      }
    };

    const lowerMsg = message.toLowerCase();
    let response;

    if (lowerMsg.includes('emergency') || lowerMsg.includes('police') || lowerMsg.includes('ambulance')) {
      response = mockResponses.emergency[language] || mockResponses.emergency.en;
    } else if (lowerMsg.includes('mayor') || lowerMsg.includes('purna') || lowerMsg.includes('acharya')) {
      response = mockResponses.mayor[language] || mockResponses.mayor.en;
    } else if (lowerMsg.includes('hospital') || lowerMsg.includes('doctor') || lowerMsg.includes('medical')) {
      response = mockResponses.hospital[language] || mockResponses.hospital.en;
    } else {
      response = mockResponses.default[language] || mockResponses.default.en;
    }

    res.status(200).json({
      answer: response,
      verified: true,
      source: 'mock'
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      answer: "I'm having trouble connecting right now. Please try asking about Kohalpur emergency numbers, mayor information, or hospital locations.",
      verified: false,
      error: 'server_error'
    });
  }
}
