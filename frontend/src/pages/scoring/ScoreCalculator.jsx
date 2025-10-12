import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { scoringService } from '../../services';
import useAuthStore from '../../store/authStore';
import ScoreResult from '../../components/scoring/ScoreResult';

const ScoreCalculator = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scoreResult, setScoreResult] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setScoreResult(null);

    try {
      // Add userId if user is logged in
      const requestData = {
        ...data,
        userId: user?.id || null,
      };

      const response = await scoringService.calculateScore(requestData);
      
      if (response.success) {
        setScoreResult(response.data);
      } else {
        setError(response.message || 'Failed to calculate score');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="text-primary-600" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Calculate Your Credit Score</h1>
        <p className="text-gray-600 mt-2">
          {user ? 'Your score will be saved to your account' : 'Get instant results without creating an account'}
        </p>
      </div>

      {!user && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-primary-800">
            <strong>Anonymous Mode:</strong> You're calculating your score without logging in. 
            <a href="/register" className="underline ml-1">Create an account</a> to save your score and track progress over time.
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {scoreResult ? (
        <ScoreResult result={scoreResult} onCalculateAgain={() => setScoreResult(null)} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Age *
              </label>
              <input
                type="number"
                {...register('age', { required: 'Age is required', min: 18, max: 100 })}
                className="input-field"
                placeholder="28"
                defaultValue={28}
              />
              {errors.age && <p className="text-danger-600 text-sm mt-1">{errors.age.message}</p>}
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Annual Income ($) *
              </label>
              <input
                type="number"
                {...register('annualIncome', { required: 'Annual income is required', min: 0 })}
                className="input-field"
                placeholder="50000"
                defaultValue={50000}
              />
              {errors.annualIncome && <p className="text-danger-600 text-sm mt-1">{errors.annualIncome.message}</p>}
            </div>

            {/* Monthly Salary */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Monthly In-hand Salary ($) *
              </label>
              <input
                type="number"
                {...register('monthlySalary', { required: 'Monthly salary is required', min: 0 })}
                className="input-field"
                placeholder="3500"
                defaultValue={3500}
              />
              {errors.monthlySalary && <p className="text-danger-600 text-sm mt-1">{errors.monthlySalary.message}</p>}
            </div>

            {/* Monthly Balance */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Monthly Balance ($) *
              </label>
              <input
                type="number"
                {...register('monthlyBalance', { required: 'Monthly balance is required', min: 0 })}
                className="input-field"
                placeholder="2500"
                defaultValue={2500}
              />
              {errors.monthlyBalance && <p className="text-danger-600 text-sm mt-1">{errors.monthlyBalance.message}</p>}
            </div>

            {/* Number of Bank Accounts */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of Bank Accounts *
              </label>
              <input
                type="number"
                {...register('numBankAccounts', { required: 'Number of bank accounts is required', min: 0 })}
                className="input-field"
                placeholder="3"
                defaultValue={3}
              />
              {errors.numBankAccounts && <p className="text-danger-600 text-sm mt-1">{errors.numBankAccounts.message}</p>}
            </div>

            {/* Number of Credit Cards */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of Credit Cards *
              </label>
              <input
                type="number"
                {...register('numCreditCards', { required: 'Number of credit cards is required', min: 0 })}
                className="input-field"
                placeholder="2"
                defaultValue={2}
              />
              {errors.numCreditCards && <p className="text-danger-600 text-sm mt-1">{errors.numCreditCards.message}</p>}
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('interestRate', { required: 'Interest rate is required', min: 0 })}
                className="input-field"
                placeholder="5.5"
                defaultValue={5.5}
              />
              {errors.interestRate && <p className="text-danger-600 text-sm mt-1">{errors.interestRate.message}</p>}
            </div>

            {/* Number of Loans */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of Loans *
              </label>
              <input
                type="number"
                {...register('numLoans', { required: 'Number of loans is required', min: 0 })}
                className="input-field"
                placeholder="2"
                defaultValue={2}
              />
              {errors.numLoans && <p className="text-danger-600 text-sm mt-1">{errors.numLoans.message}</p>}
            </div>

            {/* Delay from Due Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Delay from Due Date (days) *
              </label>
              <input
                type="number"
                {...register('delayFromDueDate', { required: 'Delay from due date is required', min: 0 })}
                className="input-field"
                placeholder="3"
                defaultValue={3}
              />
              {errors.delayFromDueDate && <p className="text-danger-600 text-sm mt-1">{errors.delayFromDueDate.message}</p>}
            </div>

            {/* Number of Delayed Payments */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of Delayed Payments *
              </label>
              <input
                type="number"
                {...register('numDelayedPayments', { required: 'Number of delayed payments is required', min: 0 })}
                className="input-field"
                placeholder="2"
                defaultValue={2}
              />
              {errors.numDelayedPayments && <p className="text-danger-600 text-sm mt-1">{errors.numDelayedPayments.message}</p>}
            </div>

            {/* Number of Credit Inquiries */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of Credit Inquiries *
              </label>
              <input
                type="number"
                {...register('numCreditInquiries', { required: 'Number of credit inquiries is required', min: 0 })}
                className="input-field"
                placeholder="4"
                defaultValue={4}
              />
              {errors.numCreditInquiries && <p className="text-danger-600 text-sm mt-1">{errors.numCreditInquiries.message}</p>}
            </div>

            {/* Credit Utilization Ratio */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Credit Utilization Ratio (%) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('creditUtilizationRatio', { required: 'Credit utilization ratio is required', min: 0, max: 100 })}
                className="input-field"
                placeholder="30.5"
                defaultValue={30.5}
              />
              {errors.creditUtilizationRatio && <p className="text-danger-600 text-sm mt-1">{errors.creditUtilizationRatio.message}</p>}
            </div>

            {/* Credit History Age */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Credit History Age (months) *
              </label>
              <input
                type="number"
                {...register('creditHistoryAgeMonths', { required: 'Credit history age is required', min: 0 })}
                className="input-field"
                placeholder="60"
                defaultValue={60}
              />
              {errors.creditHistoryAgeMonths && <p className="text-danger-600 text-sm mt-1">{errors.creditHistoryAgeMonths.message}</p>}
            </div>

            {/* Total EMI Per Month */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total EMI Per Month ($) *
              </label>
              <input
                type="number"
                {...register('totalEmiPerMonth', { required: 'Total EMI per month is required', min: 0 })}
                className="input-field"
                placeholder="500"
                defaultValue={500}
              />
              {errors.totalEmiPerMonth && <p className="text-danger-600 text-sm mt-1">{errors.totalEmiPerMonth.message}</p>}
            </div>

            {/* Amount Invested Monthly */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Amount Invested Monthly ($) *
              </label>
              <input
                type="number"
                {...register('amountInvestedMonthly', { required: 'Amount invested monthly is required', min: 0 })}
                className="input-field"
                placeholder="200"
                defaultValue={200}
              />
              {errors.amountInvestedMonthly && <p className="text-danger-600 text-sm mt-1">{errors.amountInvestedMonthly.message}</p>}
            </div>

            {/* Outstanding Debt */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Outstanding Debt ($) *
              </label>
              <input
                type="number"
                {...register('outstandingDebt', { required: 'Outstanding debt is required', min: 0 })}
                className="input-field"
                placeholder="5000"
                defaultValue={5000}
              />
              {errors.outstandingDebt && <p className="text-danger-600 text-sm mt-1">{errors.outstandingDebt.message}</p>}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  <span>Calculate Score</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ScoreCalculator;
