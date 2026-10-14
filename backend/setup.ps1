# LINGO Backend - Setup Script (PowerShell)
# This script automates:
#   1. npm install
#   2. Create .env with random JWT secrets
#   3. Generate Prisma Client
#   4. Create SQLite database
#   5. Seed with sample words
#
# Usage (run from backend folder):
#   .\setup.ps1

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Write-Step($msg) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor DarkGray
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor DarkGray
}

function Write-OK($msg) {
    Write-Host "  [OK] $msg" -ForegroundColor Green
}

function Write-Warn($msg) {
    Write-Host "  [!]  $msg" -ForegroundColor Yellow
}

function Write-Err($msg) {
    Write-Host "  [X]  $msg" -ForegroundColor Red
}

# --- 0. Check Node.js ---
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

# --- 0b. Check npm registry reachability ---
Write-Step "Checking npm registry"
$env:NPM_CONFIG_REGISTRY = $null
$npmPing = npm ping 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warn "npm registry is NOT reachable."
    Write-Host ""
    Write-Host "  If you have a VPN/proxy, run this first:" -ForegroundColor Yellow
    Write-Host "    cd .." -ForegroundColor Cyan
    Write-Host "    .\enable-proxy.ps1" -ForegroundColor Cyan
    Write-Host "    cd backend" -ForegroundColor Cyan
    Write-Host "    .\setup.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  If you don't have a VPN, try a mirror:" -ForegroundColor Yellow
    Write-Host "    npm config set registry https://registry.npmmirror.com" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}
Write-OK "npm registry is reachable."

# --- 1. Install dependencies ---
Write-Step "Installing packages (npm install)"
if (Test-Path "node_modules") {
    Write-Warn "node_modules already exists. To clean it, run:"
    Write-Host "      Remove-Item -Recurse -Force node_modules, package-lock.json" -ForegroundColor DarkYellow
    Write-Host "  Continuing with install..." -ForegroundColor Cyan
}
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm install failed."
    exit 1
}
Write-OK "Packages installed."

# --- 2. Create .env ---
Write-Step "Creating .env with random JWT secrets"

if (Test-Path ".env") {
    Write-Warn ".env already exists. Skipping."
    Write-Host "  To regenerate, delete it first:" -ForegroundColor DarkYellow
    Write-Host "      Remove-Item .env" -ForegroundColor DarkYellow
} else {
    # Generate 64-byte hex secrets
    $accessSecret = -join ((1..64) | ForEach-Object {
        '{0:x2}' -f (Get-Random -Maximum 256)
    })
    $refreshSecret = -join ((1..64) | ForEach-Object {
        '{0:x2}' -f (Get-Random -Maximum 256)
    })

    # Copy .env.example and replace placeholders
    Copy-Item .env.example .env
    (Get-Content .env) -replace 'CHANGE_ME_TO_A_RANDOM_64_BYTE_HEX_STRING', $accessSecret `
                       -replace 'CHANGE_ME_TO_ANOTHER_RANDOM_64_BYTE_HEX_STRING', $refreshSecret `
                       | Set-Content .env

    Write-OK ".env created."
    Write-Host "  JWT_ACCESS_SECRET:  $($accessSecret.Substring(0, 16))..." -ForegroundColor DarkGray
    Write-Host "  JWT_REFRESH_SECRET: $($refreshSecret.Substring(0, 16))..." -ForegroundColor DarkGray
}

# --- 3. Prisma Client ---
Write-Step "Generating Prisma Client"
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Err "Prisma generate failed."
    exit 1
}
Write-OK "Prisma Client generated."

# --- 4. Create database ---
Write-Step "Creating SQLite database"
npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) {
    Write-Err "Database creation failed."
    exit 1
}
Write-OK "Database created: dev.db"

# --- 5. Seed sample words ---
Write-Step "Seeding database with sample words"
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Seed failed (might already be done)."
} else {
    Write-OK "10 sample German words added."
}

# --- Done ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now start the server with:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server runs on http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "Test it in your browser:" -ForegroundColor White
Write-Host "  http://localhost:4000/api/health" -ForegroundColor Cyan
Write-Host ""
