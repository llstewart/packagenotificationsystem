from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from models import db, Resident, Package
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend', template_folder='../frontend')
CORS(app)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/packages.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Email configuration
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/package')
def package():
    return render_template('package.html')

@app.route('/api/residents', methods=['POST'])
def add_resident():
    data = request.json
    new_resident = Resident(
        name=data['name'],
        email=data['email'],
        apartment=data['apartment']
    )
    db.session.add(new_resident)
    db.session.commit()
    return jsonify({"message": "Resident added"}), 201

@app.route('/api/packages', methods=['POST'])
def add_package():
    data = request.json
    new_package = Package(
        courier=data['courier'],
        apartment=data['apartment'],
        description=data['description'],
        notes=data.get('notes', '')
    )
    
    # Find resident and send email
    resident = Resident.query.filter_by(apartment=data['apartment']).first()
    if resident:
        msg = MIMEText(f'''
            New Package Notification\n
            Apartment: {data['apartment']}\n
            Courier: {data['courier']}\n
            Description: {data['description']}\n
            Notes: {data.get('notes', '')}
        ''')
        msg['Subject'] = 'New Package Received'
        msg['From'] = EMAIL_USER
        msg['To'] = resident.email
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
    
    db.session.add(new_package)
    db.session.commit()
    return jsonify({"message": "Package logged"}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)