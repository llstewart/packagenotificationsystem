Overview
The Package Notification System is a full-stack web application designed to streamline the tracking and notification process for package deliveries. It enables users to register incoming packages, monitor their status, and notify recipients through a web-based interface.

This system is divided into two main components:

Backend: A Flask-based Python server that handles all logic, routing, and data management.

Frontend: A lightweight HTML/CSS/JavaScript interface for user interaction.

Project Structure
bash
Copy
Edit
packagenotificationsystem/
│
├── backend/                  # Backend application using Flask
│   ├── app.py                # Main application file
│   ├── models.py             # Database models
│   ├── helpers.py            # Utility functions
│   ├── database/             # Contains database-related files
│   └── .env                  # Environment configuration file (not committed)
│
├── frontend/                 # Frontend files
│   ├── index.html            # Homepage
│   ├── package.html          # Page to register and view packages
│   ├── scripts.js            # JavaScript for frontend functionality
│   └── styles.css            # CSS for styling
│
├── venv/                     # Python virtual environment
└── .git/                     # Git repository metadata
Prerequisites
Python 3.7+

Git

(Optional) A modern web browser for frontend interaction

Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone <your-repository-url>
cd packagenotificationsystem
2. Backend Setup
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate        # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
Create a .env file in the backend/ directory with the necessary environment variables:

Example .env:

ini
Copy
Edit
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///database/packagedb.db
3. Run the Backend Server
bash
Copy
Edit
python app.py
By default, this will run the Flask server on http://localhost:5000.

4. Launch the Frontend
You can either open the HTML files directly in a web browser or serve them locally.

To serve with a lightweight server:

bash
Copy
Edit
cd frontend
python -m http.server
Visit http://localhost:8000 to use the frontend.

File Descriptions
Backend
app.py: Initializes and runs the Flask app with routing logic.

models.py: Defines the database schema.

helpers.py: Contains reusable utility functions.

database/: Stores the database or migration scripts.

Frontend
index.html: Entry point to the application.

package.html: Interface to view and add packages.

scripts.js: JavaScript logic for dynamic interaction.

styles.css: Styling for the user interface.

Dependencies
Install Python dependencies using:

bash
Copy
Edit
pip install -r requirements.txt
Dependencies typically include:

Flask

python-dotenv



License
This project is provided under a custom non-commercial license.

You are permitted to:

Clone and view the source code

Use the code for personal, educational, or non-commercial purposes

You are not permitted to:

Use this project or its code for any commercial, business, or for-profit purpose

Sell, sublicense, or redistribute the code as part of a paid product or service

Host or deploy this project publicly with monetization in mind

For any commercial inquiries, you must obtain explicit written permission from the project owner.

Contributing
This repository is read-only for external users. You are welcome to clone or fork the repository for personal or educational use, but:

Do not open issues or pull requests

Do not contribute code changes

This is a closed-source project for public reference only.

