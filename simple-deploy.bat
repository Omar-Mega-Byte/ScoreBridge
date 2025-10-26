@echo off
REM ====================================
REM ScoreBridge AWS - Simple Fresh Deploy
REM ====================================

setlocal enabledelayedexpansion

cd /d "c:\Users\d_tol\Desktop\PROJECTS JAVA\credit_score_sys"

echo.
echo ====================================
echo ScoreBridge AWS Fresh Deploy
echo ====================================
echo.

REM Step 1: Clean EB config
echo [1/4] Cleaning old EB configuration...
if exist ".elasticbeanstalk" (
    rmdir /s /q .elasticbeanstalk >nul 2>&1
    echo [OK] Old EB config deleted
) else (
    echo [OK] No old EB config
)

REM Step 2: Initialize EB
echo.
echo [2/4] Initializing Elastic Beanstalk...
echo. > eb_init_input.txt
echo y >> eb_init_input.txt
python -m ebcli.core.ebrun init -p "Corretto 21" -r us-east-1 scorebridge-backend ^
    < eb_init_input.txt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] EB initialized
) else (
    echo [OK] EB already initialized (this is fine)
)
del eb_init_input.txt >nul 2>&1

REM Step 3: Create environment
echo.
echo [3/4] Creating new environment: scorebridge-backend-prod
echo [!] This will take 5-10 minutes. Please wait...
echo [!] Watch for "Environment health: Green"
echo.

python -m ebcli.core.ebrun create scorebridge-backend-prod --single

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Environment creation failed!
    echo.
    echo Troubleshooting:
    echo   - Check logs: python -m ebcli.core.ebrun logs
    echo   - Check status: python -m ebcli.core.ebrun status
    echo.
    pause
    exit /b 1
)

echo [OK] Environment created!

REM Step 4: Verify
echo.
echo [4/4] Verifying deployment...
python -m ebcli.core.ebrun status

echo.
echo ====================================
echo SUCCESS! Your backend is deployed!
echo ====================================
echo.
echo Opening in browser...
python -m ebcli.core.ebrun open >nul 2>&1

echo.
echo Backend is ready at:
echo  http://scorebridge-backend-prod.eba-*.us-east-1.elasticbeanstalk.com
echo.
echo Next steps:
echo  1. Test the backend is working (browser should open)
echo  2. Deploy ML service: cd ml_service ^&^& python -m ebcli.core.ebrun create scorebridge-ml-prod --single
echo  3. Deploy frontend to AWS Amplify
echo  4. Update frontend API URLs
echo.
pause
