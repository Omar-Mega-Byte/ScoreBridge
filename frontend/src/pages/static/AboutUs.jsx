import { Users, Target, Award, Github, Linkedin, Mail, Trophy } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Omar",
      role: "Full-Stack Developer & Software Architect",
      github: "https://github.com/Omar-Mega-Byte",
      linkedin: "https://linkedin.com/in/omarmegabyte",
      email: "omar.tolis2004@gmail.com",
      bio: "Led the complete architecture design, implementing both frontend and backend systems, and ensuring comprehensive testing coverage.",
      skills: ["Java", "Spring Boot", "React", "System Architecture", "Full-Stack Development", "Testing & QA"]
    },
    {
      name: "Shahd",
      role: "Machine Learning Engineer & AI Specialist",
      github: "https://github.com/shahdkh2288",
      linkedin: "https://linkedin.com/in/shahdkh",
      email: "kshahd528@gmail.com",
      bio: "Designed and developed the ML recommendation engine, credit score prediction model, and all AI-powered features.",
      skills: ["Python", "Machine Learning", "scikit-learn", "Data Science", "AI Model Training", "Feature Engineering"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="ScoreBridge Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-5xl font-bold mb-4">About ScoreBridge</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Empowering financial decisions through intelligent credit scoring and AI-driven insights
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To democratize credit scoring by making it transparent, accessible, and actionable for everyone. 
              We believe in empowering individuals with the tools and insights to improve their financial health.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-primary-700" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the leading platform for credit score management and financial literacy, helping millions 
              of people make informed decisions and achieve their financial goals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">HackNomics 2025</h3>
            <p className="text-gray-600 leading-relaxed">
              This project was built for HackNomics 2025, showcasing innovative solutions in fintech. 
              We're competing to revolutionize how people understand and manage their credit scores.
            </p>
          </div>
        </div>

        {/* Project Story */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p className="text-lg font-medium text-gray-700">
              ScoreBridge was born from a simple yet powerful observation: credit scores are often mysterious, 
              intimidating, and inaccessible for the average person. We set out to democratize financial literacy 
              and empower individuals with the tools they need to understand and improve their financial health.
            </p>
            <p>
              The journey began with extensive research into credit scoring methodologies. We developed our proprietary 
              <strong> ScoreBridge Index (SBI)</strong> credit scoring formula because of its comprehensive approach that 
              considers four critical dimensions: Payment History (P), Credit Utilization (I), Credit Mix & Age (T), 
              and Recent Credit Behavior (S). This formula provides a holistic view of an individual's creditworthiness, 
              ranging from 300 to 900 points.
            </p>
            <p>
              But we didn't stop at just implementing the formula. We enhanced it with cutting-edge machine learning 
              capabilities. Our team spent countless hours training and fine-tuning a Random Forest model using 
              diverse financial profiles, enabling us to not only calculate scores but also predict future trends 
              and provide intelligent recommendations. The ML engine analyzes thousands of data points to generate 
              personalized, actionable advice that's specific to each user's unique financial situation.
            </p>
            <p>
              What truly sets ScoreBridge apart is our unwavering commitment to transparency and education. Unlike 
              traditional credit bureaus that operate as black boxes, we show users exactly how their score is 
              calculated, breaking down each component with clear explanations. Our AI-powered recommendations don't 
              just tell you what to do—they explain why it matters, how much impact it will have on your score, 
              and provide step-by-step action plans to help you succeed.
            </p>
            <p>
              The technical implementation showcases modern fintech architecture at its best. Omar architected and 
              developed the entire full-stack system: a robust Spring Boot backend with RESTful APIs, JWT authentication, 
              and H2 database integration; a responsive React frontend with beautiful visualizations using Recharts; 
              and comprehensive testing to ensure reliability. Shahd designed and trained the machine learning models, 
              implementing sophisticated feature engineering, recommendation algorithms, and the entire Python Flask 
              ML service that powers our AI capabilities.
            </p>
            <p>
              As a HackNomics 2025 competition project, ScoreBridge represents our vision for the future of fintech: 
              technology that's powerful yet accessible, intelligent yet transparent, and designed to truly help people 
              improve their financial lives. We're excited to showcase how AI and modern web technologies can work 
              together to solve real-world problems and make financial services more equitable for everyone.
            </p>
            <p className="text-lg font-semibold text-primary-600 italic">
              Join us on this journey to bridge the gap between complex financial systems and everyday users. 
              Together, we're building a future where everyone has the tools and knowledge to achieve their 
              financial goals. 🚀
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24"></div>
                <div className="p-8 -mt-12">
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg mx-auto">
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">{member.name}</h3>
                  <p className="text-center text-primary-700 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">{member.bio}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Skills</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, i) => (
                        <span 
                          key={i}
                          className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <a 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Email"
                    >
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg text-primary-600 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18 with Vite</li>
                <li>• Tailwind CSS</li>
                <li>• Recharts for visualizations</li>
                <li>• Zustand for state management</li>
                <li>• React Router v6</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary-700 mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Spring Boot (Java)</li>
                <li>• H2 In-Memory Database</li>
                <li>• RESTful API Architecture</li>
                <li>• JWT Authentication</li>
                <li>• Maven Build System</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-green-600 mb-4">AI/ML Service</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Python Flask</li>
                <li>• scikit-learn</li>
                <li>• NumPy & Pandas</li>
                <li>• Feature Engineering</li>
                <li>• ML Model Training</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
