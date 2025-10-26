@echo off
REM ====================================
REM ScoreBridge AWS Deployment Script
REM ====================================

echo.
echo ====================================
echo ScoreBridge AWS Deployment
echo ====================================
echo.

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] AWS CLI is not installed!
    echo Please install from: https://aws.amazon.com/cli/
    exit /b 1
)

REM Check if EB CLI is installed
where eb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] EB CLI is not installed!
    echo Please install: pip install awsebcli
    exit /b 1
)

echo [✓] AWS CLI and EB CLI are installed
echo.

REM Step 1: Build Spring Boot Backend
echo ====================================
echo [1/3] Building Spring Boot Backend
echo ====================================
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend build failed!
    exit /b 1
)
echo [✓] Backend built successfully
echo.

REM Step 2: Deploy Backend to Elastic Beanstalk
echo ====================================
echo [2/3] Deploying Backend
echo ====================================
echo Checking if EB environment exists...
eb status scorebridge-backend-env >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Environment not found. Creating new environment...
    call eb create scorebridge-backend-env --platform "Corretto 21" --single
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create environment!
        exit /b 1
    )
) else (
    echo [!] Environment exists. Deploying update...
    call eb deploy scorebridge-backend-env
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Backend deployment failed!
        exit /b 1
    )
)
echo [✓] Backend deployed successfully
echo.

REM Step 3: Deploy ML Service
echo ====================================
echo [3/3] Deploying ML Service
echo ====================================
cd ml_service
eb status scorebridge-ml-env >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] ML environment not found. Creating new environment...
    call eb create scorebridge-ml-env --platform "Python 3.11" --single
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create ML environment!
        cd ..
        exit /b 1
    )
) else (
    echo [!] ML environment exists. Deploying update...
    call eb deploy scorebridge-ml-env
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] ML service deployment failed!
        cd ..
        exit /b 1
    )
)
cd ..
echo [✓] ML Service deployed successfully
echo.

REM Get URLs
echo ====================================
echo ✅ Deployment Complete!
echo ====================================
echo.
echo Your services are now running:
echo.
eb status scorebridge-backend-env | findstr "CNAME:"
cd ml_service
eb status scorebridge-ml-env | findstr "CNAME:"
cd ..
echo.
echo ====================================
echo Next Steps:
echo 1. Deploy frontend to AWS Amplify
echo 2. Update frontend API URLs
echo 3. Test all services
echo ====================================
echo.
pause
