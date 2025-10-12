import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CreditCard, Wallet, History, Calculator, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/authStore';
import { scoringService, dataIngestionService } from '../services';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [latestScore, setLatestScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.id) {
          // Fetch latest score
          const scoreResponse = await scoringService.getLatestScore(user.id);
          if (scoreResponse.success) {
            setLatestScore(scoreResponse.data);
          }

          // Fetch score history
          const historyResponse = await scoringService.getScoreHistory(user.id);
          if (historyResponse.success) {
            setScoreHistory(historyResponse.data);
          }

          // Fetch accounts
          const accountsResponse = await dataIngestionService.getUserAccounts(user.id);
          if (accountsResponse.success) {
            setAccounts(accountsResponse.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Prepare chart data
  const chartData = scoreHistory.map(score => ({
    date: new Date(score.calculatedAt).toLocaleDateString(),
    score: score.sbiScore
  })).slice(0, 10).reverse();

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-success-600 bg-success-50';
    if (score >= 650) return 'text-primary-600 bg-primary-50';
    if (score >= 550) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-primary-100">
          Here's your financial overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Latest Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Latest Score</span>
            <TrendingUp className="text-primary-600" size={20} />
          </div>
          <div className={`text-3xl font-bold ${latestScore ? getScoreColor(latestScore.sbiScore).split(' ')[0] : 'text-gray-400'}`}>
            {latestScore ? latestScore.sbiScore : '---'}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {latestScore ? latestScore.scoreCategory : 'No score yet'}
          </p>
        </div>

        {/* Total Accounts */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Bank Accounts</span>
            <Wallet className="text-success-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{accounts.length}</div>
          <p className="text-sm text-gray-500 mt-1">Active accounts</p>
        </div>

        {/* Score History Count */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Score History</span>
            <History className="text-warning-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{scoreHistory.length}</div>
          <p className="text-sm text-gray-500 mt-1">Calculations</p>
        </div>

        {/* Credit Cards */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Credit Cards</span>
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {accounts.filter(a => a.accountType === 'CREDIT_CARD').length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Active cards</p>
        </div>
      </div>

      {/* Score Trend Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[300, 850]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/calculate-score" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
              <Calculator className="text-primary-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Calculate Score</h3>
              <p className="text-sm text-gray-600">Get your latest credit score</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary-600" size={20} />
          </div>
        </Link>

        <Link to="/accounts" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-success-100 p-3 rounded-lg group-hover:bg-success-600 transition-colors">
              <Wallet className="text-success-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Manage Accounts</h3>
              <p className="text-sm text-gray-600">View and add accounts</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-success-600" size={20} />
          </div>
        </Link>

        <Link to="/score-history" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-warning-100 p-3 rounded-lg group-hover:bg-warning-600 transition-colors">
              <History className="text-warning-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Score History</h3>
              <p className="text-sm text-gray-600">View past calculations</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-warning-600" size={20} />
          </div>
        </Link>
      </div>

      {/* Latest Score Details */}
      {latestScore && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {latestScore.components.paymentConsistency.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Payment</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">
                {latestScore.components.incomeReliability.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Income</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">
                {latestScore.components.transactionPatterns.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Transaction</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {latestScore.components.savingsStability.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Savings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
