# 🧠 MenTex – AI-Powered Mental Health Companion

[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase-FFCA28?style=flat&logo=firebase)](https://aimentalhealth-e4f52.web.app)
[![Render Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://mentex-server.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**MenTex** is a premium, full-stack mental health ecosystem designed to provide accessible, empathetic, and data-driven emotional support. By combining the power of **Google Gemini AI** with sophisticated analytics, MenTex offers users a safe space to track their mental well-being, engage in therapeutic conversations, and gain deep insights into their emotional patterns.

---

## ✨ Key Features

### 🤖 Intelligent AI Therapy
* **Real-time Support**: Empathetic, context-aware conversations powered by Google Gemini.
* **Sentiment Analysis**: AI detects emotional states during chat to provide personalized responses.
* **Safety First**: Integrated safety protocols to handle sensitive mental health queries responsibly.

### 📊 Advanced Mood tracking & Analytics
* **Daily Check-ins**: Quick, intuitive interface for logging daily moods and triggers.
* **Dynamic Dashboards**: Visualize your emotional journey with interactive charts (Chart.js).
* **Weekly Reports**: Automated, data-driven insights that summarize emotional trends.

### 📓 Smart Journaling System
* **Reflective Writing**: A premium journaling interface with markdown support.
* **AI Feedback**: Receive therapeutic insights based on your journal entries.
* **Mood Correlation**: Automatically link your journal entries with your mood history.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Vanilla CSS** (Custom Premium Design System)
- **Lucide Icons**
- **Chart.js & Recharts**

### Backend
- **Node.js & Express**
- **MongoDB Atlas**
- **Google Gemini API** (Generative AI)
- **OpenRouter API** (Safety Monitor Fallback)
- **Nodemailer** (Email notifications)

---

## 🚀 Local Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Atlas account or local instance)
- **Firebase Account** (for Authentication & Hosting)

### 2. Backend Configuration
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder:
   ```env
   # API Keys
   GEMINI_API_KEY=your_gemini_key
   OPENROUTER_API_KEY=your_openrouter_key
   
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # Server Config
   PORT=4000
   
   # Mail Service (Gmail App Password)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` folder:
   ```env
   # Firebase Config
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Backend Connection
   VITE_API_URL=http://localhost:4000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
MenTex/
├── client/           # React + Vite Application
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Page components (Dashboard, Chat, etc.)
│   │   ├── contexts/    # State management (Auth, Theme)
│   │   └── i18n/        # Translation files (EN/BM)
├── server/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database schemas
│   │   └── routes/      # API endpoints
└── firebase.json     # Hosting configurations
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Powered by Onebit Team**  
*Built with ❤️ for mental well-being.*
