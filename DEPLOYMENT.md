# 🚀 Quick Deployment Guide for ScoreBridge

## FREE Deployment Options for Hackathon

### ⭐ OPTION 1: Render.com (EASIEST - RECOMMENDED)

**Time: 10 minutes | Cost: FREE**

#### Steps:
1. **Push to GitHub** (already done ✅)
   ```bash
   git add .
   git commit -m "Add deployment configs"
   git push origin main
   ```

2. **Sign Up at Render.com**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub

3. **Deploy Services Manually** (Easier for hackathons!)
   
   **Deploy ML Service First:**
   - Click "New +" → "Web Service"
   - Connect repository: `shahdkh2288/ScoreBridge_HackNomics`
   - Name: `scorebridge-ml`
   - Runtime: Python 3
   - Build Command: `cd ml_service && pip install -r requirements.txt`
   - Start Command: `cd ml_service && python app.py`
   - Click "Create Web Service"
   - **Copy the URL** (e.g., `https://scorebridge-ml.onrender.com`)
   
   **Deploy Backend Second:**
   - Click "New +" → "Web Service"
   - Same repository
   - Name: `scorebridge-backend`
   - Runtime: Docker
   - Dockerfile Path: `./Dockerfile`
   - Add Environment Variables:
     - `JWT_SECRET` = `your-super-secret-key-min-32-characters-long`
     - `ML_SERVICE_URL` = `https://scorebridge-ml.onrender.com` (from step above)
     - `SPRING_DATASOURCE_URL` = `jdbc:h2:mem:scorebridge`
     - `CORS_ALLOWED_ORIGINS` = `*` (update later with frontend URL)
   - Click "Create Web Service"
   - **Copy the URL** (e.g., `https://scorebridge-backend.onrender.com`)
   
   **Deploy Frontend Last:**
   - Click "New +" → "Static Site"
   - Same repository
   - Name: `scorebridge-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_URL` = `https://scorebridge-backend.onrender.com` (from step above)
   - Click "Create Static Site"
   
   **Update CORS (Important!):**
   - Go back to backend service settings
   - Update `CORS_ALLOWED_ORIGINS` with your frontend URL
   - Example: `https://scorebridge-frontend.onrender.com`

4. **That's it!** 🎉
   - Backend: `https://scorebridge-backend.onrender.com`
   - ML Service: `https://scorebridge-ml.onrender.com`
   - Frontend: `https://scorebridge-frontend.onrender.com`

**Note:** Free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

### 🚂 OPTION 2: Railway.app (SIMPLEST)

**Time: 5 minutes | Cost: $5 free credit (enough for hackathon)**

#### Steps:
1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub"
3. Select `ScoreBridge_HackNomics` repo
4. Railway auto-detects everything and deploys!

**Add Environment Variables:**
```
JWT_SECRET=your-secret-key-here-make-it-long
CORS_ALLOWED_ORIGINS=${{RAILWAY_STATIC_URL}}
ML_SERVICE_URL=${{ML_SERVICE.RAILWAY_PUBLIC_DOMAIN}}
```

---

### 🎯 OPTION 3: Split Deployment (Vercel + Render)

**Best for: Fast frontend, reliable backend**

#### Frontend on Vercel:
1. Go to https://vercel.com
2. Import GitHub repo: `ScoreBridge_HackNomics`
3. Set Root Directory: `frontend`
4. Build Command: `npm run build`
5. Deploy!

#### Backend + ML on Render:
Same as Option 1, but only deploy backend and ML services.

---

### 🎯 OPTION 4: Fly.io (Developer Favorite)

**Time: 15 minutes | Cost: FREE**

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login: `flyctl auth login`
3. Deploy each service:
```bash
# Backend
cd credit_score_sys
flyctl launch --name scorebridge-backend

# ML Service
cd ml_service
flyctl launch --name scorebridge-ml

# Frontend
cd frontend
flyctl launch --name scorebridge-frontend
```

---

## 🔧 Manual Deployment (Any Platform)

If using another platform, you need:

### Spring Boot Backend:
- **Build:** `mvn clean package -DskipTests`
- **Run:** `java -jar target/credit_score_sys-0.0.1-SNAPSHOT.jar`
- **Port:** 8080
- **Health Check:** `/actuator/health`

### Python ML Service:
- **Install:** `pip install -r ml_service/requirements.txt`
- **Run:** `python ml_service/app.py`
- **Port:** 5000
- **Health Check:** `/health`

### React Frontend:
- **Install:** `cd frontend && npm install`
- **Build:** `npm run build`
- **Serve:** Static files in `frontend/dist` folder

---

## 📝 Environment Variables Needed

### Backend:
```env
SERVER_PORT=8080
ML_SERVICE_URL=https://your-ml-service-url.com
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
SPRING_DATASOURCE_URL=jdbc:h2:mem:scorebridge
```

### ML Service:
```env
PORT=5000
FLASK_ENV=production
```

### Frontend:
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 🎯 My Recommendation for Hackathon

**Use Render.com Option 1** because:
- ✅ Completely free
- ✅ No credit card required
- ✅ Deploys all 3 services from one config
- ✅ Auto-builds from GitHub
- ✅ Perfect for demos
- ✅ Easy to show to judges

**Backup: Railway.app** if you want faster cold starts and have $5 to spare.

---

## 🚨 Common Issues

### "Services won't start"
- Check logs in Render dashboard
- Make sure ML model files exist in `ml_service/model/`
- Verify environment variables are set

### "Frontend can't connect to backend"
- Update `VITE_API_URL` in frontend env
- Check CORS settings in backend
- Verify backend is running (check health endpoint)

### "ML predictions fail"
- Make sure model was trained: `python ml_service/train_model.py`
- Check if model files are committed to git
- Verify ML service URL in backend env

---

## 💡 Quick Test After Deployment

1. **Test ML Service:** 
   `curl https://your-ml-service-url.com/health`

2. **Test Backend:** 
   `curl https://your-backend-url.com/actuator/health`

3. **Open Frontend:** 
   Visit your frontend URL in browser

4. **Register & Test:**
   - Create account
   - Add financial data
   - Calculate score

---

## 🎉 You're Ready!

Choose Option 1 (Render) and you'll be deployed in **10 minutes**.

Good luck with your hackathon! 🚀
