@echo off
REM ====================================
REM ScoreBridge Backend AWS Deploy (Fixed)
REM ====================================

echo.
echo ====================================
echo Deploy Spring Boot to AWS (Fixed)
echo ====================================
echo.

REM Step 1: Clean build
echo [1/3] Building application...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    exit /b 1
)
echo [✓] Build successful
echo.

REM Step 2: Deploy to Elastic Beanstalk
echo [2/3] Deploying to Elastic Beanstalk...
call eb deploy scorebridge-backend-env --verbose
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Deployment failed!
    echo.
    echo Try these steps:
    echo 1. Check logs: eb logs
    echo 2. Terminate: aws elasticbeanstalk terminate-environment --environment-name scorebridge-backend-env --region us-east-1
    echo 3. Retry deploy
    exit /b 1
)
echo [✓] Deployment successful
echo.

REM Step 3: Check status
echo [3/3] Checking status...
call eb status
echo.
echo ====================================
echo Opening application in browser...
echo ====================================
call eb open

echo.
echo ✅ Done!
