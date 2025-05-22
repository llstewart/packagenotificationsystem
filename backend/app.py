import os
import logging
from flask import Flask
from flask_cors import CORS
from helpers import check_resident_email
from helpers import log_package  # ✅ Import the functions from helpers.py
from helpers import residents  # ✅ Import the function from helpers.py

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# ✅ Load environment variables
EMAIL_NOTIFICATIONS_ENABLED = os.getenv("EMAIL_NOTIFICATIONS", "true").lower() == "true"

# ✅ Flask App Setup
app = Flask(__name__)
CORS(app)

# ✅ Register the `residents` function as a route
app.add_url_rule('/api/residents', view_func=residents, methods=['POST', 'GET'])

# ✅Register the `check_resident_email` function as a route
app.add_url_rule('/api/residents/check-email', view_func=check_resident_email, methods=['POST'])

# ✅Register the `log_package` function as a route
app.add_url_rule('/api/packages', view_func=log_package, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
