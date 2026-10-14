# LINGO - Enable Proxy (PowerShell)
# Sets proxy for env vars, npm, and git.
# After running this, in the SAME PowerShell session run:
#   cd backend
#   .\setup.ps1
#
# Note: settings only apply to this PowerShell session.
# If you close PowerShell, run this again.

$proxy = "http://127.0.0.1:10808"

# --- 1. Environment Variables (for curl, node, axios, fetch) ---
$env:HTTP_PROXY  = $proxy
$env:HTTPS_PROXY = $proxy
$env:ALL_PROXY   = $proxy
$env:http_proxy  = $proxy
$env:https_proxy = $proxy
$env:all_proxy   = $proxy

# --- 2. npm config (CRITICAL - npm does NOT read env vars) ---
npm config set proxy $proxy
npm config set https-proxy $proxy

# --- 3. git config (for clone/pull/push) ---
git config --global http.proxy $proxy
git config --global https.proxy $proxy

# --- 4. Confirm ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Proxy enabled: $proxy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Applied to:" -ForegroundColor White
Write-Host "  * env vars: HTTP_PROXY, HTTPS_PROXY, ALL_PROXY" -ForegroundColor DarkGray
Write-Host "  * npm:      proxy, https-proxy" -ForegroundColor DarkGray
Write-Host "  * git:      http.proxy, https.proxy" -ForegroundColor DarkGray
Write-Host ""

# --- 5. Test connectivity ---
Write-Host "Testing npm registry..." -ForegroundColor Cyan
$npmPing = npm ping 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] npm registry is reachable" -ForegroundColor Green
} else {
    Write-Host "  [!]  npm ping failed (proxy might be down)" -ForegroundColor Yellow
    Write-Host "       Output: $npmPing" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Now you can run setup:" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  .\setup.ps1" -ForegroundColor Cyan
Write-Host ""
