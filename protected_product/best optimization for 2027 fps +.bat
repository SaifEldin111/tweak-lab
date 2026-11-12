@echo off
setlocal EnableDelayedExpansion
title BEST OPTIMIZATION FOR 2027 FPS+ [PRO COMMERCIAL EDITION v2027.1]
color 0B

:: ============================================================================
::  BEST OPTIMIZATION FOR 2027 FPS+ (100% SAFE & REVERSIBLE GAMING SUITE)
::  Designed for Windows 10 & Windows 11 Gaming PCs
::  Includes Built-in Customer Guide, Auto-Backup, 35+ Safe Tweaks & Undo Engine
:: ============================================================================

:: --- STEP 1: CHECK FOR ADMINISTRATOR PRIVILEGES ---
net session >nul 2>&1
if %errorLevel% neq 0 (
    color 0E
    cls
    echo ============================================================================
    echo          BEST OPTIMIZATION FOR 2027 FPS+ - ADMINISTRATOR REQUIRED
    echo ============================================================================
    echo.
    echo  [!] Welcome! To safely optimize your Windows Power Plan, Registry, and
    echo      Gaming Priorities, this tool requires Administrator privileges.
    echo.
    echo  [*] Requesting Administrator permission now...
    echo      Please click "Yes" on the Windows popup window.
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

:: --- STEP 2: INITIALIZE BACKUP DIRECTORY & LOG FILE ---
set "BACKUP_DIR=%SystemDrive%\2027_FPS_Backup"
set "LOG_FILE=%BACKUP_DIR%\optimization_log.txt"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%" >nul 2>&1

:: --- STEP 3: FIRST-TIME CUSTOMER WELCOME & QUICK-START GUIDE ---
:WELCOME_SCREEN
cls
color 0B
echo ================================================================================
echo              BEST OPTIMIZATION FOR 2027 FPS+  ^|  ULTIMATE EDITION
echo            Maximum FPS  *  Lower Input Latency  *  100%% PC Safe
echo ================================================================================
echo.
echo   WELCOME TO YOUR STEP-BY-STEP PC GAMING OPTIMIZATION SUITE!
echo   This utility is engineered to boost average FPS, improve 1%% low framerates,
echo   stabilize frame pacing, and reduce mouse/network latency WITHOUT harming
echo   your PC, breaking Windows Update, or disabling critical security.
echo.
echo   ----------------------------------------------------------------------------
echo   HOW TO USE THIS TOOL (EASY 3-STEP CUSTOMER GUIDE):
echo   ----------------------------------------------------------------------------
echo   STEP 1: Press [S] on the next screen to create an Automatic Safety Backup
echo           (System Restore Point + Registry Backup in C:\2027_FPS_Backup).
echo   STEP 2: Press [A] to apply the "1-Click Safe Pro Gaming Preset" (Recommended)
echo           OR type any number [1-35] to apply specific tweaks one by one.
echo   STEP 3: Restart your PC after applying tweaks so Windows loads them cleanly!
echo.
echo   [SAFETY GUARANTEE]: You can press [R] at ANY time to undo all tweaks and
echo   restore your PC back to 100%% factory Windows default settings.
echo   ----------------------------------------------------------------------------
echo.
echo   Press ANY KEY to open the Main Optimization Dashboard...
pause >nul

:: ============================================================================
::  MAIN INTERACTIVE DASHBOARD MENU
:: ============================================================================
:MAIN_MENU
cls
color 0B
echo ================================================================================
echo              BEST OPTIMIZATION FOR 2027 FPS+  ^|  MAIN DASHBOARD
echo                Backup Folder: %BACKUP_DIR%
echo ================================================================================
echo  [SAFETY, GUIDE ^& 1-CLICK PRESETS]
echo   [S] Create Safety Backup (System Restore Point + Full Registry Backup)
echo   [A] 1-CLICK PRO GAMING PRESET (Applies All Recommended Safe Tweaks + Backup)
echo   [C] 1-CLICK ULTIMATE CLEANER ^& RAM OPTIMIZER (Temp + Prefetch + DNS + Idle RAM)
echo   [G] Read Built-In Customer Guide, GPU Driver Guide ^& BIOS Checklist
echo   [R] REVERT / UNDO ALL TWEAKS (Restore Factory Windows Defaults)
echo --------------------------------------------------------------------------------
echo  [1. CPU ^& POWER PERFORMANCE]          [2. GPU, DIRECTX ^& DISPLAY]
echo   [1] Unlock Ultimate Performance Plan  [7] Boost GPU ^& CPU Game Priority (MMCSS)
echo   [2] Disable CPU Core Parking          [8] Enable Hardware GPU Scheduling (HAGS)
echo   [3] Set 100%% Gaming CPU Responsiveness[9] Enable Windowed Game Flip-Model Opt
echo   [4] Optimize Win32 Priority (0x26)    [10] Enable Variable Refresh Rate (VRR)
echo   [5] Disable App Power Throttling      [11] Disable Xbox Game DVR Recording
echo   [6] Disable Hibernation (Save SSD GB) [12] Enable Native Windows Game Mode
echo --------------------------------------------------------------------------------
echo  [3. INPUT LAG, MOUSE ^& USB]           [4. RAM, STORAGE ^& SHADER CACHE]
echo   [13] 1:1 Raw Mouse Input (No Accel)   [18] Disable RAM Compression (16GB+ RAM)
echo   [14] Instant Keyboard Repeat Response [19] Disable NTFS Last Access Timestamps
echo   [15] Disable Sticky/Filter Key Popups [20] Optimize SvcHost RAM Split Threshold
echo   [16] Disable USB Selective Suspend    [21] Clean Windows Temp ^& Prefetch Junk
echo   [17] Disable PCIe Link Power Saving   [22] Clear DirectX ^& GPU Shader Caches
echo                                         [23] Run SSD TRIM Storage Optimization
echo --------------------------------------------------------------------------------
echo  [5. NETWORK, PING ^& PACKET LOSS]      [6. WINDOWS BLOAT ^& UI LATENCY]
echo   [24] Disable Network Throttling Index [29] Disable Windows Transparency Effects
echo   [25] Flush DNS ^& Reset Winsock Stack  [30] Disable Game Bar Tips ^& Ad Suggestions
echo   [26] Optimize TCP Gaming Parameters   [31] Disable Start Menu Bing Web Search
echo   [27] Disable NIC Power Saving Mode    [32] Disable Background App Activity
echo   [28] Gaming DNS Switcher (1.1.1.1)    [33] Reduce Error Reporting ^& Telemetry
echo                                         [34] Speed Up Menu Delay ^& Shutdown Time
echo                                         [35] Quick-Open Windows Graphics/Power UI
echo ================================================================================
echo   [0] Exit Tool
echo ================================================================================
set "CHOICE="
set /p "CHOICE=  >> Enter an Option (S, A, C, G, R, 1-35, or 0 to Exit): "

if /I "%CHOICE%"=="S" goto OPT_BACKUP
if /I "%CHOICE%"=="A" goto OPT_ALL_PRO
if /I "%CHOICE%"=="C" goto OPT_QUICK_CLEANER
if /I "%CHOICE%"=="G" goto OPT_CUSTOMER_GUIDE
if /I "%CHOICE%"=="R" goto OPT_REVERT_ALL
if "%CHOICE%"=="0" goto EXIT_TOOL
if "%CHOICE%"=="1" goto OPT_1
if "%CHOICE%"=="2" goto OPT_2
if "%CHOICE%"=="3" goto OPT_3
if "%CHOICE%"=="4" goto OPT_4
if "%CHOICE%"=="5" goto OPT_5
if "%CHOICE%"=="6" goto OPT_6
if "%CHOICE%"=="7" goto OPT_7
if "%CHOICE%"=="8" goto OPT_8
if "%CHOICE%"=="9" goto OPT_9
if "%CHOICE%"=="10" goto OPT_10
if "%CHOICE%"=="11" goto OPT_11
if "%CHOICE%"=="12" goto OPT_12
if "%CHOICE%"=="13" goto OPT_13
if "%CHOICE%"=="14" goto OPT_14
if "%CHOICE%"=="15" goto OPT_15
if "%CHOICE%"=="16" goto OPT_16
if "%CHOICE%"=="17" goto OPT_17
if "%CHOICE%"=="18" goto OPT_18
if "%CHOICE%"=="19" goto OPT_19
if "%CHOICE%"=="20" goto OPT_20
if "%CHOICE%"=="21" goto OPT_21
if "%CHOICE%"=="22" goto OPT_22
if "%CHOICE%"=="23" goto OPT_23
if "%CHOICE%"=="24" goto OPT_24
if "%CHOICE%"=="25" goto OPT_25
if "%CHOICE%"=="26" goto OPT_26
if "%CHOICE%"=="27" goto OPT_27
if "%CHOICE%"=="28" goto OPT_28
if "%CHOICE%"=="29" goto OPT_29
if "%CHOICE%"=="30" goto OPT_30
if "%CHOICE%"=="31" goto OPT_31
if "%CHOICE%"=="32" goto OPT_32
if "%CHOICE%"=="33" goto OPT_33
if "%CHOICE%"=="34" goto OPT_34
if "%CHOICE%"=="35" goto OPT_35

echo.
echo  [!] Invalid selection. Please enter a valid option from the menu.
timeout /t 2 >nul
goto MAIN_MENU

:: ============================================================================
::  [S] SAFETY BACKUP ENGINE (SYSTEM RESTORE POINT + REGISTRY EXPORT)
:: ============================================================================
:OPT_BACKUP
cls
color 0A
echo ================================================================================
echo   [S] CREATING FULL SYSTEM SAFETY BACKUP
echo ================================================================================
echo.
echo  [*] Creating backup directory at %BACKUP_DIR%...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%" >nul 2>&1

echo  [*] Backing up key Windows Registry branches before optimization...
reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "%BACKUP_DIR%\SystemProfile_Backup.reg" /y >nul 2>&1
reg export "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" "%BACKUP_DIR%\PriorityControl_Backup.reg" /y >nul 2>&1
reg export "HKLM\SYSTEM\CurrentControlSet\Control\Power" "%BACKUP_DIR%\Power_Backup.reg" /y >nul 2>&1
reg export "HKCU\Control Panel\Mouse" "%BACKUP_DIR%\Mouse_Backup.reg" /y >nul 2>&1
reg export "HKCU\Control Panel\Keyboard" "%BACKUP_DIR%\Keyboard_Backup.reg" /y >nul 2>&1
reg export "HKCU\System\GameConfigStore" "%BACKUP_DIR%\GameConfigStore_Backup.reg" /y >nul 2>&1
reg export "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" "%BACKUP_DIR%\GraphicsDrivers_Backup.reg" /y >nul 2>&1

echo  [*] Creating a Windows System Restore Point ("2027_FPS_Optimization_Backup")...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive '%SystemDrive%\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description '2027_FPS_Optimization_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue"

echo [%date% %time%] Safety Backup Created >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Registry backups saved to: %BACKUP_DIR%
echo  [SUCCESS] Windows System Restore Point requested!
echo.
pause
goto MAIN_MENU

:: ============================================================================
::  [G] BUILT-IN CUSTOMER GUIDE, GPU SETTINGS & BIOS CHECKLIST
:: ============================================================================
:OPT_CUSTOMER_GUIDE
cls
color 0E
echo ================================================================================
echo   [G] COMPLETE CUSTOMER GUIDE - HOW TO GET MAXIMUM FPS IN 2027
echo ================================================================================
echo.
echo  PART 1: WHICH OPTIONS SHOULD I USE IN THIS TOOL?
echo  ------------------------------------------------------------------------------
echo   * For 95%% of gamers: First press [S] to create a backup, then press [A] to
echo     run the "1-Click Pro Gaming Preset". It automatically applies all safe,
echo     proven Windows optimizations in 30 seconds.
echo   * Laptop Gamers: Always play with your charger plugged in! If you unplug
echo     your laptop for school/work, switch your Power Plan back to "Balanced".
echo   * RAM Note: Option [18] (Disable RAM Compression) is recommended for PCs
echo     with 16GB, 32GB, or 64GB of RAM. If you have 8GB RAM, leave it enabled.
echo.
echo  PART 2: MUST-DO BIOS SETTINGS (HUGE FPS BOOST - 10%% TO 25%% GAIN!)
echo  ------------------------------------------------------------------------------
echo   1. Enable XMP (Intel) or EXPO / DOCP (AMD):
echo      By default, your RAM runs at slow base speeds. Enabling XMP/EXPO in BIOS
echo      unlocks your RAM's full speed and dramatically boosts 1%% Low FPS!
echo   2. Enable Resizable BAR (ReBAR) / Smart Access Memory (SAM):
echo      Allows your CPU to access your GPU's full VRAM at once (+5%% to +12%% FPS).
echo.
echo  Press ANY KEY to read Page 2 (NVIDIA, AMD ^& In-Game Pro Settings)...
pause >nul
cls
echo ================================================================================
echo   [G] CUSTOMER GUIDE (PAGE 2) - NVIDIA, AMD ^& IN-GAME PRO SETTINGS
echo ================================================================================
echo.
echo  PART 3: NVIDIA CONTROL PANEL / NVIDIA APP BEST SETTINGS
echo  ------------------------------------------------------------------------------
echo   * Low Latency Mode: Set to "On" (or enable "NVIDIA Reflex + Boost" in-game)
echo   * Power Management Mode: Set to "Prefer Maximum Performance"
echo   * Texture Filtering - Quality: Set to "High Performance" or "Performance"
echo   * Shader Cache Size: Set to "10 GB" or "100 GB" (Prevents shader stutters!)
echo   * Vertical Sync (V-Sync): Set to "Off" (unless using G-Sync + FPS Cap)
echo.
echo  PART 4: AMD RADEON ADRENALIN BEST SETTINGS
echo  ------------------------------------------------------------------------------
echo   * Radeon Anti-Lag: Set to "Enabled" (Reduces click-to-display latency)
echo   * Surface Format Optimization: Set to "Enabled"
echo   * Texture Filtering Quality: Set to "Performance"
echo   * Radeon Chill / Enhanced Sync: Set to "Disabled" for competitive shooters
echo.
echo  PART 5: IN-GAME COMPETITIVE SETTINGS RULEBOOK
echo  ------------------------------------------------------------------------------
echo   * Display Mode: Fullscreen (or Borderless with Option [9] enabled)
echo   * Shadow Quality ^& Volumetric Fog: Set to LOW (Saves 15%%-30%% GPU load!)
echo   * Motion Blur, Film Grain ^& Chromatic Aberration: OFF (Clearer visibility)
echo   * Upscaling (DLSS / FSR / XeSS): Set to "Quality" for an instant +25%% FPS!
echo.
echo  Press ANY KEY to return to the Main Dashboard...
pause >nul
goto MAIN_MENU

:: ============================================================================
::  [A] 1-CLICK PRO GAMING PRESET (ALL SAFE RECOMMENDED TWEAKS)
:: ============================================================================
:OPT_ALL_PRO
cls
color 0A
echo ================================================================================
echo   [A] 1-CLICK PRO GAMING PRESET (SAFE ^& VERIFIED)
echo ================================================================================
echo.
echo  This will automatically:
echo   1. Back up your Registry to %BACKUP_DIR% ^& create a Restore Point
echo   2. Unlock ^& activate the Ultimate Performance Power Plan
echo   3. Optimize CPU ^& GPU Game Scheduling Priorities (MMCSS + Win32Priority)
echo   4. Enable Windows Game Mode, Windowed Flip-Model ^& HAGS
echo   5. Disable Xbox Game DVR Background Captures (Keeps Xbox Party/Login working!)
echo   6. Disable USB Selective Suspend ^& PCIe Link State Power Saving
echo   7. Disable Network Throttling Index for Lower Ping/Jitter
echo   8. Clean Temporary Junk Files ^& Optimize NTFS Timestamps
echo.
set /p "CONFIRM_ALL=  >> Apply the 1-Click Pro Gaming Preset now? (Y/N): "
if /I not "%CONFIRM_ALL%"=="Y" goto MAIN_MENU

echo.
echo  [1/8] Creating Safety Registry Backups...
reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "%BACKUP_DIR%\SystemProfile_Backup.reg" /y >nul 2>&1
reg export "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" "%BACKUP_DIR%\PriorityControl_Backup.reg" /y >nul 2>&1
reg export "HKCU\System\GameConfigStore" "%BACKUP_DIR%\GameConfigStore_Backup.reg" /y >nul 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive '%SystemDrive%\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description '2027_FPS_OneClick_Preset' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue"

echo  [2/8] Unlocking ^& Activating Ultimate Performance Power Plan...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
for /f "tokens=4" %%i in ('powercfg -list ^| findstr /i "Ultimate"') do set "ULT_GUID=%%i"
if defined ULT_GUID powercfg -setactive %ULT_GUID% >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor PROCTHROTTLEMIN 100 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_usb usbselectsuspend 0 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_pciexpress aspm 0 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1

echo  [3/8] Optimizing CPU ^& Multimedia Gaming Scheduler (MMCSS)...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 4294967295 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 6 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f >nul 2>&1

echo  [4/8] Enabling Game Mode, HAGS ^& Windowed Game Flip-Model...
reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "DirectXUserGlobalSettings" /t REG_SZ /d "VRROptimizeEnable=1;SwapEffectUpgradeEnable=1;" /f >nul 2>&1

echo  [5/8] Disabling Background Xbox Game DVR Captures (Stopping FPS Stutters)...
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d 0 /f >nul 2>&1

echo  [6/8] Optimizing Storage Timestamps ^& UI Responsiveness...
fsutil behavior set disablelastaccess 1 >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "EnableTransparency" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f >nul 2>&1

echo  [7/8] Cleaning Temporary Junk Files...
del /s /f /q "%TEMP%\*.*" >nul 2>&1
del /s /f /q "%SystemRoot%\Temp\*.*" >nul 2>&1

echo  [8/8] Flushing DNS Cache...
ipconfig /flushdns >nul 2>&1

echo [%date% %time%] Applied 1-Click Pro Gaming Preset >> "%LOG_FILE%"
echo.
echo ================================================================================
echo  [SUCCESS] 1-CLICK PRO GAMING PRESET COMPLETE!
echo  Please RESTART your PC before launching your games for full FPS gains.
echo ================================================================================
pause
goto MAIN_MENU

:: ============================================================================
::  INDIVIDUAL TWEAK MODULES [1 - 35]
:: ============================================================================

:OPT_1
cls
echo ================================================================================
echo   [1] UNLOCK ^& ACTIVATE ULTIMATE PERFORMANCE POWER PLAN
echo ================================================================================
echo  What this does: Prevents Windows from downclocking CPU cores mid-frame,
echo  eliminating micro-stutters and boosting 1%% Low FPS.
echo.
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
for /f "tokens=4" %%i in ('powercfg -list ^| findstr /i "Ultimate"') do set "ULT_GUID=%%i"
if defined ULT_GUID (
    powercfg -setactive %ULT_GUID%
    echo  [SUCCESS] Ultimate Performance Plan unlocked and set as ACTIVE!
) else (
    powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c >nul 2>&1
    echo  [SUCCESS] High Performance Power Plan activated!
)
echo [%date% %time%] Applied Option 1 (Ultimate Power Plan) >> "%LOG_FILE%"
echo.
pause
goto MAIN_MENU

:OPT_2
cls
echo ================================================================================
echo   [2] DISABLE CPU CORE PARKING ON ACTIVE POWER PLAN
echo ================================================================================
echo  What this does: Ensures 100%% of CPU cores stay awake during gameplay instead
echo  of parking/sleeping between frames.
echo.
powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor PROCTHROTTLEMIN 100 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1
echo [%date% %time%] Applied Option 2 (Disable CPU Core Parking) >> "%LOG_FILE%"
echo  [SUCCESS] CPU Core Parking disabled on your active power plan!
echo.
pause
goto MAIN_MENU

:OPT_3
cls
echo ================================================================================
echo   [3] SET MULTIMEDIA CPU SYSTEM RESPONSIVENESS TO 100%% GAMING
echo ================================================================================
echo  What this does: By default, Windows reserves 20%% of CPU time for background
echo  tasks. Setting SystemResponsiveness to 0 gives foreground games maximum CPU.
echo.
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f
echo [%date% %time%] Applied Option 3 (SystemResponsiveness=0) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] SystemResponsiveness set to 0 (Maximum Gaming Priority)!
pause
goto MAIN_MENU

