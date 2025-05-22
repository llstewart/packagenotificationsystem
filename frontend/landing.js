// Change API URL to match Flask server
const API_BASE_URL = "http://127.0.0.1:5000";

// Apple-style animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .btn-apple, img, h2, h3, p');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                element.classList.add('fade-in');
            }
        });
    };

    // Run animate on scroll on page load and during scrolling
    window.addEventListener('scroll', animateOnScroll);
    // Initial animation check
    setTimeout(animateOnScroll, 300);

    // Add Apple-style CSS enhancements
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            /* Apple-style animations */
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .fade-in { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
            
            /* Apple-style form focus states */
            input:focus, textarea:focus {
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.12);
                border-color: #0071e3;
            }
            
            /* Apple-style inputs and hover effects */
            .form-input {
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            
            /* Apple-style buttons */
            button {
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            button:active {
                transform: scale(0.98);
            }
            
            /* Apple-style popup notifications */
            .apple-popup {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 16px 24px;
                border-radius: 14px;
                color: #fff;
                font-size: 15px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
                transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .apple-popup.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            
            /* Loading indicator */
            .apple-loading {
                position: relative;
                pointer-events: none;
            }
            .apple-loading::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: apple-spin 0.8s linear infinite;
            }
            @keyframes apple-spin {
                to {
                    transform: rotate(360deg);
                }
            }
            
            /* Form validation styles */
            .form-error {
                color: #ff3b30;
                font-size: 12px;
                margin-top: 4px;
                opacity: 0;
                height: 0;
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .form-error.show {
                opacity: 1;
                height: 16px;
                margin-top: 4px;
            }
            input.error, textarea.error {
                border-color: #ff3b30;
            }
        </style>
    `);
    
    // Mobile menu toggle with Apple-style animation
    const menuButton = document.querySelector('.sm\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                mobileMenu.classList.remove('hidden');
                
                // Trigger reflow for animation
                mobileMenu.offsetHeight;
                
                mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                mobileMenu.style.opacity = '1';
                mobileMenu.style.transform = 'translateY(0)';
            } else {
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Close mobile menu when clicking on a navigation item
    const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.style.opacity = '0';
            mobileMenu.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        });
    });

    // Smooth scrolling for anchor links with Apple-style ease
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced form inputs with Apple-style feedback
    document.querySelectorAll('input, textarea').forEach(input => {
        // Add form-input class for styling
        input.classList.add('form-input');
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.id = `${input.id}-error`;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        
        // Apple-style focus and blur effects
        input.addEventListener('focus', function() {
            this.parentNode.querySelector('label').classList.add('text-apple-blue');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.querySelector('label').classList.remove('text-apple-blue');
        });
    });

    // Enhanced popup with Apple-style animation
    window.showPopup = function(message, isSuccess = true) {
        // Remove any existing popups
        document.querySelectorAll('.apple-popup').forEach(popup => {
            popup.remove();
        });
        
        const popup = document.createElement("div");
        popup.className = "apple-popup";
        popup.textContent = message;
        popup.style.backgroundColor = isSuccess ? "#32d74b" : "#ff3b30";
        
        document.body.appendChild(popup);
        
        // Trigger reflow for animation
        popup.offsetHeight;
        
        // Show the popup
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 400);
        }, 5000);
    };    // Form validation utility
    const validateField = (field, errorMsg) => {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (!field.value.trim()) {
            field.classList.add('error');
            errorElement.textContent = errorMsg;
            errorElement.classList.add('show');
            return false;
        } else {
            field.classList.remove('error');
            errorElement.classList.remove('show');
            return true;
        }
    };

    // Enhanced Package Form Submission with Apple-style interactions
    const packageForm = document.getElementById('packageForm');
    if (packageForm) {
        const nameField = document.getElementById('pkg-name');
        const apartmentField = document.getElementById('pkg-apartment');
        const courierField = document.getElementById('pkg-courier');
        const descriptionField = document.getElementById('pkg-description');
        const submitButton = packageForm.querySelector('button[type="submit"]');
        
        // Real-time validation on input
        [nameField, apartmentField, courierField, descriptionField].forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                    document.getElementById(`${field.id}-error`).classList.remove('show');
                }
            });
        });
        
        packageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const nameValid = validateField(nameField, 'Please enter resident name');
            const aptValid = validateField(apartmentField, 'Please enter apartment number');
            const courierValid = validateField(courierField, 'Please enter courier name');
            const descValid = validateField(descriptionField, 'Please enter package description');
            
            if (!nameValid || !aptValid || !courierValid || !descValid) {
                return;
            }
            
            // Show Apple-style loading state
            const buttonText = submitButton.innerHTML;
            submitButton.innerHTML = '';
            submitButton.classList.add('apple-loading');
            submitButton.disabled = true;
            
            const data = {
                name: nameField.value.trim(),
                apartment: apartmentField.value.trim().toUpperCase(),
                courier: courierField.value.trim(),
                description: descriptionField.value.trim()
            };

            try {
                // Check if there is an email associated with the apartment number
                const checkResponse = await fetch(`${API_BASE_URL}/api/residents/check-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ aptNumber: data.apartment })
                });

                if (!checkResponse.ok) {
                    throw new Error('Network response error when checking resident email');
                }
                
                const checkResult = await checkResponse.json();
                console.log("Email check response:", checkResult);

                // If no email exists, show warning but continue
                if (!checkResult.message.exists) {
                    showPopup("⚠️ No email found for this apartment. Package will be logged but no notification will be sent.", false);
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
                });

                if (!logResponse.ok) {
                    throw new Error('Network response error when logging package');
                }
                
                const logResult = await logResponse.json();

                if (logResponse.ok) {
                    if (logResult.emailsSent) {
                        showPopup("✅ Package logged successfully and resident notified!", true);
                    } else {
                        showPopup("✅ Package logged successfully! No notifications sent (no registered email)", true);
                    }
                    
                    // Apple-style form reset with animation
                    [nameField, apartmentField, courierField, descriptionField].forEach(field => {
                        field.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        field.style.backgroundColor = '#f5f5f7';
                        setTimeout(() => {
                            field.style.backgroundColor = '';
                            field.value = '';
                        }, 300);
                    });
                } else {
                    showPopup("⚠️ Logging Warning: " + logResult.error, false);
                }
            } catch (error) {
                showPopup("⚠️ Network Warning: " + error.message, false);
                console.error("Package logging error:", error);
            } finally {
                // Restore button state with smooth transition
                setTimeout(() => {
                    submitButton.classList.remove('apple-loading');
                    submitButton.innerHTML = buttonText;
                    submitButton.disabled = false;
                }, 500);
            }
        });
    }    // Enhanced Registration Form Submission with Apple-style interactions
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const nameField = document.getElementById('res-name');
        const apartmentField = document.getElementById('res-apartment');
        const emailField = document.getElementById('res-email');
        const phoneField = document.getElementById('res-phone');
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        
        // Real-time validation on input
        [nameField, apartmentField, emailField].forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                    document.getElementById(`${field.id}-error`).classList.remove('show');
                }
            });
        });
        
        // Email validation
        emailField.addEventListener('blur', () => {
            const email = emailField.value.trim();
            const errorElement = document.getElementById(`${emailField.id}-error`);
            
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailField.classList.add('error');
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.add('show');
            }
        });
        
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const nameValid = validateField(nameField, 'Please enter your full name');
            const aptValid = validateField(apartmentField, 'Please enter your apartment number');
            const emailValid = validateField(emailField, 'Please enter your email address');
            
            // Validate email format
            const email = emailField.value.trim();
            let emailFormatValid = true;
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailField.classList.add('error');
                const errorElement = document.getElementById(`${emailField.id}-error`);
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.add('show');
                emailFormatValid = false;
            }
            
            if (!nameValid || !aptValid || !emailValid || !emailFormatValid) {
                return;
            }
            
            // Show Apple-style loading state
            const buttonText = submitButton.innerHTML;
            submitButton.innerHTML = '';
            submitButton.classList.add('apple-loading');
            submitButton.disabled = true;
            
            const data = {
                name: nameField.value.trim(),
                email: emailField.value.trim(),
                phone: phoneField.value.trim(),
                apartment: apartmentField.value.trim()
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/residents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.error || "Registration failed");
                }
                
                const result = await response.json();
                
                showPopup("✅ Registration request sent! Please wait for admin approval.", true);
                
                // Apple-style form reset with animation
                [nameField, apartmentField, emailField, phoneField].forEach(field => {
                    field.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    field.style.backgroundColor = '#f5f5f7';
                    setTimeout(() => {
                        field.style.backgroundColor = '';
                        field.value = '';
                    }, 300);
                });
            } catch (error) {
                showPopup("❌ Registration Failed: " + error.message, false);
                console.error("Registration error:", error);
            } finally {
                // Restore button state with smooth transition
                setTimeout(() => {
                    submitButton.classList.remove('apple-loading');
                    submitButton.innerHTML = buttonText;
                    submitButton.disabled = false;
                }, 500);
            }
        });
    }    // Apple-style stats animation with refined timing
    const statElements = document.querySelectorAll('.feature-card span');
    if (statElements.length > 0) {
        const animateStats = () => {
            statElements.forEach(stat => {
                const rect = stat.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        const targetValue = stat.textContent;
                        stat.textContent = '0';
                        
                        let currentValue = 0;
                        const finalValue = parseInt(targetValue) || 0;
                        const duration = 1800; // 1.8 seconds - Apple-like timing
                        const start = performance.now();
                        
                        // Apple-style easing function
                        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 3);
                        
                        const animateValue = (timestamp) => {
                            const elapsed = timestamp - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const easedProgress = easeOutQuart(progress);
                            
                            currentValue = easedProgress * finalValue;
                            
                            if (progress < 1) {
                                stat.textContent = Math.floor(currentValue) + (targetValue.includes('%') ? '%' : '');
                                requestAnimationFrame(animateValue);
                            } else {
                                stat.textContent = targetValue;
                            }
                        };
                        
                        requestAnimationFrame(animateValue);
                    }
                }
            });
        };
        
        // Animate on scroll
        window.addEventListener('scroll', animateStats);
        // Initial check
        setTimeout(animateStats, 500);
    }
});
