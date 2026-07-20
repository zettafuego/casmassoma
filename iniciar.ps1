$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Yellow
Write-Host "   Portal SSOMA - Compania Minera Casma SAC" -ForegroundColor Yellow
Write-Host "  ================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Abriendo http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Presione Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:8080"
python -m http.server 8080