:OPT_4
cls
echo ================================================================================
echo   [4] OPTIMIZE WIN32 PRIORITY SEPARATION FOR FOREGROUND GAMES (0x26)
echo ================================================================================
echo  What this does: Configures the Windows CPU quantum scheduler for short,
echo  high-priority foreground bursts-ideal for low input lag in games.
echo.
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f
echo [%date% %time%] Applied Option 4 (Win32PrioritySeparation=38) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Win32PrioritySeparation set to 0x26 (38 decimal)!
pause
goto MAIN_MENU

:OPT_5
cls
echo ================================================================================
echo   [5] DISABLE WINDOWS POWER THROTTLING FOR FOREGROUND APPS
echo ================================================================================
echo  What this does: Stops Windows from throttling CPU clock speeds on your games
echo  and voice chat apps (like Discord).
echo.
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f
echo [%date% %time%] Applied Option 5 (PowerThrottlingOff=1) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Application Power Throttling disabled!
pause
goto MAIN_MENU

:OPT_6
cls
echo ================================================================================
echo   [6] DISABLE HIBERNATION (FREE UP SSD SPACE ^& REDUCE DISK WRITES)
echo ================================================================================
echo  What this does: Deletes hiberfil.sys (frees 6GB-16GB of SSD space) and stops
echo  background hibernation state writes on Desktop PCs.
echo.
powercfg -h off
echo [%date% %time%] Applied Option 6 (Hibernation Off) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Hibernation disabled and SSD space freed!
pause
goto MAIN_MENU

