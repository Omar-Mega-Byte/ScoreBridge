@echo off
echo ========================================
echo ScoreBridge - Starting Frontend
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting React development server on http://localhost:3000...
echo.
echo The frontend will automatically reload when you make changes.
echo Press Ctrl+C to stop.
echo.

npm run dev
