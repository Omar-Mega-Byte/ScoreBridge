import { User, Mail, Phone, Calendar, TrendingUp, Award, Activity, Target, Edit2, Save, X, Shield, CreditCard, Wallet, PieChart, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useAuthStore from '../../store/authStore';
import { scoringService, dataIngestionService } from '../../services';

const Profile = () => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [latestScore, setLatestScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
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

          // Fetch financial profile
          const profileResponse = await dataIngestionService.getFinancialProfile(user.id);
          if (profileResponse.success) {
            setFinancialData(profileResponse.data);
          }
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-primary-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 750) return 'bg-green-50 border-green-200';
    if (score >= 650) return 'bg-primary-50 border-primary-200';
    if (score >= 550) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const calculateDaysSinceJoined = () => {
    if (!user?.createdAt) return 0;
    const joined = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - joined);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAchievements = () => {
    const achievements = [];
    const calculations = scoreHistory.length;
    const daysSinceJoined = calculateDaysSinceJoined();

    if (calculations >= 1) achievements.push({ icon: '🎯', title: 'First Score', desc: 'Calculated your first score' });
    if (calculations >= 5) achievements.push({ icon: '📊', title: 'Tracking Pro', desc: '5+ score calculations' });
    if (calculations >= 10) achievements.push({ icon: '🏆', title: 'Dedicated User', desc: '10+ score calculations' });
    if (latestScore && latestScore.sbiScore >= 750) achievements.push({ icon: '⭐', title: 'Excellent Score', desc: 'Achieved 750+ score' });
    if (latestScore && latestScore.sbiScore >= 800) achievements.push({ icon: '💎', title: 'Diamond Status', desc: 'Achieved 800+ score' });
    if (daysSinceJoined >= 7) achievements.push({ icon: '📅', title: 'Week Warrior', desc: 'Active for 1 week' });
    if (daysSinceJoined >= 30) achievements.push({ icon: '🗓️', title: 'Monthly Member', desc: 'Active for 1 month' });
    if (financialData?.amountInvestedMonthly > 0) achievements.push({ icon: '💰', title: 'Smart Investor', desc: 'Regular investments' });

    return achievements;
  };

  const getComponentsData = () => {
    if (!latestScore) return [];
    return [
      { name: 'Payment', value: latestScore.components.paymentConsistency, color: '#3b82f6' },
      { name: 'Income', value: latestScore.components.incomeReliability, color: '#10b981' },
      { name: 'Transaction', value: latestScore.components.transactionPatterns, color: '#f59e0b' },
      { name: 'Savings', value: latestScore.components.savingsStability, color: '#8b5cf6' },
    ];
  };

  const calculateScoreTrend = () => {
    if (scoreHistory.length < 2) return null;
    const latest = scoreHistory[0].sbiScore;
    const oldest = scoreHistory[scoreHistory.length - 1].sbiScore;
    const change = latest - oldest;
    return {
      change,
      percentage: ((change / oldest) * 100).toFixed(1),
      isPositive: change > 0
    };
  };

  const trend = calculateScoreTrend();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <User className="text-primary-600" size={64} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user?.name || 'User'}</h1>
            <div className="flex flex-col md:flex-row gap-4 text-sm opacity-90">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} />
                <span>{user?.email || 'N/A'}</span>
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone size={16} />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Calendar size={16} />
                <span>Joined {calculateDaysSinceJoined()} days ago</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setEditing(!editing)}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-all flex items-center gap-2 shadow-lg"
          >
            {editing ? <><X size={20} /> Cancel</> : <><Edit2 size={20} /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        {/* Current Score */}
        {latestScore && (
          <div className={`rounded-xl p-6 shadow-lg border-2 ${getScoreBgColor(latestScore.sbiScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Current Score</h3>
              <Activity className={getScoreColor(latestScore.sbiScore)} size={20} />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(latestScore.sbiScore)}`}>
              {latestScore.sbiScore}
            </div>
            <div className="text-sm text-gray-600 mt-1">{latestScore.scoreCategory}</div>
          </div>
        )}

        {/* Total Calculations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Calculations</h3>
            <Target className="text-primary-600" size={20} />
          </div>
          <div className="text-4xl font-bold text-primary-600">
            {scoreHistory.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Score checks</div>
        </div>

        {/* Score Improvement */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Overall Trend</h3>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          {trend ? (
            <>
              <div className={`text-4xl font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.change}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {trend.percentage}% change
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">Calculate more to see trend</div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Achievements</h3>
            <Award className="text-yellow-600" size={20} />
          </div>
          <div className="text-4xl font-bold text-yellow-600">
            {getAchievements().length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Badges earned</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Score Components */}
          {latestScore && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="text-primary-700" size={28} />
                Score Breakdown
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie
                      data={getComponentsData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getComponentsData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Payment</span>
                    <span className="text-lg font-bold text-primary-600">
                      {latestScore.components.paymentConsistency.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Income</span>
                    <span className="text-lg font-bold text-green-600">
                      {latestScore.components.incomeReliability.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Transaction</span>
                    <span className="text-lg font-bold text-yellow-600">
                      {latestScore.components.transactionPatterns.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Savings</span>
                    <span className="text-lg font-bold text-primary-700">
                      {latestScore.components.savingsStability.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Snapshot */}
          {financialData && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="text-green-600" size={28} />
                Financial Snapshot
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Monthly Investment</div>
                  <div className="text-2xl font-bold text-primary-600">
                    ${financialData.amountInvestedMonthly?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Outstanding Debt</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${financialData.outstandingDebt?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Monthly EMI</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${financialData.totalEmiPerMonth?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="text-primary-600" size={28} />
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">User ID</div>
                  <div className="font-medium text-gray-900">#{user?.id}</div>
                </div>
                <User className="text-gray-400" size={20} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium text-gray-900">{user?.email}</div>
                </div>
                <Mail className="text-gray-400" size={20} />
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{user.phoneNumber}</div>
                  </div>
                  <Phone className="text-gray-400" size={20} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements & Stats */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-yellow-600" size={28} />
              Achievements
            </h2>
            <div className="space-y-3">
              {getAchievements().length > 0 ? (
                getAchievements().map((achievement, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-yellow-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="font-bold text-gray-800">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.desc}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>Start your journey to earn achievements!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a 
                href="/calculate-score" 
                className="block bg-white p-4 rounded-lg hover:shadow-md transition-all border-2 border-primary-100"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="text-primary-600" size={24} />
                  <div>
                    <div className="font-semibold text-gray-800">Calculate Score</div>
                    <div className="text-xs text-gray-600">Check your latest score</div>
                  </div>
                </div>
              </a>
              <a 
                href="/score-history" 
                className="block bg-white p-4 rounded-lg hover:shadow-md transition-all border-2 border-primary-100"
              >
                <div className="flex items-center gap-3">
                  <Activity className="text-primary-700" size={24} />
                  <div>
                    <div className="font-semibold text-gray-800">View History</div>
                    <div className="text-xs text-gray-600">Track your progress</div>
                  </div>
                </div>
              </a>
              <a 
                href="/recommendations" 
                className="block bg-white p-4 rounded-lg hover:shadow-md transition-all border-2 border-green-100"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-600" size={24} />
                  <div>
                    <div className="font-semibold text-gray-800">Get Recommendations</div>
                    <div className="text-xs text-gray-600">Improve your score</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