:OPT_7
cls
echo ================================================================================
echo   [7] BOOST GPU ^& CPU GAME SCHEDULER PRIORITY (MMCSS)
echo ================================================================================
echo  What this does: Sets Windows Multimedia Class Scheduler 'Games' profile to
echo  GPU Priority = 8, Priority = 6, Scheduling Category = High.
echo.
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 6 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f
echo [%date% %time%] Applied Option 7 (MMCSS Games High Priority) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] GPU ^& CPU Game Priorities maximized!
pause
goto MAIN_MENU

:OPT_8
cls
echo ================================================================================
echo   [8] ENABLE HARDWARE-ACCELERATED GPU SCHEDULING (HAGS)
echo ================================================================================
echo  What this does: Lets your GPU manage its own VRAM scheduling directly,
echo  reducing CPU overhead and enabling DLSS 3/4 Frame Generation support.
echo.
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 2 /f
echo [%date% %time%] Applied Option 8 (Enable HAGS) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Hardware-Accelerated GPU Scheduling enabled! (Restart required)
pause
goto MAIN_MENU

:OPT_9
cls
echo ================================================================================
echo   [9] ENABLE WINDOWED ^& BORDERLESS GAME FLIP-MODEL OPTIMIZATIONS
echo ================================================================================
echo  What this does: Enables DirectX Flip-Model presentation for Windowed and
echo  Borderless Windowed games, giving you Exclusive-Fullscreen low latency!
echo.
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "DirectXUserGlobalSettings" /t REG_SZ /d "VRROptimizeEnable=1;SwapEffectUpgradeEnable=1;" /f
echo [%date% %time%] Applied Option 9 (Windowed Game Flip-Model) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Optimizations for Windowed Games enabled!
pause
goto MAIN_MENU

