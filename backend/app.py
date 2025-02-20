from flask import Flask, jsonify, request, render_template
from flask_cors import CORS  # Import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS globally for all routes

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZeHBI9R2fZrio3r2N3mALNiu6fSB0LOAnAo4u8o1Sz6Yw7Z3s1XAqsf9zGV-tK0gk/exec"

@app.route('/api/residents', methods=['POST'])
def add_resident():
    data = request.json

    payload = {
        "action": "registerResident",
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],  # NEW PHONE FIELD
        "aptNumber": data["apartment"]
    }

    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code == 200:
        return jsonify({"message": "Resident added successfully"}), 201
    else:
        return jsonify({"error": "Failed to register resident in Google Sheets"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
