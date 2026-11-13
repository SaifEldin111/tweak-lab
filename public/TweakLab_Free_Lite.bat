@echo off
title Tweak Lab - Free Lite Optimization (v1.0)
color 0A
net session >nul 2>&1
if %errorLevel% neq 0 (
color 0C
echo [!] ERROR: Right-click and select "Run as Administrator".
pause
exit
)
echo Cleaning System Temp & Cache...
del /s /f /q "%temp%*." >nul 2>&1
del /s /f /q "C:\Windows\Temp*." >nul 2>&1
ipconfig /flushdns >nul 2>&1
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
cls
color 0B
echo =========================================================
echo   LITE OPTIMIZATION DONE!
echo   Want full Registry tweaks & zero Input Delay?
echo   Get the Pro Pack (99 EGP): https://tweak-lab-a177.vercel.app
echo =========================================================
pause
exit
