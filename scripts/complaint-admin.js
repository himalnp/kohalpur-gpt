// Complete Multilingual Complaint Admin Panel
class ComplaintAdmin {
    constructor() {
        this.currentAdmin = null;
        this.currentComplaint = null;
        this.complaints = [];
        this.filteredComplaints = [];
        this.currentLanguage = 'en';
        this.init();
    }

    async init() {
        this.setupLanguage();
        this.checkLoginStatus();
        this.setupEventListeners();
        
        if (this.currentAdmin) {
            await this.loadComplaints();
        }
    }

    setupLanguage() {
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
        // Language switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Search input
        const searchInput = document.getElementById('adminSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterComplaints();
            });
        }

        // Filters
        const filters = ['statusFilter', 'wardFilter', 'typeFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.filterComplaints();
                });
            }
        });

        // Export button
        const exportBtn = document.querySelector('[onclick="exportToCSV()"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToCSV();
            });
        }

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('complaintModal');
            if (modal && e.target === modal) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('kohalpur_language', lang);
        this.applyLanguage();
    }

    applyLanguage() {
        const translations = this.getTranslations();
        const langData = translations[this.currentLanguage] || translations['en'];

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = langData[key];
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'SELECT') {
                    // For select options, update the first option (placeholder)
                    const firstOption = element.options[0];
                    if (firstOption && firstOption.value === '') {
                        firstOption.textContent = translation;
                    }
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = langData[key];
            if (translation && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                element.placeholder = translation;
            }
        });

        // Update page title
        document.title = langData['admin_title'] + ' - Kohalpur GPT';

        // Update table headers and modal content if they exist
        this.updateTableHeaders();
        this.updateModalContent();
    }

    updateTableHeaders() {
        const headers = document.querySelectorAll('.complaints-table th[data-i18n]');
        if (headers.length > 0) {
            const translations = this.getTranslations();
            const langData = translations[this.currentLanguage] || translations['en'];
            
            headers.forEach(header => {
                const key = header.getAttribute('data-i18n');
                if (langData[key]) {
                    header.textContent = langData[key];
                }
            });
        }
    }

    updateModalContent() {
        if (!this.currentComplaint) return;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modalTitle && modalBody) {
            const translations = this.getTranslations();
            const langData = translations[this.currentLanguage] || translations['en'];
            
            // Update modal title
            modalTitle.textContent = this.currentComplaint.title;
            
            // Update status update section labels
            const statusUpdateLabel = document.querySelector('#complaintModal h3[data-i18n="update_status"]');
            const commentLabel = document.querySelector('#complaintModal h3[data-i18n="add_comment"]');
            
            if (statusUpdateLabel) statusUpdateLabel.textContent = langData['update_status'];
            if (commentLabel) commentLabel.textContent = langData['add_comment'];
            
            // Update button texts
            const buttons = document.querySelectorAll('#complaintModal button[data-i18n]');
            buttons.forEach(button => {
                const key = button.getAttribute('data-i18n');
                if (langData[key]) {
                    button.textContent = langData[key];
                }
            });
        }
    }

    getTranslations() {
        return {
            'en': {
                // Admin Panel
                'admin_title': 'Complaint Admin Panel',
                'admin_subtitle': 'Manage all complaints from Kohalpur residents',
                'admin_dashboard': 'Dashboard',
                'admin_panel': 'Admin Panel',
                'admin_login': 'Admin Login',
                
                // Stats
                'total_complaints': 'Total Complaints',
                'pending_complaints': 'Pending',
                'processing_complaints': 'Processing',
                'resolved_complaints': 'Resolved',
                
                // Filters
                'search_complaints': 'Search complaints...',
                'filter_all': 'All',
                'filter_pending': 'Pending',
                'filter_processing': 'Processing',
                'filter_resolved': 'Resolved',
                
                // Table Headers
                'ticket_id': 'Ticket ID',
                'complaint_title': 'Title',
                'complaint_type': 'Type',
                'ward': 'Ward',
                'complaint_status': 'Status',
                'date_submitted': 'Date',
                'priority': 'Priority',
                'actions': 'Actions',
                
                // Actions
                'export_csv': 'Export CSV',
                'close_details': 'Close',
                'assign_to_me': 'Assign to Me',
                'download_photos': 'Download Photos',
                'update_status': 'Update Status',
                'add_comment': 'Add Comment',
                
                // Status & Priority
                'status_pending': 'Pending',
                'status_processing': 'Processing',
                'status_resolved': 'Resolved',
                'status_rejected': 'Rejected',
                'priority_low': 'Low',
                'priority_medium': 'Medium',
                'priority_high': 'High',
                'priority_critical': 'Critical',
                
                // Form Labels
                'username': 'Username',
                'password': 'Password',
                'login_button': 'Login',
                'logout_button': 'Logout',
                'assigned_to': 'Assigned To',
                'comment_placeholder': 'Add status update or comment...',
                
                // Messages
                'invalid_credentials': 'Invalid username or password',
                'login_success': 'Login successful',
                'logout_success': 'Logout successful',
                'complaint_updated': 'Complaint updated successfully',
                'comment_added': 'Comment added successfully',
                'no_complaints_admin': 'No complaints found',
                'loading_complaints': 'Loading complaints...',
                'error_loading': 'Error loading complaints',
                
                // Confirmation
                'confirm_delete': 'Are you sure you want to delete this complaint?',
                'confirm_assign': 'Are you sure you want to assign this complaint to yourself?',
                'confirm_update': 'Are you sure you want to update the status?',
                
                // Modal
                'complaint_details': 'Complaint Details',
                'description': 'Description',
                'location': 'Location',
                'submitted_by': 'Submitted By',
                'submitted_date': 'Submitted Date',
                'contact_info': 'Contact Information',
                'photos': 'Photos',
                'comments': 'Comments',
                'no_photos': 'No photos attached',
                'no_comments': 'No comments yet',
                'anonymous': 'Anonymous'
            },
            'np': {
                // Admin Panel
                'admin_title': 'शिकायत प्रशासक प्यानल',
                'admin_subtitle': 'कोहलपुर बासिन्दाहरूबाट आएका सबै शिकायतहरू व्यवस्थापन गर्नुहोस्',
                'admin_dashboard': 'ड्यासबोर्ड',
                'admin_panel': 'प्रशासक प्यानल',
                'admin_login': 'प्रशासक लगइन',
                
                // Stats
                'total_complaints': 'कुल शिकायतहरू',
                'pending_complaints': 'पेन्डिङ',
                'processing_complaints': 'प्रक्रियामा',
                'resolved_complaints': 'समाधान भयो',
                
                // Filters
                'search_complaints': 'शिकायतहरू खोज्नुहोस्...',
                'filter_all': 'सबै',
                'filter_pending': 'पेन्डिङ',
                'filter_processing': 'प्रक्रियामा',
                'filter_resolved': 'समाधान भयो',
                
                // Table Headers
                'ticket_id': 'टिकट आईडी',
                'complaint_title': 'शीर्षक',
                'complaint_type': 'प्रकार',
                'ward': 'वार्ड',
                'complaint_status': 'स्थिति',
                'date_submitted': 'मिति',
                'priority': 'प्राथमिकता',
                'actions': 'कार्यहरू',
                
                // Actions
                'export_csv': 'CSV निर्यात गर्नुहोस्',
                'close_details': 'बन्द गर्नुहोस्',
                'assign_to_me': 'मलाई तोक्नुहोस्',
                'download_photos': 'फोटो डाउनलोड गर्नुहोस्',
                'update_status': 'स्थिति अपडेट गर्नुहोस्',
                'add_comment': 'टिप्पणी थप्नुहोस्',
                
                // Status & Priority
                'status_pending': 'पेन्डिङ',
                'status_processing': 'प्रक्रियामा',
                'status_resolved': 'समाधान भयो',
                'status_rejected': 'अस्वीकृत',
                'priority_low': 'कम',
                'priority_medium': 'मध्यम',
                'priority_high': 'उच्च',
                'priority_critical': 'गम्भीर',
                
                // Form Labels
                'username': 'प्रयोगकर्ता नाम',
                'password': 'पासवर्ड',
                'login_button': 'लगइन',
                'logout_button': 'लगआउट',
                'assigned_to': 'तोकिएको',
                'comment_placeholder': 'स्थिति अपडेट वा टिप्पणी थप्नुहोस्...',
                
                // Messages
                'invalid_credentials': 'अमान्य प्रयोगकर्ता नाम वा पासवर्ड',
                'login_success': 'लगइन सफल भयो',
                'logout_success': 'लगआउट सफल भयो',
                'complaint_updated': 'शिकायत सफलतापूर्वक अपडेट गरियो',
                'comment_added': 'टिप्पणी सफलतापूर्वक थपियो',
                'no_complaints_admin': 'कुनै शिकायत फेला परेन',
                'loading_complaints': 'शिकायतहरू लोड हुँदै...',
                'error_loading': 'शिकायतहरू लोड गर्दा त्रुटि',
                
                // Confirmation
                'confirm_delete': 'के तपाईं यो शिकायत मेट्न निश्चित हुनुहुन्छ?',
                'confirm_assign': 'के तपाईं यो शिकायत आफैंलाई तोक्न निश्चित हुनुहुन्छ?',
                'confirm_update': 'के तपाईं स्थिति अपडेट गर्न निश्चित हुनुहुन्छ?',
                
                // Modal
                'complaint_details': 'शिकायत विवरण',
                'description': 'विवरण',
                'location': 'स्थान',
                'submitted_by': 'पेश गर्ने',
                'submitted_date': 'पेश गरिएको मिति',
                'contact_info': 'सम्पर्क जानकारी',
                'photos': 'फोटोहरू',
                'comments': 'टिप्पणीहरू',
                'no_photos': 'कुनै फोटो संलग्न छैन',
                'no_comments': 'अहिले सम्म कुनै टिप्पणी छैन',
                'anonymous': 'अज्ञात'
            },
            'th': {
                // Admin Panel
                'admin_title': 'शिकायत प्रशासक प्यानल',
                'admin_subtitle': 'कोहलपुर बासिन्दाहरू बाट आएका सबै शिकायतहरू व्यवस्थापन गर्नुहोस्',
                'admin_dashboard': 'ड्यासबोर्ड',
                'admin_panel': 'प्रशासक प्यानल',
                'admin_login': 'प्रशासक लगइन',
                
                // Stats
                'total_complaints': 'कुल शिकायतहरू',
                'pending_complaints': 'पेन्डिङ',
                'processing_complaints': 'प्रक्रिया मा',
                'resolved_complaints': 'समाधान भयो',
                
                // Filters
                'search_complaints': 'शिकायतहरू खोज्नुहोस्...',
                'filter_all': 'सबै',
                'filter_pending': 'पेन्डिङ',
                'filter_processing': 'प्रक्रिया मा',
                'filter_resolved': 'समाधान भयो',
                
                // Table Headers
                'ticket_id': 'टिकट आईडी',
                'complaint_title': 'शीर्षक',
                'complaint_type': 'प्रकार',
                'ward': 'वार्ड',
                'complaint_status': 'स्थिति',
                'date_submitted': 'मिति',
                'priority': 'प्राथमिकता',
                'actions': 'कार्यहरू',
                
                // Actions
                'export_csv': 'CSV निर्यात गर्नुहोस्',
                'close_details': 'बन्द गर्नुहोस्',
                'assign_to_me': 'मलाई तोक्नुहोस्',
                'download_photos': 'फोटो डाउनलोड गर्नुहोस्',
                'update_status': 'स्थिति अपडेट गर्नुहोस्',
                'add_comment': 'टिप्पणी थप्नुहोस्',
                
                // Status & Priority
                'status_pending': 'पेन्डिङ',
                'status_processing': 'प्रक्रिया मा',
                'status_resolved': 'समाधान भयो',
                'status_rejected': 'अस्वीकृत',
                'priority_low': 'कम',
                'priority_medium': 'मध्यम',
                'priority_high': 'उच्च',
                'priority_critical': 'गम्भीर',
                
                // Form Labels
                'username': 'प्रयोगकर्ता नाम',
                'password': 'पासवर्ड',
                'login_button': 'लगइन',
                'logout_button': 'लगआउट',
                'assigned_to': 'तोकिएको',
                'comment_placeholder': 'स्थिति अपडेट वा टिप्पणी थप्नुहोस्...',
                
                // Messages
                'invalid_credentials': 'अमान्य प्रयोगकर्ता नाम वा पासवर्ड',
                'login_success': 'लगइन सफल भयो',
                'logout_success': 'लगआउट सफल भयो',
                'complaint_updated': 'शिकायत सफलतापूर्वक अपडेट गरियो',
                'comment_added': 'टिप्पणी सफलतापूर्वक थपियो',
                'no_complaints_admin': 'कुनै शिकायत फेला परेन',
                'loading_complaints': 'शिकायतहरू लोड हुँदै...',
                'error_loading': 'शिकायतहरू लोड गर्दा त्रुटि',
                
                // Confirmation
                'confirm_delete': 'के तपाईं यो शिकायत मेट्न निश्चित हुनुहुन्छ?',
                'confirm_assign': 'के तपाईं यो शिकायत आफैंलाई तोक्न निश्चित हुनुहुन्छ?',
                'confirm_update': 'के तपाईं स्थिति अपडेट गर्न निश्चित हुनुहुन्छ?',
                
                // Modal
                'complaint_details': 'शिकायत विवरण',
                'description': 'विवरण',
                'location': 'स्थान',
                'submitted_by': 'पेश गर्ने',
                'submitted_date': 'पेश गरिएको मिति',
                'contact_info': 'सम्पर्क जानकारी',
                'photos': 'फोटोहरू',
                'comments': 'टिप्पणीहरू',
                'no_photos': 'कुनै फोटो संलग्न छैन',
                'no_comments': 'अहिले सम्म कुनै टिप्पणी छैन',
                'anonymous': 'अज्ञात'
            }
        };
    }

    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        const adminData = JSON.parse(localStorage.getItem('admin_data') || 'null');
        
        if (isLoggedIn && adminData) {
            this.currentAdmin = adminData;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (adminDashboard) adminDashboard.style.display = 'none';
    }

    showDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        
        // Update admin name in navbar
        const adminName = document.querySelector('.nav-brand h1');
        if (adminName && this.currentAdmin) {
            const translations = this.getTranslations();
            const langData = translations[this.currentLanguage] || translations['en'];
            adminName.textContent = `Kohalpur Admin (${this.currentAdmin.name})`;
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        // Default admin credentials
        const validCredentials = [
            { username: 'admin', password: 'kohalpur123', name: 'System Admin', role: 'admin' },
            { username: 'municipal', password: 'kohalpur456', name: 'Municipal Officer', role: 'officer' },
            { username: 'officer', password: 'kohalpur789', name: 'Field Officer', role: 'officer' }
        ];

        const validUser = validCredentials.find(
            cred => cred.username === username && cred.password === password
        );

        if (validUser) {
            this.currentAdmin = validUser;
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_data', JSON.stringify(validUser));
            
            this.showDashboard();
            await this.loadComplaints();
            
            if (errorDiv) errorDiv.style.display = 'none';
            
            // Show success message
            this.showNotification(this.getTranslation('login_success'), 'success');
        } else {
            const errorMessage = this.getTranslation('invalid_credentials');
            if (errorDiv) {
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';
            }
            this.showNotification(errorMessage, 'error');
        }
    }

    handleLogout() {
        const confirmMessage = this.getTranslation('confirm_logout');
        if (!confirm(confirmMessage)) return;
        
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_data');
        this.currentAdmin = null;
        this.complaints = [];
        this.filteredComplaints = [];
        
        this.showLogin();
        this.showNotification(this.getTranslation('logout_success'), 'success');
    }

    async loadComplaints() {
        try {
            // Show loading state
            const tbody = document.getElementById('complaintsTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="loading-state">
                            <div class="loading-spinner"></div>
                            <p data-i18n="loading_complaints">Loading complaints...</p>
                        </td>
                    </tr>
                `;
                this.applyLanguage();
            }
            
            // Load from localStorage
            this.complaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
            
            // Debug log
            console.log(`Loaded ${this.complaints.length} complaints from localStorage`);
            console.log('Complaints data:', this.complaints);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.filteredComplaints = [...this.complaints];
            this.updateStats();
            this.renderTable();
            
        } catch (error) {
            console.error('Error loading complaints:', error);
            this.showNotification(this.getTranslation('error_loading'), 'error');
            
            const tbody = document.getElementById('complaintsTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="error-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>${this.getTranslation('error_loading')}</p>
                        </td>
                    </tr>
                `;
            }
        }
    }

    updateStats() {
        const total = this.complaints.length;
        const pending = this.complaints.filter(c => c.status === 'pending').length;
        const processing = this.complaints.filter(c => c.status === 'processing').length;
        const resolved = this.complaints.filter(c => c.status === 'resolved').length;

        document.getElementById('totalComplaints').textContent = total;
        document.getElementById('pendingComplaints').textContent = pending;
        document.getElementById('processingComplaints').textContent = processing;
        document.getElementById('resolvedComplaints').textContent = resolved;
    }

    filterComplaints() {
        const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const wardFilter = document.getElementById('wardFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;

        let filtered = [...this.complaints];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(complaint => 
                complaint.title.toLowerCase().includes(searchTerm) ||
                complaint.description.toLowerCase().includes(searchTerm) ||
                complaint.id.toLowerCase().includes(searchTerm) ||
                complaint.location.toLowerCase().includes(searchTerm) ||
                (complaint.contactName && complaint.contactName.toLowerCase().includes(searchTerm))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(complaint => complaint.status === statusFilter);
        }

        // Ward filter
        if (wardFilter !== 'all') {
            filtered = filtered.filter(complaint => complaint.ward === wardFilter);
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(complaint => complaint.type === typeFilter);
        }

        this.filteredComplaints = filtered;
        this.renderTable();
    }

    renderTable() {
        const tbody = document.getElementById('complaintsTableBody');
        if (!tbody) return;

        if (this.filteredComplaints.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-data">
                        <i class="fas fa-inbox"></i>
                        <p data-i18n="no_complaints_admin">No complaints found</p>
                    </td>
                </tr>
            `;
            this.applyLanguage();
            return;
        }

        // Sort by date (newest first)
        const sortedComplaints = [...this.filteredComplaints].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        let html = '';
        sortedComplaints.forEach(complaint => {
            const date = new Date(complaint.date).toLocaleDateString();
            const time = new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Get type display name
            const typeDisplay = this.getComplaintTypeDisplay(complaint.type);
            
            html += `
                <tr data-id="${complaint.id}">
                    <td><strong>${complaint.id}</strong></td>
                    <td>${complaint.title}</td>
                    <td><span class="type-badge">${typeDisplay}</span></td>
                    <td>${complaint.ward ? `Ward ${complaint.ward}` : 'N/A'}</td>
                    <td><span class="status-badge status-${complaint.status}">${this.getStatusDisplay(complaint.status)}</span></td>
                    <td>${date}<br><small>${time}</small></td>
                    <td><span class="priority-badge priority-${complaint.priority || 'medium'}">${this.getPriorityDisplay(complaint.priority)}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn view-complaint" data-id="${complaint.id}" title="${this.getTranslation('view')}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn assign-complaint" data-id="${complaint.id}" title="${this.getTranslation('assign_to_me')}">
                                <i class="fas fa-user-tag"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        
        // Add event listeners to action buttons
        this.setupTableActions();
    }

    setupTableActions() {
        // View complaint buttons
        document.querySelectorAll('.view-complaint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const complaintId = e.target.closest('.view-complaint').getAttribute('data-id');
                this.viewComplaintDetails(complaintId);
            });
        });

        // Assign complaint buttons
        document.querySelectorAll('.assign-complaint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const complaintId = e.target.closest('.assign-complaint').getAttribute('data-id');
                this.assignComplaintToMe(complaintId);
            });
        });
    }

    getComplaintTypeDisplay(type) {
        const types = {
            'infrastructure': 'Infrastructure',
            'sanitation': 'Sanitation',
            'safety': 'Safety',
            'service': 'Service',
            'other': 'Other'
        };
        return types[type] || type;
    }

    getStatusDisplay(status) {
        const statusMap = {
            'pending': this.getTranslation('status_pending'),
            'processing': this.getTranslation('status_processing'),
            'resolved': this.getTranslation('status_resolved'),
            'rejected': this.getTranslation('status_rejected')
        };
        return statusMap[status] || status;
    }

    getPriorityDisplay(priority) {
        const priorityMap = {
            'low': this.getTranslation('priority_low'),
            'medium': this.getTranslation('priority_medium'),
            'high': this.getTranslation('priority_high'),
            'critical': this.getTranslation('priority_critical')
        };
        return priorityMap[priority] || this.getTranslation('priority_medium');
    }

    getTranslation(key) {
        const translations = this.getTranslations();
        const langData = translations[this.currentLanguage] || translations['en'];
        return langData[key] || key;
    }

    async viewComplaintDetails(complaintId) {
        const complaint = this.complaints.find(c => c.id === complaintId);
        if (!complaint) {
            this.showNotification('Complaint not found', 'error');
            return;
        }

        this.currentComplaint = complaint;
        this.openModal(complaint);
    }

    openModal(complaint) {
        const modal = document.getElementById('complaintModal');
        if (!modal) return;

        const date = new Date(complaint.date).toLocaleDateString();
        const time = new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Build modal content
        let modalContent = `
            <div class="modal-section">
                <h3 data-i18n="complaint_details">Complaint Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong data-i18n="ticket_id">Ticket ID:</strong>
                        <span>${complaint.id}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="complaint_type">Type:</strong>
                        <span>${this.getComplaintTypeDisplay(complaint.type)}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="complaint_status">Status:</strong>
                        <span class="status-badge status-${complaint.status}">${this.getStatusDisplay(complaint.status)}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="priority">Priority:</strong>
                        <span class="priority-badge priority-${complaint.priority || 'medium'}">${this.getPriorityDisplay(complaint.priority)}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="assigned_to">Assigned To:</strong>
                        <span>${complaint.assignedTo || 'Not assigned'}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="location">Location:</strong>
                        <span>${complaint.location}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="ward">Ward:</strong>
                        <span>${complaint.ward || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong data-i18n="submitted_date">Submitted Date:</strong>
                        <span>${date} ${time}</span>
                    </div>
                    ${complaint.contactName && !complaint.anonymous ? `
                    <div class="detail-item">
                        <strong data-i18n="submitted_by">Submitted By:</strong>
                        <span>${complaint.contactName}</span>
                    </div>
                    ` : ''}
                    ${complaint.contactPhone ? `
                    <div class="detail-item">
                        <strong data-i18n="contact_info">Contact:</strong>
                        <span>${complaint.contactPhone}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="modal-section">
                <h3 data-i18n="description">Description</h3>
                <p>${complaint.description}</p>
            </div>
        `;

        // Add photos section if available
        if (complaint.photos && complaint.photos.length > 0) {
            modalContent += `
                <div class="modal-section">
                    <h3 data-i18n="photos">Photos (${complaint.photos.length})</h3>
                    <div class="photo-grid">
                        ${complaint.photos.map((photo, index) => `
                            <div class="photo-item">
                                <img src="${photo.data}" alt="Photo ${index + 1}" onclick="admin.viewPhoto('${photo.data}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Add comments section if available
        if (complaint.comments && complaint.comments.length > 0) {
            modalContent += `
                <div class="modal-section">
                    <h3 data-i18n="comments">Comments (${complaint.comments.length})</h3>
                    <div class="comments-list">
                        ${complaint.comments.map(comment => `
                            <div class="comment-item">
                                <div class="comment-header">
                                    <strong>${comment.admin || 'Admin'}</strong>
                                    <small>${new Date(comment.date).toLocaleString()}</small>
                                </div>
                                <p>${comment.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Set modal content
        document.getElementById('modalTitle').textContent = complaint.title;
        document.getElementById('modalBody').innerHTML = modalContent;
        
        // Set current values in form
        document.getElementById('statusUpdate').value = complaint.status;
        document.getElementById('priorityUpdate').value = complaint.priority || 'medium';
        document.getElementById('assignedTo').value = complaint.assignedTo || '';
        document.getElementById('adminComment').value = '';
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Apply language to modal content
        this.applyLanguage();
    }

    closeModal() {
        const modal = document.getElementById('complaintModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.currentComplaint = null;
        }
    }

    assignComplaintToMe(complaintId) {
        if (!this.currentAdmin) {
            this.showNotification('Please login first', 'error');
            return;
        }

        const confirmMessage = this.getTranslation('confirm_assign');
        if (!confirm(confirmMessage)) return;

        const complaint = this.complaints.find(c => c.id === complaintId);
        if (!complaint) {
            this.showNotification('Complaint not found', 'error');
            return;
        }

        // Update complaint
        complaint.assignedTo = this.currentAdmin.name;
        complaint.status = 'processing';
        
        // Add a comment
        if (!complaint.comments) complaint.comments = [];
        complaint.comments.push({
            admin: this.currentAdmin.name,
            text: `Assigned to ${this.currentAdmin.name}`,
            date: new Date().toISOString()
        });

        // Save to localStorage
        this.saveComplaints();
        
        // Update UI
        this.updateStats();
        this.renderTable();
        
        // If this complaint is currently open in modal, update it
        if (this.currentComplaint && this.currentComplaint.id === complaintId) {
            this.currentComplaint = complaint;
            this.openModal(complaint);
        }
        
        this.showNotification('Complaint assigned successfully', 'success');
    }

    updateComplaintStatus() {
        if (!this.currentComplaint) return;

        const status = document.getElementById('statusUpdate').value;
        const priority = document.getElementById('priorityUpdate').value;
        const assignedTo = document.getElementById('assignedTo').value;
        const comment = document.getElementById('adminComment').value.trim();

        const confirmMessage = this.getTranslation('confirm_update');
        if (!confirm(confirmMessage)) return;

        // Update complaint
        this.currentComplaint.status = status;
        this.currentComplaint.priority = priority;
        this.currentComplaint.assignedTo = assignedTo;

        // Add comment if provided
        if (comment) {
            if (!this.currentComplaint.comments) this.currentComplaint.comments = [];
            this.currentComplaint.comments.push({
                admin: this.currentAdmin.name,
                text: comment,
                date: new Date().toISOString()
            });
        }

        // Save to localStorage
        const index = this.complaints.findIndex(c => c.id === this.currentComplaint.id);
        if (index !== -1) {
            this.complaints[index] = { ...this.currentComplaint };
            this.saveComplaints();
        }

        // Update UI
        this.updateStats();
        this.renderTable();
        this.openModal(this.currentComplaint);
        
        this.showNotification(this.getTranslation('complaint_updated'), 'success');
    }

    addComment() {
        if (!this.currentComplaint || !this.currentAdmin) return;

        const commentText = document.getElementById('adminComment').value.trim();
        if (!commentText) {
            this.showNotification('Please enter a comment', 'warning');
            return;
        }

        // Add comment to complaint
        if (!this.currentComplaint.comments) {
            this.currentComplaint.comments = [];
        }
        
        this.currentComplaint.comments.push({
            admin: this.currentAdmin.name,
            text: commentText,
            date: new Date().toISOString()
        });

        // Save to localStorage
        const index = this.complaints.findIndex(c => c.id === this.currentComplaint.id);
        if (index !== -1) {
            this.complaints[index] = { ...this.currentComplaint };
            this.saveComplaints();
        }

        // Clear and update modal
        document.getElementById('adminComment').value = '';
        this.openModal(this.currentComplaint);
        
        this.showNotification(this.getTranslation('comment_added'), 'success');
    }

    saveComplaints() {
        localStorage.setItem('kohalpur_complaints', JSON.stringify(this.complaints));
    }

    exportToCSV() {
        if (this.filteredComplaints.length === 0) {
            this.showNotification('No complaints to export', 'warning');
            return;
        }

        const headers = [
            'Ticket ID',
            'Title',
            'Type',
            'Ward',
            'Status',
            'Priority',
            'Location',
            'Submitted Date',
            'Assigned To',
            'Contact Name',
            'Contact Phone'
        ];

        const csvRows = [
            headers.join(','),
            ...this.filteredComplaints.map(complaint => [
                `"${complaint.id}"`,
                `"${complaint.title.replace(/"/g, '""')}"`,
                `"${complaint.type}"`,
                `"${complaint.ward || ''}"`,
                `"${complaint.status}"`,
                `"${complaint.priority || 'medium'}"`,
                `"${complaint.location.replace(/"/g, '""')}"`,
                `"${new Date(complaint.date).toLocaleString()}"`,
                `"${complaint.assignedTo || ''}"`,
                `"${complaint.contactName || ''}"`,
                `"${complaint.contactPhone || ''}"`
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kohalpur-complaints-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Complaints exported successfully', 'success');
    }

    downloadPhotos() {
        if (!this.currentComplaint || !this.currentComplaint.photos || this.currentComplaint.photos.length === 0) {
            this.showNotification('No photos to download', 'warning');
            return;
        }

        // Create a zip file with all photos (simplified - would need JSZip library for full implementation)
        if (this.currentComplaint.photos.length === 1) {
            // Download single photo
            const photo = this.currentComplaint.photos[0];
            const link = document.createElement('a');
            link.href = photo.data;
            link.download = `complaint-${this.currentComplaint.id}-photo.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // For multiple photos, offer individual downloads
            this.currentComplaint.photos.forEach((photo, index) => {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = photo.data;
                    link.download = `complaint-${this.currentComplaint.id}-photo-${index + 1}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, index * 100);
            });
        }
        
        this.showNotification('Photos download started', 'success');
    }

    viewPhoto(photoData) {
        // Open photo in new window/tab
        const photoWindow = window.open();
        photoWindow.document.write(`
            <html>
                <head>
                    <title>Complaint Photo</title>
                    <style>
                        body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
                        img { max-width: 100%; max-height: 90vh; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
                    </style>
                </head>
                <body>
                    <img src="${photoData}" alt="Complaint Photo">
                </body>
            </html>
        `);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.admin-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                              type === 'success' ? 'check-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getTranslation(key) {
        const translations = this.getTranslations();
        const langData = translations[this.currentLanguage] || translations['en'];
        return langData[key] || key;
    }
}

// Initialize admin system
const admin = new ComplaintAdmin();
window.admin = admin;

// Global functions for HTML onclick handlers
function closeModal() {
    if (window.admin) {
        window.admin.closeModal();
    }
}

function assignToMe() {
    if (window.admin && window.admin.currentComplaint) {
        window.admin.assignComplaintToMe(window.admin.currentComplaint.id);
    }
}

function downloadPhotos() {
    if (window.admin) {
        window.admin.downloadPhotos();
    }
}

function updateComplaintStatus() {
    if (window.admin) {
        window.admin.updateComplaintStatus();
    }
}

function addComment() {
    if (window.admin) {
        window.admin.addComment();
    }
}

function exportToCSV() {
    if (window.admin) {
        window.admin.exportToCSV();
    }
}