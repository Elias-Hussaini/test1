# ═══════════════════════════════════════════
# LINGO — Disable Proxy (PowerShell)
# ═══════════════════════════════════════════
# این اسکریپت پروکسی رو از npm, git, و env vars پاک می‌کنه.
# ═══════════════════════════════════════════

# ─── ۱. پاک‌سازی env vars ─────────────────────────────────────────
$env:HTTP_PROXY  = $null
$env:HTTPS_PROXY = $null
$env:ALL_PROXY   = $null
$env:http_proxy  = $null
$env:https_proxy = $null
$env:all_proxy   = $null

# ─── ۲. پاک‌سازی npm config ───────────────────────────────────────
npm config delete proxy
npm config delete https-proxy

# ─── ۳. پاک‌سازی git config ───────────────────────────────────────
git config --global --unset http.proxy 2>$null
git config --global --unset https.proxy 2>$null

# ─── ۴. تأیید ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ✓ پروکسی غیرفعال شد" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
