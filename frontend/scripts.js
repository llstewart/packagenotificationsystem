// Registration Form
document.getElementById('registrationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        apartment: document.getElementById('apartment').value
    };

    try {
        const response = await fetch('/api/residents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Resident registered successfully!');
            e.target.reset();
        } else {
            alert('Error: ' + (await response.json()).message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});

// Package Form
document.getElementById('packageForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        courier: document.getElementById('courier').value,
        apartment: document.getElementById('apartment').value,
        description: document.getElementById('description').value,
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch('/api/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Package logged successfully!');
            e.target.reset();
        } else {
            alert('Error: ' + (await response.json()).message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});