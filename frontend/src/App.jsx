import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout
import MainLayout from './components/layout/MainLayout';
import HackathonBanner from './components/common/HackathonBanner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ScoreCalculator from './pages/scoring/ScoreCalculator';
import ScoreHistory from './pages/scoring/ScoreHistory';
import FinancialProfile from './pages/data-ingestion/FinancialProfile';
import Accounts from './pages/data-ingestion/Accounts';
import Transactions from './pages/data-ingestion/Transactions';
import Profile from './pages/user/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Guest Route Component (redirects to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <>
      <HackathonBanner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        
        {/* Guest Only Routes */}
        <Route path="login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />

        {/* Public Scoring - Anonymous scoring */}
        <Route path="calculate-score" element={<ScoreCalculator />} />

        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="score-history" element={
          <ProtectedRoute>
            <ScoreHistory />
          </ProtectedRoute>
        } />
        <Route path="financial-profile" element={
          <ProtectedRoute>
            <FinancialProfile />
          </ProtectedRoute>
        } />
        <Route path="accounts" element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        } />
        <Route path="transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
