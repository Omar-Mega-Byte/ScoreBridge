import { useEffect, useState } from 'react';
import { History, Calendar, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, BarChart3, Activity, Award, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAuthStore from '../../store/authStore';
import { scoringService } from '../../services';

const ScoreHistory = () => {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user?.id) {
          const response = await scoringService.getScoreHistory(user.id);
          if (response.success) {
            setHistory(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch score history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-primary-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 750) return 'bg-green-50';
    if (score >= 650) return 'bg-primary-50';
    if (score >= 550) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Excellent': 'badge-success',
      'Very Good': 'badge-info',
      'Good': 'badge-info',
      'Fair': 'badge-warning',
      'Poor': 'badge-danger',
    };
    return badges[category] || 'badge-info';
  };

  const calculateTrend = () => {
    if (history.length < 2) return null;
    const latest = history[0].sbiScore;
    const previous = history[1].sbiScore;
    const change = latest - previous;
    return {
      change,
      percentage: ((change / previous) * 100).toFixed(1),
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  const getChartData = () => {
    return [...history].reverse().map((score, index) => ({
      date: new Date(score.calculatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: score.sbiScore,
      payment: score.components.paymentConsistency,
      income: score.components.incomeReliability,
      transaction: score.components.transactionPatterns,
      savings: score.components.savingsStability,
    }));
  };

  const getLatestComponentsData = () => {
    if (history.length === 0) return [];
    const latest = history[0];
    return [
      { component: 'Payment', value: latest.components.paymentConsistency, fullMark: 250 },
      { component: 'Income', value: latest.components.incomeReliability, fullMark: 250 },
      { component: 'Transaction', value: latest.components.transactionPatterns, fullMark: 250 },
      { component: 'Savings', value: latest.components.savingsStability, fullMark: 250 },
    ];
  };

  const getAverageScore = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, score) => acc + score.sbiScore, 0);
    return Math.round(sum / history.length);
  };

  const getHighestScore = () => {
    if (history.length === 0) return 0;
    return Math.max(...history.map(s => s.sbiScore));
  };

  const getLowestScore = () => {
    if (history.length === 0) return 0;
    return Math.min(...history.map(s => s.sbiScore));
  };

  const trend = calculateTrend();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <History className="text-primary-600" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Score History</h1>
        <p className="text-gray-600">Track your credit score journey and celebrate your progress</p>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="text-gray-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Score History Yet</h2>
          <p className="text-gray-600 mb-6">Calculate your first credit score to start tracking</p>
          <a href="/calculate-score" className="btn-primary px-6 py-3">
            Calculate Score Now
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Current Score */}
            <div className={`${getScoreBgColor(history[0].sbiScore)} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Current Score</h3>
                <Activity className={getScoreColor(history[0].sbiScore)} size={20} />
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(history[0].sbiScore)} mb-2`}>
                {history[0].sbiScore}
              </div>
              {trend && !trend.isNeutral && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {Math.abs(trend.change)} ({trend.isPositive ? '+' : ''}{trend.percentage}%)
                </div>
              )}
            </div>

            {/* Average Score */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-primary-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
                <Target className="text-primary-600" size={20} />
              </div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {getAverageScore()}
              </div>
              <div className="text-sm text-gray-500">
                Over {history.length} calculation{history.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Highest Score */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Highest Score</h3>
                <Award className="text-green-600" size={20} />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {getHighestScore()}
              </div>
              <div className="text-sm text-green-700 font-medium">
                🎉 Your best score!
              </div>
            </div>

            {/* Total Calculations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Calculations</h3>
                <BarChart3 className="text-primary-700" size={20} />
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">
                {history.length}
              </div>
              <div className="text-sm text-primary-700 font-medium">
                Keep tracking! 📊
              </div>
            </div>
          </div>

          {/* Score Trend Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-primary-600" size={28} />
                Score Trend Over Time
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[300, 900]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#scoreGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Component Breakdown Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Line Chart for Components */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Component Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="payment" stroke="#3b82f6" strokeWidth={2} name="Payment" />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="transaction" stroke="#f59e0b" strokeWidth={2} name="Transaction" />
                  <Line type="monotone" dataKey="savings" stroke="#8b5cf6" strokeWidth={2} name="Savings" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart for Latest Components */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Component Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getLatestComponentsData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="component" />
                  <PolarRadiusAxis angle={90} domain={[0, 250]} />
                  <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart for Component Comparison */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Component Comparison Across History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payment" fill="#3b82f6" name="Payment" />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="transaction" fill="#f59e0b" name="Transaction" />
                <Bar dataKey="savings" fill="#8b5cf6" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed History Timeline */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Timeline</h2>
            <div className="space-y-4">
              {history.map((score, index) => {
                const isLatest = index === 0;
                const prevScore = index < history.length - 1 ? history[index + 1].sbiScore : null;
                const scoreChange = prevScore ? score.sbiScore - prevScore : null;
                
                return (
                  <div key={score.id} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${isLatest ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`text-5xl font-bold ${getScoreColor(score.sbiScore)}`}>
                            {score.sbiScore}
                          </div>
                          {isLatest && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold text-yellow-900">
                              Latest
                            </span>
                          )}
                        </div>
                        <div>
                          <span className={`badge ${getCategoryBadge(score.scoreCategory)} mb-2`}>
                            {score.scoreCategory}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>{new Date(score.calculatedAt).toLocaleString()}</span>
                          </div>
                          {scoreChange !== null && (
                            <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${scoreChange > 0 ? 'text-green-600' : scoreChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {scoreChange > 0 ? <ArrowUp size={16} /> : scoreChange < 0 ? <ArrowDown size={16} /> : <Minus size={16} />}
                              {scoreChange > 0 ? '+' : ''}{scoreChange} from previous
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-primary-50 p-3 rounded-lg">
                          <div className="text-gray-600 text-xs mb-1">Payment</div>
                          <div className="font-bold text-primary-600 text-lg">
                            {score.components.paymentConsistency.toFixed(0)}
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-gray-600 text-xs mb-1">Income</div>
                          <div className="font-bold text-green-600 text-lg">
                            {score.components.incomeReliability.toFixed(0)}
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="text-gray-600 text-xs mb-1">Transaction</div>
                          <div className="font-bold text-yellow-600 text-lg">
                            {score.components.transactionPatterns.toFixed(0)}
                          </div>
                        </div>
                        <div className="bg-primary-50 p-3 rounded-lg">
                          <div className="text-gray-600 text-xs mb-1">Savings</div>
                          <div className="font-bold text-primary-700 text-lg">
                            {score.components.savingsStability.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;
