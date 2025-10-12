import { CheckCircle, AlertTriangle, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ScoreResult = ({ result, onCalculateAgain }) => {
  const { sbiScore, scoreCategory, riskLevel, components, explanation, recommendations, confidenceLevel } = result;

  // Determine score color and icon
  const getScoreColor = () => {
    if (sbiScore >= 750) return 'text-success-600';
    if (sbiScore >= 650) return 'text-primary-600';
    if (sbiScore >= 550) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getCategoryBadge = () => {
    const badges = {
      'Excellent': 'badge-success',
      'Very Good': 'badge-info',
      'Good': 'badge-info',
      'Fair': 'badge-warning',
      'Poor': 'badge-danger',
    };
    return badges[scoreCategory] || 'badge-info';
  };

  const getRiskBadge = () => {
    const badges = {
      'Low Risk': 'badge-success',
      'Moderate Risk': 'badge-warning',
      'High Risk': 'badge-danger',
    };
    return badges[riskLevel] || 'badge-info';
  };

  // Prepare data for pie chart - showing raw component scores
  const chartData = [
    { name: 'Payment Score', value: components.paymentConsistency, weight: '35%', color: '#3b82f6' },
    { name: 'Income Score', value: components.incomeReliability, weight: '25%', color: '#10b981' },
    { name: 'Transaction Score', value: components.transactionPatterns, weight: '20%', color: '#f59e0b' },
    { name: 'Savings Score', value: components.savingsStability, weight: '20%', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Main Score Card */}
      <div className="card text-center bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-center justify-center mb-4">
          <Award className="text-primary-600" size={48} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your ScoreBridge Index</h2>
        <div className={`text-7xl font-bold mb-4 ${getScoreColor()}`}>
          {sbiScore}
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className={`badge ${getCategoryBadge()} text-lg px-6 py-2`}>
            {scoreCategory}
          </span>
          <span className={`badge ${getRiskBadge()} text-lg px-6 py-2`}>
            {riskLevel}
          </span>
        </div>
        <p className="text-gray-600 mt-4">
          Score Range: 300-850 | Confidence: {confidenceLevel}%
        </p>
      </div>

      {/* Components Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Scores */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary-600" size={24} />
            Score Components
          </h3>
          <div className="space-y-4">
            {/* Payment Consistency */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Payment Consistency (35%)</span>
                <span className="text-primary-600 font-bold">{components.paymentConsistency.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                <div
                  className="bg-primary-600 h-3 rounded-full"
                  style={{ 
                    width: `${Math.min(100, components.paymentConsistency)}%`,
                    transition: 'width 500ms ease-in-out',
                    display: 'block'
                  }}
                ></div>
              </div>
            </div>

            {/* Income Reliability */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Income Reliability (25%)</span>
                <span className="text-success-600 font-bold">{components.incomeReliability.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                <div
                  className="h-3 rounded-full"
                  style={{ 
                    width: `${Math.min(100, components.incomeReliability)}%`,
                    backgroundColor: '#059669',
                    transition: 'width 500ms ease-in-out',
                    display: 'block'
                  }}
                ></div>
              </div>
            </div>

            {/* Transaction Patterns */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Transaction Patterns (20%)</span>
                <span className="text-warning-600 font-bold">{components.transactionPatterns.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                <div
                  className="h-3 rounded-full"
                  style={{ 
                    width: `${Math.min(100, components.transactionPatterns)}%`,
                    backgroundColor: '#d97706',
                    transition: 'width 500ms ease-in-out',
                    display: 'block'
                  }}
                ></div>
              </div>
            </div>

            {/* Savings Stability */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Savings Stability (20%)</span>
                <span className="text-purple-600 font-bold">{components.savingsStability.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                <div
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ 
                    width: `${Math.min(100, components.savingsStability)}%`,
                    transition: 'width 500ms ease-in-out',
                    display: 'block'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Component Score Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">
            Showing raw component scores (not weighted contributions)
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ name, value }) => `${value.toFixed(0)}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `Score: ${value.toFixed(1)} | Weight: ${props.payload.weight}`,
                  props.payload.name
                ]}
              />
              <Legend 
                verticalAlign="bottom"
                height={80}
                formatter={(value, entry) => `${entry.payload.name} (Weight: ${entry.payload.weight})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="card bg-primary-50 border border-primary-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-primary-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What This Means</h3>
              <p className="text-gray-700">{explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && (
        <div className="card bg-warning-50 border border-warning-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-warning-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Improve Your Score</h3>
              <div className="text-gray-700 whitespace-pre-line">{recommendations}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onCalculateAgain}
          className="btn-outline px-6 py-3 flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Calculate Again
        </button>
        <a
          href="/dashboard"
          className="btn-primary px-6 py-3 flex items-center gap-2"
        >
          <TrendingUp size={20} />
          View Dashboard
        </a>
      </div>
    </div>
  );
};

export default ScoreResult;
