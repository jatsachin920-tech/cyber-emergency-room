# 🛡️ Cyber Emergency Room: AI-Powered Phishing Detection Engine

A production-grade, fail-safe MERN stack application designed to analyze, classify, and mitigate phishing and cyber scam threats in real-time. Built as an advanced cybersecurity solution, utilizing Google Gemini 2.5-Flash with a robust, zero-downtime local matrix wrapper.

---

## 🚀 Key Features

- **Dual-Language Cyber Diagnostics:** Real-time threat analysis supporting both English and Hindi (Devanagari script) frameworks for localized cybersecurity action steps.
- **Gemini 2.5-Flash Engine:** Deep linguistic and structural analysis of suspicious texts, utility alerts, job scams, and phishing links based on modern (2026) fraud patterns.
- **Fail-Safe Fault Tolerance:** Integrated local matrix that automatically intercepts API key dropouts, network drops, or 503 errors, serving simulated diagnostics without crashing.
- **Live Threat Intelligence Feed:** A high-performance community alert feed synced seamlessly with MongoDB to broadcast newly intercepted active threats.
- **Real-Time Forensic Analytics:** Live counters tracking high-risk vectors like Banking/KYC phishing and Utility scams.
- **One-Click Forensic PDF:** Instant client-side automated report generation utilizing custom `@media print` layout sanitization.

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS (Custom Dark Glassmorphic Theme), Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose ODM  
**AI Layer:** Google Generative AI SDK (`gemini-2.5-flash`)

---

## 📁 Industrial Project Structure

cyber-emergency-room/
├── client/                 # React Frontend
│   src/
│   ├── components/        # TriageDesk, ReportScamForm, CommunityFeed
│   └── ...
├── server/                 # Express Backend
│   ├── config/             # db.js (MongoDB Async Init), gemini.js (AI Engine)
│   ├── controllers/        # aiController.js (Core Business Logic & Fallbacks)
│   ├── models/             # Threat.js (Mongoose Timestamps Schema)
│   ├── routes/             # aiRoutes.js (REST Endpoints mapping)
│   └── server.js           # App entry point & Global Exception Boundary
└── .gitignore              # Dependency & environment safety configurations


⚙️ Environment Configuration
Create a .env file inside the server/ directory
Code snippet:
PORT=8080
ATLASDB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

📦 Local Installation & Setup
Prerequisites
* Node.js (v18+ recommended)
* MongoDB Atlas account or local installation

1. Clone the repository
  git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
  cd cyber-emergency-room

2. Setup Backend Server
  cd server
  npm install
  npm start

3. Setup Frontend Client
 Open a new terminal window:
  cd client
  npm install
  npm run dev

🛡️ Resilience & Production Guardrails
  CORS Multi-Origin Alignment: Configured to dynamically intercept requests from both localhost and explicit loopback configurations (127.0.0.1), mitigating browser-level blocking during live evaluations.

  Graceful DB Isolation: If database connections undergo latency or failures, the AI execution thread is isolated safely to continue serving web client analytics seamlessly.

  Automated JSON Sanitization: Built-in regex filters strip unexpected markdown backticks from AI generation strings, ensuring zero schema parsing errors.
