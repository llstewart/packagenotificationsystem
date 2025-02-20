from flask import Flask, jsonify, request, render_template
from flask_cors import CORS  # Import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS globally for all routes

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyE-tnK10vRlnB-_x2ox7bCBZNDr15S0Ch5J6Cs1033rVCtLS-Vu-Rh8P3PLZIXig1lbA/exec"

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
    
if __name__ == '__main__':
    app.run(debug=True)
