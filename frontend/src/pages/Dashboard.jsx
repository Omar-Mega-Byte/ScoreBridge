import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CreditCard, Wallet, History, Calculator, ArrowRight, Target, AlertCircle, Zap, PieChart as PieChartIcon, DollarSign, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import useAuthStore from '../store/authStore';
import { scoringService, dataIngestionService, mlService } from '../services';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [latestScore, setLatestScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spendingAnalysis, setSpendingAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.id) {
          // Fetch latest score
          const scoreResponse = await scoringService.getLatestScore(user.id);
          if (scoreResponse.success) {
            setLatestScore(scoreResponse.data);
            
            // Fetch recommendations based on latest score
            const recResponse = await mlService.getRecommendations({
              paymentConsistency: scoreResponse.data.components.paymentConsistency,
              incomeReliability: scoreResponse.data.components.incomeReliability,
              transactionPatterns: scoreResponse.data.components.transactionPatterns,
              savingsStability: scoreResponse.data.components.savingsStability,
              currentScore: scoreResponse.data.sbiScore,
              creditUtilizationRatio: 30, // You can get this from user profile
              monthlyInhandSalary: 50000,
              monthlyBalance: 20000,
              amountInvestedMonthly: 5000,
              totalEmiPerMonth: 15000,
              numCreditInquiries: 2
            });
            
            if (recResponse.success) {
              setRecommendations(recResponse.data.recommendations.slice(0, 3));
            }
            
            // Fetch spending analysis
            const spendingResponse = await mlService.analyzeSpending({
              monthlyInhandSalary: 50000,
              monthlyBalance: 20000,
              totalEmiPerMonth: 15000,
              amountInvestedMonthly: 5000
            });
            
            if (spendingResponse.success) {
              setSpendingAnalysis(spendingResponse.data);
            }
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
            <CreditCard className="text-primary-700" size={20} />
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

        <Link to="/recommendations" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Target className="text-primary-700 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
              <p className="text-sm text-gray-600">Get personalized advice</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary-700" size={20} />
          </div>
        </Link>

        <Link to="/score-simulator" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
              <Zap className="text-primary-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Score Simulator</h3>
              <p className="text-sm text-gray-600">What-if scenarios</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary-600" size={20} />
          </div>
        </Link>

        <Link to="/accounts" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
              <Wallet className="text-primary-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Manage Accounts</h3>
              <p className="text-sm text-gray-600">View and add accounts</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary-600" size={20} />
          </div>
        </Link>

        <Link to="/score-history" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
              <History className="text-primary-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Score History</h3>
              <p className="text-sm text-gray-600">View past calculations</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary-600" size={20} />
          </div>
        </Link>

        <Link to="/financial-profile" className="card hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-600 transition-colors">
              <DollarSign className="text-pink-600 group-hover:text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Financial Profile</h3>
              <p className="text-sm text-gray-600">Update your info</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-pink-600" size={20} />
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
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-700">
                {latestScore.components.savingsStability.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Savings</div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Health & Spending Analysis */}
      {spendingAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Health Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Zap className={`text-${spendingAnalysis.healthColor}-600`} size={24} />
                Financial Health
              </h3>
              <span className={`badge badge-${spendingAnalysis.healthColor} text-lg px-4 py-1`}>
                {spendingAnalysis.spendingHealth}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EMI Ratio</span>
                <span className="font-semibold">{spendingAnalysis.metrics.emiRatio}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${spendingAnalysis.metrics.emiRatio > 40 ? 'bg-danger-500' : 'bg-success-500'}`}
                  style={{ width: `${Math.min(100, spendingAnalysis.metrics.emiRatio)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Savings Rate</span>
                <span className="font-semibold">{spendingAnalysis.metrics.savingsRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-success-500"
                  style={{ width: `${Math.min(100, spendingAnalysis.metrics.savingsRate)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Investment Rate</span>
                <span className="font-semibold">{spendingAnalysis.metrics.investmentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${Math.min(100, spendingAnalysis.metrics.investmentRate)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary-50 rounded-lg">
              <p className="text-xs text-primary-700 font-medium">💡 Target: EMI &lt; 40%, Savings &gt; 20%, Investment &gt; 10%</p>
            </div>
          </div>

          {/* Spending Breakdown */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="text-primary-700" size={24} />
              Spending Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'EMI', value: spendingAnalysis.breakdown.emi, color: '#ef4444' },
                    { name: 'Investments', value: spendingAnalysis.breakdown.investments, color: '#3b82f6' },
                    { name: 'Savings', value: spendingAnalysis.breakdown.savings, color: '#10b981' },
                    { name: 'Spending', value: spendingAnalysis.breakdown.estimatedSpending, color: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'EMI', value: spendingAnalysis.breakdown.emi, color: '#ef4444' },
                    { name: 'Investments', value: spendingAnalysis.breakdown.investments, color: '#3b82f6' },
                    { name: 'Savings', value: spendingAnalysis.breakdown.savings, color: '#10b981' },
                    { name: 'Spending', value: spendingAnalysis.breakdown.estimatedSpending, color: '#f59e0b' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">${spendingAnalysis.breakdown.emi.toLocaleString()}</div>
                <div className="text-xs text-gray-600">EMI</div>
              </div>
              <div className="text-center p-2 bg-primary-50 rounded">
                <div className="text-lg font-bold text-primary-600">${spendingAnalysis.breakdown.investments.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Investments</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">${spendingAnalysis.breakdown.savings.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Savings</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-lg font-bold text-yellow-600">${spendingAnalysis.breakdown.estimatedSpending.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Spending</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Recommendations */}
      {recommendations.length > 0 && (
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-primary-700" size={24} />
            🤖 AI-Powered Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-primary-500 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${rec.priority === 'high' ? 'badge-danger' : rec.priority === 'medium' ? 'badge-warning' : 'badge-info'} text-xs`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{rec.category}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xs text-gray-500">Potential Impact</div>
                    <div className="text-sm font-semibold text-success-600">{rec.impact}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Action Steps:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {rec.actions.slice(0, 3).map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary-600">→</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg text-center">
            <p className="text-sm text-gray-600">
              ✨ Following these recommendations could improve your score by <span className="font-bold text-success-600">50-80 points</span> in 3-6 months!
            </p>
          </div>
        </div>
      )}

      {/* Financial Insights */}
      {spendingAnalysis && spendingAnalysis.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spendingAnalysis.insights.map((insight, index) => (
            <div key={index} className={`card border-l-4 ${
              insight.type === 'warning' ? 'border-warning-500 bg-warning-50' : 
              insight.type === 'success' ? 'border-success-500 bg-success-50' : 
              'border-info-500 bg-primary-50'
            }`}>
              <div className="flex items-start gap-3">
                {insight.type === 'warning' && <AlertCircle className="text-warning-600 flex-shrink-0" size={20} />}
                {insight.type === 'success' && <TrendingUp className="text-success-600 flex-shrink-0" size={20} />}
                {insight.type === 'info' && <DollarSign className="text-primary-600 flex-shrink-0" size={20} />}
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
