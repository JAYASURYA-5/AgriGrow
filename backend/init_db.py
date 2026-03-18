# Optional: Raw SQL schema support commented out
from app import app, db
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


with app.app_context():
    print("Initializing database...")
    db.create_all()

    # Run raw schema (MySQL syntax)
    from sqlalchemy import text
    with app.app_context():
        with open('database/schema.sql', 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        db.session.execute(text(schema_sql))
        db.session.commit()

    print("✅ Database initialized successfully!")
    print("📁 Tables created. Ready for use.")
