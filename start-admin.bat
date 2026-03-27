@echo off
title Bogman Gallery Admin
cd /d "%~dp0"

:: Install dependencies if needed
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

:: Start server in background and open browser
start "" http://localhost:3001
node server.js
pause
