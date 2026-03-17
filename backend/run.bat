@echo off
echo Starting Flask Auth Backend...
echo Install deps first: pip install -r requirements.txt
echo Setup DB: python init_db.py
echo.
python app.py
pause

