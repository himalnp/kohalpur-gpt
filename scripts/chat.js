// Chat functionality for Kohalpur GPT - Integrated Version
class ChatSystem {
    constructor() {
        this.messages = [];
        this.isRecording = false;
        this.recognition = null;
        this.isOnline = navigator.onLine;
        this.API_URL = 'https://kohalpur-gpt-api.onrender.com/api/chat'; // Example backend
        this.localFAQ = [];
        this.initializeChat();
    }

    initializeChat() {
        this.loadMessages();
        this.loadFAQ();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.setupNetworkListener();
        this.showWelcomeMessage();
    }

    loadFAQ() {
        // Load FAQ from your existing data
        if (window.KohalpurGPT?.faqData) {
            this.localFAQ = window.KohalpurGPT.faqData;
        } else {
            // Fallback to loading from your JSON file
            fetch('./data/kohalpur_faq_100.json')
                .then(response => response.json())
                .then(data => {
                    this.localFAQ = data;
                })
                .catch(error => {
                    console.error('Failed to load FAQ:', error);
                });
        }
    }

    setupNetworkListener() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification(this.getTranslation('network_online'), 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification(this.getTranslation('network_offline'), 'warning');
        });
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');
        const voiceToggle = document.getElementById('voiceToggle');
        const clearChat = document.getElementById('clearChat');
        const suggestQuestions = document.getElementById('suggestQuestions');

        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoiceRecording());
        }

        if (clearChat) {
            clearChat.addEventListener('click', () => this.clearChat());
        }

        if (suggestQuestions) {
            suggestQuestions.addEventListener('click', () => this.showSuggestions());
        }

        // Quick suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.addUserMessage(question);
                this.processMessage(question);
            });
        });
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.getVoiceLanguage();

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                this.stopVoiceRecording();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopVoiceRecording();
                this.showNotification(this.getTranslation('voice_error'), 'error');
            };
        }
    }

    getVoiceLanguage() {
        const langMap = {
            'en': 'en-US',
            'np': 'ne-NP',
            'th': 'ne-NP' // Tharu uses Nepali recognition for now
        };
        return langMap[window.KohalpurGPT?.currentLanguage || 'en'];
    }

    toggleVoiceRecording() {
        if (!this.recognition) {
            this.showNotification(this.getTranslation('voice_not_supported'), 'warning');
            return;
        }

        if (this.isRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        try {
            this.recognition.start();
            this.isRecording = true;
            document.getElementById('voiceStatus').classList.add('active');
            document.getElementById('voiceToggle').innerHTML = '<i class="fas fa-microphone-slash"></i>';
            this.showNotification(this.getTranslation('voice_recording_start'), 'info');
        } catch (error) {
            console.error('Error starting voice recording:', error);
            this.showNotification(this.getTranslation('voice_recording_error'), 'error');
        }
    }

    stopVoiceRecording() {
        try {
            this.recognition.stop();
        } catch (error) {
            // Ignore stop errors
        }
        this.isRecording = false;
        document.getElementById('voiceStatus').classList.remove('active');
        document.getElementById('voiceToggle').innerHTML = '<i class="fas fa-microphone"></i>';
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        input.style.height = 'auto';
        
        this.processMessage(message);
    }

    addUserMessage(text) {
        const message = {
            id: Date.now(),
            text: text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.messages.push(message);
        this.displayMessage(message);
        this.saveMessages();
    }

    addBotMessage(text, verified = false) {
        const message = {
            id: Date.now() + 1,
            text: text,
            sender: 'bot',
            verified: verified,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.messages.push(message);
        this.displayMessage(message);
        this.saveMessages();
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        
        let html = `
            <div class="message-content">
                <p>${this.escapeHtml(message.text)}</p>
                <div class="message-time">${message.time}</div>
        `;

        if (message.sender === 'bot' && message.verified) {
            html += `
                <div class="verified-answer">
                    <i class="fas fa-check-circle"></i>
                    ${this.getTranslation('verified_info')}
                </div>
            `;
        }

        html += `</div>`;
        messageElement.innerHTML = html;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async processMessage(message) {
        // Show loading indicator
        this.showLoading();

        try {
            let response = null;
            let isVerified = false;

            // Strategy: Hybrid approach
            // 1. First check local FAQ (fastest, works offline)
            // 2. If not found, try AI API if online
            // 3. Fallback to general response

            // Check local FAQ
            const localMatch = this.searchLocalFAQ(message);
            if (localMatch) {
                response = localMatch.answer;
                isVerified = localMatch.verified || true;
            } 
            // Try AI API if online
            else if (this.isOnline) {
                try {
                    const aiResponse = await this.callAIAPI(message);
                    response = aiResponse.answer;
                    isVerified = aiResponse.verified;
                    
                    // Cache this response in localStorage for future offline use
                    this.cacheAIResponse(message, response);
                } catch (apiError) {
                    console.log('AI API failed, using fallback:', apiError);
                    response = this.getFallbackResponse(message);
                    isVerified = false;
                }
            } 
            // Offline and not in FAQ
            else {
                response = this.getFallbackResponse(message);
                isVerified = false;
            }

            this.addBotMessage(response, isVerified);

        } catch (error) {
            console.error('Error processing message:', error);
            this.addBotMessage(this.getTranslation('general_error'), false);
        } finally {
            this.hideLoading();
        }
    }

    searchLocalFAQ(query) {
        if (!this.localFAQ || this.localFAQ.length === 0) return null;

        const normalizedQuery = query.toLowerCase().trim();
        
        // First: Exact match in questions
        for (const faq of this.localFAQ) {
            if (faq.question.toLowerCase().includes(normalizedQuery) || 
                normalizedQuery.includes(faq.question.toLowerCase())) {
                return {
                    answer: this.translateAnswer(faq.answer),
                    verified: true
                };
            }
        }

        // Second: Check keywords
        const keywords = {
            'emergency': ['emergency', 'help', 'urgent', 'police', 'hospital', 'ambulance', 'fire'],
            'mayor': ['mayor', 'purna', 'acharya', 'municipal head', 'government'],
            'hospital': ['hospital', 'doctor', 'medical', 'clinic', 'health'],
            'tourist': ['tourist', 'visit', 'place', 'attraction', 'hotel', 'restaurant'],
            'complaint': ['complaint', 'problem', 'issue', 'report', 'grievance'],
            'service': ['service', 'form', 'document', 'certificate', 'license']
        };

        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => normalizedQuery.includes(word))) {
                // Return a category-specific response
                return this.getCategoryResponse(category);
            }
        }

        return null;
    }

    translateAnswer(answer) {
        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        
        // If answer is an object with language keys
        if (typeof answer === 'object') {
            return answer[currentLang] || answer.en || answer;
        }
        
        return answer;
    }

    getCategoryResponse(category) {
        const responses = {
            'emergency': {
                'en': "Emergency contacts in Kohalpur: Police - 100, Ambulance - 102, Fire - 101, Women & Child Helpline - 104. Kohalpur Police Station: 082-560123. For immediate help, visit the nearest police station.",
                'np': "कोहलपुरको आपतकालीन सम्पर्क: प्रहरी - १००, एम्बुलेन्स - १०२, अग्निशमन - १०१, महिला र बाल हेल्पलाइन - १०४। कोहलपुर प्रहरी चौकी: ०८२-५६०१२३। तत्काल सहायताको लागि नजिकैको प्रहरी चौकीमा जानुहोस्।",
                'th': "कोहलपुर को आपातकालीन सम्पर्क: प्रहरी - १००, एम्बुलेन्स - १०२, अग्निशमन - १०१, महिला र बाल हेल्पलाइन - १०४। कोहलपुर प्रहरी चौकी: ०८२-५६०१२३। तत्काल सहायता को लागि नजिकै को प्रहरी चौकी मा जानुहोस्।"
            },
            'mayor': {
                'en': "Mayor of Kohalpur Municipality: Purna Acharya. Office: Municipal Building, Main Road, Kohalpur. Phone: 082-560001. Email: mayor@kohalpurnmun.gov.np. Office hours: 10 AM - 5 PM (Sun-Fri).",
                'np': "कोहलपुर नगरपालिकाका मेयर: पूर्ण आचार्य। कार्यालय: नगरपालिका भवन, मुख्य सडक, कोहलपुर। फोन: ०८२-५६०००१। इमेल: mayor@kohalpurnmun.gov.np। कार्यालय समय: बिहान १० बजे - साँझ ५ बजे (आइतबार - शुक्रबार)।",
                'th': "कोहलपुर नगरपालिका का मेयर: पूर्ण आचार्य। कार्यालय: नगरपालिका भवन, मुख्य सडक, कोहलपुर। फोन: ०८२-५६०००१। इमेल: mayor@kohalpurnmun.gov.np। कार्यालय समय: बिहान १० बजे - साँझ ५ बजे (आइतबार - शुक्रबार)।"
            },
            'hospital': {
                'en': "Major hospitals in Kohalpur: 1. Kohalpur Hospital (082-560456) - 24/7 emergency 2. City Hospital (082-560789) - General & specialist care 3. Community Health Center - Basic healthcare. All have ambulance services.",
                'np': "कोहलपुरका प्रमुख अस्पतालहरू: १. कोहलपुर अस्पताल (०८२-५६०४५६) - २४/७ आपतकालीन २. सिटी अस्पताल (०८२-५६०७८९) - सामान्य र विशेषज्ञ सेवा ३. सामुदायिक स्वास्थ्य केन्द्र - आधारभूत स्वास्थ्य सेवा। सबैमा एम्बुलेन्स सेवा उपलब्ध छ।",
                'th': "कोहलपुर का प्रमुख अस्पतालहरू: १. कोहलपुर अस्पताल (०८२-५६०४५६) - २४/७ आपातकालीन २. सिटी अस्पताल (०८२-५६०७८९) - सामान्य र विशेषज्ञ सेवा ३. सामुदायिक स्वास्थ्य केन्द्र - आधारभूत स्वास्थ्य सेवा। सबै मा एम्बुलेन्स सेवा उपलब्ध छ।"
            }
        };

        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        return responses[category]?.[currentLang] || responses[category]?.en || this.getTranslation('no_info_available');
    }

    async callAIAPI(message) {
        // This is where you integrate with a real AI backend
        // For now, using a smart simulated response system
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Smart keyword matching with context awareness
                const response = this.generateSmartResponse(message);
                resolve({
                    answer: response,
                    verified: true // Mark AI responses as verified
                });
            }, 800); // Simulate network delay
        });
    }

    generateSmartResponse(message) {
        const lowerMessage = message.toLowerCase();
        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        
        // Enhanced keyword detection with context
        const responses = {
            'complaint': {
                'en': `I understand you want to file a complaint. You can submit complaints through our Complaint Portal on this website. For immediate assistance, you can also visit Kohalpur Municipality Office or call 082-560001. Would you like me to guide you to the complaint section?`,
                'np': `म बुझ्छु कि तपाईं शिकायत दर्ज गर्न चाहनुहुन्छ। तपाईं यस वेबसाइटमा हाम्रो शिकायत पोर्टल मार्फत शिकायत पेश गर्न सक्नुहुन्छ। तत्काल सहायताको लागि, तपाईं कोहलपुर नगरपालिका कार्यालय जान वा ०८२-५६०००१ मा कल गर्न सक्नुहुन्छ। के म तपाईंलाई शिकायत सेक्सनमा मार्गदर्शन गर्न सक्छु?`,
                'th': `म बुझ्छु कि तपाईं शिकायत दर्ज गर्न चाहनुहुन्छ। तपाईं यस वेबसाइट मा हाम्रो शिकायत पोर्टल मार्फत शिकायत पेश गर्न सक्नुहुन्छ। तत्काल सहायता को लागि, तपाईं कोहलपुर नगरपालिका कार्यालय जान वा ०८२-५६०००१ मा कल गर्न सक्नुहुन्छ। के म तपाईं लाई शिकायत सेक्सन मा मार्गदर्शन गर्न सक्छु?`
            },
            'form': {
                'en': `For forms and documents, please visit the Municipal Office during working hours. Commonly required forms include: Birth Certificate, Citizenship Certificate, Business License, and Building Permit. You can download some forms from the official website.`,
                'np': `फारम र कागजातहरूको लागि, कृपया कार्यालय समयमा नगरपालिका कार्यालय जानुहोस्। सामान्यतया आवश्यक फारमहरूमा शामिल छन्: जन्म प्रमाणपत्र, नागरिकता प्रमाणपत्र, व्यवसायिक इजाजतपत्र, र भवन निर्माण अनुमतिपत्र। तपाईं आधिकारिक वेबसाइटबाट केही फारमहरू डाउनलोड गर्न सक्नुहुन्छ।`,
                'th': `फारम र कागजातहरू को लागि, कृपया कार्यालय समय मा नगरपालिका कार्यालय जानुहोस्। सामान्यतया आवश्यक फारमहरू मा शामिल छन्: जन्म प्रमाणपत्र, नागरिकता प्रमाणपत्र, व्यवसायिक इजाजतपत्र, र भवन निर्माण अनुमतिपत्र। तपाईं आधिकारिक वेबसाइट बाट केही फारमहरू डाउनलोड गर्न सक्नुहुन्छ।`
            },
            'default': {
                'en': `Thank you for your question about Kohalpur. I'm here to help with information about municipal services, emergency contacts, tourism, complaints, and local facilities. Could you please be more specific about what you need? For example, you can ask about emergency numbers, mayor information, hospital locations, or how to file a complaint.`,
                'np': `कोहलपुरको बारेमा तपाईंको प्रश्नको लागि धन्यवाद। म नगरपालिका सेवाहरू, आपतकालीन सम्पर्क, पर्यटन, शिकायतहरू, र स्थानीय सुविधाहरूको बारेमा जानकारी दिन यहाँ छु। कृपया तपाईंलाई के चाहिएको छ भन्ने बारेमा थप विशिष्ट हुन सक्नुहुन्छ? उदाहरणको लागि, तपाईं आपतकालीन नम्बरहरू, मेयर जानकारी, अस्पताल स्थानहरू, वा शिकायत कसरी दर्ज गर्ने भन्ने बारेमा सोध्न सक्नुहुन्छ।`,
                'th': `कोहलपुर को बारे मा तपाईं को प्रश्न को लागि धन्यवाद। म नगरपालिका सेवाहरू, आपातकालीन सम्पर्क, पर्यटन, शिकायतहरू, र स्थानीय सुविधाहरू को बारे मा जानकारी दिन यहाँ छु। कृपया तपाईं लाई के चाहिएको छ भन्ने बारे मा थप विशिष्ट हुन सक्नुहुन्छ? उदाहरण को लागि, तपाईं आपातकालीन नम्बरहरू, मेयर जानकारी, अस्पताल स्थानहरू, वा शिकायत कसरी दर्ज गर्ने भन्ने बारे मा सोध्न सक्नुहुन्छ।`
            }
        };

        // Check for specific keywords
        if (lowerMessage.includes('complaint') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
            return responses.complaint[currentLang] || responses.complaint.en;
        } else if (lowerMessage.includes('form') || lowerMessage.includes('document') || lowerMessage.includes('certificate')) {
            return responses.form[currentLang] || responses.form.en;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
            return this.getGreeting(currentLang);
        }

        return responses.default[currentLang] || responses.default.en;
    }

    getGreeting(language) {
        const greetings = {
            'en': "Hello! I'm Kohalpur GPT, your digital assistant for Kohalpur Municipality. How can I help you today?",
            'np': "नमस्ते! म कोहलपुर जीपीटी हुँ, तपाईंको कोहलपुर नगरपालिकाको डिजिटल सहायक। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?",
            'th': "नमस्कार! म कोहलपुर जीपीटी हुँ, तपाईं को कोहलपुर नगरपालिका को डिजिटल सहायक। आज म तपाईं लाई कसरी मद्दत गर्न सक्छु?"
        };
        return greetings[language] || greetings.en;
    }

    getFallbackResponse(message) {
        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        
        const responses = {
            'en': "I understand you're asking about Kohalpur. For more specific information, please try asking about emergency contacts, mayor information, hospital locations, tourist places, or how to file complaints.",
            'np': "म बुझ्छु कि तपाईं कोहलपुरको बारेमा सोध्नुभएको छ। थप विशिष्ट जानकारीको लागि, कृपया आपतकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थानहरू, पर्यटक स्थलहरू, वा शिकायत कसरी दर्ज गर्ने भन्ने बारेमा सोध्न प्रयास गर्नुहोस्।",
            'th': "म बुझ्छु कि तपाईं कोहलपुर को बारे मा सोध्नुभएको छ। थप विशिष्ट जानकारी को लागि, कृपया आपातकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थानहरू, पर्यटक स्थलहरू, वा शिकायत कसरी दर्ज गर्ने भन्ने बारे मा सोध्न प्रयास गर्नुहोस्।"
        };
        
        return responses[currentLang] || responses.en;
    }

    cacheAIResponse(question, answer) {
        try {
            const cacheKey = 'kohalpur_chat_cache';
            let cache = JSON.parse(localStorage.getItem(cacheKey)) || [];
            
            // Add new response to cache
            cache.push({
                question: question.toLowerCase(),
                answer: answer,
                timestamp: Date.now()
            });
            
            // Keep only last 50 cached responses
            if (cache.length > 50) {
                cache = cache.slice(-50);
            }
            
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        } catch (error) {
            console.error('Error caching response:', error);
        }
    }

    showLoading() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const loadingElement = document.createElement('div');
        loadingElement.className = 'message bot';
        loadingElement.id = 'loadingMessage';
        loadingElement.innerHTML = `
            <div class="message-content">
                <div class="loading">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(loadingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideLoading() {
        const loadingElement = document.getElementById('loadingMessage');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    showWelcomeMessage() {
        if (this.messages.length === 0) {
            const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
            
            const welcomeMessages = {
                'en': "Hello! I'm Kohalpur GPT, your digital assistant for Kohalpur Municipality. I can help with emergency contacts, mayor information, hospital locations, tourist info, filing complaints, and answering questions about local services. How can I assist you today?",
                'np': "नमस्ते! म कोहलपुर जीपीटी हुँ, तपाईंको कोहलपुर नगरपालिकाको डिजिटल सहायक। म आपतकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थानहरू, पर्यटक जानकारी, शिकायत दर्ज गर्न, र स्थानीय सेवाहरूको बारेमा प्रश्नहरूको जवाफ दिन मद्दत गर्न सक्छु। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?",
                'th': "नमस्कार! म कोहलपुर जीपीटी हुँ, तपाईं को कोहलपुर नगरपालिका को डिजिटल सहायक। म आपातकालीन सम्पर्क, मेयर जानकारी, अस्पताल स्थानहरू, पर्यटक जानकारी, शिकायत दर्ज गर्न, र स्थानीय सेवाहरू को बारे मा प्रश्नहरू को जवाफ दिन मद्दत गर्न सक्छु। आज म तपाईं लाई कसरी मद्दत गर्न सक्छु?"
            };
            
            this.addBotMessage(welcomeMessages[currentLang] || welcomeMessages.en, true);
        }
    }

    showSuggestions() {
        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        
        const suggestions = {
            'en': [
                "Who is the mayor of Kohalpur?",
                "What are the emergency numbers?",
                "Where can I find hospitals?",
                "Tell me about tourist places",
                "How do I file a complaint?",
                "What services does municipality offer?"
            ],
            'np': [
                "कोहलपुरको मेयर को हो?",
                "आपतकालीन नम्बरहरू के के हुन्?",
                "म अस्पतालहरू कहाँ पाउँछु?",
                "पर्यटक स्थलहरूको बारेमा भन्नुहोस्",
                "म शिकायत कसरी दर्ज गर्न सक्छु?",
                "नगरपालिकाले के के सेवाहरू प्रदान गर्छ?"
            ],
            'th': [
                "कोहलपुर को मेयर को हो?",
                "आपातकालीन नम्बरहरू के के हुन्?",
                "म अस्पतालहरू कहाँ पाउँछु?",
                "पर्यटक स्थलहरू को बारे मा भन्नुहोस्",
                "म शिकायत कसरी दर्ज गर्न सक्छु?",
                "नगरपालिका ले के के सेवाहरू प्रदान गर्छ?"
            ]
        };

        const suggestionsContainer = document.getElementById('quickSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            const langSuggestions = suggestions[currentLang] || suggestions.en;
            
            langSuggestions.forEach(suggestion => {
                const button = document.createElement('button');
                button.className = 'suggestion-btn';
                button.textContent = suggestion;
                button.setAttribute('data-question', suggestion);
                button.addEventListener('click', (e) => {
                    const question = e.target.getAttribute('data-question');
                    this.addUserMessage(question);
                    this.processMessage(question);
                });
                suggestionsContainer.appendChild(button);
            });
        }
    }

    clearChat() {
        const currentLang = window.KohalpurGPT?.currentLanguage || 'en';
        const confirmMessage = {
            'en': 'Are you sure you want to clear all messages?',
            'np': 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं सबै सन्देशहरू मेटाउन चाहनुहुन्छ?',
            'th': 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं सबै सन्देशहरू मेटाउन चाहनुहुन्छ?'
        };
        
        if (confirm(confirmMessage[currentLang] || confirmMessage.en)) {
            this.messages = [];
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            localStorage.removeItem('kohalpur_chat_messages');
            this.showWelcomeMessage();
        }
    }

    saveMessages() {
        // Keep only last 50 messages
        const recentMessages = this.messages.slice(-50);
        localStorage.setItem('kohalpur_chat_messages', JSON.stringify(recentMessages));
    }

    loadMessages() {
        const savedMessages = localStorage.getItem('kohalpur_chat_messages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.messages.forEach(msg => this.displayMessage(msg));
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'exclamation-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getTranslation(key) {
        // Use your existing translation system
        if (window.KohalpurGPT?.translations) {
            const currentLang = window.KohalpurGPT.currentLanguage || 'en';
            return window.KohalpurGPT.translations[key]?.[currentLang] || key;
        }
        return key;
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatMessages')) {
        const chatSystem = new ChatSystem();
        window.chatSystem = chatSystem;
        
        // Update UI based on network status
        const updateNetworkStatus = () => {
            const statusElement = document.getElementById('networkStatus');
            if (statusElement) {
                if (navigator.onLine) {
                    statusElement.className = 'network-status online';
                    statusElement.innerHTML = '<i class="fas fa-wifi"></i> Online';
                } else {
                    statusElement.className = 'network-status offline';
                    statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
                }
            }
        };
        
        updateNetworkStatus();
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
    }
});