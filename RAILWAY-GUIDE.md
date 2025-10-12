# 🚂 Railway Deployment Verification Guide

## Deployment ID: 0f5ec2ad-bfc8-4956-96db-6d32d593e075

---

## ✅ **Check if ALL Services Deployed**

### **Expected Services (You should see 3):**

Railway might detect them as:
1. **`credit_score_sys`** or **`backend`** - Spring Boot (Port 8080)
2. **`ml_service`** - Python Flask (Port 5000)  
3. **`frontend`** - React Vite (Port 3000)

---

## 🔗 **Get Your Deployment URLs**

### **For Each Service:**

1. **Open Railway Dashboard**
   - Go to: https://railway.app/project/0f5ec2ad-bfc8-4956-96db-6d32d593e075

2. **Click on Each Service** (one at a time)

3. **Generate Public Domain:**
   - Click **"Settings"** tab
   - Scroll to **"Networking"**
   - Click **"Generate Domain"**
   - Copy the URL

4. **Repeat for all 3 services**

---

## 🎯 **What You Should See:**

```
✅ Backend:   https://credit-score-sys-production.up.railway.app
✅ ML Service: https://ml-service-production.up.railway.app  
✅ Frontend:   https://frontend-production.up.railway.app
```

(Your actual URLs will be different)

---

## ⚠️ **If You Only See 1 Service (Backend Only)**

Railway might have only detected the root folder (backend). Here's how to add the other services:

### **Add ML Service:**
1. Click **"+ New"** → **"Empty Service"**
2. Click the new service → **"Settings"**
3. **Root Directory:** Set to `ml_service`
4. **Start Command:** `python app.py`
5. **Watch Paths:** `ml_service/**`
6. Deploy!

### **Add Frontend:**
1. Click **"+ New"** → **"Empty Service"**
2. Click the new service → **"Settings"**
3. **Root Directory:** Set to `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm run preview` or `npx serve -s dist -l $PORT`
6. Deploy!

---

## 🔧 **Set Environment Variables**

Once all services are deployed, add these env vars:

### **Backend Service:**
```env
PORT=8080
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-random
SPRING_DATASOURCE_URL=jdbc:h2:mem:scorebridge
ML_SERVICE_URL=https://YOUR-ML-SERVICE-URL.up.railway.app
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-URL.up.railway.app
```

### **ML Service:**
```env
PORT=5000
```

### **Frontend:**
```env
VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app
```

**Important:** Replace the URLs with your actual Railway URLs!

---

## 🧪 **Test Your Deployment**

### **1. Test ML Service:**
Open in browser: `https://YOUR-ML-SERVICE-URL.up.railway.app/health`

Should return: `{"status": "healthy"}`

### **2. Test Backend:**
Open in browser: `https://YOUR-BACKEND-URL.up.railway.app/actuator/health`

Should return: `{"status": "UP"}`

### **3. Test Frontend:**
Open in browser: `https://YOUR-FRONTEND-URL.up.railway.app`

Should show your ScoreBridge homepage!

### **4. Full Test:**
1. Register a new account
2. Add financial data
3. Calculate credit score
4. View results

---

## 🚨 **Common Issues**

### "I only see the backend deployed"
- Railway detected only the root `pom.xml`
- Manually add ML and Frontend services (see instructions above)

### "Services are running but can't connect"
- Check environment variables
- Make sure you updated the URLs in env vars
- Check CORS settings

### "Build failed for ML service"
- Check logs: Does it find `ml_service/requirements.txt`?
- Verify Root Directory is set to `ml_service`

### "Frontend shows blank page"
- Check browser console for errors
- Verify `VITE_API_URL` points to backend
- Check if backend CORS allows frontend URL

---

## 📱 **Quick Check Commands**

Run these in your browser or terminal:

```bash
# Test ML Service
curl https://YOUR-ML-URL.up.railway.app/health

# Test Backend
curl https://YOUR-BACKEND-URL.up.railway.app/actuator/health

# Check Frontend (should return HTML)
curl https://YOUR-FRONTEND-URL.up.railway.app
```

---

## 💡 **Next Steps**

1. ✅ Verify all 3 services are deployed
2. ✅ Generate domains for each
3. ✅ Update environment variables with correct URLs
4. ✅ Test the full application flow
5. ✅ Share frontend URL with judges!

---

## 🎉 **Your Live Demo Links**

Once deployed, fill these in:

- **Frontend (Share this!):** `https://_____.up.railway.app`
- **Backend API:** `https://_____.up.railway.app`
- **ML Service:** `https://_____.up.railway.app`
- **Swagger Docs:** `https://YOUR-BACKEND-URL.up.railway.app/swagger-ui.html`

Good luck with your hackathon! 🚀
