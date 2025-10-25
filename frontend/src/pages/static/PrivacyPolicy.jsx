import { Shield, Lock, Eye, Database, AlertTriangle, CheckCircle, FileText, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Your privacy and data security are our top priorities
          </p>
          <p className="text-sm mt-4 opacity-75">Last Updated: January 2025 | HackNomics 2025 Project</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-12 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-yellow-900 mb-2">🚀 HackNomics 2025 Hackathon Project Notice</h3>
              <p className="text-yellow-800 leading-relaxed mb-3">
                This is a demonstration project created for the HackNomics 2025 hackathon. Currently, we use 
                an <strong>H2 in-memory database</strong>, which means:
              </p>
              <ul className="list-disc ml-6 text-yellow-800 space-y-2">
                <li><strong>All data is temporary</strong> and will be lost when the application restarts</li>
                <li>No persistent storage of personal or financial information</li>
                <li>Data exists only during your current session</li>
                <li>No long-term data retention or backup systems</li>
              </ul>
              <p className="text-yellow-800 mt-3 font-medium">
                💡 <em>A permanent database solution with enhanced security will be implemented after the hackathon.</em>
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            Overview
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            ScoreBridge ("we", "our", or "us") is committed to protecting your privacy and ensuring the security 
            of your personal and financial information. This Privacy Policy explains how we collect, use, store, 
            and protect your data when you use our credit scoring platform.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By using ScoreBridge, you agree to the collection and use of information in accordance with this policy. 
            As this is a hackathon demonstration project, please be aware of the temporary nature of data storage 
            as outlined in the notice above.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary-700" />
            Information We Collect
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary-600" />
                Personal Information
              </h3>
              <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Username and encrypted password for authentication</li>
                <li>Profile information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Financial Information
              </h3>
              <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>Bank account details (account numbers, types, balances)</li>
                <li>Transaction history (income, expenses, patterns)</li>
                <li>Credit information (credit cards, loans, EMIs)</li>
                <li>Investment and savings data</li>
                <li>Payment history and credit behavior</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary-700" />
                Usage Information
              </h3>
              <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>How you interact with our platform (features used, pages visited)</li>
                <li>Credit score calculation requests and simulations</li>
                <li>AI recommendation interactions</li>
                <li>Dashboard and analytics usage patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            How We Use Your Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3 text-blue-900">Credit Score Calculation</h3>
              <p className="text-sm text-gray-700">
                We use your financial data to calculate your credit score using the ScoreBridge Index (SBI) formula (P+I+T+S), 
                analyzing payment history, credit utilization, credit mix, and recent behavior.
              </p>
            </div>

            <div className="bg-primary-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3 text-purple-900">AI-Powered Recommendations</h3>
              <p className="text-sm text-gray-700">
                Our machine learning engine analyzes your profile to generate personalized, actionable 
                recommendations to help you improve your credit score.
              </p>
            </div>

            <div className="bg-green-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3 text-green-900">Score Simulation</h3>
              <p className="text-sm text-gray-700">
                We process your data to run what-if scenarios, showing you how changes in your financial 
                behavior could impact your credit score.
              </p>
            </div>

            <div className="bg-orange-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3 text-orange-900">Analytics & Insights</h3>
              <p className="text-sm text-gray-700">
                We analyze your spending patterns, financial health, and credit trends to provide 
                meaningful insights through our dashboard and visualization tools.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-red-600" />
            Data Security
          </h2>
          
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              We implement industry-standard security measures to protect your personal and financial information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800">JWT Authentication</div>
                  <div className="text-sm">Secure token-based authentication for all API requests</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800">Password Encryption</div>
                  <div className="text-sm">All passwords are encrypted using strong hashing algorithms</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800">HTTPS Communication</div>
                  <div className="text-sm">All data transmission is encrypted in transit</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800">Access Controls</div>
                  <div className="text-sm">Role-based access controls to protect sensitive data</div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> As this is currently a hackathon project using an H2 in-memory database, 
                data persistence and advanced security features will be significantly enhanced in the production 
                version with a permanent database solution.
              </p>
            </div>
          </div>
        </div>

        {/* Data Retention & Deletion */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Data Retention & Deletion</h2>
          
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <div className="bg-yellow-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-yellow-900">Current Status (Hackathon Demo)</h3>
              <p className="text-sm">
                Since we're using an H2 in-memory database, all data is automatically deleted when the application 
                restarts. No data is permanently stored or retained beyond the current session. This means:
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                <li>Data exists only while the application is running</li>
                <li>Application restarts result in complete data loss</li>
                <li>No backup or recovery mechanisms are in place</li>
                <li>No long-term data retention policies needed</li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-green-900">Future Implementation (Post-Hackathon)</h3>
              <p className="text-sm">
                After the hackathon, when we implement a permanent database solution:
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                <li>We will retain your data for as long as your account is active</li>
                <li>You can request account deletion at any time</li>
                <li>Deleted data will be permanently removed within 30 days</li>
                <li>Some anonymized data may be retained for analytics and ML model improvement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Rights</h2>
          
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800">Access:</span> You can view all your personal and 
                financial data through your profile and dashboard at any time.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800">Correction:</span> You can update and correct your 
                information through the data ingestion and profile management features.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800">Deletion:</span> You can request deletion of your 
                account and all associated data (in the permanent version, data is currently temporary).
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800">Transparency:</span> We provide clear explanations 
                of how your credit score is calculated and how recommendations are generated.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800">Control:</span> You decide what financial data to 
                share and can modify or delete it at any time.
              </div>
            </div>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Third-Party Services</h2>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            ScoreBridge currently does not share your data with any third-party services for marketing or 
            advertising purposes. The platform operates as a standalone system with the following components:
          </p>
          
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span><strong>Spring Boot Backend:</strong> Handles all business logic and data processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span><strong>Python ML Service:</strong> Processes data locally for recommendations and predictions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span><strong>React Frontend:</strong> All visualizations and interactions happen in your browser</span>
            </li>
          </ul>
        </div>

        {/* Changes to Privacy Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Changes to This Privacy Policy</h2>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            We may update our Privacy Policy from time to time, especially when transitioning from the hackathon 
            demo to a production system. We will notify you of any changes by:
          </p>
          
          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
            <li>Sending an email notification for significant changes (in the permanent version)</li>
            <li>Displaying a prominent notice on the dashboard</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          
          <p className="mb-6 opacity-90">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle 
            your data, please contact us:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3">Omar</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>📧 omar.tolis2004@gmail.com</p>
                <p>🔗 github.com/Omar-Mega-Byte</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-3">Shahd</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>📧 kshahd528@gmail.com</p>
                <p>🔗 github.com/shahdkh2288</p>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-sm opacity-75">
            We will respond to all privacy-related inquiries within 48 hours during the hackathon period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
