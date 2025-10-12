# 🎨 ScoreBridge Frontend

Modern, responsive React frontend for the ScoreBridge Credit Scoring System.

## 🚀 Tech Stack

- **React 18.2** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Charts and data visualization
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── layout/       # Header, Footer, MainLayout
│   │   └── scoring/      # ScoreResult component
│   ├── pages/           # Page components
│   │   ├── auth/        # Login, Register
│   │   ├── scoring/     # ScoreCalculator, ScoreHistory
│   │   ├── data-ingestion/  # FinancialProfile, Accounts, Transactions
│   │   ├── user/        # Profile
│   │   ├── Home.jsx     # Landing page
│   │   └── Dashboard.jsx # User dashboard
│   ├── services/        # API integration
│   │   ├── api.js       # Axios configuration
│   │   └── index.js     # All API services
│   ├── store/           # State management
│   │   └── authStore.js # Authentication state
│   ├── App.jsx          # Main app & routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## 🎯 Features Implemented

### ✅ Core Modules

1. **Authentication Module**
   - User registration with validation
   - Login with JWT token storage
   - Protected routes
   - Persistent authentication state

2. **Scoring Module**
   - Interactive score calculator (16 financial inputs)
   - Real-time score calculation
   - Beautiful score visualization with charts
   - Component breakdown (P, I, T, S)
   - Score history tracking
   - Anonymous scoring support

3. **Dashboard**
   - Overview of financial health
   - Latest score display
   - Score trend chart
   - Quick action cards
   - Account summary

4. **Data Ingestion Module** (Placeholders)
   - Financial profile management
   - Account management
   - Transaction tracking

5. **User Profile**
   - View user information
   - Account settings (coming soon)

### 🎨 UI/UX Features

- Fully responsive design (mobile, tablet, desktop)
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Loading states
- Error handling with user-friendly messages
- Success notifications
- Accessible form validation
- Professional color scheme

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Backend API running on http://localhost:8080

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🔌 API Integration

The frontend connects to the Spring Boot backend via Axios. Base URL is configured in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

### Available Services

All API services are defined in `src/services/index.js`:

```javascript
// Authentication
authService.register(userData)
authService.login(credentials)
authService.logout()

// Credit Scoring
scoringService.calculateScore(financialData)
scoringService.getScoreHistory(userId)
scoringService.getLatestScore(userId)

// Data Ingestion
dataIngestionService.createFinancialProfile(data)
dataIngestionService.getUserAccounts(userId)
dataIngestionService.createTransaction(data)

// User Management
userService.getProfile()
userService.updateProfile(data)
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Custom colors and utilities are defined in `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },    // Blue
  success: { ... },    // Green
  warning: { ... },    // Yellow
  danger: { ... },     // Red
}
```

### Custom CSS Classes

Reusable component classes in `src/index.css`:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outline button
- `.input-field` - Form input
- `.card` - Card container
- `.badge-*` - Status badges

## 📱 Pages & Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Guest | User login |
| `/register` | Register | Guest | User registration |
| `/calculate-score` | ScoreCalculator | Public | Score calculation (anonymous + auth) |
| `/dashboard` | Dashboard | Protected | User dashboard |
| `/score-history` | ScoreHistory | Protected | Score history |
| `/financial-profile` | FinancialProfile | Protected | Financial profile |
| `/accounts` | Accounts | Protected | Account management |
| `/transactions` | Transactions | Protected | Transaction tracking |
| `/profile` | Profile | Protected | User profile |

## 🔒 Authentication Flow

1. User registers/logs in
2. JWT token stored in `localStorage`
3. Token added to all API requests via Axios interceptor
4. Protected routes check authentication state
5. Auto-redirect to login if token expired (401 response)

## 📊 State Management

Using **Zustand** for lightweight state management:

```javascript
// Authentication state
const { user, login, logout, isAuthenticated } = useAuthStore();
```

## 🎯 Score Calculation Flow

1. User fills form with 16 financial inputs
2. Form validation using React Hook Form
3. API call to `/api/score/calculate`
4. Display results with:
   - Main score (300-850)
   - Score category badge
   - Risk level
   - Component breakdown (bar charts)
   - Pie chart visualization
   - Personalized recommendations
5. Save to history if user logged in

## 🎨 Color Coding

**Score Ranges:**
- 750-850: Green (Excellent)
- 650-749: Blue (Good/Very Good)
- 550-649: Yellow (Fair)
- 300-549: Red (Poor)

**Components:**
- Payment: Blue (#3b82f6)
- Income: Green (#10b981)
- Transaction: Yellow (#f59e0b)
- Savings: Purple (#8b5cf6)

## 🔧 Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "zustand": "^4.4.7",
  "react-hook-form": "^7.49.2",
  "recharts": "^2.10.3",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.8"
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.js
server: { port: 3001 }
```

### API Connection Issues
- Ensure backend is running on http://localhost:8080
- Check browser console for CORS errors
- Verify proxy configuration in vite.config.js

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Build
```bash
npm run build
# Output in dist/ folder
```

### Deploy Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist/` to S3 bucket

## 📝 TODO / Future Enhancements

- [ ] Complete financial profile form
- [ ] Full account management CRUD
- [ ] Transaction import from CSV
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] PDF export functionality
- [ ] Email notifications for score changes
- [ ] Progressive Web App (PWA)
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Score comparison with peers (anonymized)

## 🤝 Contributing

This frontend is part of the ScoreBridge hackathon project. Key files to understand:

1. `src/App.jsx` - Routing setup
2. `src/services/index.js` - API integration
3. `src/store/authStore.js` - Auth state
4. `src/pages/scoring/ScoreCalculator.jsx` - Main feature

## 📄 License

Part of ScoreBridge project - Built for HackNomics 2025

---

**Frontend Status: ✅ READY FOR DEMO**

Start the app: `npm run dev`
Access at: http://localhost:3000
