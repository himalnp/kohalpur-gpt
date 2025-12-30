// Main JavaScript for Kohalpur GPT with complete multilingual support
class KohalpurGPT {
    constructor() {
        this.isOnline = navigator.onLine;
        this.faqData = [];
        this.currentLanguage = 'en';
        this.init();
    }

    async init() {
        this.setupLanguageManager();
        this.setupEventListeners();
        this.setupServiceWorker();
        await this.loadFAQData();
        this.updateOnlineStatus();
        this.applyLanguage();
    }

    setupLanguageManager() {
        // Load saved language preference
        this.currentLanguage = localStorage.getItem('kohalpur_language') || 'en';
        
        // Update language selector if exists
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
        
        // Apply language immediately
        this.applyLanguage();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Language switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && menuToggle && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target) &&
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });

        // Apply language to dynamically loaded content
        window.addEventListener('languageChanged', () => {
            this.applyLanguage();
            this.updateOnlineStatus();
        });
    }

    async loadFAQData() {
        try {
            const response = await fetch('kohalpur_faq_100.json');
            this.faqData = await response.json();
            console.log('FAQ data loaded:', this.faqData.length, 'questions');
            
            // Store in localStorage for offline use
            localStorage.setItem('kohalpur_faq', JSON.stringify(this.faqData));
        } catch (error) {
            console.log('Error loading FAQ data:', error);
            // Try to load from localStorage
            const cachedData = localStorage.getItem('kohalpur_faq');
            if (cachedData) {
                this.faqData = JSON.parse(cachedData);
                console.log('Loaded FAQ from cache:', this.faqData.length, 'questions');
            }
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('scripts/service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }

    updateOnlineStatus() {
        const offlineAlert = document.getElementById('offlineAlert');
        const statusText = document.getElementById('offlineText');
        const statusDot = document.getElementById('statusDot');
        const statusTextElem = document.getElementById('statusText');

        if (this.isOnline) {
            if (offlineAlert) offlineAlert.classList.remove('show');
            if (statusDot) {
                statusDot.style.backgroundColor = '#2ed573';
                statusDot.title = this.getTranslation('online_status');
            }
            if (statusTextElem) {
                statusTextElem.textContent = this.getTranslation('online_status');
            }
        } else {
            if (offlineAlert) {
                offlineAlert.classList.add('show');
                if (statusText) {
                    statusText.textContent = this.getTranslation('offline_message');
                }
            }
            if (statusDot) {
                statusDot.style.backgroundColor = '#ffa502';
                statusDot.title = this.getTranslation('offline_status');
            }
            if (statusTextElem) {
                statusTextElem.textContent = this.getTranslation('offline_status');
            }
        }
    }

    async syncOfflineData() {
        // Sync offline complaints when coming online
        const offlineComplaints = JSON.parse(localStorage.getItem('offline_complaints') || '[]');
        if (offlineComplaints.length > 0) {
            console.log('Syncing offline complaints:', offlineComplaints.length);
            // In a real app, this would send to your backend
            localStorage.removeItem('offline_complaints');
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('kohalpur_language', lang);
        
        // Update language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = lang;
        }
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        
        // Apply language changes
        this.applyLanguage();
    }

    applyLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'SELECT') {
                    // For select options
                    if (element.hasAttribute('data-i18n-keep')) {
                        // Keep original values, just translate placeholder
                        const firstOption = element.options[0];
                        if (firstOption && firstOption.value === '') {
                            firstOption.textContent = translation;
                        }
                    }
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.title = translation;
                } else {
                    element.setAttribute('title', translation);
                }
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            if (translation && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                element.placeholder = translation;
            }
        });

        // Update page title if it has data-i18n attribute
        const titleElement = document.querySelector('title[data-i18n], [data-i18n-title]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n') || titleElement.getAttribute('data-i18n-title');
            if (key) {
                document.title = this.getTranslation(key) + ' - Kohalpur GPT';
            }
        }

        // Update specific elements by ID
        this.updateElementByIds();
    }

    updateElementByIds() {
        const translations = {
            'en': {
                'hero-title': 'Welcome to Kohalpur GPT',
                'hero-subtitle': 'Your community-focused digital assistant for Kohalpur Municipality, Nepal',
                'features-title': 'Key Features',
                'features-subtitle': 'Comprehensive digital assistant services for Kohalpur residents and visitors',
                'how-title': 'How It Works',
                'offlineText': 'You are currently offline. Using local FAQ database.',
                'online_status': 'Online',
                'offline_status': 'Offline',
                'offline_message': 'You are currently offline. Using local FAQ database.'
            },
            'np': {
                'hero-title': 'कोहलपुर जीपीटीमा स्वागत छ',
                'hero-subtitle': 'नेपालको कोहलपुर नगरपालिकाको लागि तपाईंको समुदाय-केन्द्रित डिजिटल सहायक',
                'features-title': 'मुख्य विशेषताहरू',
                'features-subtitle': 'कोहलपुरका बासिन्दा र भ्रमणकारीहरूको लागि सम्पूर्ण डिजिटल सहायक सेवाहरू',
                'how-title': 'यसले कसरी काम गर्छ',
                'offlineText': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
                'online_status': 'अनलाइन',
                'offline_status': 'अफलाइन',
                'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।'
            },
            'th': {
                'hero-title': 'कोहलपुर GPT मा स्वागत छ',
                'hero-subtitle': 'नेपाल को कोहलपुर नगरपालिका को लागि तपाईं को समुदाय-केन्द्रित डिजिटल सहायक',
                'features-title': 'मुख्य विशेषताहरू',
                'features-subtitle': 'कोहलपुर का बासिन्दा र भ्रमणकारीहरू को लागि सम्पूर्ण डिजिटल सहायक सेवाहरू',
                'how-title': 'यसले कसरी काम गर्छ',
                'offlineText': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
                'online_status': 'अनलाइन',
                'offline_status': 'अफलाइन',
                'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।'
            }
        };

        const langData = translations[this.currentLanguage] || translations['en'];
        
        Object.keys(langData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = langData[id];
            }
        });
    }

    getTranslation(key) {
        const translations = {
            'en': {
                // Navigation
                'nav_home': 'Home',
                'nav_chat': 'AI Chat',
                'nav_complaint': 'Complaint',
                'nav_emergency': 'Emergency',
                'nav_directory': 'Directory',
                'nav_faq': 'FAQ',
                'nav_admin': 'Admin Panel',
                'nav_dashboard': 'Dashboard',
                
                // Common
                'online_status': 'Online',
                'offline_status': 'Offline',
                'offline_message': 'You are currently offline. Using local FAQ database.',
                'loading': 'Loading...',
                'error': 'Error',
                'success': 'Success',
                'warning': 'Warning',
                'close': 'Close',
                'save': 'Save',
                'cancel': 'Cancel',
                'submit': 'Submit',
                'update': 'Update',
                'delete': 'Delete',
                'edit': 'Edit',
                'view': 'View',
                'search': 'Search',
                'filter': 'Filter',
                'clear': 'Clear',
                'download': 'Download',
                'print': 'Print',
                'share': 'Share',
                'help': 'Help',
                'settings': 'Settings',
                'logout': 'Logout',
                'login': 'Login',
                'register': 'Register',
                'profile': 'Profile',
                'admin': 'Admin',
                'user': 'User',
                'guest': 'Guest',
                
                // Status
                'status_pending': 'Pending',
                'status_processing': 'Processing',
                'status_resolved': 'Resolved',
                'status_rejected': 'Rejected',
                
                // Priority
                'priority_low': 'Low',
                'priority_medium': 'Medium',
                'priority_high': 'High',
                'priority_critical': 'Critical',
                
                // Actions
                'action_edit': 'Edit',
                'action_view': 'View',
                'action_delete': 'Delete',
                'action_save': 'Save',
                'action_cancel': 'Cancel',
                'action_submit': 'Submit',
                'action_update': 'Update',
                'action_download': 'Download',
                'action_print': 'Print',
                'action_share': 'Share',
                
                // Messages
                'save_success': 'Saved successfully',
                'update_success': 'Updated successfully',
                'delete_success': 'Deleted successfully',
                'submit_success': 'Submitted successfully',
                'error_occurred': 'An error occurred',
                'network_error': 'Network error',
                'server_error': 'Server error',
                'validation_error': 'Validation error',
                'required_field': 'This field is required',
                'invalid_email': 'Invalid email address',
                'invalid_phone': 'Invalid phone number',
                'invalid_date': 'Invalid date',
                'invalid_number': 'Invalid number',
                
                // Confirmation
                'confirm_delete': 'Are you sure you want to delete this item?',
                'confirm_cancel': 'Are you sure you want to cancel?',
                'confirm_logout': 'Are you sure you want to logout?',
                'yes': 'Yes',
                'no': 'No',
                'ok': 'OK',
                
                // Time
                'today': 'Today',
                'yesterday': 'Yesterday',
                'this_week': 'This week',
                'this_month': 'This month',
                'this_year': 'This year',
                'last_week': 'Last week',
                'last_month': 'Last month',
                'last_year': 'Last year',
                
                // Dates
                'january': 'January',
                'february': 'February',
                'march': 'March',
                'april': 'April',
                'may': 'May',
                'june': 'June',
                'july': 'July',
                'august': 'August',
                'september': 'September',
                'october': 'October',
                'november': 'November',
                'december': 'December',
                
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday',
                'sunday': 'Sunday'
            },
            'np': {
                // Navigation
                'nav_home': 'गृहपृष्ठ',
                'nav_chat': 'AI कुराकानी',
                'nav_complaint': 'शिकायत',
                'nav_emergency': 'आपतकालीन',
                'nav_directory': 'निर्देशिका',
                'nav_faq': 'बारम्बार सोधिने प्रश्न',
                'nav_admin': 'प्रशासक प्यानल',
                'nav_dashboard': 'ड्यासबोर्ड',
                
                // Common
                'online_status': 'अनलाइन',
                'offline_status': 'अफलाइन',
                'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
                'loading': 'लोड हुँदै...',
                'error': 'त्रुटि',
                'success': 'सफलता',
                'warning': 'चेतावनी',
                'close': 'बन्द गर्नुहोस्',
                'save': 'सेभ गर्नुहोस्',
                'cancel': 'रद्द गर्नुहोस्',
                'submit': 'पेश गर्नुहोस्',
                'update': 'अपडेट गर्नुहोस्',
                'delete': 'मेट्नुहोस्',
                'edit': 'सम्पादन गर्नुहोस्',
                'view': 'हेर्नुहोस्',
                'search': 'खोज्नुहोस्',
                'filter': 'फिल्टर गर्नुहोस्',
                'clear': 'खाली गर्नुहोस्',
                'download': 'डाउनलोड गर्नुहोस्',
                'print': 'प्रिन्ट गर्नुहोस्',
                'share': 'सेयर गर्नुहोस्',
                'help': 'मद्दत',
                'settings': 'सेटिङहरू',
                'logout': 'लगआउट',
                'login': 'लगइन',
                'register': 'दर्ता गर्नुहोस्',
                'profile': 'प्रोफाइल',
                'admin': 'प्रशासक',
                'user': 'प्रयोगकर्ता',
                'guest': 'अतिथि',
                
                // Status
                'status_pending': 'पेन्डिङ',
                'status_processing': 'प्रक्रियामा',
                'status_resolved': 'समाधान भयो',
                'status_rejected': 'अस्वीकृत',
                
                // Priority
                'priority_low': 'कम',
                'priority_medium': 'मध्यम',
                'priority_high': 'उच्च',
                'priority_critical': 'गम्भीर',
                
                // Actions
                'action_edit': 'सम्पादन गर्नुहोस्',
                'action_view': 'हेर्नुहोस्',
                'action_delete': 'मेट्नुहोस्',
                'action_save': 'सेभ गर्नुहोस्',
                'action_cancel': 'रद्द गर्नुहोस्',
                'action_submit': 'पेश गर्नुहोस्',
                'action_update': 'अपडेट गर्नुहोस्',
                'action_download': 'डाउनलोड गर्नुहोस्',
                'action_print': 'प्रिन्ट गर्नुहोस्',
                'action_share': 'सेयर गर्नुहोस्',
                
                // Messages
                'save_success': 'सफलतापूर्वक सेभ गरियो',
                'update_success': 'सफलतापूर्वक अपडेट गरियो',
                'delete_success': 'सफलतापूर्वक मेटियो',
                'submit_success': 'सफलतापूर्वक पेश गरियो',
                'error_occurred': 'एउटा त्रुटि भयो',
                'network_error': 'नेटवर्क त्रुटि',
                'server_error': 'सर्भर त्रुटि',
                'validation_error': 'मान्यता त्रुटि',
                'required_field': 'यो क्षेत्र आवश्यक छ',
                'invalid_email': 'अमान्य इमेल ठेगाना',
                'invalid_phone': 'अमान्य फोन नम्बर',
                'invalid_date': 'अमान्य मिति',
                'invalid_number': 'अमान्य नम्बर',
                
                // Confirmation
                'confirm_delete': 'के तपाईं यो वस्तु मेट्न निश्चित हुनुहुन्छ?',
                'confirm_cancel': 'के तपाईं रद्द गर्न निश्चित हुनुहुन्छ?',
                'confirm_logout': 'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?',
                'yes': 'हो',
                'no': 'होईन',
                'ok': 'ठिक छ',
                
                // Time
                'today': 'आज',
                'yesterday': 'हिजो',
                'this_week': 'यो हप्ता',
                'this_month': 'यो महिना',
                'this_year': 'यो वर्ष',
                'last_week': 'गत हप्ता',
                'last_month': 'गत महिना',
                'last_year': 'गत वर्ष',
                
                // Dates
                'january': 'जनवरी',
                'february': 'फेब्रुअरी',
                'march': 'मार्च',
                'april': 'अप्रिल',
                'may': 'मे',
                'june': 'जुन',
                'july': 'जुलाई',
                'august': 'अगस्ट',
                'september': 'सेप्टेम्बर',
                'october': 'अक्टोबर',
                'november': 'नोभेम्बर',
                'december': 'डिसेम्बर',
                
                'monday': 'सोमबार',
                'tuesday': 'मङ्गलबार',
                'wednesday': 'बुधबार',
                'thursday': 'बिहिबार',
                'friday': 'शुक्रबार',
                'saturday': 'शनिबार',
                'sunday': 'आइतबार'
            },
            'th': {
                // Navigation
                'nav_home': 'घर',
                'nav_chat': 'AI कुराकानी',
                'nav_complaint': 'शिकायत',
                'nav_emergency': 'आपातकालीन',
                'nav_directory': 'निर्देशिका',
                'nav_faq': 'बारम्बार सोधिने प्रश्न',
                'nav_admin': 'प्रशासक प्यानल',
                'nav_dashboard': 'ड्यासबोर्ड',
                
                // Common
                'online_status': 'अनलाइन',
                'offline_status': 'अफलाइन',
                'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
                'loading': 'लोड हुँदै...',
                'error': 'त्रुटि',
                'success': 'सफलता',
                'warning': 'चेतावनी',
                'close': 'बन्द गर्नुहोस्',
                'save': 'सेभ गर्नुहोस्',
                'cancel': 'रद्द गर्नुहोस्',
                'submit': 'पेश गर्नुहोस्',
                'update': 'अपडेट गर्नुहोस्',
                'delete': 'मेट्नुहोस्',
                'edit': 'सम्पादन गर्नुहोस्',
                'view': 'हेर्नुहोस्',
                'search': 'खोज्नुहोस्',
                'filter': 'फिल्टर गर्नुहोस्',
                'clear': 'खाली गर्नुहोस्',
                'download': 'डाउनलोड गर्नुहोस्',
                'print': 'प्रिन्ट गर्नुहोस्',
                'share': 'सेयर गर्नुहोस्',
                'help': 'मद्दत',
                'settings': 'सेटिङहरू',
                'logout': 'लगआउट',
                'login': 'लगइन',
                'register': 'दर्ता गर्नुहोस्',
                'profile': 'प्रोफाइल',
                'admin': 'प्रशासक',
                'user': 'प्रयोगकर्ता',
                'guest': 'अतिथि',
                
                // Status
                'status_pending': 'पेन्डिङ',
                'status_processing': 'प्रक्रियामा',
                'status_resolved': 'समाधान भयो',
                'status_rejected': 'अस्वीकृत',
                
                // Priority
                'priority_low': 'कम',
                'priority_medium': 'मध्यम',
                'priority_high': 'उच्च',
                'priority_critical': 'गम्भीर',
                
                // Actions
                'action_edit': 'सम्पादन गर्नुहोस्',
                'action_view': 'हेर्नुहोस्',
                'action_delete': 'मेट्नुहोस्',
                'action_save': 'सेभ गर्नुहोस्',
                'action_cancel': 'रद्द गर्नुहोस्',
                'action_submit': 'पेश गर्नुहोस्',
                'action_update': 'अपडेट गर्नुहोस्',
                'action_download': 'डाउनलोड गर्नुहोस्',
                'action_print': 'प्रिन्ट गर्नुहोस्',
                'action_share': 'सेयर गर्नुहोस्',
                
                // Messages
                'save_success': 'सफलतापूर्वक सेभ गरियो',
                'update_success': 'सफलतापूर्वक अपडेट गरियो',
                'delete_success': 'सफलतापूर्वक मेटियो',
                'submit_success': 'सफलतापूर्वक पेश गरियो',
                'error_occurred': 'एउटा त्रुटि भयो',
                'network_error': 'नेटवर्क त्रुटि',
                'server_error': 'सर्भर त्रुटि',
                'validation_error': 'मान्यता त्रुटि',
                'required_field': 'यो क्षेत्र आवश्यक छ',
                'invalid_email': 'अमान्य इमेल ठेगाना',
                'invalid_phone': 'अमान्य फोन नम्बर',
                'invalid_date': 'अमान्य मिति',
                'invalid_number': 'अमान्य नम्बर',
                
                // Confirmation
                'confirm_delete': 'के तपाईं यो वस्तु मेट्न निश्चित हुनुहुन्छ?',
                'confirm_cancel': 'के तपाईं रद्द गर्न निश्चित हुनुहुन्छ?',
                'confirm_logout': 'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?',
                'yes': 'हो',
                'no': 'होईन',
                'ok': 'ठिक छ',
                
                // Time
                'today': 'आज',
                'yesterday': 'हिजो',
                'this_week': 'यो हप्ता',
                'this_month': 'यो महिना',
                'this_year': 'यो वर्ष',
                'last_week': 'गत हप्ता',
                'last_month': 'गत महिना',
                'last_year': 'गत वर्ष',
                
                // Dates
                'january': 'जनवरी',
                'february': 'फेब्रुअरी',
                'march': 'मार्च',
                'april': 'अप्रिल',
                'may': 'मे',
                'june': 'जुन',
                'july': 'जुलाई',
                'august': 'अगस्ट',
                'september': 'सेप्टेम्बर',
                'october': 'अक्टोबर',
                'november': 'नोभेम्बर',
                'december': 'डिसेम्बर',
                
                'monday': 'सोमबार',
                'tuesday': 'मङ्गलबार',
                'wednesday': 'बुधबार',
                'thursday': 'बिहिबार',
                'friday': 'शुक्रबार',
                'saturday': 'शनिबार',
                'sunday': 'आइतबार'
            }
        };

        const langData = translations[this.currentLanguage] || translations['en'];
        return langData[key] || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    searchFAQ(query) {
        if (!this.faqData.length) return null;

        const currentLang = this.currentLanguage;
        const lowerQuery = query.toLowerCase();
        
        // Try to find matching question
        for (const item of this.faqData) {
            const question = item.question[currentLang] || item.question['en'];
            if (question && question.toLowerCase().includes(lowerQuery)) {
                return {
                    answer: item.answer[currentLang] || item.answer['en'],
                    verified: true
                };
            }
        }

        // Keyword matching
        const keywords = {
            'emergency': [2, 3, 4, 5],
            'police': [2],
            'hospital': [3],
            'fire': [4],
            'child': [5],
            'mayor': [1]
        };

        for (const [keyword, ids] of Object.entries(keywords)) {
            if (lowerQuery.includes(keyword)) {
                const item = this.faqData.find(faq => ids.includes(faq.id));
                if (item) {
                    return {
                        answer: item.answer[currentLang] || item.answer['en'],
                        verified: true
                    };
                }
            }
        }

        return null;
    }
}

// Initialize the app
const app = new KohalpurGPT();
window.KohalpurGPT = app;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KohalpurGPT };
}