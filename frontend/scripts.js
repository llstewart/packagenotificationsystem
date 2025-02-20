// Change API URL to match Flask server
const API_BASE_URL = "http://127.0.0.1:5000";  // Ensure Flask runs on port 5000


// Function to show a pop-up message
function showPopup(message, isSuccess = true) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.padding = "15px 20px";
    popup.style.color = "#fff";
    popup.style.borderRadius = "5px";
    popup.style.fontSize = "16px";
    popup.style.fontWeight = "bold";
    popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "9999";
    popup.style.backgroundColor = isSuccess ? "#28a745" : "#dc3545"; // Green for success, Red for error

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => document.body.removeChild(popup), 500);
    }, 3000);
}

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
            showPopup("✅ Resident registered successfully!", true);
            e.target.reset();
        } else {
            showPopup("❌ Registration Failed: " + result.error, false);
        }
    } catch (error) {
        showPopup("❌ Network Error: " + error.message, false);
    }
});