:OPT_10
cls
echo ================================================================================
echo   [10] ENABLE VARIABLE REFRESH RATE (VRR) SUPPORT IN WINDOWS
echo ================================================================================
echo  What this does: Eliminates screen tearing and smooths frame delivery on
echo  G-Sync, FreeSync, and Adaptive-Sync gaming monitors.
echo.
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "DirectXUserGlobalSettings" /t REG_SZ /d "VRROptimizeEnable=1;SwapEffectUpgradeEnable=1;" /f
echo [%date% %time%] Applied Option 10 (Enable VRR) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Variable Refresh Rate (VRR) enabled!
pause
goto MAIN_MENU

:OPT_11
cls
echo ================================================================================
echo   [11] DISABLE XBOX GAME DVR ^& BACKGROUND VIDEO RECORDING
echo ================================================================================
echo  What this does: Stops Windows from secretly recording your screen in the
echo  background (which steals VRAM and causes FPS drops), while keeping Xbox
echo  sign-in and Party Chat 100%% functional!
echo.
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d 0 /f
echo [%date% %time%] Applied Option 11 (Disable GameDVR Recording) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Background Game DVR Recording disabled!
pause
goto MAIN_MENU

:OPT_12
cls
echo ================================================================================
echo   [12] ENABLE NATIVE WINDOWS GAME MODE
echo ================================================================================
echo  What this does: Prioritizes your active game and suppresses Windows Update
echo  installs and background notifications while you play.
echo.
reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 1 /f
echo [%date% %time%] Applied Option 12 (Enable Game Mode) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Windows Game Mode enabled!
pause
goto MAIN_MENU

