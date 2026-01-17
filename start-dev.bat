@echo off
REM Start Frontend Development Server (Windows)
REM Forces port 5173, killing any process using it

echo ================================
echo Starting Frontend Server
echo ================================
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"
