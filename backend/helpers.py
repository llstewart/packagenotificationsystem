import os
import requests  # For sending HTTP requests
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, jsonify, request, url_for  # ✅ Add `request` import
from flask_cors import CORS

# Initialize logger
logger = logging.getLogger(__name__)

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwgLr6bLg7mr85sLVi8a9eN-wJ_yHYAkK_tQzJ8EFQRMFBqBAzrJ49cz86w-UBNb_U3Q/exec"

# ✅ Load environment variables
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "notificationsapartment@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "obko qrot ctor wlic")  # Replace with actual password
ADMIN_EMAIL = "lincolnstewart4@gmail.com"  # ✅ Set the admin email


# Updated Google Apps Script URL
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwgLr6bLg7mr85sLVi8a9eN-wJ_yHYAkK_tQzJ8EFQRMFBqBAzrJ49cz86w-UBNb_U3Q/exec"

# ✅ Store Pending Approvals in Memory
pending_approvals = {}

### ───────────────────────────────────────────
### ✅ FUNCTION: Send Email (Supports HTML Emails)
### ───────────────────────────────────────────
def send_email(to_email, subject, body, is_html=False):
    """Send an email with optional HTML support. Skips email if disabled."""
    
    if os.getenv("EMAIL_NOTIFICATIONS", "true").lower() != "true":
        print(f"⚠️ Email notifications are disabled. Skipping email to {to_email}.")
        return

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html" if is_html else "plain"))

    try:
        # ✅ Connect to Gmail SMTP Server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()  # Secure connection
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        server.quit()
        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

### ───────────────────────────────────────────
### ✅ FUNCTION: Request Admin Approval via Email Links
### ───────────────────────────────────────────
def request_admin_approval(data):
    """Send an email to the admin with clickable Approve/Deny links."""

    # Store request temporarily for tracking approval
    request_id = f"{data['email']}:{data['apartment']}"
    pending_approvals[request_id] = data  

    # ✅ Create Approval/Deny Links
    base_url = "http://127.0.0.1:5000/api/residents"  # Same endpoint for admin and residents
    approve_url = f"{base_url}?email={data['email']}&apartment={data['apartment']}&response=yes"
    deny_url = f"{base_url}?email={data['email']}&apartment={data['apartment']}&response=no"

    # ✅ Email Content with Buttons
    subject = f"Resident Approval Request: {data['name']} (Apt {data['apartment']})"
    body = f"""
    <html>
    <body>
        <p>Hello Admin,</p>
        <p>A new resident has applied for an apartment and requires your approval:</p>
        <ul>
            <li><strong>Name:</strong> {data['name']}</li>
            <li><strong>Email:</strong> {data['email']}</li>
            <li><strong>Phone:</strong> {data.get("phone", "Not provided")}</li>
            <li><strong>Apartment:</strong> {data['apartment']}</li>
        </ul>
        <p>Please confirm if this resident is real by clicking one of the links below:</p>
        <a href="{approve_url}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">✅ Approve</a>
        &nbsp;&nbsp;
        <a href="{deny_url}" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">❌ Deny</a>
        <p>Thank you.</p>
    </body>
    </html>
    """

    send_email(ADMIN_EMAIL, subject, body, is_html=True)
    return {"message": "Resident approval request sent to admin"}, 200

### ───────────────────────────────────────────
### ✅ FUNCTION: Process Approval/Deny Response
### ───────────────────────────────────────────
def process_admin_response(email, apartment, admin_response):
    """Handles admin's approval or denial of a resident."""

    request_id = f"{email}:{apartment}"

    if request_id not in pending_approvals:
        return {"error": "No matching approval request found"}, 404

    resident_data = pending_approvals.pop(request_id)
    admin_response = admin_response.strip().lower()

    if admin_response.startswith("no"):
        # ❌ Send Denial Email
        subject = "Resident Registration Denied"
        body = f"""
        Hello {resident_data['name']},

        Your registration request for apartment {resident_data['apartment']} has been **denied**.

        Thank you.
        """
        send_email(resident_data["email"], subject, body)
        return {"message": "Resident registration denied by admin"}, 403

    elif admin_response.startswith("yes"):
        # ✅ Approve and Register the Resident
        return add_resident(resident_data)

    else:
        return {"error": "Invalid admin response. Use 'yes' or 'no'."}, 400

