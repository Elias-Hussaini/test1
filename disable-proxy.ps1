# LINGO - Disable Proxy (PowerShell)
# Removes proxy from env vars, npm, and git.

# --- 1. Clear env vars ---
$env:HTTP_PROXY  = $null
$env:HTTPS_PROXY = $null
$env:ALL_PROXY   = $null
$env:http_proxy  = $null
$env:https_proxy = $null
$env:all_proxy   = $null

# --- 2. Clear npm config ---
npm config delete proxy
npm config delete https-proxy

# --- 3. Clear git config ---
git config --global --unset http.proxy 2>$null
git config --global --unset https.proxy 2>$null

# --- 4. Confirm ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Proxy disabled" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
