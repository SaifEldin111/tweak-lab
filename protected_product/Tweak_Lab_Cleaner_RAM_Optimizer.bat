@echo off
:: Auto-elevate to Administrator so Windows Temp, Prefetch, and Network Reset work 100%
net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

title Tweak Lab - Ultimate Windows Cleaner ^& RAM Optimizer
color 0A
cls

echo ===================================================
echo             TWEAK LAB - SYSTEM OPTIMIZER
echo ===================================================
echo.

echo [*] Cleaning User Temp Files...
del /s /f /q "%temp%\*.*" >nul 2>&1
rd /s /q "%temp%" >nul 2>&1
md "%temp%" >nul 2>&1

echo [*] Cleaning Windows Temp Files...
del /s /f /q "C:\Windows\Temp\*.*" >nul 2>&1

echo [*] Cleaning Prefetch Data (Faster Boot)...
del /s /f /q "C:\Windows\Prefetch\*.*" >nul 2>&1

echo [*] Flushing DNS Cache (Lower Latency)...
ipconfig /flushdns >nul 2>&1

echo [*] Resetting Network Interfaces...
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1

echo [*] Forcing Windows to Free Up Idle RAM...
%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks

echo.
echo ===================================================
echo    Optimization Complete! Enjoy Higher FPS in Game.
echo ===================================================
echo.
pause
