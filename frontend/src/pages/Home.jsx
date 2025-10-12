import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, Users, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Home = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Credit Score,
          <span className="text-primary-600"> Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          ScoreBridge uses advanced AI and transparent algorithms to calculate fair,
          accurate credit scores. Understand your financial health and improve it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary px-8 py-3 text-lg">
            Get Started Free
          </Link>
          <Link to="/calculate-score" className="btn-outline px-8 py-3 text-lg">
            Calculate Score Now
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Users Trust Us</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose ScoreBridge?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            We're revolutionizing credit scoring with AI-powered insights and transparent calculations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                <TrendingUp className="text-primary-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Scoring
              </h3>
              <p className="text-gray-600">
                Our machine learning model analyzes 20+ financial factors to calculate your ScoreBridge Index (300-850).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-success-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-600 transition-colors">
                <Shield className="text-success-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Transparent
              </h3>
              <p className="text-gray-600">
                See exactly how your score is calculated with breakdowns of Payment, Income, Transaction, and Savings components.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-warning-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-warning-600 transition-colors">
                <BarChart3 className="text-warning-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your credit score over time, view historical trends, and track improvements with detailed analytics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-danger-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-danger-600 transition-colors">
                <Users className="text-danger-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fair for Everyone
              </h3>
              <p className="text-gray-600">
                Our inclusive model considers multiple income sources and financial patterns, not just traditional credit.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                <CheckCircle className="text-primary-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Advice
              </h3>
              <p className="text-gray-600">
                Get tailored recommendations on how to improve your credit score based on your unique financial situation.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card group hover:scale-105 transition-transform duration-200">
              <div className="bg-success-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-600 transition-colors">
                <ArrowRight className="text-success-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Results
              </h3>
              <p className="text-gray-600">
                Get your credit score calculated in seconds, no waiting period. Anonymous scoring available without signup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Enter Your Financial Data
                </h3>
                <p className="text-gray-600">
                  Provide basic information about your income, accounts, loans, and payment history. All data is encrypted and secure.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  AI Analyzes Your Profile
                </h3>
                <p className="text-gray-600">
                  Our machine learning model evaluates 4 key components: Payment Consistency, Income Reliability, Transaction Patterns, and Savings Stability.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Get Your ScoreBridge Index
                </h3>
                <p className="text-gray-600">
                  Receive your credit score (300-850) with detailed breakdown, risk level, and personalized recommendations for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Know Your Credit Score?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of users who trust ScoreBridge for fair and transparent credit scoring.
          </p>
          <Link to="/calculate-score" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Calculate Your Score Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
