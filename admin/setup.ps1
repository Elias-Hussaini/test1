# LINGO Admin - Setup Script (PowerShell)
# Usage: cd admin; .\setup.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Write-Step($msg) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor DarkGray
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor DarkGray
}

function Write-OK($msg) { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Err($msg) { Write-Host "  [X]  $msg" -ForegroundColor Red }

# --- Check Node ---
Write-Step "Checking Node.js"
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-OK "Node.js: $nodeVersion"
    Write-OK "npm: v$npmVersion"
} catch {
    Write-Err "Node.js is not installed. Download from https://nodejs.org"
    exit 1
}

# --- Check backend is running ---
Write-Step "Checking backend (localhost:4000)"
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -TimeoutSec 3
    if ($health.data.status -eq "OK") {
        Write-OK "Backend is running"
    } else {
        Write-Err "Backend returned unexpected response"
        exit 1
    }
} catch {
    Write-Err "Backend is NOT running on localhost:4000"
    Write-Host ""
    Write-Host "  Start the backend first:" -ForegroundColor Yellow
    Write-Host "    cd ..\backend" -ForegroundColor Cyan
    Write-Host "    npm run dev" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# --- Create .env.local ---
Write-Step "Creating .env.local"
if (Test-Path ".env.local") {
    Write-Host "  .env.local already exists" -ForegroundColor DarkYellow
} else {
    Copy-Item .env.example .env.local
    Write-OK ".env.local created"
}

# --- Install ---
Write-Step "Installing packages (npm install)"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm install failed."
    exit 1
}
Write-OK "Packages installed."

# --- Done ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Start the admin panel:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then open in browser:" -ForegroundColor White
Write-Host "  http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login:" -ForegroundColor White
Write-Host "  admin@lingo.app / Lingo@Admin2026" -ForegroundColor Cyan
Write-Host ""
