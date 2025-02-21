import os
from flask import Flask
from flask_cors import CORS
from helpers import residents  # ✅ Import the function from helpers.py

# ✅ Load environment variables
EMAIL_NOTIFICATIONS_ENABLED = os.getenv("EMAIL_NOTIFICATIONS", "true").lower() == "true"

# ✅ Flask App Setup
app = Flask(__name__)
CORS(app)

# ✅ Register the `residents` function as a route
app.add_url_rule('/api/residents', view_func=residents, methods=['POST', 'GET'])

if __name__ == '__main__':
    app.run(debug=True)
