@echo off
echo ========================================
echo AgriGrow - Backend + Frontend Starter
echo ========================================
echo.

echo [1/4] Starting Backend...
cd /d "%~dp0"
if exist venv (
  call venv\Scripts\activate.bat
) else (
  echo Creating backend venv...
  python -m venv venv
  call venv\Scripts\activate.bat
  pip install -r requirements.txt
)
python init_db.py
start "Backend Flask" cmd /k "python app.py"

echo [2/4] Waiting for backend...
timeout /t 3 /nobreak >nul

echo [3/4] Testing backend...
curl -s -X GET http://localhost:5000/health | findstr "healthy" && echo Backend OK! || echo Backend failed!

echo [4/4] Starting Frontend...
cd /d "%~dp0..\"
if exist node_modules (
  npm run dev
) else (
  echo Installing frontend deps...
  npm install
  npm run dev
)

pause

