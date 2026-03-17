# ============================================
# AgriGrow Database Deployment Script
# PowerShell Version for Windows
# ============================================

Write-Host "`n" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   AgriGrow Database Deployment Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "[*] Checking prerequisites..." -ForegroundColor Yellow

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Node.js found" -ForegroundColor Green

# Check .env file
$envPath = ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "[ERROR] .env file not found" -ForegroundColor Red
    Write-Host "Please create .env with Supabase credentials" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] .env file found" -ForegroundColor Green

# Load .env
$envContent = Get-Content $envPath
$env:VITE_SUPABASE_URL = ($envContent | Select-String 'VITE_SUPABASE_URL' | ForEach-Object {$_.Line.Split('=')[1].Trim('"')})
$env:VITE_SUPABASE_PROJECT_ID = ($envContent | Select-String 'VITE_SUPABASE_PROJECT_ID' | ForEach-Object {$_.Line.Split('=')[1].Trim('"')})

Write-Host "[OK] Supabase URL: $($env:VITE_SUPABASE_URL)" -ForegroundColor Green
Write-Host "[OK] Project ID: $($env:VITE_SUPABASE_PROJECT_ID)" -ForegroundColor Green

# Check migration files
Write-Host "`n[*] Migration files:" -ForegroundColor Cyan
$migrations = Get-ChildItem "database\migrations\*.sql" -ErrorAction SilentlyContinue

if ($migrations.Count -eq 0) {
    Write-Host "[ERROR] No migration files found" -ForegroundColor Red
    exit 1
}

$migrations | ForEach-Object {
    Write-Host "  [+] $($_.Name)" -ForegroundColor Green
}

# Display combined migration file info
Write-Host "`n[OK] Combined migration file created:" -ForegroundColor Cyan
$combinedFile = Get-Item "database\migrations\000_combined_migration.sql" -ErrorAction SilentlyContinue
if ($combinedFile) {
    Write-Host "  [+] $($combinedFile.Name) ($([math]::Round($combinedFile.Length / 1KB, 2)) KB)" -ForegroundColor Green
}

# Installation summary
Write-Host "`n" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "         DEPLOYMENT INSTRUCTIONS" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

Write-Host @"

[!] IMPORTANT: Manual SQL Execution Required

Your Supabase project uses an anonymous key, which does not allow direct
database administration. You must execute the SQL manually.

STEPS:
------
1. Open your browser and go to:
   https://app.supabase.com/projects/$($env:VITE_SUPABASE_PROJECT_ID)

2. Click "SQL Editor" in the left sidebar

3. Click "+ New Query"

4. Copy ALL content from this file:
   database/migrations/000_combined_migration.sql

5. Paste into the SQL Editor

6. Click the "Run" button (or press Ctrl+Enter)

7. Wait for success message

8. Check the "Table Editor" to verify all tables are created

ALTERNATIVE METHODS:
-------------------
* Follow: database/DEPLOYMENT_GUIDE.md for detailed instructions
* Use Supabase CLI: supabase db push
* Use pgAdmin or similar PostgreSQL client

VERIFICATION:
-------------
After deployment, run: npm run verify-db

"@ -ForegroundColor White

Write-Host "Open Supabase Dashboard? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Start-Process "https://app.supabase.com/projects/$($env:VITE_SUPABASE_PROJECT_ID)"
    Write-Host "[OK] Browser opening..." -ForegroundColor Green
}

Write-Host "`n[*] For more info, see: COMPLETE_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host "[*] Configuration: .env" -ForegroundColor Cyan
Write-Host "`nPress Enter to close..." -ForegroundColor Yellow
Read-Host
