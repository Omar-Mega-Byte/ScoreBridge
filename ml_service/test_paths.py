"""
Quick test to verify file paths are correct
"""
import os

# Get the project root directory (parent of ml_service)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# File paths
TRAIN_DATA_PATH = os.path.join(PROJECT_ROOT, 'src', 'main', 'java', 'com', 'scorebridge', 
                                'credit_score_sys', 'modules', 'scoring', 'ml', 'train.csv')
MODEL_OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'model', 'credit_score_model.pkl')

print("=" * 60)
print("Path Resolution Test")
print("=" * 60)
print(f"\nScript Directory: {SCRIPT_DIR}")
print(f"Project Root: {PROJECT_ROOT}")
print(f"\nTrain CSV Path: {TRAIN_DATA_PATH}")
print(f"Train CSV Exists: {os.path.exists(TRAIN_DATA_PATH)}")
print(f"\nModel Output Path: {MODEL_OUTPUT_PATH}")
print(f"Model Directory Exists: {os.path.exists(os.path.dirname(MODEL_OUTPUT_PATH))}")
print("=" * 60)
