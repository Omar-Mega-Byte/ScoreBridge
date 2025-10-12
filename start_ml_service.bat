@echo off
echo ========================================
echo ScoreBridge - Starting ML Service
echo ========================================
echo.

cd ml_service

echo Checking if model exists...
if not exist "model\credit_score_model.pkl" (
    echo Model not found. Training model...
    echo This will take 2-3 minutes...
    echo.
    python train_model.py
    if errorlevel 1 (
        echo ERROR: Model training failed!
        pause
        exit /b 1
    )
    echo.
    echo Model trained successfully!
    echo.
)

echo Starting Flask ML API on port 5000...
echo.
python app.py
