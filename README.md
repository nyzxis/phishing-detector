# 🛡️ PHISHGUARD // AI-Powered Phishing Detection System

A modern full-stack cybersecurity application designed to detect and dissect suspicious URLs and phishing emails in real-time using trained **Machine Learning models (Scikit-learn)**, a **Flask REST API**, a **React 19 + Tailwind CSS** cyber-security dashboard, and dual **SQLite / PostgreSQL** persistence.

Built by **Arfa Danial** ([@nyzxis](https://github.com/nyzxis)).

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend API** | Python 3.14 / 3.12, Flask 3.1, Flask-CORS, Flask-SQLAlchemy |
| **Machine Learning** | Scikit-learn (Random Forest, Multinomial Naive Bayes, TF-IDF Vectorizer), NumPy, Joblib |
| **Database** | Dual Configuration: SQLite (zero-config local development) & PostgreSQL (production via `DATABASE_URL`) |

---

## 🚀 Key Features

1. **Dual Scanner Dashboard**:
   - **URL Threat Inspector**: Evaluates IP host obfuscation, length anomalies, entropy, suspicious TLDs (`.xyz`, `.top`, `.buzz`, etc.), and credential harvesting lures.
   - **Email Body & Header NLP Inspector**: Detects urgency pressure tactics, financial transaction traps, credential harvesting phrases, and malicious embedded links.
2. **Explainable AI (XAI)**:
   - Real-time 0–100 Risk Score.
   - Confidence rating percentage.
   - Detailed threat breakdown flags explaining *why* a payload was flagged.
   - Low-level telemetry metrics (entropy, IP presence, subdomain depth, protocol verification).
3. **Historical Audit Log & Real-Time Telemetry**:
   - Live overview stats: Total Scans, Threats Blocked, Suspicious Flags, Threat Interception Rate.
   - Searchable, filterable audit database with individual and bulk purge options.
4. **Cyber-Security Dark UI**:
   - High-tech cyber dark aesthetic with glowing status meters, glassmorphism cards, and terminal-style telemetry.

---

## 📁 Project Structure

```
phishing-detector/
├── backend/
│   ├── app.py                     # Flask application entry point & API routes
│   ├── config.py                  # Database & environment configurations
│   ├── database.py                # SQLAlchemy models & schema definitions
│   ├── requirements.txt           # Python dependencies
│   ├── models/                    # Serialized machine learning models (.joblib)
│   │   ├── url_model.joblib       # Random Forest URL model
│   │   ├── email_model.joblib     # Multinomial Naive Bayes email model
│   │   └── email_vectorizer.joblib# TF-IDF Vectorizer
│   └── ml/
│       ├── train.py               # Dataset generation & model training script
│       ├── url_detector.py        # URL feature extraction & inference engine
│       └── email_detector.py      # Email NLP classification & heuristics
├── frontend/
│   ├── index.html                 # App shell
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.ts             # Vite configuration with API proxy to Flask
│   └── src/
│       ├── App.tsx                # Main Cyber Dashboard
│       ├── styles.css             # Tailwind CSS & cyber glow effects
│       ├── components/
│       │   ├── Navbar.tsx         # Cyber-security branding & live status
│       │   ├── StatsCards.tsx     # Overview metrics grid
│       │   ├── UrlScanner.tsx     # Interactive URL inspector & presets
│       │   ├── EmailScanner.tsx   # Interactive raw email analyzer & presets
│       │   ├── ResultCard.tsx     # Risk score gauge & Explainable AI breakdown
│       │   └── ScanHistory.tsx    # Searchable audit log table
│       └── lib/
│           └── api.ts             # Typed API client functions
└── README.md                      # Project documentation
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 2. Backend Setup & Run

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Retrain machine learning models:
   ```bash
   python ml/train.py
   ```
4. Start the Flask API:
   ```bash
   python app.py
   ```
   *The API will start on `http://127.0.0.1:5000` with SQLite initialized automatically.*

---

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   *Visit `http://localhost:3000` in your browser.*

---

## 🐘 PostgreSQL Configuration (Production)

To connect to a PostgreSQL database instead of the local SQLite database, supply the `DATABASE_URL` environment variable:

```bash
# Linux / macOS
export DATABASE_URL="postgresql://username:password@localhost:5432/phishing_db"

# Windows PowerShell
$env:DATABASE_URL="postgresql://username:password@localhost:5432/phishing_db"
```

Then start `python app.py`—SQLAlchemy will automatically configure the PostgreSQL connection and create all tables.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check & model loaded status |
| `POST` | `/api/scan/url` | Scans URL, extracts features, calculates ML risk score |
| `POST` | `/api/scan/email` | Analyzes email text using NLP & threat heuristics |
| `GET` | `/api/stats` | Aggregated threat metrics & counts |
| `GET` | `/api/history` | Audit log records (supports `?type=url` and `?q=query`) |
| `DELETE` | `/api/history/<id>` | Deletes an individual scan record |
| `DELETE` | `/api/history` | Clears all scan history |

---

## 📜 License
MIT © [Arfa Danial](https://github.com/nyzxis)
