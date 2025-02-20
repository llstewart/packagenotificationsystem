from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Resident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)  # NEW PHONE FIELD
    apartment = db.Column(db.String(10), nullable=False)

class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=db.func.now())
    courier = db.Column(db.String(50), nullable=False)
    apartment = db.Column(db.String(10), nullable=False)
    description = db.Column(db.Text, nullable=False)
    notes = db.Column(db.Text)