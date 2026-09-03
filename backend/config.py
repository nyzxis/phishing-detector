import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "cyber-security-secret-key-2026")
    
    # Dual database configuration: SQLite local default or PostgreSQL via DATABASE_URL
    database_url = os.environ.get("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        # Fix for SQLAlchemy 2.0+ requiring postgresql://
        database_url = database_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = database_url or f"sqlite:///{os.path.join(BASE_DIR, 'phishing_detector.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Model directories
    MODELS_DIR = os.path.join(BASE_DIR, "models")
