// Complete language translations for all pages
const translations = {
    en: {
        // Navigation
        'nav_home': 'Home',
        'nav_chat': 'AI Chat',
        'nav_complaint': 'Complaint',
        'nav_emergency': 'Emergency',
        'nav_directory': 'Directory',
        'nav_faq': 'FAQ',
        'nav_admin': 'Admin Panel',
        
        // Home Page
        'hero_title': 'Welcome to Kohalpur GPT',
        'hero_subtitle': 'Your community-focused digital assistant for Kohalpur Municipality, Nepal',
        'feature_24_7': '24/7 AI Support',
        'feature_offline': 'Offline Access',
        'feature_languages': '3 Languages',
        'feature_verified': 'Verified Info',
        'start_chatting': 'Start Chatting',
        'emergency_contacts': 'Emergency Contacts',
        'features_title': 'Key Features',
        'features_subtitle': 'Comprehensive digital assistant services for Kohalpur residents and visitors',
        'feature_ai_title': 'AI Chat Assistant',
        'feature_ai_desc': 'Get instant answers about Kohalpur in English, Nepali, or Tharu languages',
        'feature_offline_title': 'Offline FAQ',
        'feature_offline_desc': 'Access 100+ common questions even without internet connection',
        'feature_emergency_title': 'Emergency Support',
        'feature_emergency_desc': 'Verified local emergency numbers for police, ambulance, fire services',
        'feature_complaint_title': 'Complaint System',
        'feature_complaint_desc': 'Report issues with descriptions, photos, and locations',
        'feature_directory_title': 'Local Directory',
        'feature_directory_desc': 'Find hospitals, schools, banks, and municipal offices',
        'feature_voice_title': 'Voice Chat',
        'feature_voice_desc': 'Voice input/output support for easier interaction',
        'how_it_works': 'How It Works',
        'step_ask': 'Ask Questions',
        'step_ask_desc': 'Type or speak your questions about Kohalpur',
        'step_answers': 'Get Answers',
        'step_answers_desc': 'Receive accurate, verified information instantly',
        'step_action': 'Take Action',
        'step_action_desc': 'File complaints, find contacts, or get emergency help',
        'offline_message': 'You are currently offline. Using local FAQ database.',
        
        // Footer
        'footer_desc': 'Official digital assistant for Kohalpur Municipality',
        'footer_quick_links': 'Quick Links',
        'footer_contact': 'Contact',
        'footer_address': 'Kohalpur Municipality',
        'footer_phone': '082-560001',
        'footer_email': 'info@kohalpurmun.gov.np',
        
        // Emergency Page
        'emergency_title': 'Emergency Contacts',
        'emergency_subtitle': 'Verified emergency numbers for Kohalpur Municipality. Save these numbers for urgent situations.',
        'emergency_alert': 'In case of emergency, call the appropriate number below immediately.',
        'emergency_alert_desc': 'For non-emergency municipal inquiries, use the chat feature.',
        'police_title': 'Police',
        'police_desc': 'Kohalpur Police Station',
        'ambulance_title': 'Ambulance',
        'ambulance_desc': 'Kohalpur Hospital',
        'fire_title': 'Fire Brigade',
        'fire_desc': 'Kohalpur Fire Station',
        'women_helpline_title': 'Women & Child Helpline',
        'women_helpline_desc': '24/7 support for women and children in distress',
        'child_protection_title': 'Child Protection',
        'child_protection_desc': 'Child protection and welfare',
        'electricity_title': 'Electricity Emergency',
        'electricity_desc': 'Nepal Electricity Authority',
        'water_title': 'Water Supply',
        'water_desc': 'Water supply issues',
        'municipal_office_title': 'Municipal Office',
        'municipal_office_desc': 'Main office contact',
        
        // Directory Page
        'directory_title': 'Local Directory',
        'directory_subtitle': 'Find important services and offices in Kohalpur Municipality',
        'search_placeholder': 'Search hospitals, schools, offices...',
        'category_all': 'All',
        'category_hospitals': 'Hospitals',
        'category_schools': 'Schools',
        'category_banks': 'Banks',
        'category_offices': 'Government Offices',
        'category_hotels': 'Hotels',
        'category_markets': 'Markets',
        'view_on_map': 'View on Map',
        'call_now': 'Call Now',
        'get_directions': 'Get Directions',
        'opening_hours': 'Opening Hours',
        
        // FAQ Page
        'faq_title': 'Frequently Asked Questions',
        'faq_subtitle': 'Find answers to common questions about Kohalpur',
        'search_faq_placeholder': 'Search questions...',
        'category_general': 'General',
        'category_emergency': 'Emergency',
        'category_services': 'Services',
        'category_tourism': 'Tourism',
        'category_education': 'Education',
        'category_health': 'Health',
        'verified_answer': 'Verified Information',
        
        // Complaint Page
        'complaint_title': 'File a Complaint',
        'complaint_subtitle': 'Report issues about infrastructure, services, or other problems in Kohalpur',
        'step1_title': 'What type of issue?',
        'type_infrastructure': 'Infrastructure',
        'type_infrastructure_desc': 'Roads, water, electricity, etc.',
        'type_sanitation': 'Sanitation',
        'type_sanitation_desc': 'Garbage, drainage, cleanliness',
        'type_safety': 'Safety & Security',
        'type_safety_desc': 'Street lights, police, emergencies',
        'type_service': 'Public Service',
        'type_service_desc': 'Office delays, documentation',
        'type_other': 'Other',
        'type_other_desc': 'Any other issues',
        'next_button': 'Next',
        'step2_title': 'Provide Details',
        'label_title': 'Title',
        'title_placeholder': 'Brief description of the issue',
        'label_description': 'Description',
        'description_placeholder': 'Describe the issue in detail...',
        'label_location': 'Location',
        'location_placeholder': 'Street, ward, landmark',
        'label_ward': 'Ward Number',
        'ward_placeholder': 'Select Ward',
        'back_button': 'Back',
        'step3_title': 'Add Photos & Contact Info',
        'label_photos': 'Upload Photos (Optional)',
        'upload_text': 'Click or drag photos here',
        'label_name': 'Your Name (Optional)',
        'name_placeholder': 'Your name',
        'label_phone': 'Phone Number (Optional)',
        'phone_placeholder': '98XXXXXXXX',
        'label_email': 'Email (Optional)',
        'email_placeholder': 'your@email.com',
        'label_anonymous': 'Submit anonymously',
        'submit_button': 'Submit Complaint',
        'your_complaints': 'Your Submitted Complaints',
        'no_complaints': 'No complaints submitted yet',
        'ticket_id': 'Ticket ID',
        'complaint_type': 'Type',
        'complaint_status': 'Status',
        'date_submitted': 'Date Submitted',
        'action_edit': 'Edit',
        'action_view': 'View',
        'status_pending': 'Pending',
        'status_processing': 'Processing',
        'status_resolved': 'Resolved',
        'status_rejected': 'Rejected',
        'edit_complaint': 'Edit Complaint',
        'update_button': 'Update Complaint',
        'delete_button': 'Delete Complaint',
        'save_locally': 'Saved locally (offline)',
        'sync_pending': 'Sync pending',
        'submitted_success': 'Complaint submitted successfully!',
        'updated_success': 'Complaint updated successfully!',
        'delete_confirm': 'Are you sure you want to delete this complaint?',
        
        // Admin Page
        'admin_title': 'Complaint Admin Panel',
        'admin_subtitle': 'Manage all complaints from Kohalpur residents',
        'total_complaints': 'Total Complaints',
        'pending_complaints': 'Pending',
        'processing_complaints': 'Processing',
        'resolved_complaints': 'Resolved',
        'search_complaints': 'Search complaints...',
        'filter_all': 'All',
        'filter_pending': 'Pending',
        'filter_processing': 'Processing',
        'filter_resolved': 'Resolved',
        'export_csv': 'Export CSV',
        'complaint_details': 'Complaint Details',
        'assigned_to': 'Assigned To',
        'priority': 'Priority',
        'priority_low': 'Low',
        'priority_medium': 'Medium',
        'priority_high': 'High',
        'priority_critical': 'Critical',
        'add_comment': 'Add Comment',
        'comment_placeholder': 'Add status update or comment...',
        'update_status': 'Update Status',
        'assign_to_me': 'Assign to Me',
        'download_photos': 'Download Photos',
        'close_details': 'Close',
        'no_complaints_admin': 'No complaints found',
        'admin_login': 'Admin Login',
        'username': 'Username',
        'password': 'Password',
        'login_button': 'Login',
        'logout_button': 'Logout',
        'invalid_credentials': 'Invalid username or password'
    },
    
    np: {
        // Navigation
        'nav_home': 'गृहपृष्ठ',
        'nav_chat': 'AI कुराकानी',
        'nav_complaint': 'शिकायत',
        'nav_emergency': 'आपतकालीन',
        'nav_directory': 'निर्देशिका',
        'nav_faq': 'बारम्बार सोधिने प्रश्न',
        'nav_admin': 'प्रशासक प्यानल',
        
        // Home Page
        'hero_title': 'कोहलपुर जीपीटीमा स्वागत छ',
        'hero_subtitle': 'नेपालको कोहलपुर नगरपालिकाको लागि तपाईंको समुदाय-केन्द्रित डिजिटल सहायक',
        'feature_24_7': '२४/७ AI सहयोग',
        'feature_offline': 'अफलाइन पहुँच',
        'feature_languages': '३ भाषाहरू',
        'feature_verified': 'प्रमाणित जानकारी',
        'start_chatting': 'कुराकानी सुरु गर्नुहोस्',
        'emergency_contacts': 'आपतकालीन सम्पर्क',
        'features_title': 'मुख्य विशेषताहरू',
        'features_subtitle': 'कोहलपुरका बासिन्दा र भ्रमणकारीहरूको लागि सम्पूर्ण डिजिटल सहायक सेवाहरू',
        'feature_ai_title': 'AI कुराकानी सहायक',
        'feature_ai_desc': 'अंग्रेजी, नेपाली, वा थारु भाषामा कोहलपुरको बारेमा तत्काल उत्तर पाउनुहोस्',
        'feature_offline_title': 'अफलाइन FAQ',
        'feature_offline_desc': 'इन्टरनेट कनेक्सन नभए पनि १००+ सामान्य प्रश्नहरू पहुँच गर्नुहोस्',
        'feature_emergency_title': 'आपतकालीन सहयोग',
        'feature_emergency_desc': 'प्रहरी, एम्बुलेन्स, अग्निशमन सेवाका लागि प्रमाणित स्थानीय आपतकालीन नम्बरहरू',
        'feature_complaint_title': 'शिकायत प्रणाली',
        'feature_complaint_desc': 'विवरण, फोटो र स्थानसहित समस्याहरू रिपोर्ट गर्नुहोस्',
        'feature_directory_title': 'स्थानीय निर्देशिका',
        'feature_directory_desc': 'अस्पताल, विद्यालय, बैंक र नगरपालिका कार्यालयहरू फेला पार्नुहोस्',
        'feature_voice_title': 'आवाज कुराकानी',
        'feature_voice_desc': 'सजिलो अन्तरक्रियाका लागि आवाज इनपुट/आउटपुट सहयोग',
        'how_it_works': 'यसले कसरी काम गर्छ',
        'step_ask': 'प्रश्न सोध्नुहोस्',
        'step_ask_desc': 'कोहलपुरको बारेमा आफ्नो प्रश्नहरू टाइप वा बोल्नुहोस्',
        'step_answers': 'उत्तर पाउनुहोस्',
        'step_answers_desc': 'तत्काल सही, प्रमाणित जानकारी प्राप्त गर्नुहोस्',
        'step_action': 'कार्य गर्नुहोस्',
        'step_action_desc': 'शिकायत दर्ज गर्नुहोस्, सम्पर्क फेला पार्नुहोस्, वा आपतकालीन सहयोग पाउनुहोस्',
        'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
        
        // Footer
        'footer_desc': 'कोहलपुर नगरपालिकाको आधिकारिक डिजिटल सहायक',
        'footer_quick_links': 'द्रुत लिङ्कहरू',
        'footer_contact': 'सम्पर्क',
        'footer_address': 'कोहलपुर नगरपालिका',
        'footer_phone': '०८२-५६०००१',
        'footer_email': 'info@kohalpurmun.gov.np',
        
        // Emergency Page
        'emergency_title': 'आपतकालीन सम्पर्क नम्बरहरू',
        'emergency_subtitle': 'कोहलपुर नगरपालिकाका लागि प्रमाणित आपतकालीन नम्बरहरू। जरुरी अवस्थाका लागि यी नम्बरहरू सेभ गर्नुहोस्।',
        'emergency_alert': 'आपतकालीन अवस्थामा, तलको उपयुक्त नम्बरमा तुरुन्त कल गर्नुहोस्।',
        'emergency_alert_desc': 'गैर-आपतकालीन नगरपालिका जानकारीको लागि, कुराकानी फिचर प्रयोग गर्नुहोस्।',
        'police_title': 'प्रहरी',
        'police_desc': 'कोहलपुर प्रहरी कार्यालय',
        'ambulance_title': 'एम्बुलेन्स',
        'ambulance_desc': 'कोहलपुर अस्पताल',
        'fire_title': 'अग्निशमन',
        'fire_desc': 'कोहलपुर अग्निशमन कार्यालय',
        'women_helpline_title': 'महिला र बाल हेल्पलाइन',
        'women_helpline_desc': 'संकटमा परेका महिला र बालबालिकाका लागि २४/७ सहयोग',
        'child_protection_title': 'बाल संरक्षण',
        'child_protection_desc': 'बाल संरक्षण र कल्याण',
        'electricity_title': 'बिजुली आपतकालीन',
        'electricity_desc': 'नेपाल बिजुली प्राधिकरण',
        'water_title': 'पानी आपूर्ति',
        'water_desc': 'पानी आपूर्ति समस्या',
        'municipal_office_title': 'नगरपालिका कार्यालय',
        'municipal_office_desc': 'मुख्य कार्यालय सम्पर्क',
        
        // Directory Page
        'directory_title': 'स्थानीय निर्देशिका',
        'directory_subtitle': 'कोहलपुर नगरपालिकामा महत्वपूर्ण सेवाहरू र कार्यालयहरू फेला पार्नुहोस्',
        'search_placeholder': 'अस्पताल, विद्यालय, कार्यालय खोज्नुहोस्...',
        'category_all': 'सबै',
        'category_hospitals': 'अस्पतालहरू',
        'category_schools': 'विद्यालयहरू',
        'category_banks': 'बैंकहरू',
        'category_offices': 'सरकारी कार्यालयहरू',
        'category_hotels': 'होटलहरू',
        'category_markets': 'बजारहरू',
        'view_on_map': 'नक्सामा हेर्नुहोस्',
        'call_now': 'अहिले कल गर्नुहोस्',
        'get_directions': 'बाटो निर्देशन पाउनुहोस्',
        'opening_hours': 'खुल्ने समय',
        
        // FAQ Page
        'faq_title': 'बारम्बार सोधिने प्रश्नहरू',
        'faq_subtitle': 'कोहलपुरको बारेमा सामान्य प्रश्नहरूको उत्तर फेला पार्नुहोस्',
        'search_faq_placeholder': 'प्रश्नहरू खोज्नुहोस्...',
        'category_general': 'सामान्य',
        'category_emergency': 'आपतकालीन',
        'category_services': 'सेवाहरू',
        'category_tourism': 'पर्यटन',
        'category_education': 'शिक्षा',
        'category_health': 'स्वास्थ्य',
        'verified_answer': 'प्रमाणित जानकारी',
        
        // Complaint Page
        'complaint_title': 'शिकायत दर्ज गर्नुहोस्',
        'complaint_subtitle': 'कोहलपुरमा अवस्थित ढाँचा, सेवा, वा अन्य समस्याहरूको बारेमा रिपोर्ट गर्नुहोस्',
        'step1_title': 'कस्तो प्रकारको समस्या?',
        'type_infrastructure': 'ढाँचा',
        'type_infrastructure_desc': 'सडक, पानी, बिजुली, आदि',
        'type_sanitation': 'सफाइ',
        'type_sanitation_desc': 'फोहोर, जल निकासी, सफाइ',
        'type_safety': 'सुरक्षा',
        'type_safety_desc': 'बत्ती बाल, प्रहरी, आपतकालीन',
        'type_service': 'सार्वजनिक सेवा',
        'type_service_desc': 'कार्यालय ढिलाइ, कागजात',
        'type_other': 'अन्य',
        'type_other_desc': 'कुनै पनि अन्य समस्या',
        'next_button': 'अर्को',
        'step2_title': 'विवरण दिनुहोस्',
        'label_title': 'शीर्षक',
        'title_placeholder': 'समस्याको संक्षिप्त विवरण',
        'label_description': 'विवरण',
        'description_placeholder': 'समस्याको विस्तृत विवरण दिनुहोस्...',
        'label_location': 'स्थान',
        'location_placeholder': 'सडक, वार्ड, ल्यान्डमार्क',
        'label_ward': 'वार्ड नम्बर',
        'ward_placeholder': 'वार्ड छान्नुहोस्',
        'back_button': 'पछाडि',
        'step3_title': 'फोटो र सम्पर्क जानकारी थप्नुहोस्',
        'label_photos': 'फोटो अपलोड गर्नुहोस् (वैकल्पिक)',
        'upload_text': 'यहाँ क्लिक गर्नुहोस् वा फोटो तान्नुहोस्',
        'label_name': 'तपाईंको नाम (वैकल्पिक)',
        'name_placeholder': 'तपाईंको नाम',
        'label_phone': 'फोन नम्बर (वैकल्पिक)',
        'phone_placeholder': '९८XXXXXXXX',
        'label_email': 'इमेल (वैकल्पिक)',
        'email_placeholder': 'your@email.com',
        'label_anonymous': 'अज्ञात रूपमा पेश गर्नुहोस्',
        'submit_button': 'शिकायत पेश गर्नुहोस्',
        'your_complaints': 'तपाईंले पेश गर्नुभएका शिकायतहरू',
        'no_complaints': 'अहिले सम्म कुनै शिकायत पेश गरिएको छैन',
        'ticket_id': 'टिकट आईडी',
        'complaint_type': 'प्रकार',
        'complaint_status': 'स्थिति',
        'date_submitted': 'मिति पेश',
        'action_edit': 'सम्पादन गर्नुहोस्',
        'action_view': 'हेर्नुहोस्',
        'status_pending': 'पेन्डिङ',
        'status_processing': 'प्रक्रियामा',
        'status_resolved': 'समाधान भयो',
        'status_rejected': ' अस्वीकृत',
        'edit_complaint': 'शिकायत सम्पादन गर्नुहोस्',
        'update_button': 'शिकायत अपडेट गर्नुहोस्',
        'delete_button': 'शिकायत मेट्नुहोस्',
        'save_locally': 'स्थानीय रूपमा सेभ गरियो (अफलाइन)',
        'sync_pending': 'सिङ्क पेन्डिङ',
        'submitted_success': 'शिकायत सफलतापूर्वक पेश गरियो!',
        'updated_success': 'शिकायत सफलतापूर्वक अपडेट गरियो!',
        'delete_confirm': 'के तपाईं यो शिकायत मेट्न निश्चित हुनुहुन्छ?',
        
        // Admin Page
        'admin_title': 'शिकायत प्रशासक प्यानल',
        'admin_subtitle': 'कोहलपुर बासिन्दाहरूबाट आएका सबै शिकायतहरू व्यवस्थापन गर्नुहोस्',
        'total_complaints': 'कुल शिकायतहरू',
        'pending_complaints': 'पेन्डिङ',
        'processing_complaints': 'प्रक्रियामा',
        'resolved_complaints': 'समाधान भयो',
        'search_complaints': 'शिकायतहरू खोज्नुहोस्...',
        'filter_all': 'सबै',
        'filter_pending': 'पेन्डिङ',
        'filter_processing': 'प्रक्रियामा',
        'filter_resolved': 'समाधान भयो',
        'export_csv': 'CSV निर्यात गर्नुहोस्',
        'complaint_details': 'शिकायत विवरण',
        'assigned_to': 'तोकिएको',
        'priority': 'प्राथमिकता',
        'priority_low': 'कम',
        'priority_medium': 'मध्यम',
        'priority_high': 'उच्च',
        'priority_critical': 'गम्भीर',
        'add_comment': 'टिप्पणी थप्नुहोस्',
        'comment_placeholder': 'स्थिति अपडेट वा टिप्पणी थप्नुहोस्...',
        'update_status': 'स्थिति अपडेट गर्नुहोस्',
        'assign_to_me': 'मलाई तोक्नुहोस्',
        'download_photos': 'फोटो डाउनलोड गर्नुहोस्',
        'close_details': 'बन्द गर्नुहोस्',
        'no_complaints_admin': 'कुनै शिकायत फेला परेन',
        'admin_login': 'प्रशासक लगइन',
        'username': 'प्रयोगकर्ता नाम',
        'password': 'पासवर्ड',
        'login_button': 'लगइन',
        'logout_button': 'लगआउट',
        'invalid_credentials': 'अमान्य प्रयोगकर्ता नाम वा पासवर्ड'
    },
    
    th: {
        // Navigation
        'nav_home': 'घर',
        'nav_chat': 'AI कुराकानी',
        'nav_complaint': 'शिकायत',
        'nav_emergency': 'आपातकालीन',
        'nav_directory': 'निर्देशिका',
        'nav_faq': 'बारम्बार सोधिने प्रश्न',
        'nav_admin': 'प्रशासक प्यानल',
        
        // Home Page
        'hero_title': 'कोहलपुर GPT मा स्वागत छ',
        'hero_subtitle': 'नेपाल को कोहलपुर नगरपालिका को लागि तपाईं को समुदाय-केन्द्रित डिजिटल सहायक',
        'feature_24_7': '24/7 AI सहयोग',
        'feature_offline': 'अफलाइन पहुँच',
        'feature_languages': '3 भाषाहरू',
        'feature_verified': 'प्रमाणित जानकारी',
        'start_chatting': 'कुराकानी शुरू गर्नुहोस्',
        'emergency_contacts': 'आपातकालीन सम्पर्क',
        'features_title': 'मुख्य विशेषताहरू',
        'features_subtitle': 'कोहलपुर का बासिन्दा र भ्रमणकारीहरू को लागि सम्पूर्ण डिजिटल सहायक सेवाहरू',
        'feature_ai_title': 'AI कुराकानी सहायक',
        'feature_ai_desc': 'अंग्रेजी, नेपाली, वा थारु भाषा मा कोहलपुर को बारे मा तत्काल उत्तर पाउनुहोस्',
        'feature_offline_title': 'अफलाइन FAQ',
        'feature_offline_desc': 'इन्टरनेट कनेक्सन नभए पनि 100+ सामान्य प्रश्नहरू पहुँच गर्नुहोस्',
        'feature_emergency_title': 'आपातकालीन सहयोग',
        'feature_emergency_desc': 'प्रहरी, एम्बुलेन्स, अग्निशमन सेवा का लागि प्रमाणित स्थानीय आपातकालीन नम्बरहरू',
        'feature_complaint_title': 'शिकायत प्रणाली',
        'feature_complaint_desc': 'विवरण, फोटो र स्थान सहित समस्याहरू रिपोर्ट गर्नुहोस्',
        'feature_directory_title': 'स्थानीय निर्देशिका',
        'feature_directory_desc': 'अस्पताल, विद्यालय, बैंक र नगरपालिका कार्यालयहरू फेला पार्नुहोस्',
        'feature_voice_title': 'आवाज कुराकानी',
        'feature_voice_desc': 'सजिलो अन्तरक्रिया का लागि आवाज इनपुट/आउटपुट सहयोग',
        'how_it_works': 'यसले कसरी काम गर्छ',
        'step_ask': 'प्रश्न सोध्नुहोस्',
        'step_ask_desc': 'कोहलपुर को बारे मा आफ्नो प्रश्नहरू टाइप वा बोल्नुहोस्',
        'step_answers': 'उत्तर पाउनुहोस्',
        'step_answers_desc': 'तत्काल सही, प्रमाणित जानकारी प्राप्त गर्नुहोस्',
        'step_action': 'कार्य गर्नुहोस्',
        'step_action_desc': 'शिकायत दर्ज गर्नुहोस्, सम्पर्क फेला पार्नुहोस्, वा आपातकालीन सहयोग पाउनुहोस्',
        'offline_message': 'तपाईं अहिले अफलाइन हुनुहुन्छ। स्थानीय एफएक्यू डाटाबेस प्रयोग गर्दै।',
        
        // Footer
        'footer_desc': 'कोहलपुर नगरपालिका को आधिकारिक डिजिटल सहायक',
        'footer_quick_links': 'द्रुत लिङ्कहरू',
        'footer_contact': 'सम्पर्क',
        'footer_address': 'कोहलपुर नगरपालिका',
        'footer_phone': '०८२-५६०००१',
        'footer_email': 'info@kohalpurmun.gov.np',
        
        // Emergency Page (same structure as Nepali with Tharu variations if available)
        'emergency_title': 'आपातकालीन सम्पर्क नम्बरहरू',
        'emergency_subtitle': 'कोहलपुर नगरपालिका का लागि प्रमाणित आपातकालीन नम्बरहरू। जरुरी अवस्था का लागि यी नम्बरहरू सेभ गर्नुहोस्।',
        'emergency_alert': 'आपातकालीन अवस्था मा, तल को उपयुक्त नम्बर मा तुरुन्त कल गर्नुहोस्।',
        'emergency_alert_desc': 'गैर-आपातकालीन नगरपालिका जानकारी को लागि, कुराकानी फिचर प्रयोग गर्नुहोस्।',
        'police_title': 'प्रहरी',
        'police_desc': 'कोहलपुर प्रहरी कार्यालय',
        'ambulance_title': 'एम्बुलेन्स',
        'ambulance_desc': 'कोहलपुर अस्पताल',
        'fire_title': 'अग्निशमन',
        'fire_desc': 'कोहलपुर अग्निशमन कार्यालय',
        'women_helpline_title': 'महिला र बाल हेल्पलाइन',
        'women_helpline_desc': 'संकट मा परेका महिला र बालबालिका का लागि २४/७ सहयोग',
        'child_protection_title': 'बाल संरक्षण',
        'child_protection_desc': 'बाल संरक्षण र कल्याण',
        'electricity_title': 'बिजुली आपतकालीन',
        'electricity_desc': 'नेपाल बिजुली प्राधिकरण',
        'water_title': 'पानी आपूर्ति',
        'water_desc': 'पानी आपूर्ति समस्या',
        'municipal_office_title': 'नगरपालिका कार्यालय',
        'municipal_office_desc': 'मुख्य कार्यालय सम्पर्क',
        
        // Directory Page (same as Nepali)
        'directory_title': 'स्थानीय निर्देशिका',
        'directory_subtitle': 'कोहलपुर नगरपालिका मा महत्वपूर्ण सेवाहरू र कार्यालयहरू फेला पार्नुहोस्',
        'search_placeholder': 'अस्पताल, विद्यालय, कार्यालय खोज्नुहोस्...',
        'category_all': 'सबै',
        'category_hospitals': 'अस्पतालहरू',
        'category_schools': 'विद्यालयहरू',
        'category_banks': 'बैंकहरू',
        'category_offices': 'सरकारी कार्यालयहरू',
        'category_hotels': 'होटलहरू',
        'category_markets': 'बजारहरू',
        'view_on_map': 'नक्सा मा हेर्नुहोस्',
        'call_now': 'अहिले कल गर्नुहोस्',
        'get_directions': 'बाटो निर्देशन पाउनुहोस्',
        'opening_hours': 'खुल्ने समय',
        
        // FAQ Page (same as Nepali)
        'faq_title': 'बारम्बार सोधिने प्रश्नहरू',
        'faq_subtitle': 'कोहलपुर को बारे मा सामान्य प्रश्नहरू को उत्तर फेला पार्नुहोस्',
        'search_faq_placeholder': 'प्रश्नहरू खोज्नुहोस्...',
        'category_general': 'सामान्य',
        'category_emergency': 'आपतकालीन',
        'category_services': 'सेवाहरू',
        'category_tourism': 'पर्यटन',
        'category_education': 'शिक्षा',
        'category_health': 'स्वास्थ्य',
        'verified_answer': 'प्रमाणित जानकारी',
        
        // Complaint Page (same as Nepali)
        'complaint_title': 'शिकायत दर्ज गर्नुहोस्',
        'complaint_subtitle': 'कोहलपुर मा अवस्थित ढाँचा, सेवा, वा अन्य समस्याहरू को बारे मा रिपोर्ट गर्नुहोस्',
        'step1_title': 'कस्तो प्रकार को समस्या?',
        'type_infrastructure': 'ढाँचा',
        'type_infrastructure_desc': 'सडक, पानी, बिजुली, आदि',
        'type_sanitation': 'सफाइ',
        'type_sanitation_desc': 'फोहोर, जल निकासी, सफाइ',
        'type_safety': 'सुरक्षा',
        'type_safety_desc': 'बत्ती बाल, प्रहरी, आपतकालीन',
        'type_service': 'सार्वजनिक सेवा',
        'type_service_desc': 'कार्यालय ढिलाइ, कागजात',
        'type_other': 'अन्य',
        'type_other_desc': 'कुनै पनि अन्य समस्या',
        'next_button': 'अर्को',
        'step2_title': 'विवरण दिनुहोस्',
        'label_title': 'शीर्षक',
        'title_placeholder': 'समस्या को संक्षिप्त विवरण',
        'label_description': 'विवरण',
        'description_placeholder': 'समस्या को विस्तृत विवरण दिनुहोस्...',
        'label_location': 'स्थान',
        'location_placeholder': 'सडक, वार्ड, ल्यान्डमार्क',
        'label_ward': 'वार्ड नम्बर',
        'ward_placeholder': 'वार्ड छान्नुहोस्',
        'back_button': 'पछाडि',
        'step3_title': 'फोटो र सम्पर्क जानकारी थप्नुहोस्',
        'label_photos': 'फोटो अपलोड गर्नुहोस् (वैकल्पिक)',
        'upload_text': 'यहाँ क्लिक गर्नुहोस् वा फोटो तान्नुहोस्',
        'label_name': 'तपाईं को नाम (वैकल्पिक)',
        'name_placeholder': 'तपाईं को नाम',
        'label_phone': 'फोन नम्बर (वैकल्पिक)',
        'phone_placeholder': '९८XXXXXXXX',
        'label_email': 'इमेल (वैकल्पिक)',
        'email_placeholder': 'your@email.com',
        'label_anonymous': 'अज्ञात रूप मा पेश गर्नुहोस्',
        'submit_button': 'शिकायत पेश गर्नुहोस्',
        'your_complaints': 'तपाईं ले पेश गर्नुभएका शिकायतहरू',
        'no_complaints': 'अहिले सम्म कुनै शिकायत पेश गरिएको छैन',
        'ticket_id': 'टिकट आईडी',
        'complaint_type': 'प्रकार',
        'complaint_status': 'स्थिति',
        'date_submitted': 'मिति पेश',
        'action_edit': 'सम्पादन गर्नुहोस्',
        'action_view': 'हेर्नुहोस्',
        'status_pending': 'पेन्डिङ',
        'status_processing': 'प्रक्रिया मा',
        'status_resolved': 'समाधान भयो',
        'status_rejected': 'अस्वीकृत',
        'edit_complaint': 'शिकायत सम्पादन गर्नुहोस्',
        'update_button': 'शिकायत अपडेट गर्नुहोस्',
        'delete_button': 'शिकायत मेट्नुहोस्',
        'save_locally': 'स्थानीय रूप मा सेभ गरियो (अफलाइन)',
        'sync_pending': 'सिङ्क पेन्डिङ',
        'submitted_success': 'शिकायत सफलतापूर्वक पेश गरियो!',
        'updated_success': 'शिकायत सफलतापूर्वक अपडेट गरियो!',
        'delete_confirm': 'के तपाईं यो शिकायत मेट्न निश्चित हुनुहुन्छ?',
        
        // Admin Page (same as Nepali)
        'admin_title': 'शिकायत प्रशासक प्यानल',
        'admin_subtitle': 'कोहलपुर बासिन्दाहरू बाट आएका सबै शिकायतहरू व्यवस्थापन गर्नुहोस्',
        'total_complaints': 'कुल शिकायतहरू',
        'pending_complaints': 'पेन्डिङ',
        'processing_complaints': 'प्रक्रिया मा',
        'resolved_complaints': 'समाधान भयो',
        'search_complaints': 'शिकायतहरू खोज्नुहोस्...',
        'filter_all': 'सबै',
        'filter_pending': 'पेन्डिङ',
        'filter_processing': 'प्रक्रिया मा',
        'filter_resolved': 'समाधान भयो',
        'export_csv': 'CSV निर्यात गर्नुहोस्',
        'complaint_details': 'शिकायत विवरण',
        'assigned_to': 'तोकिएको',
        'priority': 'प्राथमिकता',
        'priority_low': 'कम',
        'priority_medium': 'मध्यम',
        'priority_high': 'उच्च',
        'priority_critical': 'गम्भीर',
        'add_comment': 'टिप्पणी थप्नुहोस्',
        'comment_placeholder': 'स्थिति अपडेट वा टिप्पणी थप्नुहोस्...',
        'update_status': 'स्थिति अपडेट गर्नुहोस्',
        'assign_to_me': 'मलाई तोक्नुहोस्',
        'download_photos': 'फोटो डाउनलोड गर्नुहोस्',
        'close_details': 'बन्द गर्नुहोस्',
        'no_complaints_admin': 'कुनै शिकायत फेला परेन',
        'admin_login': 'प्रशासक लगइन',
        'username': 'प्रयोगकर्ता नाम',
        'password': 'पासवर्ड',
        'login_button': 'लगइन',
        'logout_button': 'लगआउट',
        'invalid_credentials': 'अमान्य प्रयोगकर्ता नाम वा पासवर्ड'
    }
};

