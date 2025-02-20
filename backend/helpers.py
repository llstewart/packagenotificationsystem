import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Gmail credentials (Using provided email)
EMAIL_ADDRESS = "notificationsapartment@gmail.com"
EMAIL_PASSWORD = "obko qrot ctor wlic"  # Replace with your Gmail App Password

# Updated Google Apps Script URL
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZeHBI9R2fZrio3r2N3mALNiu6fSB0LOAnAo4u8o1Sz6Yw7Z3s1XAqsf9zGV-tK0gk/exec"

def send_email(to_email, subject, body):
    """Send an email notification to the resident."""
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        # Connect to Gmail SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()  # Secure connection
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        server.quit()
        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

def add_resident(data):
    """Register a resident in Google Sheets and send a confirmation email."""
    payload = {
        "action": "registerResident",
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),  # Include optional phone number
        "aptNumber": data["apartment"]
    }

    # Send request to Google Sheets API
    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code == 200:
        # Send Email Notification
        subject = "Resident Registration Successful"
        body = f"""
        Hello {data['name']},

        You have been successfully registered as a resident in apartment {data['apartment']}.
        Phone Number: {data.get("phone", "Not provided")}

        Thank you!
        """

        send_email(data["email"], subject, body)
        return {"message": "Resident added successfully and email sent!"}, 201
    else:
        return {"error": "Failed to register resident in Google Sheets"}, 500
