@echo off
title TWEAK LAB - 2027 FPS+ Store Server (InstaPay & Vodafone Cash 01020670418)
color 0B
cd /d "%~dp0"
echo ============================================================================
echo   TWEAK LAB - BEST OPTIMIZATION FOR 2027 FPS+ STORE (100 EGP)
echo   Payment Methods: InstaPay ^& Vodafone Cash (01020670418)
echo ============================================================================
echo.
echo   [*] Starting Store Server on http://localhost:3027 ...
echo   [*] Opening Customer Store and Seller Admin Dashboard (/admin)...
echo.
start "" "http://localhost:3027"
start "" "http://localhost:3027/admin"
node server.js
pause
