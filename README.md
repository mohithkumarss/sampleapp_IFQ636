# 🌱 CarbonTracker

CarbonTracker is a full-stack, enterprise-grade CRUD application designed to help individuals and organizations monitor, analyze, and manage their carbon footprint. Built with a sleek, eco-friendly emerald design system, the platform offers dynamic role-based dashboards, interactive data visualization, and automated DevOps pipelines.

## 🚀 Key Features

* **Role-Based Dual-View Architecture:** * **Standard Users:** Log daily activities (Transport, Electricity, Food), view personalized emission breakdowns via interactive doughnut charts, and receive smart, dynamic insights based on their consumption habits.
  * **Administrators:** Access a system-wide platform health dashboard, manage active accounts, view top platform emitters, and dynamically configure system-wide emission multiplier factors.
* **Full CRUD Functionality:** Seamlessly Create, Read, Update, and Delete activity logs with instant visual feedback and UI updates.
* **Interactive Data Visualization:** Real-time data rendering using Recharts for bar charts (trend analysis) and pie charts (category breakdowns).
* **Enterprise Authentication:** Secure JWT-based authentication system with encrypted passwords and role-based route protection.
* **Automated CI/CD Pipeline:** Fully automated deployments to AWS EC2 using GitHub Actions, ensuring seamless updates and secure environment variable injection.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Hooks, Context API)
* Tailwind CSS (Custom Dark Emerald Theme)
* Recharts (Data Visualization)
* Axios (API Client)
* React Router DOM (Navigation)

**Backend:**
* Node.js & Express.js (RESTful API)
* MongoDB & Mongoose (Database & ODM)
* JSON Web Tokens (JWT) & bcryptjs (Security)

**DevOps & Deployment:**
* AWS EC2 (Ubuntu server)
* PM2 (Process Management)
* GitHub Actions (CI/CD Pipeline)

## ⚙️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mohithkumarss/sampleapp_IFQ636.git](https://github.com/mohithkumarss/sampleapp_IFQ636.git)
   cd sampleapp_IFQ636

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
Create a .env file in the backend directory with your PORT, MONGO_URI, and JWT_SECRET.
Run the server: npm start

3. Frontend Setup:
   ```bash
   cd ../frontend
   npm install
Create a .env file in the frontend directory with REACT_APP_API_URL=http://localhost:5000.
Run the client: npm start
