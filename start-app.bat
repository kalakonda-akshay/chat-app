@echo off
setlocal
title Start Nebula Chat

echo.
echo ========================================
echo   Starting Nebula Chat MERN App
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not in PATH.
  echo Install Node.js from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or not in PATH.
  echo Install Node.js from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

echo Checking if port 5000 is busy...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
  echo Port 5000 is already used by PID %%a.
  echo Stopping it so the backend can start cleanly...
  taskkill /PID %%a /F >nul 2>nul
)

echo Checking if port 5173 is busy...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
  echo Port 5173 is already used by PID %%a.
  echo Stopping it so the frontend can start cleanly...
  taskkill /PID %%a /F >nul 2>nul
)

echo.
echo Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
  echo Backend npm install failed.
  pause
  exit /b 1
)

echo Creating or resetting demo user...
call node seedDemoUser.js

echo.
echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
  echo Frontend npm install failed.
  pause
  exit /b 1
)

echo.
echo Opening backend and frontend terminals...
start "Nebula Chat Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
timeout /t 5 /nobreak >nul
start "Nebula Chat Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"
timeout /t 4 /nobreak >nul

echo.
echo App is starting.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo login:
echo Email:    demo@example.com
echo Password: password123
echo.
start http://localhost:5173
pause
