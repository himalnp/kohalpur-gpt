// UPDATED Complaint System - Fixed user complaint viewing/editing
class ComplaintSystem {
    constructor() {
        this.currentStep = 1;
        this.currentComplaintId = null;
        this.complaintData = this.getDefaultComplaintData();
        this.userIdentifier = this.getUserIdentifier();
        
        this.initialize();
    }

    getUserIdentifier() {
        // Create a unique identifier for this user/browser
        let userId = localStorage.getItem('kohalpur_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('kohalpur_user_id', userId);
        }
        return userId;
    }

    getDefaultComplaintData() {
        return {
            type: '',
            title: '',
            description: '',
            location: '',
            ward: '',
            photos: [],
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            anonymous: true,
            status: 'pending',
            date: new Date().toISOString(),
            id: this.generateTicketId(),
            userId: this.userIdentifier,
            assignedTo: '',
            priority: 'medium',
            comments: []
        };
    }

    generateTicketId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `KOH-${timestamp}-${random.toString().padStart(3, '0')}`;
    }

    initialize() {
        this.loadComplaints();
        this.setupEventListeners();
        this.setupPhotoUpload();
        this.loadWards();
        
        // Check if editing an existing complaint
        this.checkEditMode();
    }

    checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        
        if (editId) {
            this.editComplaint(editId);
        }
    }

    loadWards() {
        const wardSelect = document.getElementById('ward');
        if (!wardSelect) return;

        wardSelect.innerHTML = '<option value="" data-i18n="ward_placeholder">Select Ward</option>';
        
        for (let i = 1; i <= 15; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Ward ${i}`;
            wardSelect.appendChild(option);
        }
        
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }

    setupEventListeners() {
        // Form steps navigation
        const nextButtons = document.querySelectorAll('.next-btn');
        nextButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.validateStep(this.currentStep)) {
                    this.nextStep();
                }
            });
        });

        // Complaint type selection
        document.querySelectorAll('input[name="complaintType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.complaintData.type = e.target.value;
            });
        });

        // Form inputs
        const formInputs = ['complaintTitle', 'complaintDescription', 'location', 'ward', 
                          'contactName', 'contactPhone', 'contactEmail', 'anonymous'];
        
        formInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const handler = (e) => {
                    this.complaintData[id] = element.type === 'checkbox' ? element.checked : element.value;
                };
                element.addEventListener('change', handler);
                element.addEventListener('input', handler);
            }
        });

        // Form submission
        const form = document.getElementById('complaintForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.currentComplaintId) {
                    this.updateComplaint();
                } else {
                    this.submitComplaint();
                }
            });
        }

        // Edit/Delete button clicks (using event delegation)
        document.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            const viewBtn = e.target.closest('.view-btn');
            
            if (editBtn) {
                const complaintId = editBtn.getAttribute('data-id');
                this.editComplaint(complaintId);
                e.preventDefault();
            }
            
            if (deleteBtn) {
                const complaintId = deleteBtn.getAttribute('data-id');
                this.deleteComplaint(complaintId);
                e.preventDefault();
            }
            
            if (viewBtn) {
                const complaintId = viewBtn.getAttribute('data-id');
                this.viewComplaint(complaintId);
                e.preventDefault();
            }
        });
    }

    setupPhotoUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('photoUpload');
        const previewGrid = document.getElementById('previewGrid');

        if (!uploadArea || !fileInput || !previewGrid) return;

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        const previewGrid = document.getElementById('previewGrid');
        
        for (let file of files) {
            if (!file.type.startsWith('image/')) continue;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = {
                    id: Date.now() + Math.random(),
                    data: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
                
                this.complaintData.photos.push(photo);
                this.addPhotoPreview(photo);
            };
            reader.readAsDataURL(file);
        }
    }

    addPhotoPreview(photo) {
        const previewGrid = document.getElementById('previewGrid');
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${photo.data}" alt="${photo.name}">
            <button type="button" class="remove-photo" data-id="${photo.id}">
                <i class="fas fa-times"></i>
            </button>
        `;

        previewGrid.appendChild(previewItem);

        previewItem.querySelector('.remove-photo').addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.closest('.remove-photo').getAttribute('data-id');
            this.removePhoto(id);
            previewItem.remove();
        });
    }

    removePhoto(id) {
        this.complaintData.photos = this.complaintData.photos.filter(photo => photo.id != id);
    }

    validateStep(step) {
        const lang = window.languageManager?.get.bind(window.languageManager) || ((key) => key);
        
        switch(step) {
            case 1:
                if (!this.complaintData.type) {
                    this.showError(lang('select_complaint_type') || 'Please select a complaint type');
                    return false;
                }
                break;
                
            case 2:
                const title = document.getElementById('complaintTitle');
                const description = document.getElementById('complaintDescription');
                const location = document.getElementById('location');
                const ward = document.getElementById('ward');
                
                if (!title.value.trim()) {
                    this.showError(lang('enter_title') || 'Please enter a title for your complaint');
                    title.focus();
                    return false;
                }
                
                if (!description.value.trim()) {
                    this.showError(lang('enter_description') || 'Please describe the issue');
                    description.focus();
                    return false;
                }
                
                if (!location.value.trim()) {
                    this.showError(lang('enter_location') || 'Please provide the location');
                    location.focus();
                    return false;
                }
                
                if (!ward.value) {
                    this.showError(lang('select_ward') || 'Please select a ward number');
                    ward.focus();
                    return false;
                }
                
                this.complaintData.title = title.value;
                this.complaintData.description = description.value;
                this.complaintData.location = location.value;
                this.complaintData.ward = ward.value;
                break;
                
            case 3:
                // All fields optional
                break;
        }
        
        return true;
    }

    nextStep() {
        if (this.currentStep >= 3) return;
        
        document.getElementById(`step${this.currentStep}`).classList.remove('active');
        this.currentStep++;
        document.getElementById(`step${this.currentStep}`).classList.add('active');
        
        // Scroll to top of step
        window.scrollTo({ top: document.querySelector('.complaint-form-container').offsetTop - 100, behavior: 'smooth' });
    }

    prevStep() {
        if (this.currentStep <= 1) return;
        
        document.getElementById(`step${this.currentStep}`).classList.remove('active');
        this.currentStep--;
        document.getElementById(`step${this.currentStep}`).classList.add('active');
    }

    submitComplaint() {
        if (!this.validateStep(3)) return;
        
        // Add final data
        this.complaintData.id = this.generateTicketId();
        this.complaintData.date = new Date().toISOString();
        this.complaintData.status = 'pending';
        this.complaintData.userId = this.userIdentifier;
        
        // Save complaint
        this.saveComplaint(this.complaintData);
        
        // Show success
        this.showSuccess(window.languageManager?.get('submitted_success') || 'Complaint submitted successfully!');
        
        // Reset and reload
        this.resetForm();
        this.loadComplaints();
        
        // Redirect to complaints list after 2 seconds
        setTimeout(() => {
            window.location.hash = 'complaints-list';
            document.getElementById('complaints-list')?.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }

    saveComplaint(complaint) {
        let complaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        complaints.push(complaint);
        localStorage.setItem('kohalpur_complaints', JSON.stringify(complaints));
        
        // Sync with offline queue if offline
        if (!navigator.onLine) {
            let offlineQueue = JSON.parse(localStorage.getItem('offline_complaints') || '[]');
            offlineQueue.push(complaint);
            localStorage.setItem('offline_complaints', JSON.stringify(offlineQueue));
        }
    }

    loadComplaints() {
        const complaintsList = document.getElementById('complaintsList');
        if (!complaintsList) return;
        
        let allComplaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        
        // Filter to show only this user's complaints
        const userComplaints = allComplaints.filter(complaint => complaint.userId === this.userIdentifier);
        
        if (userComplaints.length === 0) {
            complaintsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p data-i18n="no_complaints">No complaints submitted yet</p>
                </div>
            `;
            return;
        }
        
        // Sort by date (newest first)
        userComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let html = '';
        userComplaints.forEach(complaint => {
            const date = new Date(complaint.date).toLocaleDateString();
            const time = new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            html += `
                <div class="complaint-item" id="complaint-${complaint.id}">
                    <div class="complaint-item-header">
                        <div>
                            <div class="complaint-title">${complaint.title}</div>
                            <div class="complaint-ticket">${complaint.id}</div>
                        </div>
                        <div class="complaint-type-badge ${complaint.type}">
                            ${complaint.type.charAt(0).toUpperCase() + complaint.type.slice(1)}
                        </div>
                    </div>
                    <div class="complaint-description">${complaint.description}</div>
                    <div class="complaint-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${complaint.location}</span>
                        <span><i class="fas fa-layer-group"></i> Ward ${complaint.ward}</span>
                        <span><i class="fas fa-calendar"></i> ${date} ${time}</span>
                    </div>
                    <div class="complaint-footer">
                        <div class="complaint-status-badge status-${complaint.status}">
                            ${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </div>
                        <div class="complaint-actions">
                            <button class="action-btn edit-btn" data-id="${complaint.id}" title="Edit">
                                <i class="fas fa-edit"></i>
                                <span data-i18n="action_edit">Edit</span>
                            </button>
                            <button class="action-btn view-btn" data-id="${complaint.id}" title="View">
                                <i class="fas fa-eye"></i>
                                <span data-i18n="action_view">View</span>
                            </button>
                            <button class="action-btn delete-btn" data-id="${complaint.id}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        complaintsList.innerHTML = html;
        
        // Update language
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }

    editComplaint(complaintId) {
        let allComplaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        const complaint = allComplaints.find(c => c.id === complaintId && c.userId === this.userIdentifier);
        
        if (!complaint) {
            this.showError('Complaint not found or you do not have permission to edit it');
            return;
        }
        
        // Load complaint data
        this.currentComplaintId = complaintId;
        this.complaintData = { ...complaint };
        
        // Fill form fields
        document.getElementById('complaintTitle').value = complaint.title;
        document.getElementById('complaintDescription').value = complaint.description;
        document.getElementById('location').value = complaint.location;
        document.getElementById('ward').value = complaint.ward;
        document.getElementById('contactName').value = complaint.contactName || '';
        document.getElementById('contactPhone').value = complaint.contactPhone || '';
        document.getElementById('contactEmail').value = complaint.contactEmail || '';
        document.getElementById('anonymous').checked = complaint.anonymous !== false;
        
        // Set complaint type
        document.querySelectorAll('input[name="complaintType"]').forEach(radio => {
            radio.checked = radio.value === complaint.type;
            if (radio.checked) {
                this.complaintData.type = radio.value;
            }
        });
        
        // Load photos
        const previewGrid = document.getElementById('previewGrid');
        previewGrid.innerHTML = '';
        complaint.photos.forEach(photo => {
            this.addPhotoPreview(photo);
        });
        
        // Go to first step
        this.currentStep = 1;
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.toggle('active', index === 0);
        });
        
        // Update submit button
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fas fa-save"></i> <span data-i18n="update_button">Update Complaint</span>`;
        }
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update language
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }

    updateComplaint() {
        if (!this.validateStep(3)) return;
        
        // Update complaint data
        this.complaintData.date = new Date().toISOString();
        this.complaintData.userId = this.userIdentifier;
        
        // Update in localStorage
        let allComplaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        const index = allComplaints.findIndex(c => c.id === this.currentComplaintId && c.userId === this.userIdentifier);
        
        if (index !== -1) {
            allComplaints[index] = { ...this.complaintData };
            localStorage.setItem('kohalpur_complaints', JSON.stringify(allComplaints));
            
            this.showSuccess(window.languageManager?.get('updated_success') || 'Complaint updated successfully!');
            this.resetForm();
            this.loadComplaints();
            
            // Remove edit parameter from URL
            if (window.history.replaceState) {
                const url = new URL(window.location);
                url.searchParams.delete('edit');
                window.history.replaceState({}, '', url);
            }
        } else {
            this.showError('Complaint not found');
        }
    }

    deleteComplaint(complaintId) {
        const confirmMessage = window.languageManager?.get('delete_confirm') || 'Are you sure you want to delete this complaint?';
        
        if (!confirm(confirmMessage)) return;
        
        let allComplaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        const initialLength = allComplaints.length;
        
        // Only delete if user owns the complaint
        allComplaints = allComplaints.filter(c => !(c.id === complaintId && c.userId === this.userIdentifier));
        
        if (allComplaints.length < initialLength) {
            localStorage.setItem('kohalpur_complaints', JSON.stringify(allComplaints));
            this.loadComplaints();
            this.showSuccess('Complaint deleted successfully');
        } else {
            this.showError('Complaint not found or you do not have permission to delete it');
        }
    }

    viewComplaint(complaintId) {
        let allComplaints = JSON.parse(localStorage.getItem('kohalpur_complaints') || '[]');
        const complaint = allComplaints.find(c => c.id === complaintId && c.userId === this.userIdentifier);
        
        if (!complaint) {
            this.showError('Complaint not found');
            return;
        }
        
        const date = new Date(complaint.date).toLocaleDateString();
        const time = new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 10px;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            ">
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: #333;">${complaint.title}</h2>
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1a5f7a; margin-bottom: 10px;">Details</h3>
                        <p><strong>Ticket ID:</strong> ${complaint.id}</p>
                        <p><strong>Type:</strong> ${complaint.type}</p>
                        <p><strong>Status:</strong> 
                            <span style="
                                background: ${complaint.status === 'pending' ? '#fff3cd' : 
                                            complaint.status === 'processing' ? '#cce5ff' : 
                                            complaint.status === 'resolved' ? '#d4edda' : '#f8d7da'};
                                color: ${complaint.status === 'pending' ? '#856404' : 
                                        complaint.status === 'processing' ? '#004085' : 
                                        complaint.status === 'resolved' ? '#155724' : '#721c24'};
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 12px;
                                font-weight: bold;
                            ">
                                ${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </span>
                        </p>
                        <p><strong>Location:</strong> ${complaint.location}</p>
                        <p><strong>Ward:</strong> ${complaint.ward}</p>
                        <p><strong>Submitted:</strong> ${date} ${time}</p>
                        ${complaint.contactName && !complaint.anonymous ? 
                            `<p><strong>Submitted by:</strong> ${complaint.contactName}</p>` : ''}
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1a5f7a; margin-bottom: 10px;">Description</h3>
                        <p style="white-space: pre-wrap;">${complaint.description}</p>
                    </div>
                    
                    ${complaint.photos && complaint.photos.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1a5f7a; margin-bottom: 10px;">Photos (${complaint.photos.length})</h3>
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                            gap: 10px;
                            margin-top: 10px;
                        ">
                            ${complaint.photos.map(photo => `
                                <div style="border-radius: 5px; overflow: hidden; border: 1px solid #eee;">
                                    <img src="${photo.data}" alt="Photo" style="width: 100%; height: 150px; object-fit: cover;">
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                    
                    ${complaint.comments && complaint.comments.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1a5f7a; margin-bottom: 10px;">Admin Comments</h3>
                        <div style="background: #f8f9fa; border-radius: 5px; padding: 15px;">
                            ${complaint.comments.map(comment => `
                                <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <strong>${comment.admin || 'Admin'}</strong>
                                        <small>${new Date(comment.date).toLocaleString()}</small>
                                    </div>
                                    <p style="margin: 0;">${comment.text}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
                <div style="
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                ">
                    <button class="btn-secondary modal-close-btn" style="
                        padding: 8px 16px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Close</button>
                    <button class="btn-primary edit-complaint-btn" data-id="${complaint.id}" style="
                        padding: 8px 16px;
                        background: #1a5f7a;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Edit Complaint</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.modal-close-btn').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.edit-complaint-btn').addEventListener('click', () => {
            this.closeModal(modal);
            this.editComplaint(complaintId);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        document.body.style.overflow = 'auto';
    }

    resetForm() {
        this.currentStep = 1;
        this.currentComplaintId = null;
        this.complaintData = this.getDefaultComplaintData();
        
        // Reset UI
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.toggle('active', index === 0);
        });
        
        document.getElementById('complaintForm').reset();
        document.getElementById('previewGrid').innerHTML = '';
        
        document.querySelectorAll('input[name="complaintType"]').forEach(radio => {
            radio.checked = false;
        });
        
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> <span data-i18n="submit_button">Submit Complaint</span>`;
        }
        
        this.loadWards();
        
        // Update language
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f8d7da' : 
                        type === 'success' ? '#d4edda' : '#cce5ff'};
            color: ${type === 'error' ? '#721c24' : 
                    type === 'success' ? '#155724' : '#004085'};
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                              type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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
        
        // Add CSS for animations
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize complaint system
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('complaintForm')) {
        const complaintSystem = new ComplaintSystem();
        window.complaintSystem = complaintSystem;
    }
});

// Global functions
function nextStep() {
    if (window.complaintSystem) {
        window.complaintSystem.nextStep();
    }
}

function prevStep() {
    if (window.complaintSystem) {
        window.complaintSystem.prevStep();
    }
}