### ───────────────────────────────────────────
### ✅ FUNCTION: Register Resident in Google Sheets
### ───────────────────────────────────────────
def add_resident(data):
    """Register the resident in Google Sheets and send a confirmation email."""
    payload = {
        "action": "registerResident",
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "aptNumber": data["apartment"]
    }

    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code == 200:
        send_email(data["email"], "Resident Registration Successful", f"Hello {data['name']},\n\nWelcome!")
        return {"message": "Resident added successfully!"}, 201
    return {"error": "Failed to register resident"}, 500


def residents():
    """Handles both resident registration and admin approval."""
    if request.method == 'POST':
        data = request.json
        response, status_code = request_admin_approval(data)
        return jsonify(response), status_code

    elif request.method == 'GET':
        email = request.args.get("email")
        apartment = request.args.get("apartment")
        admin_response = request.args.get("response")

        if not email or not apartment or not admin_response:
            return jsonify({"error": "Invalid request. Missing parameters."}), 400

        response, status_code = process_admin_response(email, apartment, admin_response)

        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2>✅ Approval Processed</h2>
                <p>Your response has been recorded successfully.</p>
                <p>Status: <strong>{admin_response.upper()}</strong></p>
                <p>Resident: {email}, Apartment: {apartment}</p>
            </body>
        </html>
        """, status_code
    
### ───────────────────────────────────────────
### FUNCTION: Check if a Resident's Email Exists
### ───────────────────────────────────────────
def check_resident_email():
    data = request.json
    apt_number = data.get("aptNumber")

    if not apt_number:
        logger.warning("Apartment number missing in email check request")
        return jsonify({"error": "Apartment number is required"}), 400

    payload = {
        "action": "checkResidentEmail",
        "aptNumber": apt_number
    }

    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code == 200:
        result = google_response.json()
        exists = result.get("message", {}).get("exists", False)
        if exists:
            logger.info(f"Email found for apartment {apt_number}")
        else:
            logger.warning(f"No email found for apartment {apt_number}")
        return jsonify(result), 200
        
    logger.warning(f"Failed to check email for apartment {apt_number}")
    return jsonify({"error": "Failed to check email"}), 500

### ───────────────────────────────────────────
### ✅ FUNCTION: To Log a package 
### ───────────────────────────────────────────

def log_package():
    data = request.json

    required_fields = ["name", "aptNumber", "courier", "description"]
    if not all(field in data for field in required_fields):
        logger.warning(f"Missing required fields in package data: {data}")
        return jsonify({"error": "Missing required fields"}), 400

    # Get the resident's emails
    payload = {
        "action": "checkResidentEmail",
        "aptNumber": data["aptNumber"]
    }
    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code != 200:
        logger.warning(f"Failed to retrieve resident emails for apartment {data['aptNumber']}")
        return jsonify({"error": "Failed to retrieve resident emails"}), 500
    
    email_data = google_response.json()

    # Extract emails correctly
    resident_emails = email_data.get("message", {}).get("emails", [])

    # Ensure we have a list of emails
    if isinstance(resident_emails, str):  
        resident_emails = [resident_emails]  # Convert single email into a list

    # Allow package logging even if no emails are found (just log a warning)
    has_emails = len(resident_emails) > 0
    if not has_emails:
        logger.warning(f"No email found for apartment {data['aptNumber']}. Package will be logged without notification.")
    
    # Log the package
    log_payload = {
        "action": "logPackage",
        "name": data["name"],
        "aptNumber": data["aptNumber"],
        "courier": data["courier"],
        "description": data["description"]
    }
    log_response = requests.post(GOOGLE_SCRIPT_URL, json=log_payload)

    if log_response.status_code == 200:
        # Construct the email content
        description = data["description"].strip()
        description_text = f"\n\nDescription: {description}" if description else "\n\nThere was no description provided."
        email_body = f"Hello,\n\nApartment #{data['aptNumber']}: A package has arrived for {data['name']}.{description_text}"

        # Send email notification to all associated emails if any exist
        if resident_emails:
            for email in resident_emails:
                send_email(email, "Package Arrival Notification", email_body)
            logger.info(f"Package logged successfully for {data['name']} at apartment {data['aptNumber']} with notifications sent")
        else:
            logger.info(f"Package logged successfully for {data['name']} at apartment {data['aptNumber']} without notifications")
        
        return jsonify({"message": "Package logged successfully", "emailsSent": len(resident_emails) > 0}), 200

    logger.warning(f"Failed to log package for {data['name']} at apartment {data['aptNumber']}")
    return jsonify({"error": "Failed to log package"}), 500
