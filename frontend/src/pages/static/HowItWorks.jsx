import { Calculator, TrendingUp, Brain, BarChart3, PieChart, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const scoringComponents = [
    {
      name: "Payment History (P)",
      weight: "35%",
      icon: CheckCircle2,
      color: "blue",
      description: "Your track record of making on-time payments",
      factors: [
        "Number of on-time payments",
        "Payment consistency",
        "Late payment history",
        "Default accounts"
      ]
    },
    {
      name: "Credit Utilization (I)",
      weight: "30%",
      icon: PieChart,
      color: "purple",
      description: "How much credit you're using vs. available",
      factors: [
        "Credit card utilization ratio",
        "Outstanding debt amount",
        "Available credit limit",
        "Debt-to-income ratio"
      ]
    },
    {
      name: "Credit Mix & Age (T)",
      weight: "25%",
      icon: BarChart3,
      color: "green",
      description: "Diversity and length of your credit history",
      factors: [
        "Types of credit accounts",
        "Age of oldest account",
        "Average account age",
        "Account diversity score"
      ]
    },
    {
      name: "Recent Behavior (S)",
      weight: "10%",
      icon: TrendingUp,
      color: "orange",
      description: "Your recent credit activity and inquiries",
      factors: [
        "Recent credit inquiries",
        "New accounts opened",
        "Recent payment patterns",
        "Credit seeking behavior"
      ]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Data Collection",
      description: "Enter your financial information including accounts, transactions, and credit history.",
      icon: Shield,
      color: "blue"
    },
    {
      step: 2,
      title: "Score Calculation",
      description: "Our system uses the ScoreBridge Index (SBI) formula (P+I+T+S) to calculate your credit score based on the four key components.",
      icon: Calculator,
      color: "purple"
    },
    {
      step: 3,
      title: "ML Analysis",
      description: "Our machine learning model analyzes your data to identify patterns and predict future score trends.",
      icon: Brain,
      color: "green"
    },
    {
      step: 4,
      title: "Personalized Recommendations",
      description: "Receive AI-powered, actionable recommendations tailored to your specific financial situation.",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  const features = [
    {
      title: "Real-Time Score Calculation",
      description: "Get instant credit score updates based on the latest financial data you provide.",
      icon: Calculator
    },
    {
      title: "What-If Simulator",
      description: "Test different scenarios to see how changes in your finances would affect your credit score.",
      icon: Brain
    },
    {
      title: "AI Recommendations",
      description: "Receive intelligent, prioritized suggestions on how to improve your credit score effectively.",
      icon: TrendingUp
    },
    {
      title: "Spending Analysis",
      description: "Visualize your spending patterns and understand how they impact your financial health.",
      icon: PieChart
    },
    {
      title: "Score History Tracking",
      description: "Monitor your credit score journey over time with beautiful charts and insights.",
      icon: BarChart3
    },
    {
      title: "Financial Dashboard",
      description: "Get a comprehensive view of your financial health with intuitive widgets and metrics.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">How ScoreBridge Works</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Understanding the science behind your credit score and how we help you improve it
          </p>
        </div>
      </div>

      {/* SBI Formula Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">The ScoreBridge Index (SBI) Formula</h2>
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-primary-100 to-primary-200 px-8 py-4 rounded-xl">
              <p className="text-3xl font-bold text-gray-800">
                Credit Score = <span className="text-primary-600">P</span> + <span className="text-primary-700">I</span> + <span className="text-green-600">T</span> + <span className="text-orange-600">S</span>
              </p>
            </div>
          </div>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            ScoreBridge uses our proprietary <strong>ScoreBridge Index (SBI)</strong> scoring methodology, which evaluates four 
            critical components of your financial behavior to generate a comprehensive credit score ranging 
            from 300 to 900.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {scoringComponents.map((component, index) => (
              <div 
                key={index}
                className={`bg-${component.color}-50 p-6 rounded-xl hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`bg-${component.color}-100 p-3 rounded-full`}>
                    <component.icon className={`w-6 h-6 text-${component.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{component.name}</h3>
                      <span className={`bg-${component.color}-200 text-${component.color}-700 px-3 py-1 rounded-full text-sm font-semibold`}>
                        {component.weight}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{component.description}</p>
                  </div>
                </div>
                <div className="ml-16">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Factors:</h4>
                  <ul className="space-y-1">
                    {component.factors.map((factor, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${component.color}-600`}></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Our 4-Step Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className={`bg-${step.color}-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                  </div>
                  <div className={`text-center mb-4 text-${step.color}-600 font-bold text-sm`}>
                    STEP {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-4 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ML Engine Explanation */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-full">
              <Brain className="w-8 h-8 text-primary-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">AI & Machine Learning Engine</h2>
          </div>
          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              At the heart of ScoreBridge is a sophisticated machine learning engine built with Python and 
              scikit-learn. Our ML model has been trained on diverse financial profiles to understand the 
              complex relationships between financial behaviors and credit scores.
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 text-purple-900">Recommendation Engine</h3>
                <p className="text-sm">
                  Analyzes your financial data to generate personalized, prioritized recommendations. Each 
                  suggestion includes expected impact, difficulty level, and actionable steps to help you 
                  improve your credit score efficiently.
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 text-blue-900">Score Prediction</h3>
                <p className="text-sm">
                  Our what-if simulator uses advanced feature engineering to predict how changes in your 
                  financial behavior would affect your credit score, allowing you to make informed decisions 
                  before taking action.
                </p>
              </div>
            </div>
            <p>
              The ML service continuously learns and adapts, ensuring that our recommendations remain 
              relevant and effective. By combining traditional credit scoring methods with modern AI, we 
              provide insights that are both accurate and actionable.
            </p>
          </div>
        </div>

        {/* Score Ranges */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Understanding Score Ranges</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
              <div className="w-32 font-bold text-green-700">750 - 900</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Excellent</div>
                <div className="text-sm text-gray-600">Outstanding credit profile with minimal risk</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
              <div className="w-32 font-bold text-primary-700">650 - 749</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Good</div>
                <div className="text-sm text-gray-600">Strong credit history with good financial habits</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl">
              <div className="w-32 font-bold text-yellow-700">550 - 649</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Fair</div>
                <div className="text-sm text-gray-600">Moderate credit risk, room for improvement</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-32 font-bold text-orange-700">450 - 549</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Poor</div>
                <div className="text-sm text-gray-600">Significant credit challenges, needs attention</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
              <div className="w-32 font-bold text-red-700">300 - 449</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Very Poor</div>
                <div className="text-sm text-gray-600">High credit risk, immediate action required</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
