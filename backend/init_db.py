# Optional: Raw SQL schema support commented out
from app import app, db
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


with app.app_context():
    print("Initializing database...")
    db.create_all()

    # Optional: Run raw schema
    # with open('database/schema.sql', 'r') as f:
    #     db.engine.execute(f.read())

    print("✅ Database initialized successfully!")
    print("📁 Tables created. Ready for use.")
