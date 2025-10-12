@echo off
echo ========================================
echo ScoreBridge - Starting Spring Boot API
echo ========================================
echo.

echo Building project...
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application on port 8080...
echo.
call mvn spring-boot:run
