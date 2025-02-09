document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwMXa4cqsUUs8TjxyXLGba7SCm90lWobKrNa3BV3JECMlh0idKiLsLcLcueSDoMHH-G_w/exec';
    
    // Navigation handling (unchanged)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            
            link.classList.add('active');
            document.querySelector(link.getAttribute('href')).classList.add('active');
        });
    });

    // Registration Form
    document.getElementById('registrationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            aptNumber: document.getElementById('aptNumber').value.trim()
        };

        if (!validateForm(formData, ['name', 'email', 'aptNumber'])) {
            showStatus('Please fill out all required fields', 'error');
            return;
        }

        try {
            const response = await fetch(`${SCRIPT_URL}?action=registerResident`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            handleResponse(response, 'Resident registered successfully!');
            e.target.reset();
        } catch (error) {
            showStatus('Error registering resident: ' + error.message, 'error');
        }
    });

    // Package Logging Form
    document.getElementById('packageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const packageData = {
            date: document.getElementById('packageDate').value,
            time: document.getElementById('packageTime').value,
            courier: document.getElementById('courier').value.trim(),
            aptNumber: document.getElementById('aptNumberPackage').value.trim(),
            description: document.getElementById('packageDesc').value.trim()
        };

        if (!validateForm(packageData, ['date', 'time', 'courier', 'aptNumber', 'description'])) {
            showStatus('Please fill out all required fields', 'error');
            return;
        }

        try {
            const response = await fetch(`${SCRIPT_URL}?action=logPackage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageData)
            });

            handleResponse(response, 'Package logged successfully!');
            e.target.reset();
            updatePendingCount();
        } catch (error) {
            showStatus('Error logging package: ' + error.message, 'error');
        }
    });

    // Send Notifications
    document.getElementById('sendEmails').addEventListener('click', async () => {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=sendNotifications`);
            const count = await response.text();
            
            if (response.ok) {
                showStatus(`Successfully sent ${count} notifications`, 'success');
                updatePendingCount();
            } else {
                showStatus('Error sending notifications', 'error');
            }
        } catch (error) {
            showStatus('Error sending notifications: ' + error.message, 'error');
        }
    });

    // Helper Functions
    function validateForm(data, requiredFields) {
        return requiredFields.every(field => data[field]);
    }

    async function handleResponse(response, successMessage) {
        if (response.ok) {
            showStatus(successMessage, 'success');
            return true;
        }
        const error = await response.text();
        throw new Error(error);
    }

    async function updatePendingCount() {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getPendingCount`);
            const count = await response.text();
            document.getElementById('pendingCount').textContent = count;
        } catch (error) {
            console.error('Error fetching pending count:', error);
        }
    }

    function showStatus(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        setTimeout(() => statusDiv.textContent = '', 5000);
    }

    // Initial load
    updatePendingCount();
});