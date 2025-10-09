# 🏥 **SwasthyaSetu — AI Health Awareness Bot for Rural India**

**SwasthyaSetu** is a **multilingual, AI-powered health awareness platform** built to combat misinformation and promote government healthcare schemes in **rural India**.  
It provides both a **modern web app** and **SMS-based assistant**, ensuring **digital inclusion for all**.

---

## 🎯 **The Problem**

Many rural regions in India face serious **health information gaps** due to:

- ⚠️ **Misinformation** — Reliance on unverified WhatsApp forwards instead of professional medical advice.  
- 🚫 **Access Gaps** — Clinics and doctors are often far away or unavailable.  
- 🧾 **Low Awareness** — Government schemes like *Ayushman Bharat (PM-JAY)* remain underutilized.  
- 📵 **Digital Divide** — Many users lack smartphones or stable internet access.

---

## ✅ **The Solution**

**SwasthyaSetu** bridges this gap with an inclusive, multi-platform approach:

### 💬 **1. Multilingual AI Chatbot — “SwasthyaDoot”**
A responsive **web app** where users chat with an **AI health assistant** for:
- Health awareness & symptom info  
- Government healthcare schemes  
- Local medical guidelines  

### 📱 **2. SMS-Based Chat**
Users without internet can interact via **basic SMS**, powered by **Twilio webhooks**.

### 🔤 **3. Hinglish → Hindi Transliteration**
Backend automatically converts *“cancer ke lakshan” → “कैंसर के लक्षण”*,  
ensuring a **natural, intuitive experience** for Hindi-speaking users.

### 🧠 **4. Retrieval-Augmented Generation (RAG)**
AI answers only from **verified health documents** (ICMR, WHO, etc.) stored in **Pinecone Vector DB**.  
Admins can **upload PDFs** to instantly update the AI’s knowledge base.

### 🔐 **5. Secure Authentication**
- **Users**: Phone-based OTP login  
- **Admins (NGOs / Health Workers)**: Secure credentials for admin dashboard access  

### 🧾 **6. Admin Dashboard**
Admins can:
- Upload verified health PDFs  
- Manage health tips and outreach content  
- Monitor and manage user engagement  

### 📢 **7. Automated Health Outreach**
- **Daily SMS Health Tips** — Scheduled via `node-cron`  
- **Weekly Email Digest** — Sent using `Nodemailer`  

### 💾 **8. Persistent User Experience**
- Chat history and preferences stored in **Supabase DB**  
- Multilingual continuity across sessions  

---

## 🛠️ **Tech Stack**

| Category | Technologies |
|-----------|--------------|
| **Frontend (User & Admin)** | React + TypeScript + Vite, Tailwind CSS, React Router, TanStack Query, i18next, vite-plugin-pwa |
| **Backend** | Node.js + Express.js (TypeScript), Twilio Webhooks, node-cron, Multer, Nodemailer |
| **AI & Data Pipeline** | LangChain.js, Groq (llama-3.1-8b-instant), Pinecone |
| **Database & Auth** | Supabase (PostgreSQL + Auth) |
| **Deployment** | Vercel (Frontend), Render (Backend), Twilio (SMS) |

---

## 🚀 **Getting Started (Local Development)**

Follow the steps below to run **SwasthyaSetu** locally on your system.

---

### 🧩 **Prerequisites**

Before starting, ensure you have these installed:

- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- Access to the required **API keys** (Groq, Pinecone, Supabase, Twilio, etc.)

---

### ⚙️ **1. Clone the Repository**

```bash
# Clone the repo
git clone https://github.com/apurb2509/SwasthyaSetu.git

# Navigate into the project
cd SwasthyaSetu


