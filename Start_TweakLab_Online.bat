@echo off
title TWEAK LAB - 2027 FPS+ Online Store & Admin Launcher
color 0B
cd /d "%~dp0"
echo ========================================================================
echo   TWEAK LAB - BEST OPTIMIZATION FOR 2027 FPS+ (ONLINE STORE LAUNCHER)
echo ========================================================================
echo.
echo [1/2] Starting Local Store Server on http://localhost:3027 ...
start "TweakLab Local Server" /min cmd /c "node server.js"
timeout /t 2 /nobreak >nul
echo [2/2] Opening Admin Dashboard (http://localhost:3027/admin) ...
start "" "http://localhost:3027/admin"
echo.
echo [3/3] Starting Public HTTPS Online Link (Cloudflare Tunnel)...
echo Copy the https://....trycloudflare.com link below for your YouTube description!
echo ========================================================================
cloudflared.exe tunnel --url http://localhost:3027
pause
