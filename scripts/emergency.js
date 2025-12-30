// Emergency page functionality
class EmergencySystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateContactCard();
    }

    setupEventListeners() {
        // Call buttons
        document.querySelectorAll('.call-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (number) {
                    this.makeCall(number);
                }
            });
        });
    }

    makeCall(number) {
        // For mobile devices
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = `tel:${number}`;
        } else {
            // For desktop, show number
            alert(`Call: ${number}`);
        }
    }

    downloadContacts() {
        const contacts = {
            police: { number: '100', details: 'Kohalpur Police Station' },
            ambulance: { number: '102', details: 'Kohalpur Hospital' },
            fire: { number: '101', details: 'Kohalpur Fire Station' },
            women_helpline: { number: '104', details: 'Women & Child Helpline' },
            child_protection: { number: '1098', details: 'Child Protection' },
            electricity: { number: '1134', details: 'Nepal Electricity Authority' },
            water: { number: '1150', details: 'Water Supply' },
            municipal: { number: '082-560001', details: 'Municipal Office' }
        };

        const blob = new Blob([JSON.stringify(contacts, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kohalpur-emergency-contacts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveToPhone() {
        // Create vCard
        const vCard = `BEGIN:VCARD
VERSION:3.0
FN:Kohalpur Emergency Contacts
ORG:Kohalpur Municipality
TEL;TYPE=emergency:100
TEL;TYPE=ambulance:102
TEL;TYPE=fire:101
TEL;TYPE=helpline:104
TEL;TYPE=child:1098
TEL;TYPE=electricity:1134
TEL;TYPE=water:1150
TEL;TYPE=office:082-560001
END:VCARD`;

        const blob = new Blob([vCard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kohalpur-emergency.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    printContacts() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Kohalpur Emergency Contacts</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #d32f2f; }
                        .contact { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                        .number { font-size: 24px; font-weight: bold; color: #d32f2f; }
                        @media print { button { display: none; } }
                    </style>
                </head>
                <body>
                    <h1>Kohalpur Emergency Contacts</h1>
                    ${document.querySelector('.emergency-grid').innerHTML}
                    <button onclick="window.print()">Print</button>
                    <button onclick="window.close()">Close</button>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    generateContactCard() {
        // Generate QR code for emergency contacts
        const qrContainer = document.getElementById('qrCode');
        if (qrContainer) {
            // This would generate a QR code with all emergency contacts
            // Using a library like qrcode.js would be needed
        }
    }
}

// Initialize emergency system
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.emergency-container')) {
        const emergencySystem = new EmergencySystem();
        window.emergencySystem = emergencySystem;
    }
});

// Global functions for onclick handlers
function callNumber(number) {
    if (window.emergencySystem) {
        window.emergencySystem.makeCall(number);
    }
}

function downloadContacts() {
    if (window.emergencySystem) {
        window.emergencySystem.downloadContacts();
    }
}

function saveToPhone() {
    if (window.emergencySystem) {
        window.emergencySystem.saveToPhone();
    }
}

function printContacts() {
    if (window.emergencySystem) {
        window.emergencySystem.printContacts();
    }
}