# 🧠 MenTex – AI-Powered Mental Health Companion

[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase-FFCA28?style=flat&logo=firebase)](https://aimentalhealth-e4f52.web.app)
[![Render Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://mentex-server.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**MenTex** is a premium, full-stack mental health ecosystem designed to provide accessible, empathetic, and data-driven emotional support. By combining the power of **Google Gemini AI** with sophisticated analytics, MenTex offers users a safe space to track their mental well-being, engage in therapeutic conversations, and gain deep insights into their emotional patterns.

---

## ✨ Key Features

### 🤖 Intelligent AI Therapy
* **Real-time Support**: Empathetic, context-aware conversations powered by Google Gemini.
* **Sentiment Analysis**: AI detects emotional states during chat to provide more personalized responses.
* **Safety First**: Integrated safety protocols to handle sensitive mental health queries responsibly.

### 📊 Advanced Mood tracking & Analytics
* **Daily Check-ins**: Quick, intuitive interface for logging daily moods and triggers.
* **Dynamic Dashboards**: Visualize your emotional journey with interactive charts (Chart.js).
* **Weekly Reports**: Automated, data-driven insights that summarize your emotional trends and suggest wellness improvements.

### 📓 Smart Journaling System
* **Reflective Writing**: A premium journaling interface with markdown support.
* **AI Feedback**: Receive therapeutic insights and summaries based on your journal entries.
* **Mood Correlation**: Automatically link your journal entries with your mood history.

### 🌍 Global Accessibility
* **Multi-Language Support**: Fully supporting **English** and **Bahasa Melayu (BM)**.
* **Premium UI**: Modern, glassmorphic design with seamless **Dark/Light mode** transitions.
* **Privacy Focused**: Secure authentication and private data storage.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS / Vanilla CSS**
- **Lucide Icons**
- **Chart.js & Recharts**
- **React Router Dom 7**

### Backend
- **Node.js & Express**
- **MongoDB** (Mongoose)
- **Google Gemini API** (Generative AI)
- **OpenAI API** (Safety & Fallback)

### Deployment
- **Frontend**: Firebase Hosting
- **Backend**: Render

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or Local)
- Google Gemini API Key

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   GEMINI_API_KEY=your_gemini_key
   PORT=4000
   MONGO_URI=your_mongodb_uri
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
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
│   │   └── contexts/    # State management (Auth, Theme)
├── server/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database schemas
│   │   └── routes/       # API endpoints
└── firebase.json     # Hosting configurations
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments
* Special thanks to the Google Gemini team for the AI capabilities.
* Dedicated to making mental health support accessible to everyone.
