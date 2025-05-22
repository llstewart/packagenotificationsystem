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
    }, 5000);
}

// Registration Form Submission
document.getElementById('registrationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,  // NEW PHONE FIELD
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


document.getElementById('packageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value.trim(),
        apartment: document.getElementById('apartment').value.trim().toUpperCase(),
        courier: document.getElementById('courier').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    try {
        // Check if there is an email associated with the apartment number
        const checkResponse = await fetch(`${API_BASE_URL}/api/residents/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aptNumber: data.apartment })
        });

        const checkResult = await checkResponse.json();
        console.log("Email check response:", checkResult); // Debugging        // Fix: Access exists inside the message object
        if (!checkResult.message.exists) {
            showPopup("⚠️ No email found for the given apartment number. The package will be logged, but no notification will be sent.", false);
            console.warn(`No email found for apartment ${data.apartment}`);
            // Continue with logging the package anyway
        }

        // Log the package
        const logResponse = await fetch(`${API_BASE_URL}/api/packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: "logPackage",
                name: data.name,
                aptNumber: data.apartment,
                courier: data.courier,
                description: data.description
            })
        });        const logResult = await logResponse.json();

        if (logResponse.ok) {
            if (logResult.emailsSent) {
                showPopup("✅ Package logged successfully and resident notified!", true);
            } else {
                showPopup("✅ Package logged successfully! ⚠️ No notifications sent (no registered email)", true);
            }
            e.target.reset();
        } else {
            showPopup("⚠️ Logging Warning: " + logResult.error, false);
        }
    } catch (error) {
        showPopup("⚠️ Network Warning: " + error.message, false);
    }
});
