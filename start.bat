@echo off
title PhishGuard AI - Full Stack Launcher
echo ========================================================
echo   Launching AI-Powered Phishing Detection System...
echo ========================================================
echo.

:: 1. Start Flask Backend API on Port 5000
echo [1/2] Starting Flask Backend API on http://127.0.0.1:5000 ...
start "PhishGuard API (Flask)" cmd /k "cd backend && python app.py"

:: 2. Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start React Frontend on Port 3000
echo [2/2] Starting React Frontend on http://localhost:3000 ...
start "PhishGuard UI (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Both services are launching in separate windows!
echo   Open your browser at: http://localhost:3000
echo ========================================================
