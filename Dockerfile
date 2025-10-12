FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM python:3.11-slim AS ml-service
WORKDIR /ml
COPY ml_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ml_service/ .

FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install Python for ML service
RUN apk add --no-cache python3 py3-pip nginx

# Copy backend
COPY --from=backend-build /app/target/credit_score_sys-0.0.1-SNAPSHOT.jar app.jar

# Copy ML service
COPY --from=ml-service /ml /ml

# Copy frontend build
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080 5000 80

ENTRYPOINT ["/docker-entrypoint.sh"]
