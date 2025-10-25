import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, RefreshCw, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { scoringService, mlService } from '../../services';

const ScoreSimulator = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [simulatedScore, setSimulatedScore] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);
  const [componentChanges, setComponentChanges] = useState(null);
  const [recommendation, setRecommendation] = useState('neutral');
  
  // Current data
  const [currentData, setCurrentData] = useState({
    age: 30,
    annualIncome: 600000,
    monthlyInhandSalary: 50000,
    monthlyBalance: 20000,
    numBankAccounts: 2,
    numCreditCard: 1,
    interestRate: 12,
    numOfLoan: 1,
    delayFromDueDate: 5,
    numOfDelayedPayment: 1,
    numCreditInquiries: 2,
    creditUtilizationRatio: 30,
    creditHistoryAgeMonths: 36,
    totalEmiPerMonth: 15000,
    amountInvestedMonthly: 5000,
    outstandingDebt: 200000
  });

  // Simulated changes
  const [changes, setChanges] = useState({});

  useEffect(() => {
    const fetchCurrentScore = async () => {
      try {
        if (user?.id) {
          const scoreResponse = await scoringService.getLatestScore(user.id);
          if (scoreResponse.success) {
            const score = scoreResponse.data.sbiScore;
            setCurrentScore(score);
            // Also set a baseline simulated score
            setSimulatedScore(score);
          }
        } else {
          // For non-logged in users, set defaults
          setCurrentScore(650);
          setSimulatedScore(650);
        }
      } catch (error) {
        console.error('Failed to fetch current score:', error);
        // Set defaults on error
        setCurrentScore(650);
        setSimulatedScore(650);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentScore();
  }, [user]);

  const simulateScore = async () => {
    if (Object.keys(changes).length === 0) {
      alert('Please make at least one change to simulate');
      return;
    }
    
    setLoading(true);
    try {
      const response = await mlService.simulateScore(currentData, changes);
      
      if (response.success) {
        setSimulatedScore(response.data.simulatedScore);
        setScoreDifference(response.data.scoreDifference);
        setComponentChanges(response.data.componentChanges);
        setRecommendation(response.data.recommendation);
      } else {
        console.error('Simulation error:', response.error);
        alert(`Simulation failed: ${response.error}`);
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed. Please make sure the ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (field, value) => {
    setChanges({
      ...changes,
      [field]: parseFloat(value) || 0
    });
  };

  const resetSimulation = () => {
    setChanges({});
    setSimulatedScore(0);
    setScoreDifference(0);
    setComponentChanges(null);
    setRecommendation('neutral');
  };

  const scenarios = [
    {
      name: 'Pay Off Credit Card',
      description: 'Reduce credit utilization to 10%',
      changes: { creditUtilizationRatio: 10 }
    },
    {
      name: 'Clear All Delays',
      description: 'Zero delayed payments',
      changes: { numOfDelayedPayment: 0, delayFromDueDate: 0 }
    },
    {
      name: 'Increase Investments',
      description: 'Double monthly investments',
      changes: { amountInvestedMonthly: currentData.amountInvestedMonthly * 2 }
    },
    {
      name: 'Reduce Debt Burden',
      description: 'Pay off 50% of outstanding debt',
      changes: { outstandingDebt: currentData.outstandingDebt * 0.5, totalEmiPerMonth: currentData.totalEmiPerMonth * 0.5 }
    }
  ];

  const applyScenario = (scenario) => {
    setChanges(scenario.changes);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Calculator size={32} />
          <h1 className="text-3xl font-bold">Score Simulator</h1>
        </div>
        <p className="text-primary-100">
          See how financial changes would affect your credit score
        </p>
      </div>

      {/* Quick Scenarios */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="text-primary-600" size={24} />
          Quick Scenarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => applyScenario(scenario)}
              className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-lg border-2 border-primary-200 hover:border-primary-400 transition-all text-left"
            >
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{scenario.name}</h3>
              <p className="text-xs text-gray-600">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjust Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Utilization (%)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder={currentData.creditUtilizationRatio}
                value={changes.creditUtilizationRatio || ''}
                onChange={(e) => handleChangeInput('creditUtilizationRatio', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current: {currentData.creditUtilizationRatio}%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delayed Payments
              </label>
              <input
                type="number"
                className="input-field"
                placeholder={currentData.numOfDelayedPayment}
                value={changes.numOfDelayedPayment || ''}
                onChange={(e) => handleChangeInput('numOfDelayedPayment', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current: {currentData.numOfDelayedPayment}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Investment ($)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder={currentData.amountInvestedMonthly}
                value={changes.amountInvestedMonthly || ''}
                onChange={(e) => handleChangeInput('amountInvestedMonthly', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current: ${currentData.amountInvestedMonthly.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outstanding Debt ($)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder={currentData.outstandingDebt}
                value={changes.outstandingDebt || ''}
                onChange={(e) => handleChangeInput('outstandingDebt', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current: ${currentData.outstandingDebt.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly EMI ($)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder={currentData.totalEmiPerMonth}
                value={changes.totalEmiPerMonth || ''}
                onChange={(e) => handleChangeInput('totalEmiPerMonth', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current: ${currentData.totalEmiPerMonth.toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={simulateScore}
                disabled={Object.keys(changes).length === 0 || loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Calculator size={20} />
                Simulate
              </button>
              <button
                onClick={resetSimulation}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Score Comparison */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Simulation Results</h2>
            
            {simulatedScore > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Current Score</div>
                    <div className="text-3xl font-bold text-primary-600">{currentScore}</div>
                  </div>
                  <div className="text-center p-4 bg-primary-100 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Simulated Score</div>
                    <div className="text-3xl font-bold text-primary-700">{simulatedScore}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${
                  recommendation === 'positive' ? 'bg-success-50 border-2 border-success-200' :
                  recommendation === 'negative' ? 'bg-danger-50 border-2 border-danger-200' :
                  'bg-gray-50 border-2 border-gray-200'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {recommendation === 'positive' && <TrendingUp className="text-success-600" size={24} />}
                    {recommendation === 'negative' && <TrendingDown className="text-danger-600" size={24} />}
                    {recommendation === 'neutral' && <Minus className="text-gray-600" size={24} />}
                    <span className={`text-2xl font-bold ${
                      recommendation === 'positive' ? 'text-success-600' :
                      recommendation === 'negative' ? 'text-danger-600' :
                      'text-gray-600'
                    }`}>
                      {scoreDifference > 0 ? '+' : ''}{scoreDifference} points
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {recommendation === 'positive' && '✅ Great! These changes would improve your score'}
                    {recommendation === 'negative' && '⚠️ Warning: These changes could hurt your score'}
                    {recommendation === 'neutral' && 'ℹ️ These changes would have minimal impact'}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="mx-auto mb-3 text-gray-400" size={48} />
                <p>Adjust parameters and click Simulate to see results</p>
              </div>
            )}
          </div>

          {/* Component Changes */}
          {componentChanges && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Payment</span>
                  <span className={`font-bold ${componentChanges.payment >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {componentChanges.payment >= 0 ? '+' : ''}{componentChanges.payment.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Income</span>
                  <span className={`font-bold ${componentChanges.income >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {componentChanges.income >= 0 ? '+' : ''}{componentChanges.income.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Transaction</span>
                  <span className={`font-bold ${componentChanges.transaction >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {componentChanges.transaction >= 0 ? '+' : ''}{componentChanges.transaction.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Savings</span>
                  <span className={`font-bold ${componentChanges.savings >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {componentChanges.savings >= 0 ? '+' : ''}{componentChanges.savings.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreSimulator;
