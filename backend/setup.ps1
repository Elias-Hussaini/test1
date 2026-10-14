# ═══════════════════════════════════════════
# LINGO Backend — Setup Script (PowerShell)
# ═══════════════════════════════════════════
# این اسکریپت همه‌چیز رو از صفر راه‌اندازی می‌کنه:
#   1. نصب پکیج‌ها
#   2. ساخت .env با JWT secrets تصادفی
#   3. ساخت Prisma Client
#   4. ساخت دیتابیس SQLite
#   5. پر کردن دیتابیس با لغات اولیه
#
# استفاده:
#   PowerShell رو باز کن، به پوشه‌ی backend برو، بعد:
#   .\setup.ps1
# ═══════════════════════════════════════════

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Write-Step($msg) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
}

function Write-OK($msg) {
    Write-Host "  ✓ $msg" -ForegroundColor Green
}

function Write-Warn($msg) {
    Write-Host "  ⚠ $msg" -ForegroundColor Yellow
}

function Write-Err($msg) {
    Write-Host "  ✗ $msg" -ForegroundColor Red
}

# ─── بررسی Node.js ────────────────────────
Write-Step "بررسی Node.js"
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-OK "Node.js: $nodeVersion"
    Write-OK "npm: v$npmVersion"
} catch {
    Write-Err "Node.js نصب نیست. از https://nodejs.org دانلود و نصب کن."
    exit 1
}

# ─── بررسی اتصال به npm registry ─────────
Write-Step "بررسی اتصال به npm registry"
$env:NPM_CONFIG_REGISTRY = $null  # پاک‌سازی registry سفارشی اگه هست
$npmPing = npm ping 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warn "npm registry در دسترس نیست."
    Write-Host ""
    Write-Host "  اگه فیلترشکن داری، اول این رو بزن:" -ForegroundColor Yellow
    Write-Host "    cd .." -ForegroundColor Cyan
    Write-Host "    .\enable-proxy.ps1" -ForegroundColor Cyan
    Write-Host "    cd backend" -ForegroundColor Cyan
    Write-Host "    .\setup.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  اگه فیلترشکن نداری، این رو امتحان کن:" -ForegroundColor Yellow
    Write-Host "    npm config set registry https://registry.npmmirror.com" -ForegroundColor Cyan
    Write-Host "    (mirror چینی — معمولاً از ایران کار می‌کنه)" -ForegroundColor DarkGray
    Write-Host ""
    exit 1
}
Write-OK "npm registry در دسترسه."

# ─── ۱. نصب پکیج‌ها ───────────────────────
Write-Step "نصب پکیج‌ها (npm install)"
if (Test-Path "node_modules") {
    Write-Warn "node_modules از قبل وجود دارد. اگه می‌خوای پاک‌سازی کنی، اول این رو بزن:"
    Write-Host "      Remove-Item -Recurse -Force node_modules, package-lock.json" -ForegroundColor DarkYellow
    Write-Host "  ادامه با نصب..." -ForegroundColor Cyan
}
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "نصب پکیج‌ها ناموفق بود."
    exit 1
}
Write-OK "پکیج‌ها نصب شدند."

# ─── ۲. ساخت .env ────────────────────────
Write-Step "ساخت .env با JWT secrets تصادفی"

if (Test-Path ".env") {
    Write-Warn ".env از قبل وجود دارد. پرش نمی‌کنم."
    Write-Host "  اگه می‌خوای از نو ساخته بشه، اول این رو بزن:"
    Write-Host "      Remove-Item .env" -ForegroundColor DarkYellow
} else {
    # تولید JWT secrets (64 بایت hex)
    $accessSecret = -join ((1..64) | ForEach-Object {
        '{0:x2}' -f (Get-Random -Maximum 256)
    })
    $refreshSecret = -join ((1..64) | ForEach-Object {
        '{0:x2}' -f (Get-Random -Maximum 256)
    })

    # کپی از .env.example و جایگزینی
    Copy-Item .env.example .env
    (Get-Content .env) -replace 'CHANGE_ME_TO_A_RANDOM_64_BYTE_HEX_STRING', $accessSecret `
                       -replace 'CHANGE_ME_TO_ANOTHER_RANDOM_64_BYTE_HEX_STRING', $refreshSecret `
                       | Set-Content .env

    Write-OK ".env ساخته شد."
    Write-Host "  JWT_ACCESS_SECRET:  $($accessSecret.Substring(0, 16))..." -ForegroundColor DarkGray
    Write-Host "  JWT_REFRESH_SECRET: $($refreshSecret.Substring(0, 16))..." -ForegroundColor DarkGray
}

# ─── ۳. Prisma Client ────────────────────
Write-Step "تولید Prisma Client"
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Err "Prisma generate ناموفق بود."
    exit 1
}
Write-OK "Prisma Client ساخته شد."

# ─── ۴. ساخت دیتابیس ─────────────────────
Write-Step "ساخت دیتابیس SQLite"
npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) {
    Write-Err "ساخت دیتابیس ناموفق بود."
    exit 1
}
Write-OK "دیتابیس ساخته شد: dev.db"

# ─── ۵. Seed لغات اولیه ─────────────────
Write-Step "پر کردن دیتابیس با لغات اولیه"
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Seed ناموفق بود (ممکنه قبلاً انجام شده باشه)."
} else {
    Write-OK "۱۰ لغت آلمانی اضافه شد."
}

# ─── پایان ────────────────────────────────
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🎉 راه‌اندازی کامل شد!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "حالا می‌تونی سرور رو اجرا کنی:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "سرور روی http://localhost:4000 بالا میاد." -ForegroundColor White
Write-Host ""
Write-Host "برای تست، توی مرورگر بزن:" -ForegroundColor White
Write-Host "  http://localhost:4000/api/health" -ForegroundColor Cyan
Write-Host ""