// Language utility class
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.init();
    }

    init() {
        // Load saved language preference
        this.currentLang = localStorage.getItem('kohalpur_language') || 'en';
        
        // Update language selector
        const selector = document.getElementById('languageSelect');
        if (selector) {
            selector.value = this.currentLang;
            selector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        
        // Apply current language
        this.applyLanguage();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('kohalpur_language', lang);
        this.applyLanguage();
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }

    applyLanguage() {
        const langData = translations[this.currentLang] || translations['en'];
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = langData[key];
                } else if (element.tagName === 'SELECT') {
                    // For select options, we need special handling
                    const option = element.querySelector(`option[value="${key}"]`);
                    if (option) {
                        option.textContent = langData[key];
                    } else {
                        element.textContent = langData[key];
                    }
                } else {
                    element.textContent = langData[key];
                }
            }
        });
        
        // Update page title if it has data-i18n-title
        const titleElement = document.querySelector('[data-i18n-title]');
        if (titleElement && langData[titleElement.getAttribute('data-i18n-title')]) {
            document.title = langData[titleElement.getAttribute('data-i18n-title')];
        }
        
        // Update specific elements with IDs
        this.updateElementByIds(langData);
    }

    updateElementByIds(langData) {
        // List of element IDs that need to be updated
        const idMap = {
            // Home page
            'hero-title': 'hero_title',
            'hero-subtitle': 'hero_subtitle',
            'features-title': 'features_title',
            'features-subtitle': 'features_subtitle',
            'how-title': 'how_it_works',
            
            // Emergency page
            'emergency-title': 'emergency_title',
            'emergency-subtitle': 'emergency_subtitle',
            'emergency-alert-text': 'emergency_alert',
            'emergency-alert-desc': 'emergency_alert_desc',
            
            // Directory page
            'directory-title': 'directory_title',
            'directory-subtitle': 'directory_subtitle',
            
            // FAQ page
            'faq-title': 'faq_title',
            'faq-subtitle': 'faq_subtitle',
            
            // Complaint page
            'complaint-title': 'complaint_title',
            'complaint-subtitle': 'complaint_subtitle',
            
            // Admin page
            'admin-title': 'admin_title',
            'admin-subtitle': 'admin_subtitle'
        };

        Object.entries(idMap).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element && langData[key]) {
                element.textContent = langData[key];
            }
        });
    }

    get(key) {
        return translations[this.currentLang]?.[key] || translations['en'][key] || key;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();
window.languageManager = languageManager;