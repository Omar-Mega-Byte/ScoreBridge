import { useEffect, useState } from 'react';
import { History, Calendar, TrendingUp } from 'lucide-react';
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
    if (score >= 750) return 'text-success-600';
    if (score >= 650) return 'text-primary-600';
    if (score >= 550) return 'text-warning-600';
    return 'text-danger-600';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <History className="text-primary-600" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Score History</h1>
        <p className="text-gray-600 mt-2">Track your credit score progress over time</p>
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
        <div className="space-y-4">
          {history.map((score) => (
            <div key={score.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`text-4xl font-bold ${getScoreColor(score.sbiScore)}`}>
                    {score.sbiScore}
                  </div>
                  <div>
                    <span className={`badge ${getCategoryBadge(score.scoreCategory)}`}>
                      {score.scoreCategory}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Calendar size={16} />
                      <span>{new Date(score.calculatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Payment</div>
                    <div className="font-semibold text-primary-600">
                      {score.components.paymentConsistency.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Income</div>
                    <div className="font-semibold text-success-600">
                      {score.components.incomeReliability.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transaction</div>
                    <div className="font-semibold text-warning-600">
                      {score.components.transactionPatterns.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Savings</div>
                    <div className="font-semibold text-purple-600">
                      {score.components.savingsStability.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;