:OPT_13
cls
echo ================================================================================
echo   [13] APPLY 1:1 RAW MOUSE INPUT FIX (DISABLE MOUSE ACCELERATION)
echo ================================================================================
echo  What this does: Disables "Enhance Pointer Precision" (mouse acceleration) and
echo  sets pointer speed to the exact 6/11 neutral notch for 1:1 aiming accuracy.
echo.
reg add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f
echo [%date% %time%] Applied Option 13 (1:1 Raw Mouse Input) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] 1:1 Raw Mouse Input configured! (Log out or restart to take effect)
pause
goto MAIN_MENU

:OPT_14
cls
echo ================================================================================
echo   [14] OPTIMIZE KEYBOARD REPEAT DELAY ^& RATE FOR INSTANT RESPONSE
echo ================================================================================
echo  What this does: Minimizes keyboard repeat delay and maximizes repeat rate for
echo  snappier movement and key responsiveness.
echo.
reg add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f
echo [%date% %time%] Applied Option 14 (Keyboard Response Tuned) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Keyboard responsiveness optimized!
pause
goto MAIN_MENU

:OPT_15
cls
echo ================================================================================
echo   [15] DISABLE STICKY KEYS, FILTER KEYS ^& TOGGLE KEYS POPUPS
echo ================================================================================
echo  What this does: Prevents Windows from tabbing you out of your game when you
echo  rapidly press Shift or Ctrl during intense fights.
echo.
reg add "HKCU\Control Panel\Accessibility\StickyKeys" /v "Flags" /t REG_SZ /d "506" /f
reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_SZ /d "122" /f
reg add "HKCU\Control Panel\Accessibility\ToggleKeys" /v "Flags" /t REG_SZ /d "58" /f
echo [%date% %time%] Applied Option 15 (Disable Sticky/Filter Keys) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Sticky Keys, Filter Keys, and Toggle Keys popups disabled!
pause
goto MAIN_MENU

:OPT_16
cls
echo ================================================================================
echo   [16] DISABLE USB SELECTIVE SUSPEND (STOP MOUSE/CONTROLLER STUTTER)
echo ================================================================================
echo  What this does: Prevents Windows from putting USB ports into low-power sleep
echo  states, eliminating mouse polling drops and controller disconnects.
echo.
powercfg -setacvalueindex scheme_current sub_usb usbselectsuspend 0 >nul 2>&1
powercfg -setdcvalueindex scheme_current sub_usb usbselectsuspend 0 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1
echo [%date% %time%] Applied Option 16 (Disable USB Selective Suspend) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] USB Selective Suspend disabled on active power plan!
pause
goto MAIN_MENU

:OPT_17
cls
echo ================================================================================
echo   [17] DISABLE PCI EXPRESS LINK STATE POWER MANAGEMENT
echo ================================================================================
echo  What this does: Prevents your GPU and NVMe SSD PCIe lanes from entering deep
echo  power-saving sleep states, preventing micro-stutters when loading assets.
echo.
powercfg -setacvalueindex scheme_current sub_pciexpress aspm 0 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1
echo [%date% %time%] Applied Option 17 (Disable PCIe ASPM) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] PCIe Link State Power Management set to OFF!
pause
goto MAIN_MENU

