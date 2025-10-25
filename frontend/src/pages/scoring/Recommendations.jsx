import { useState, useEffect } from 'react';
import { Target, Zap, TrendingUp, AlertCircle, CheckCircle, DollarSign, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { scoringService, mlService } from '../../services';

const Recommendations = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [potentialScore, setPotentialScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeframe, setTimeframe] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (user?.id) {
          // Fetch latest score
          const scoreResponse = await scoringService.getLatestScore(user.id);
          
          if (scoreResponse.success) {
            const score = scoreResponse.data;
            setCurrentScore(score.sbiScore);
            
            // Fetch detailed recommendations
            const recResponse = await mlService.getRecommendations({
              paymentConsistency: score.components.paymentConsistency,
              incomeReliability: score.components.incomeReliability,
              transactionPatterns: score.components.transactionPatterns,
              savingsStability: score.components.savingsStability,
              currentScore: score.sbiScore,
              creditUtilizationRatio: 30,
              monthlyInhandSalary: 50000,
              monthlyBalance: 20000,
              amountInvestedMonthly: 5000,
              totalEmiPerMonth: 15000,
              numCreditInquiries: 2
            });
            
            if (recResponse.success) {
              setRecommendations(recResponse.data.recommendations);
              setPotentialScore(recResponse.data.potentialScore);
              setTimeframe(recResponse.data.timeframe);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="text-danger-600" size={20} />;
      case 'medium':
        return <Target className="text-warning-600" size={20} />;
      default:
        return <CheckCircle className="text-info-600" size={20} />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
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
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={32} />
          <h1 className="text-3xl font-bold">AI-Powered Recommendations</h1>
        </div>
        <p className="text-primary-100">
          Personalized suggestions to improve your credit score
        </p>
      </div>

      {/* Score Improvement Potential */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center bg-gradient-to-br from-blue-50 to-white">
          <div className="text-sm text-gray-600 mb-2">Current Score</div>
          <div className="text-4xl font-bold text-primary-600 mb-1">{currentScore}</div>
          <div className="text-xs text-gray-500">Your starting point</div>
        </div>
        
        <div className="card text-center bg-gradient-to-br from-green-50 to-white">
          <div className="text-sm text-gray-600 mb-2">Potential Score</div>
          <div className="text-4xl font-bold text-success-600 mb-1">{potentialScore}</div>
          <div className="text-xs text-gray-500">With improvements</div>
        </div>
        
        <div className="card text-center bg-gradient-to-br from-purple-50 to-white">
          <div className="text-sm text-gray-600 mb-2">Improvement</div>
          <div className="text-4xl font-bold text-primary-700 mb-1">
            +{potentialScore - currentScore}
          </div>
          <div className="text-xs text-gray-500">{timeframe}</div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Score Improvement Progress</span>
          <span className="text-sm text-gray-600">{currentScore} → {potentialScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentScore / potentialScore) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          You're {((currentScore / potentialScore) * 100).toFixed(0)}% of the way to your potential score!
        </p>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="text-primary-700" size={28} />
          Your Action Plan
        </h2>
        
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className="card border-l-4 hover:shadow-xl transition-shadow"
            style={{ 
              borderLeftColor: rec.priority === 'high' ? '#ef4444' : 
                               rec.priority === 'medium' ? '#f59e0b' : '#3b82f6'
            }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getPriorityIcon(rec.priority)}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${getPriorityBadge(rec.priority)} text-xs`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {rec.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  
                  {/* Impact Badge */}
                  <div className="ml-4 text-right flex-shrink-0">
                    <div className="bg-success-50 px-3 py-2 rounded-lg">
                      <div className="text-xs text-success-700 font-medium">Impact</div>
                      <div className="text-sm font-bold text-success-600">{rec.impact}</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Steps */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-primary-600" size={18} />
                    <span className="font-semibold text-gray-900 text-sm">Action Steps:</span>
                  </div>
                  <ul className="space-y-2">
                    {rec.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-primary-500 font-bold mt-0.5">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div className="card bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 border-2 border-primary-200">
        <div className="text-center">
          <Zap className="text-primary-700 mx-auto mb-3" size={40} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            You're on the right track! 🎯
          </h3>
          <p className="text-gray-700 mb-4">
            By following these {recommendations.length} recommendations, you could see significant improvements 
            in your credit score within {timeframe}. Stay consistent and monitor your progress!
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600">High Priority</div>
              <div className="text-lg font-bold text-danger-600">
                {recommendations.filter(r => r.priority === 'high').length}
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600">Medium Priority</div>
              <div className="text-lg font-bold text-warning-600">
                {recommendations.filter(r => r.priority === 'medium').length}
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600">Quick Wins</div>
              <div className="text-lg font-bold text-success-600">
                {recommendations.filter(r => r.priority === 'low').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
