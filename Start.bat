@echo off
:: Start the Backend
start /min cmd /c "cd /d C:\Users\YOURUSERNAME\Desktop\gestion de stock\backend && npm run dev"

:: Start the Frontend
start /min cmd /c "cd /d C:\Users\YOURUSERNAME\Desktop\gestion de stock\frontend && npm start"

:: Wait 5 seconds for servers to initialize, then open the browser
timeout /t 5