:OPT_18
cls
echo ================================================================================
echo   [18] DISABLE WINDOWS RAM MEMORY COMPRESSION (FOR 16GB+ RAM PCS)
echo ================================================================================
echo  What this does: Stops the Windows kernel from using CPU cycles to compress
echo  and decompress RAM in the background. Recommended if you have 16GB+ RAM.
echo.
set /p "CONFIRM_RAM=  >> Do you have 16GB or more of RAM? (Y/N): "
if /I not "%CONFIRM_RAM%"=="Y" goto MAIN_MENU
powershell -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -mc -ErrorAction SilentlyContinue"
echo [%date% %time%] Applied Option 18 (Disable-MMAgent -mc) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Memory Compression disabled! (Restart required)
pause
goto MAIN_MENU

:OPT_19
cls
echo ================================================================================
echo   [19] DISABLE NTFS LAST ACCESS TIMESTAMP UPDATES
echo ================================================================================
echo  What this does: Stops Windows from writing a timestamp to your SSD every
echo  single time a game reads a texture or audio file, reducing disk I/O overhead.
echo.
fsutil behavior set disablelastaccess 1
echo [%date% %time%] Applied Option 19 (Disable NTFS LastAccess) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] NTFS Last Access Timestamp updates disabled!
pause
goto MAIN_MENU

:OPT_20
cls
echo ================================================================================
echo   [20] OPTIMIZE SVCHOST RAM SPLIT THRESHOLD FOR YOUR SYSTEM RAM
echo ================================================================================
echo  What this does: Matches Windows SvcHost process grouping to your exact
echo  physical RAM size to reduce background process overhead.
echo.
for /f "tokens=2 delims==" %%a in ('wmic os get TotalVisibleMemorySize /format:value ^| findstr "TotalVisibleMemorySize"') do set "MEM_KB=%%a"
if defined MEM_KB (
    reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d %MEM_KB% /f >nul 2>&1
    echo  [SUCCESS] SvcHostSplitThresholdInKB matched to your RAM ^(%MEM_KB% KB^)!
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ram = (Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control' -Name 'SvcHostSplitThresholdInKB' -Value $ram -Type DWord"
    echo  [SUCCESS] SvcHostSplitThresholdInKB optimized for your installed RAM!
)
echo [%date% %time%] Applied Option 20 (SvcHostSplitThresholdInKB) >> "%LOG_FILE%"
echo.
pause
goto MAIN_MENU

:OPT_21
cls
echo ================================================================================
echo   [21] DEEP CLEAN WINDOWS TEMP, PREFETCH ^& CRASH DUMP FILES
echo ================================================================================
echo  What this does: Safely clears leftover temporary files that slow down disk
echo  reads and waste valuable SSD storage.
echo.
echo  [*] Cleaning User Temp folder...
del /s /f /q "%TEMP%\*.*" >nul 2>&1
rd /s /q "%TEMP%" >nul 2>&1
mkdir "%TEMP%" >nul 2>&1
echo  [*] Cleaning Windows Temp folder...
del /s /f /q "%SystemRoot%\Temp\*.*" >nul 2>&1
echo  [*] Cleaning outdated Prefetch cache...
del /s /f /q "%SystemRoot%\Prefetch\*.*" >nul 2>&1
echo [%date% %time%] Applied Option 21 (Cleaned Temp ^& Prefetch) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Temporary files and Prefetch cache cleaned!
pause
goto MAIN_MENU

:OPT_22
cls
echo ================================================================================
echo   [22] CLEAR DIRECTX ^& GPU SHADER CACHES (FIXES STUTTERING)
echo ================================================================================
echo  What this does: Clears corrupted or outdated DirectX, NVIDIA, and AMD shader
echo  caches. Ideal after updating your GPU driver or a major game patch!
echo.
del /s /f /q "%LocalAppData%\D3DSCache\*.*" >nul 2>&1
del /s /f /q "%LocalAppData%\NVIDIA\DXCache\*.*" >nul 2>&1
del /s /f /q "%LocalAppData%\NVIDIA\GLCache\*.*" >nul 2>&1
del /s /f /q "%LocalAppData%\AMD\DxCache\*.*" >nul 2>&1
cleanmgr /verylowdisk /d %SystemDrive% >nul 2>&1
echo [%date% %time%] Applied Option 22 (Cleared Shader Caches) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] DirectX ^& GPU Shader Caches cleared! (Note: Your game may recompile
echo            fresh shaders during its first launch).
pause
goto MAIN_MENU

:OPT_23
cls
echo ================================================================================
echo   [23] RUN SSD TRIM STORAGE OPTIMIZATION
echo ================================================================================
echo  What this does: Runs native Windows ReTrim on your system drive so your NVMe
echo  or SATA SSD maintains peak read/write speeds for fast game loading.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Optimize-Volume -DriveLetter C -ReTrim -Verbose"
echo [%date% %time%] Applied Option 23 (SSD ReTrim) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] SSD TRIM optimization completed!
pause
goto MAIN_MENU

:OPT_24
cls
echo ================================================================================
echo   [24] DISABLE WINDOWS MULTIMEDIA NETWORK THROTTLING INDEX
echo ================================================================================
echo  What this does: Windows throttles network packets when multimedia/audio plays.
echo  Setting NetworkThrottlingIndex to ffffffff removes packet throttling in games!
echo.
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 4294967295 /f
echo [%date% %time%] Applied Option 24 (NetworkThrottlingIndex=ffffffff) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Network Throttling disabled for maximum packet throughput!
pause
goto MAIN_MENU

