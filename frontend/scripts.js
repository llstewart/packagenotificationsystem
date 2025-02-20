// Change API URL to match Flask server
const API_BASE_URL = "http://127.0.0.1:5000";  // Ensure Flask runs on port 5000

// Registration Form Submission
document.getElementById('registrationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        apartment: document.getElementById('apartment').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/residents`, {  // Use the correct API URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Resident registered successfully!');
            e.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});
