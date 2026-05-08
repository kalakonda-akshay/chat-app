@echo off
setlocal
title Stop Nebula Chat Ports

echo Stopping processes using ports 5000 and 5173...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
  echo Stopping backend PID %%a
  taskkill /PID %%a /F >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
  echo Stopping frontend PID %%a
  taskkill /PID %%a /F >nul 2>nul
)

echo Done.
pause
