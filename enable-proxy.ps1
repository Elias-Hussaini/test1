# ═══════════════════════════════════════════
# LINGO — Proxy Setup (PowerShell)
# ═══════════════════════════════════════════
# این اسکریپت پروکسی رو برای npm, git, و env vars فعال می‌کنه.
# بعد از اجرای این اسکریپت، تو همون PowerShell بزن:
#   cd backend
#   .\setup.ps1
#
# توجه: این تنظیمات فقط برای همین PowerShell session فعالن.
# اگه PowerShell رو ببندی، باید دوباره این اسکریپت رو بزنی.
# ═══════════════════════════════════════════

$proxy = "http://127.0.0.1:10808"

# ─── ۱. Environment Variables (برای curl, node, axios, fetch, ...) ──
$env:HTTP_PROXY  = $proxy
$env:HTTPS_PROXY = $proxy
$env:ALL_PROXY   = $proxy
$env:http_proxy  = $proxy
$env:https_proxy = $proxy
$env:all_proxy   = $proxy

# ─── ۲. npm config (مهم‌ترین بخش!) ───────────────────────────────
# npm از env vars استفاده نمی‌کنه — باید خودش تنظیم بشه
npm config set proxy $proxy
npm config set https-proxy $proxy

# ─── ۳. git config (برای clone/pull/push) ─────────────────────────
git config --global http.proxy $proxy
git config --global https.proxy $proxy

# ─── ۴. نمایش تأیید ───────────────────────────────────────────────
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ پروکسی فعال شد: $proxy" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "تنظیمات اعمال‌شده:" -ForegroundColor White
Write-Host "  • env vars: HTTP_PROXY, HTTPS_PROXY, ALL_PROXY" -ForegroundColor DarkGray
Write-Host "  • npm:      proxy, https-proxy" -ForegroundColor DarkGray
Write-Host "  • git:      http.proxy, https.proxy" -ForegroundColor DarkGray
Write-Host ""

# ─── ۵. تست اتصال ─────────────────────────────────────────────────
Write-Host "تست اتصال به npm registry..." -ForegroundColor Cyan
$npmPing = npm ping 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ npm registry در دسترسه" -ForegroundColor Green
} else {
    Write-Host "  ⚠ npm ping ناموفق بود (ممکنه پروکسی قطع باشه)" -ForegroundColor Yellow
    Write-Host "    خروجی: $npmPing" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "حالا می‌تونی بری سراغ setup:" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  .\setup.ps1" -ForegroundColor Cyan
Write-Host ""