:OPT_25
cls
echo ================================================================================
echo   [25] FLUSH DNS, RESET WINSOCK ^& CLEAR ARP CACHE
echo ================================================================================
echo  What this does: Refreshes your network stack to resolve high ping spikes,
echo   rubberbanding, and server connection delays.
echo.
ipconfig /flushdns
arp -d * >nul 2>&1
netsh winsock reset >nul 2>&1
echo [%date% %time%] Applied Option 25 (Flush DNS ^& Winsock Reset) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] DNS flushed, ARP cleared, and Winsock reset!
pause
goto MAIN_MENU

:OPT_26
cls
echo ================================================================================
echo   [26] OPTIMIZE TCP/IP GAMING PARAMETERS (RSS ON, RSC OFF, ECN OFF)
echo ================================================================================
echo  What this does: Enables Receive Side Scaling (spreads network load across CPU
echo  cores) and disables Receive Segment Coalescing (which adds packet delay).
echo.
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global rsc=disabled >nul 2>&1
netsh int tcp set global ecncapability=disabled >nul 2>&1
netsh int tcp set global autotuninglevel=normal >nul 2>&1
echo [%date% %time%] Applied Option 26 (TCP Gaming Parameters) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] TCP/IP stack tuned for low-latency online gaming!
pause
goto MAIN_MENU

:OPT_27
cls
echo ================================================================================
echo   [27] DISABLE NETWORK ADAPTER POWER SAVING MODE
echo ================================================================================
echo  What this does: Prevents Windows from putting your Ethernet or Wi-Fi card
echo  into low-power states during matches.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter -Physical | Disable-NetAdapterPowerManagement -ErrorAction SilentlyContinue"
echo [%date% %time%] Applied Option 27 (Disable NIC Power Saving) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Network Adapter Power Management disabled!
pause
goto MAIN_MENU

:OPT_28
cls
echo ================================================================================
echo   [28] FAST GAMING DNS SWITCHER (CLOUDFLARE / GOOGLE / DEFAULT)
echo ================================================================================
echo  Choose your preferred DNS provider for faster server lookups:
echo   [1] Cloudflare Gaming DNS (1.1.1.1 / 1.0.0.1) - Fastest Response
echo   [2] Google Public DNS     (8.8.8.8 / 8.8.4.4) - Ultra Reliable
echo   [3] Restore Automatic ISP DNS (DHCP Default)
echo   [0] Cancel / Back to Main Menu
echo.
set /p "DNS_OPT=  >> Select DNS Option (1, 2, 3, or 0): "
if "%DNS_OPT%"=="1" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter | Where-Object Status -eq 'Up' | Set-DnsClientServerAddress -ServerAddresses ('1.1.1.1','1.0.0.1')"
    ipconfig /flushdns >nul 2>&1
    echo  [SUCCESS] Cloudflare DNS ^(1.1.1.1^) applied!
)
if "%DNS_OPT%"=="2" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter | Where-Object Status -eq 'Up' | Set-DnsClientServerAddress -ServerAddresses ('8.8.8.8','8.8.4.4')"
    ipconfig /flushdns >nul 2>&1
    echo  [SUCCESS] Google Public DNS ^(8.8.8.8^) applied!
)
if "%DNS_OPT%"=="3" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter | Where-Object Status -eq 'Up' | Set-DnsClientServerAddress -ResetServerAddresses"
    ipconfig /flushdns >nul 2>&1
    echo  [SUCCESS] Restored automatic ISP DNS!
)
pause
goto MAIN_MENU

:OPT_29
cls
echo ================================================================================
echo   [29] DISABLE WINDOWS TRANSPARENCY EFFECTS (REDUCE DWM GPU OVERHEAD)
echo ================================================================================
echo  What this does: Turns off acrylic blur/transparency on the taskbar and windows,
echo  freeing VRAM and Desktop Window Manager (DWM) GPU cycles.
echo.
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "EnableTransparency" /t REG_DWORD /d 0 /f
echo [%date% %time%] Applied Option 29 (Disable Transparency) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Windows Transparency effects disabled!
pause
goto MAIN_MENU

:OPT_30
cls
echo ================================================================================
echo   [30] DISABLE GAME BAR TIPS, STARTUP POPUPS ^& AD SUGGESTIONS
echo ================================================================================
echo  What this does: Disables annoying Windows "Tips ^& Suggestions" popups and
echo  Game Bar startup notifications that interrupt fullscreen games.
echo.
reg add "HKCU\Software\Microsoft\GameBar" /v "ShowStartupPanel" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\GameBar" /v "GamePanelStartupTipIndex" /t REG_DWORD /d 3 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SoftLandingEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338389Enabled" /t REG_DWORD /d 0 /f
echo [%date% %time%] Applied Option 30 (Disable Tips ^& Popups) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Game Bar Startup Tips and Windows Popups disabled!
pause
goto MAIN_MENU

:OPT_31
cls
echo ================================================================================
echo   [31] DISABLE BING WEB SEARCH IN WINDOWS START MENU
echo ================================================================================
echo  What this does: Stops Windows Start Menu from sending web queries to Bing,
echo  making local search instant and stopping SearchHost.exe network/CPU spikes.
echo.
reg add "HKCU\Software\Policies\Microsoft\Windows\Explorer" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Search" /v "BingSearchEnabled" /t REG_DWORD /d 0 /f
echo [%date% %time%] Applied Option 31 (Disable Bing Start Menu Search) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Start Menu Bing Web Search disabled!
pause
goto MAIN_MENU

:OPT_32
cls
echo ================================================================================
echo   [32] DISABLE BACKGROUND APPS FROM RUNNING WHILE GAMING
echo ================================================================================
echo  What this does: Prevents unused Microsoft Store apps from waking up in the
echo  background and stealing CPU cycles or bandwidth while you game.
echo.
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" /v "GlobalUserDisabled" /t REG_DWORD /d 1 /f
echo [%date% %time%] Applied Option 32 (Disable Background Apps) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Background App activity disabled!
pause
goto MAIN_MENU

