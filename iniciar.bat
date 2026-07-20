@echo off
title Portal SSOMA - Minera Casma SAC
echo.
echo  ================================================
echo   Portal SSOMA - Compania Minera Casma SAC
echo  ================================================
echo.
echo  Iniciando servidor en http://localhost:8080
echo  Presione Ctrl+C para detener
echo.
cd /d "%~dp0"
python -m http.server 8080
pause