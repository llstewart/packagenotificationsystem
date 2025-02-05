document.addEventListener('DOMContentLoaded', () => {
  // Navigation handling
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
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          aptNumber: document.getElementById('aptNumber').value
      };

      try {
          const response = await fetch('YOUR_REGISTRATION_SCRIPT_URL', {
              method: 'POST',
              body: JSON.stringify(formData)
          });
          
          if(response.ok) {
              alert('Resident registered successfully!');
              e.target.reset();
          }
      } catch (error) {
          showStatus('Error registering resident', 'error');
      }
  });

  // Package Logging Form
  document.getElementById('packageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const packageData = {
          date: document.getElementById('packageDate').value,
          time: document.getElementById('packageTime').value,
          courier: document.getElementById('courier').value,
          aptNumber: document.getElementById('aptNumberPackage').value,
          description: document.getElementById('packageDesc').value
      };

      try {
          const response = await fetch('YOUR_PACKAGE_SCRIPT_URL', {
              method: 'POST',
              body: JSON.stringify(packageData)
          });

          if(response.ok) {
              showStatus('Package logged successfully!', 'success');
              e.target.reset();
              updatePendingCount();
          }
      } catch (error) {
          showStatus('Error logging package', 'error');
      }
  });

  // Send Notifications
  document.getElementById('sendEmails').addEventListener('click', async () => {
      try {
          const response = await fetch('YOUR_EMAIL_SCRIPT_URL');
          const result = await response.text();
          
          showStatus(`Successfully sent ${result} notifications`, 'success');
          updatePendingCount();
      } catch (error) {
          showStatus('Error sending notifications', 'error');
      }
  });

  // Helper Functions
  function showStatus(message, type) {
      const statusDiv = document.getElementById('statusMessage');
      statusDiv.textContent = message;
      statusDiv.className = type;
  }

  async function updatePendingCount() {
      try {
          const response = await fetch('YOUR_PENDING_COUNT_SCRIPT_URL');
          const count = await response.text();
          document.getElementById('pendingCount').textContent = count;
      } catch (error) {
          console.error('Error fetching pending count:', error);
      }
  }

  // Initial load
  updatePendingCount();
});