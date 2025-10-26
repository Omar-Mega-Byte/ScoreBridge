@echo off
REM ====================================
REM ScoreBridge AWS - Complete Fresh Deploy
REM ====================================

setlocal enabledelayedexpansion

cd /d "c:\Users\d_tol\Desktop\PROJECTS JAVA\credit_score_sys"

echo.
echo ====================================
echo ScoreBridge AWS Fresh Deploy
echo ====================================
echo.

REM Step 1: Check old environment
echo [1/5] Checking for old environment...
for /f "tokens=*" %%i in ('aws elasticbeanstalk describe-environments --application-name scorebridge-backend --environment-names scorebridge-backend-env --region us-east-1 --query "Environments[0].Status" --output text 2^>nul') do set OLD_ENV_STATUS=%%i

if "%OLD_ENV_STATUS%"=="Terminated" (
    echo [!] Old environment still exists (Terminated). Terminating again...
    aws elasticbeanstalk terminate-environment --environment-name scorebridge-backend-env --region us-east-1 --no-terminate-resources 2>nul
    echo [✓] Termination signal sent
    echo [!] Waiting 30 seconds...
    timeout /t 30 /nobreak
) else if "%OLD_ENV_STATUS%"=="Terminating" (
    echo [!] Environment still terminating. Waiting...
    timeout /t 30 /nobreak
) else (
    echo [✓] No old environment found
)

REM Step 2: Clean EB config
echo.
echo [2/5] Cleaning old EB configuration...
if exist ".elasticbeanstalk" (
    rmdir /s /q .elasticbeanstalk
    echo [✓] Old EB config deleted
) else (
    echo [✓] No old EB config found
)

REM Step 3: Initialize EB
echo.
echo [3/5] Initializing Elastic Beanstalk...
python -m ebcli.core.ebrun init -p "Corretto 21" -r us-east-1 scorebridge-backend 2>&1 | findstr /i "initialized\|exist"
if %ERRORLEVEL% NEQ 0 (
    echo [!] Init may have requested input. Continuing...
)

REM Step 4: Create environment
echo.
echo [4/5] Creating new environment (scorebridge-backend-prod)...
echo [!] This will take 5-10 minutes...
python -m ebcli.core.ebrun create scorebridge-backend-prod --single --verbose 2>&1 | findstr /i "green\|ready\|error\|failed"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Environment creation failed!
    echo.
    echo Run: eb logs
    echo to see what went wrong.
    exit /b 1
)

echo [✓] Environment created successfully!

REM Step 5: Verify
echo.
echo [5/5] Verifying deployment...
python -m ebcli.core.ebrun status 2>&1 | findstr /i "ready\|green"

echo.
echo ====================================
echo ✅ Deployment Complete!
echo ====================================
echo.
echo Opening application in browser...
python -m ebcli.core.ebrun open

echo.
echo Your new backend URL:
python -m ebcli.core.ebrun status 2>&1 | findstr "CNAME"
echo.
echo Next steps:
echo 1. Deploy ML service: cd ml_service ^&^& eb create scorebridge-ml-prod --single
echo 2. Deploy frontend to AWS Amplify
echo 3. Update frontend API URLs
echo.
pause