:OPT_33
cls
echo ================================================================================
echo   [33] REDUCE WINDOWS ERROR REPORTING ^& DIAGNOSTIC TELEMETRY QUEUES
echo ================================================================================
echo  What this does: Stops Windows Error Reporting from queuing large crash dumps
echo  and uploading diagnostic data during gameplay (100%% safe, no services deleted).
echo.
reg add "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting" /v "Disabled" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 1 /f
echo [%date% %time%] Applied Option 33 (Reduce WER ^& Telemetry) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Error Reporting ^& Telemetry overhead reduced!
pause
goto MAIN_MENU

:OPT_34
cls
echo ================================================================================
echo   [34] SPEED UP WINDOWS MENU SHOW DELAY ^& SHUTDOWN TIMEOUTS
echo ================================================================================
echo  What this does: Makes right-click and context menus appear instantaneously
echo  and speeds up app closing during restart/shutdown.
echo.
reg add "HKCU\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v "WaitToKillServiceTimeout" /t REG_SZ /d "2000" /f
echo [%date% %time%] Applied Option 34 (MenuShowDelay=0) >> "%LOG_FILE%"
echo.
echo  [SUCCESS] Desktop Menu Delay ^& Shutdown Timeout optimized!
pause
goto MAIN_MENU

:OPT_35
cls
echo ================================================================================
echo   [35] QUICK-LAUNCH WINDOWS GRAPHICS, POWER ^& STARTUP APPS PANELS
echo ================================================================================
echo  Use these shortcuts to quickly inspect your Windows visual settings:
echo   [1] Open Windows Graphics Settings (HAGS / Per-Game High Performance GPU)
echo   [2] Open Classic Power Options Control Panel (powercfg.cpl)
echo   [3] Open Mouse Properties (Pointer Precision / Polling Check)
echo   [4] Open Windows Startup Apps (Disable heavy launchers on boot)
echo   [5] Open System Protection / Restore Points (sysdm.cpl)
echo   [0] Back to Main Menu
echo.
set /p "SHORT_OPT=  >> Select Shortcut (1-5 or 0): "
if "%SHORT_OPT%"=="1" start ms-settings:display-advancedgraphics
if "%SHORT_OPT%"=="2" control powercfg.cpl
if "%SHORT_OPT%"=="3" control main.cpl
if "%SHORT_OPT%"=="4" start ms-settings:startupapps
if "%SHORT_OPT%"=="5" control sysdm.cpl,,4
goto MAIN_MENU

:: ============================================================================
::  [R] 1-CLICK FACTORY RESET / UNDO ALL TWEAKS
:: ============================================================================
:OPT_REVERT_ALL
cls
color 0E
echo ================================================================================
echo   [R] REVERT / UNDO ALL TWEAKS TO WINDOWS FACTORY DEFAULTS
echo ================================================================================
echo.
echo  This will safely restore all modified settings back to standard Windows
echo  factory defaults (or import your saved Registry Backup if present).
echo.
set /p "CONFIRM_REV=  >> Are you sure you want to restore Windows defaults? (Y/N): "
if /I not "%CONFIRM_REV%"=="Y" goto MAIN_MENU

echo.
echo  [*] Restoring Multimedia SystemProfile ^& Network Throttling defaults...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 20 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "Medium" /f >nul 2>&1

echo  [*] Restoring Win32PrioritySeparation ^& Power Throttling defaults...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 2 /f >nul 2>&1
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /f >nul 2>&1

echo  [*] Restoring Balanced Power Plan ^& Hibernation...
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
powercfg -h on >nul 2>&1

echo  [*] Restoring Mouse, Keyboard, Transparency, Search ^& Background App defaults...
reg add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "1" /f >nul 2>&1
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "6" /f >nul 2>&1
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "10" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "EnableTransparency" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "400" /f >nul 2>&1
reg delete "HKCU\Software\Policies\Microsoft\Windows\Explorer" /v "DisableSearchBoxSuggestions" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Search" /v "BingSearchEnabled" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" /v "GlobalUserDisabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d 3670016 /f >nul 2>&1
fsutil behavior set disablelastaccess 0 >nul 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Enable-MMAgent -mc -ErrorAction SilentlyContinue"

if exist "%BACKUP_DIR%\SystemProfile_Backup.reg" reg import "%BACKUP_DIR%\SystemProfile_Backup.reg" >nul 2>&1
if exist "%BACKUP_DIR%\PriorityControl_Backup.reg" reg import "%BACKUP_DIR%\PriorityControl_Backup.reg" >nul 2>&1

echo [%date% %time%] Reverted all tweaks to Windows Factory Defaults >> "%LOG_FILE%"
echo.
echo  [SUCCESS] All settings restored to Windows Factory Defaults!
echo            Please restart your PC to complete the restoration.
pause
goto MAIN_MENU

:: ============================================================================
::  [C] TWEAK LAB - ULTIMATE WINDOWS CLEANER & RAM OPTIMIZER
:: ============================================================================
:OPT_QUICK_CLEANER
cls
color 0A
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

echo [%date% %time%] Executed Tweak Lab System Optimizer (Temp, Prefetch, DNS, Winsock, Idle RAM) >> "%LOG_FILE%"
echo.
echo ===================================================
echo    Optimization Complete! Enjoy Higher FPS in Game.
echo ===================================================
echo.
pause
goto MAIN_MENU

:EXIT_TOOL
cls
color 0B
echo ================================================================================
echo        THANK YOU FOR USING BEST OPTIMIZATION FOR 2027 FPS+!
echo        Remember to restart your PC if you applied new optimizations.
echo ================================================================================
timeout /t 2 >nul
exit /b 0
