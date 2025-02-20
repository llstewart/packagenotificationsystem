from flask import Flask, jsonify, request
from flask_cors import CORS
from helpers import add_resident  # Import function from helpers.py

app = Flask(__name__)
CORS(app)  # Enable CORS globally for all routes

@app.route('/api/residents', methods=['POST'])
def register_resident():
    data = request.json
    response, status_code = add_resident(data)  # Call the function from helpers.py
    return jsonify(response), status_code

if __name__ == '__main__':
    app.run(debug=True)
