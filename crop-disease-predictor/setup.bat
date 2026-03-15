@echo off
REM Crop Disease Predictor - Quick Start Script (Windows)
REM This script handles setup and training

setlocal enabledelayedexpansion

echo.
echo =====================================
echo  Crop Disease Predictor - Setup
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [2/5] Checking Kaggle API credentials...
if not exist "%USERPROFILE%\.kaggle\kaggle.json" (
    echo.
    echo WARNING: Kaggle API credentials not found!
    echo.
    echo To download the dataset, you need:
    echo 1. Go to https://www.kaggle.com/settings/account
    echo 2. Click "Create New API Token"
    echo 3. Place kaggle.json in %USERPROFILE%\.kaggle\
    echo.
    set /p continue="Continue without Kaggle credentials? (y/n) "
    if /i not "!continue!"=="y" (
        echo Setup cancelled.
        pause
        exit /b 1
    )
) else (
    echo ✓ Kaggle credentials found
)

echo.
echo [3/5] Training the model...
echo This may take 30-60 minutes depending on your hardware
echo.
python train_model.py
if errorlevel 1 (
    echo ERROR: Model training failed
    pause
    exit /b 1
)
echo ✓ Model trained successfully

echo.
echo [4/5] Starting Flask backend...
echo Backend will run on http://localhost:5000
echo (Open another terminal to start the frontend)
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
