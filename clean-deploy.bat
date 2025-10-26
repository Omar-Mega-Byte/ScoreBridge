@echo off
REM ====================================
REM Clean Deploy Script (Fixed)
REM ====================================

cd /d "c:\Users\d_tol\Desktop\PROJECTS JAVA\credit_score_sys"

echo.
echo ====================================
echo AWS EB Clean Deploy
echo ====================================
echo.

REM Step 1: Check if environment exists
echo [1/3] Checking environment status...
for /f "tokens=*" %%i in ('python -c "import boto3; client = boto3.client('elasticbeanstalk', region_name='us-east-1'); envs = client.describe_environments(ApplicationName='scorebridge-backend', EnvironmentNames=['scorebridge-backend-env']); print(envs['Environments'][0]['Status'] if envs['Environments'] else 'NOT_FOUND')" 2^>nul') do set ENV_STATUS=%%i

echo Environment status: %ENV_STATUS%

if "%ENV_STATUS%"=="Terminated" (
    echo [!] Environment is terminated. Deleting...
    python -c "import boto3; client = boto3.client('elasticbeanstalk', region_name='us-east-1'); client.delete_environment(EnvironmentName='scorebridge-backend-env')" 2>nul
    echo [✓] Environment deleted
    echo.
    echo [!] Waiting 30 seconds for deletion to complete...
    timeout /t 30 /nobreak
)

REM Step 2: Deploy
echo [2/3] Deploying application...
python -m ebcli.core.ebrun deploy --timeout 20
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Deployment failed!
    exit /b 1
)
echo [✓] Deployment successful
echo.

REM Step 3: Check status
echo [3/3] Checking status...
python -m ebcli.core.ebrun status
echo.
echo ====================================
echo ✅ Done!
echo ====================================
