<div align="center">

# 🎉 ScoreBridge - HackNomics 2025

### **AI-Driven Financial Reliability for the Invisible Economy**

[![Hackathon Project](https://img.shields.io/badge/🏆-Hackathon_Project-ff6b6b?style=for-the-badge)](https://github.com/Omar-Mega-Byte/ScoreBridge_HackNomics)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Python ML](https://img.shields.io/badge/Python_ML-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A fair, transparent credit scoring system for freelancers, gig workers, students, and underbanked communities.**

[🚀 Live Demo](#-demo) • [📖 Documentation](src/main/java/com/scorebridge/credit_score_sys/doc/ProjectArch.md) • [💻 Tech Stack](#-tech-stack) • [🏗️ Getting Started](#-getting-started)

</div>

---

## ⚠️ **HACKATHON PROJECT NOTICE**

> **🎉 This is a hackathon demonstration project!**
> 
> This application uses an **in-memory H2 database** for quick setup and demo purposes. 
> **Your data will be lost** when:
> - The server restarts
> - After periods of inactivity
> - When you close your browser
> 
> **⚡ Do NOT store important or real financial information!**

---

## 🌍 **The Problem**

Traditional credit scoring systems are **broken and biased**:

❌ **Exclude 45% of adults** who lack traditional banking history  
❌ **Penalize freelancers & gig workers** for non-traditional income  
❌ **Ignore real financial behavior** like on-time rent & utility payments  
❌ **Lock out students** with no credit cards but responsible spending  
❌ **Reinforce inequality** by treating lack of history as high risk  

**Result**: Millions of financially responsible people are denied loans, housing, and essential services.

---

## 💡 **Our Solution**

**ScoreBridge** is an **AI-powered financial scoring engine** that evaluates **real-world money habits**, not just credit cards and bank loans.

### **What We Analyze:**

✅ **Payment Consistency (35%)** - On-time bill payments, rent, utilities  
✅ **Income Reliability (25%)** - Steady income patterns, freelance stability  
✅ **Transaction Patterns (20%)** - Spending habits, financial responsibility  
✅ **Savings Stability (20%)** - Emergency funds, savings growth over time  

### **The ScoreBridge Index (SBI) Formula:**

```
SBI = 0.35·P + 0.25·I + 0.20·T + 0.20·S

Score Range: 300-850 (like FICO, but fairer)
```

---

## 🎯 **Key Features**

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Scoring** | Machine learning model trained to find optimal weights for fair assessment |
| 🎨 **Beautiful Dashboard** | Real-time score visualization with interactive charts and progress bars |
| 📊 **Component Breakdown** | Transparent view of exactly what impacts your score |
| � **Smart Recommendations** | Personalized tips to improve your financial health |
| 🔒 **Secure Authentication** | JWT-based auth with bcrypt password hashing |
| � **Fully Responsive** | Works seamlessly on desktop, tablet, and mobile |
| ⚡ **Real-Time Calculation** | Instant score results powered by Flask ML service |
| 🎭 **Demo-Ready** | Pre-populated data for easy testing and presentation |

---

## 🏗️ **Architecture**

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React SPA     │─────▶│  Spring Boot API │─────▶│  Flask ML API   │
│  (Port 3000)    │◀─────│   (Port 8080)    │◀─────│   (Port 5000)   │
│                 │      │                  │      │                 │
│  • User Auth    │      │  • JWT Auth      │      │  • ML Model     │
│  • Dashboard    │      │  • Data Storage  │      │  • Feature Eng  │
│  • Score View   │      │  • API Gateway   │      │  • Prediction   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │   H2 Database    │
                         │   (In-Memory)    │
                         └──────────────────┘
```

### **Module Structure:**

- **👤 User Module**: Registration, authentication, profile management
- **📥 Data Ingestion Module**: Financial profile persistence and validation  
- **🎯 Scoring Module**: AI-powered score calculation and history tracking
- **🔧 Common Module**: Shared utilities, validators, and configurations

---

## ⚙️ **Tech Stack**

### **Backend**
- ☕ **Java 21** - Modern LTS version with latest features
- 🍃 **Spring Boot 3.3.5** - REST API, Security, Data JPA
- 🗄️ **H2 Database** - In-memory for hackathon demo
- 🔐 **Spring Security** - JWT authentication with bcrypt
- ✅ **Bean Validation** - Input validation and sanitization

### **Frontend**
- ⚛️ **React 18.2** - Modern UI with hooks
- ⚡ **Vite 5.0** - Lightning-fast build tool
- 🎨 **Tailwind CSS 3.3** - Utility-first styling
- 📊 **Recharts 2.10** - Beautiful data visualizations
- 🐻 **Zustand** - Lightweight state management
- 🎯 **React Router 6** - Client-side routing

### **Machine Learning**
- 🐍 **Python 3.11** - ML service runtime
- 🧪 **Flask** - Lightweight ML API server
- 📈 **Scikit-learn** - Logistic regression model
- 🔢 **Pandas & NumPy** - Data processing
- 🎯 **Feature Engineering** - Custom financial metrics

### **DevOps**
- 📦 **Maven** - Java dependency management
- 📦 **npm** - Frontend package management
- 🐳 **Docker-ready** - Containerization support

---

## 🚀 **How to Run the Project**

### **Prerequisites**
- ☕ **Java 21** ([Download](https://adoptium.net/))
- 📦 **Node.js 18+** ([Download](https://nodejs.org/))
- 🐍 **Python 3.11+** ([Download](https://www.python.org/))

### **Quick Setup (3 Terminal Windows)**

**Terminal 1: ML Service**
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```
✅ ML API: `http://localhost:5000`

**Terminal 2: Spring Boot Backend**
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
✅ Backend API: `http://localhost:8080`

**Terminal 3: React Frontend**
```bash
cd frontend
npm install
npm run dev
```
✅ Web App: `http://localhost:3000`

### **🎉 Ready to Use!**
Open your browser and go to **http://localhost:3000** to start using ScoreBridge!

---

## 📖 **Usage Guide**

### **1. Register an Account**

```
Email: demo@scorebridge.com
Password: Demo123!
Name: John Doe
Phone: +1234567890
```

### **2. Add Financial Data**

Fill out the financial profile form with:
- 💰 **Accounts**: Bank accounts, credit cards, savings
- 📊 **Transactions**: Income (salary, freelance), expenses (rent, utilities)
- 📅 **History**: 3-12 months of data recommended

### **3. Calculate Your Score**

Click **"Calculate Score"** and get instant results:
- 🎯 **SBI Score** (300-850)
- 📊 **Component Breakdown** with visual progress bars
- 📈 **Pie Chart** showing weight distribution
- 💡 **Personalized Recommendations**

### **4. Track Your Progress**

- View **score history** on your dashboard
- See **latest score** and **account summary**
- Access **all past calculations**

---

## 🎯 **Demo Data**

Try these scenarios for testing:

### **Excellent Score (750+)**
- ✅ 6+ months on-time payments
- ✅ Steady income from multiple sources
- ✅ Balanced spending patterns
- ✅ Growing savings balance

### **Good Score (650-749)**
- ✅ Most payments on time
- ✅ Regular income with minor gaps
- ✅ Reasonable spending habits
- ⚠️ Modest savings

### **Fair Score (550-649)**
- ⚠️ Some late payments
- ⚠️ Irregular income patterns
- ⚠️ High expense-to-income ratio
- ❌ Minimal savings

---

## 🎯 **Impact & Vision**

### **Who We Help:**

👨‍💻 **Freelancers & Gig Workers** - Validate non-traditional income streams  
🎓 **Students** - Build credit history without credit cards  
🏠 **Renters** - Leverage on-time rent payments  
🌍 **Underbanked Communities** - Access fair financial opportunities  
💼 **Small Business Owners** - Demonstrate cash flow reliability  

### **Social Impact:**

- **Financial Inclusion**: Bridge the gap for 45% of adults without credit history
- **Fairness**: Reward actual financial behavior, not rigid banking rules
- **Transparency**: Users understand exactly what impacts their score
- **Empowerment**: Provide actionable recommendations for improvement

---

## � **Project Status**

### **✅ Completed (MVP)**

- [x] 🤖 AI scoring model with optimized weights
- [x] 🎨 Full-stack React + Spring Boot application
- [x] 🔐 Secure JWT authentication system
- [x] 📊 Interactive dashboard with visualizations
- [x] 💾 Data persistence and score history
- [x] 📱 Responsive mobile-friendly design
- [x] 🎯 Real-time score calculation
- [x] 💡 Personalized recommendations engine

### **🚧 Future Enhancements**

- [ ] 🔗 Integration with real financial data APIs (Plaid, Stripe)
- [ ] 📧 Email notifications for score changes
- [ ] 📄 PDF score export functionality
- [ ] 🧪 A/B testing for model improvements
- [ ] 🌐 Multi-language support
- [ ] 🗄️ PostgreSQL migration for production
- [ ] 🐳 Docker Compose setup
- [ ] ☸️ Kubernetes deployment configurations
- [ ] 🔍 Advanced analytics dashboard for admins

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **HackNomics 2025** for the opportunity to build this solution
- Financial inclusion research from the World Bank
- Open-source community for amazing tools and libraries
- All underbanked individuals inspiring us to build fairer systems

---

## 📞 **Contact**

- 🌐 **GitHub**: [Omar-Mega-Byte/ScoreBridge](https://github.com/Omar-Mega-Byte/ScoreBridge)
- 📧 **Email**: omar.tolis2004@gmail.com
- 💬 **Issues**: [Report a bug or request a feature](https://github.com/Omar-Mega-Byte/ScoreBridge/issues)

---

<div align="center">

**⭐ If you find this project helpful, please give it a star!**

**Made with ❤️ for a more financially inclusive world**

</div>


