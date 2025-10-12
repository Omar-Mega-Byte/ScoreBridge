@echo off
echo ================================================================
echo    ScoreBridge - Complete System Startup
echo ================================================================
echo.
echo This will start ALL three services:
echo   1. ML Service (Python Flask) on port 5000
echo   2. Spring Boot Backend on port 8080
echo   3. React Frontend on port 3000
echo.
echo Make sure you have:
echo   - Java 21
echo   - Python 3.8+
echo   - Node.js 16+
echo   - Maven
echo.
echo ================================================================
echo.

echo [1/3] Starting ML Service...
start "ScoreBridge ML Service" cmd /k start_ml_service.bat
timeout /t 3 /nobreak >nul

echo [2/3] Starting Spring Boot Backend...
start "ScoreBridge Backend" cmd /k start_spring_boot.bat
timeout /t 3 /nobreak >nul

echo [3/3] Starting React Frontend...
start "ScoreBridge Frontend" cmd /k start_frontend.bat

echo.
echo ================================================================
echo All services are starting!
echo ================================================================
echo.
echo Wait 60-90 seconds for all services to fully start, then:
echo.
echo   Frontend:   http://localhost:3000
echo   Backend:    http://localhost:8080/swagger-ui.html
echo   ML Service: http://localhost:5000/health
echo   Database:   http://localhost:8080/h2-console
echo.
echo ================================================================
echo.
echo Three terminal windows will open. Keep them running.
echo Close this window when all services are ready.
echo.

pause
