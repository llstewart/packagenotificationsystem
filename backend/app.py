from flask import Flask, jsonify, request, render_template
import requests
import os

app = Flask(__name__)

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwY_4pkeXMGV--tv1jkf9BWh0Bu7KBh2PrqgfWDQy285QJSU9cvlBP51q5JASQSykhGqQ/exec"

@app.route('/api/residents', methods=['POST'])
def add_resident():
    data = request.json

    payload = {
        "action": "registerResident",
        "name": data["name"],
        "email": data["email"],
        "aptNumber": data["apartment"]
    }

    google_response = requests.post(GOOGLE_SCRIPT_URL, json=payload)

    if google_response.status_code == 200:
        return jsonify({"message": "Resident added successfully"}), 201
    else:
        return jsonify({"error": "Failed to register resident in Google Sheets"}), 500
