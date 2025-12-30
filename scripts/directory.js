// Directory system for Kohalpur GPT
class DirectorySystem {
    constructor() {
        this.directoryData = [];
        this.filteredData = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadDirectoryData();
        this.setupEventListeners();
        this.renderDirectory();
    }

    async loadDirectoryData() {
        // Sample directory data - in real app, load from JSON file or API
        this.directoryData = [
            {
                id: 1,
                name: 'Kohalpur Hospital',
                category: 'hospitals',
                address: 'Main Road, Kohalpur',
                phone: '082-560456',
                hours: '24/7',
                description: 'Government hospital with emergency services',
                location: { lat: 28.1234, lng: 81.5678 }
            },
            {
                id: 2,
                name: 'City Hospital',
                category: 'hospitals',
                address: 'Hospital Road, Kohalpur',
                phone: '082-560789',
                hours: '24/7',
                description: 'Private hospital with specialized care',
                location: { lat: 28.1245, lng: 81.5689 }
            },
            {
                id: 3,
                name: 'Kohalpur Higher Secondary School',
                category: 'schools',
                address: 'School Road, Kohalpur',
                phone: '082-560111',
                hours: '10:00 AM - 4:00 PM',
                description: 'Government school from grade 1-12',
                location: { lat: 28.1256, lng: 81.5690 }
            },
            {
                id: 4,
                name: 'Bright Future Academy',
                category: 'schools',
                address: 'Education Road, Kohalpur',
                phone: '082-560222',
                hours: '9:00 AM - 5:00 PM',
                description: 'Private English medium school',
                location: { lat: 28.1267, lng: 81.5701 }
            },
            {
                id: 5,
                name: 'Nepal Bank Limited',
                category: 'banks',
                address: 'Bank Road, Kohalpur',
                phone: '082-560333',
                hours: '10:00 AM - 4:00 PM',
                description: 'Government bank with ATM facility',
                location: { lat: 28.1278, lng: 81.5712 }
            },
            {
                id: 6,
                name: 'Kohalpur Municipality Office',
                category: 'offices',
                address: 'Municipal Road, Kohalpur',
                phone: '082-560001',
                hours: '10:00 AM - 5:00 PM',
                description: 'Main municipal administration office',
                location: { lat: 28.1289, lng: 81.5723 }
            },
            {
                id: 7,
                name: 'Kohalpur Inn',
                category: 'hotels',
                address: 'Hotel Road, Kohalpur',
                phone: '082-560444',
                hours: '24/7',
                description: 'Budget hotel with restaurant',
                location: { lat: 28.1290, lng: 81.5734 }
            },
            {
                id: 8,
                name: 'City Market',
                category: 'markets',
                address: 'Market Road, Kohalpur',
                phone: '082-560555',
                hours: '6:00 AM - 8:00 PM',
                description: 'Main vegetable and grocery market',
                location: { lat: 28.1301, lng: 81.5745 }
            }
        ];

        this.filteredData = [...this.directoryData];
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterBySearch(e.target.value);
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
    }

    filterBySearch(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredData = this.directoryData.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.address.toLowerCase().includes(lowerQuery)
        );
        this.renderDirectory();
    }

    filterByCategory(category) {
        this.currentCategory = category;
        if (category === 'all') {
            this.filteredData = [...this.directoryData];
        } else {
            this.filteredData = this.directoryData.filter(item => 
                item.category === category
            );
        }
        this.renderDirectory();
    }

    renderDirectory() {
        const grid = document.getElementById('directoryGrid');
        if (!grid) return;

        if (this.filteredData.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.filteredData.forEach(item => {
            const categoryNames = {
                'hospitals': 'Hospital',
                'schools': 'School',
                'banks': 'Bank',
                'offices': 'Government Office',
                'hotels': 'Hotel',
                'markets': 'Market'
            };

            const icons = {
                'hospitals': 'fa-hospital',
                'schools': 'fa-graduation-cap',
                'banks': 'fa-university',
                'offices': 'fa-landmark',
                'hotels': 'fa-hotel',
                'markets': 'fa-shopping-cart'
            };

            html += `
                <div class="directory-item ${item.category}">
                    <div class="item-header">
                        <div class="item-icon">
                            <i class="fas ${icons[item.category]}"></i>
                        </div>
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <span class="item-category">${categoryNames[item.category]}</span>
                        </div>
                    </div>
                    <div class="item-details">
                        <div class="item-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${item.address}</span>
                        </div>
                        <div class="item-detail">
                            <i class="fas fa-phone"></i>
                            <span>${item.phone}</span>
                        </div>
                        <div class="item-detail">
                            <i class="fas fa-clock"></i>
                            <span>${item.hours}</span>
                        </div>
                        <p>${item.description}</p>
                    </div>
                    <div class="item-actions">
                        <button class="action-btn" onclick="callNumber('${item.phone.replace(/-/g, '')}')">
                            <i class="fas fa-phone"></i>
                            <span data-i18n="call_now">Call Now</span>
                        </button>
                        <button class="action-btn" onclick="getDirections(${item.location.lat}, ${item.location.lng})">
                            <i class="fas fa-directions"></i>
                            <span data-i18n="get_directions">Directions</span>
                        </button>
                        <button class="action-btn" onclick="saveContact('${item.name}', '${item.phone}')">
                            <i class="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
        
        // Update language for newly created elements
        if (window.languageManager) {
            window.languageManager.applyLanguage();
        }
    }
}

// Initialize directory system
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.directory-container')) {
        const directorySystem = new DirectorySystem();
        window.directorySystem = directorySystem;
    }
});

// Global functions
function openMap() {
    // Open Google Maps with Kohalpur location
    window.open('https://www.google.com/maps/place/Kohalpur,+Nepal', '_blank');
}

function getDirections(lat, lng) {
    // Open directions in Google Maps
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(`geo:${lat},${lng}?q=${lat},${lng}`);
    } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
}

function saveContact(name, phone) {
    // Create vCard
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=WORK:${phone}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}