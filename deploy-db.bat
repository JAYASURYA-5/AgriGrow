@echo off
REM ============================================
REM AgriGrow Database Deployment Script
REM Windows Batch Version
REM ============================================

echo.
echo ======================================
echo   AgriGrow Database Deployment
echo ======================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Change to project directory
cd /d "%~dp0.."

REM Check for .env file
if not exist ".env" (
    echo ❌ .env file not found
    echo Please create .env with Supabase credentials
    pause
    exit /b 1
)

echo ✅ .env file found

REM Install dependencies if needed
if not exist "node_modules\@supabase\supabase-js" (
    echo ⏳ Installing dependencies...
    call npm install @supabase/supabase-js
)

echo.
echo ======================================
echo   Migration Files Ready for Deploy
echo ======================================
echo.

REM Display migration files
for /f %%F in ('dir /b database\migrations\*.sql') do (
    echo ✓ %%F
)

echo.
echo ⚠️  MANUAL DEPLOYMENT REQUIRED
echo.
echo Since you have an anon API key, you need to execute the SQL
echo manually via Supabase Dashboard:
echo.
echo 1. Go to: https://app.supabase.com
echo 2. Open your project "AgriGrow" ^(zxdremqifbhjlqghisme^)
echo 3. Click SQL Editor in left sidebar
echo 4. Click "New Query"
echo 5. Copy contents from: database/migrations/000_combined_migration.sql
echo 6. Paste into SQL Editor
echo 7. Click "Run"
echo.
echo Alternatively, open: database/DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo Press any key to open browser...
pause

REM Open Supabase dashboard in browser
start https://app.supabase.com/projects/zxdremqifbhjlqghisme
