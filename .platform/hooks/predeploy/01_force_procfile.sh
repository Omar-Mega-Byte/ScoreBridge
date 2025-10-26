#!/bin/bash
# Force Procfile with correct port before EB tries to auto-generate

echo "================================================"
echo "FORCING PROCFILE CONFIGURATION"
echo "================================================"

PROCFILE_PATH="/var/app/current/Procfile"

# Ensure Procfile exists with port 5000
cat > "$PROCFILE_PATH" << 'EOF'
web: java -Dserver.port=5000 -Dspring.profiles.active=aws -jar target/credit_score_sys-0.0.1-SNAPSHOT.jar
EOF

echo "Procfile created at: $PROCFILE_PATH"
cat "$PROCFILE_PATH"

# Also set environment variable
export PORT=5000

echo "PORT environment variable set to: $PORT"
echo "================================================"
