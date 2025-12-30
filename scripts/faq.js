// FAQ System for Kohalpur GPT
class FAQSystem {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        await this.loadFAQData();
        this.setupEventListeners();
        this.renderFAQ();
        this.updateStats();
    }

    async loadFAQData() {
        try {
            // Try to load from JSON file
            const response = await fetch('kohalpur_faq_100.json');
            this.faqData = await response.json();
            
            // Add categories to FAQ items
            this.categorizeFAQ();
            
            // Store in localStorage for offline use
            localStorage.setItem('kohalpur_faq_categorized', JSON.stringify(this.faqData));
            
        } catch (error) {
            console.log('Error loading FAQ data:', error);
            // Try to load from localStorage
            const cachedData = localStorage.getItem('kohalpur_faq_categorized');
            if (cachedData) {
                this.faqData = JSON.parse(cachedData);
            } else {
                // Load from the original FAQ file structure
                await this.loadOriginalFAQ();
            }
        }
        
        this.filteredData = [...this.faqData];
    }

    async loadOriginalFAQ() {
        try {
            const response = await fetch('kohalpur_faq_100.json');
            const originalData = await response.json();
            
            // Convert to categorized structure
            this.faqData = originalData.map(item => {
                // Determine category based on ID
                let category = 'general';
                if (item.id >= 1 && item.id <= 20) category = 'general';
                else if (item.id >= 21 && item.id <= 40) category = 'emergency';
                else if (item.id >= 41 && item.id <= 60) category = 'services';
                else if (item.id >= 61 && item.id <= 80) category = 'tourism';
                else if (item.id >= 81 && item.id <= 100) category = 'education';
                
                return {
                    ...item,
                    category: category,
                    verified: item.id <= 5 // First 5 items are verified
                };
            });
            
            localStorage.setItem('kohalpur_faq_categorized', JSON.stringify(this.faqData));
            
        } catch (error) {
            console.log('Error loading original FAQ:', error);
            // Create sample data as fallback
            this.createSampleFAQ();
        }
    }

    createSampleFAQ() {
        const sampleQuestions = [
            {
                id: 1,
                question: {
                    en: "Where is Kohalpur located?",
                    np: "कोहलपुर कहाँ अवस्थित छ?",
                    th: "कोहलपुर कहाँ अवस्थित छ?"
                },
                answer: {
                    en: "Kohalpur is located in Banke District, Lumbini Province, Nepal.",
                    np: "कोहलपुर बैंक जिल्ला, लुम्बिनी प्रदेश, नेपालमा अवस्थित छ।",
                    th: "कोहलपुर बैंक जिल्ला, लुम्बिनी प्रदेश, नेपालमा छ।"
                },
                category: "general",
                verified: true
            },
            {
                id: 2,
                question: {
                    en: "What is the emergency number for police?",
                    np: "प्रहरीको आपतकालीन नम्बर के हो?",
                    th: "प्रहरीको आपातकालीन नम्बर के हो?"
                },
                answer: {
                    en: "The emergency number for police in Kohalpur is 100.",
                    np: "कोहलपुरमा प्रहरीको आपतकालीन नम्बर १०० हो।",
                    th: "कोहलपुरमा प्रहरीको आपातकालीन नम्बर १०० हो।"
                },
                category: "emergency",
                verified: true
            },
            {
                id: 3,
                question: {
                    en: "Where is the main hospital in Kohalpur?",
                    np: "कोहलपुरको मुख्य अस्पताल कहाँ छ?",
                    th: "कोहलपुरको मुख्य अस्पताल कहाँ छ?"
                },
                answer: {
                    en: "Kohalpur Hospital is located on Main Road, Kohalpur.",
                    np: "कोहलपुर अस्पताल मुख्य सडक, कोहलपुरमा अवस्थित छ।",
                    th: "कोहलपुर अस्पताल मुख्य सडक, कोहलपुरमा अवस्थित छ।"
                },
                category: "health",
                verified: true
            },
            {
                id: 4,
                question: {
                    en: "What are the tourist attractions near Kohalpur?",
                    np: "कोहलपुर नजिकका पर्यटक आकर्षण के के हुन्?",
                    th: "कोहलपुर नजिकका पर्यटक आकर्षण के के हुन्?"
                },
                answer: {
                    en: "Bardiya National Park, local Tharu cultural villages, and Nepalgunj city are popular attractions.",
                    np: "बर्दिया राष्ट्रिय निकुञ्ज, स्थानीय थारु सांस्कृतिक गाउँहरू, र नेपालगन्ज शहर लोकप्रिय आकर्षण हुन्।",
                    th: "बर्दिया राष्ट्रिय निकुञ्ज, स्थानीय थारु सांस्कृतिक गाउँहरू, र नेपालगन्ज शहर लोकप्रिय आकर्षण हुन्।"
                },
                category: "tourism",
                verified: true
            },
            {
                id: 5,
                question: {
                    en: "How to get a birth certificate in Kohalpur?",
                    np: "कोहलपुरमा जन्म प्रमाणपत्र कसरी प्राप्त गर्ने?",
                    th: "कोहलपुरमा जन्म प्रमाणपत्र कसरी प्राप्त गर्ने?"
                },
                answer: {
                    en: "Visit the Municipal Office with required documents to get a birth certificate.",
                    np: "जन्म प्रमाणपत्र प्राप्त गर्न आवश्यक कागजातहरू सहित नगरपालिका कार्यालय भ्रमण गर्नुहोस्।",
                    th: "जन्म प्रमाणपत्र प्राप्त गर्न आवश्यक कागजातहरू सहित नगरपालिका कार्यालय भ्रमण गर्नुहोस्।"
                },
                category: "services",
                verified: true
            }
        ];

        this.faqData = sampleQuestions;
    }

    categorizeFAQ() {
        // Add categories to FAQ items if not present
        this.faqData = this.faqData.map((item, index) => {
            if (!item.category) {
                // Determine category based on ID or content
                let category = 'general';
                if (item.id >= 1 && item.id <= 20) category = 'general';
                else if (item.id >= 21 && item.id <= 40) category = 'emergency';
                else if (item.id >= 41 && item.id <= 60) category = 'services';
                else if (item.id >= 61 && item.id <= 80) category = 'tourism';
                else if (item.id >= 81 && item.id <= 100) category = 'education';
                else if (item.question.en.toLowerCase().includes('hospital') || 
                         item.question.en.toLowerCase().includes('health')) category = 'health';
                
                return {
                    ...item,
                    category: category,
                    verified: item.verified || (item.id <= 5) // First 5 are verified
                };
            }
            return item;
        });
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('faqSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterFAQ();
            });
        }

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterByCategory(category);
                
                // Update active button
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        // Language change
        window.addEventListener('languageChanged', () => {
            this.renderFAQ();
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.filterFAQ();
    }

    filterFAQ() {
        let filtered = [...this.faqData];

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(item => {
                const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
                const question = item.question[currentLang] || item.question['en'];
                const answer = item.answer[currentLang] || item.answer['en'];
                
                return question.toLowerCase().includes(query) || 
                       answer.toLowerCase().includes(query);
            });
        }

        this.filteredData = filtered;
        this.renderFAQ();
    }

    renderFAQ() {
        const faqList = document.getElementById('faqList');
        if (!faqList) return;

        if (this.filteredData.length === 0) {
            faqList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No questions found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }

        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        
        let html = '';
        this.filteredData.forEach(item => {
            const question = item.question[currentLang] || item.question['en'] || item.question;
            const answer = item.answer[currentLang] || item.answer['en'] || item.answer;
            
            const categoryNames = {
                'general': window.languageManager?.get('category_general') || 'General',
                'emergency': window.languageManager?.get('category_emergency') || 'Emergency',
                'services': window.languageManager?.get('category_services') || 'Services',
                'tourism': window.languageManager?.get('category_tourism') || 'Tourism',
                'education': window.languageManager?.get('category_education') || 'Education',
                'health': window.languageManager?.get('category_health') || 'Health'
            };

            html += `
                <div class="faq-item" data-id="${item.id}">
                    <button class="faq-question">
                        <span>${question}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="faq-answer">
                        <p>${answer}</p>
                        <div class="faq-category">${categoryNames[item.category] || item.category}</div>
                        ${item.verified ? `
                            <div class="verified-badge">
                                <i class="fas fa-check-circle"></i>
                                <span data-i18n="verified_answer">Verified Information</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        faqList.innerHTML = html;
        
        // Add click event listeners to FAQ items
        this.setupFAQInteractions();
        
        // Update language for newly created elements
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }

    setupFAQInteractions() {
        // Add click event to FAQ questions
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                item.classList.toggle('active');
                
                // Close other items (optional - for accordion behavior)
                // document.querySelectorAll('.faq-item').forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('active');
                //     }
                // });
            });
        });
    }

    updateStats() {
        document.getElementById('totalQuestions').textContent = this.faqData.length;
        document.getElementById('loadedQuestions').textContent = this.filteredData.length;
        
        const verifiedCount = this.faqData.filter(item => item.verified).length;
        document.getElementById('verifiedCount').textContent = verifiedCount;
    }

    searchInFAQ(query) {
        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        const lowerQuery = query.toLowerCase();
        
        const results = this.faqData.filter(item => {
            const question = item.question[currentLang] || item.question['en'];
            const answer = item.answer[currentLang] || item.answer['en'];
            
            return question.toLowerCase().includes(lowerQuery) || 
                   answer.toLowerCase().includes(lowerQuery);
        });
        
        return results.map(item => ({
            question: item.question[currentLang] || item.question['en'],
            answer: item.answer[currentLang] || item.answer['en'],
            verified: item.verified
        }));
    }
}

// Initialize FAQ system
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.faq-container')) {
        const faqSystem = new FAQSystem();
        window.faqSystem = faqSystem;
    }
});