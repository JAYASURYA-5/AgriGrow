@echo off
echo ========================================
echo Flask Auth Backend - Complete Setup
echo ========================================
echo.

REM Navigate to backend
cd /d "%~dp0"

REM Create venv if not exists
if not exist "venv" (
  echo Creating virtual environment...
  python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Initialize database
echo Initializing database...
python init_db.py

echo.
echo ✅ Setup COMPLETE!
echo.
echo To start server:
echo call run.bat
echo.
echo Test endpoints:
echo curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" -d "{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"testpass123\"}"
echo curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"testpass123\"}"
echo.
pause

