SwasthyaSetu - AI Health Awareness Bot for Rural India
SwasthyaSetu is a multilingual, full-stack application designed to combat health misinformation and increase awareness of government healthcare schemes in rural India. It provides a reliable, AI-powered health assistant accessible via a modern web interface and basic SMS, ensuring digital inclusion for all.


🎯 The Problem
In many rural parts of India, access to reliable health information is limited. This leads to several critical issues:

Misinformation: Villagers often trust unverified messages on platforms like WhatsApp over professional medical advice.

Access Gaps: Limited proximity to clinics and doctors makes getting timely information difficult.

Low Scheme Awareness: Crucial government initiatives like Ayushman Bharat (PM-JAY) and vaccination drives are underutilized due to a lack of awareness and understanding.

Digital Divide: Many potential users do not have smartphones or consistent internet access, making web-only solutions ineffective.

✅ The Solution: Key Features
SwasthyaSetu bridges this gap by providing a multi-platform solution with the following core features:

Multilingual AI Chatbot (SwasthyaDoot): A responsive web application where users can log in and have detailed conversations with an AI assistant about health topics, symptoms, and government schemes.

SMS-Based Chat: Users with basic mobile phones can interact with the same AI assistant by sending and receiving SMS messages, ensuring a fully inclusive platform.

Hinglish to Hindi Transliteration: The backend automatically detects Hinglish (e.g., "cancer ke lakshan") in SMS messages and converts it to Devanagari script for the AI to understand, providing a natural user experience.

Retrieval-Augmented Generation (RAG): The AI's knowledge is not generic. It is based on a secure knowledge base of verified documents from sources like the ICMR and WHO, which can be updated by administrators. This ensures all responses are safe, relevant, and context-aware.

Secure User & Admin Authentication:

Users log in securely via a one-time password (OTP) sent to their phone.

Admins (NGOs/health workers) have a separate, secure login to access a dedicated dashboard.

Admin Dashboard: A private web application where authorized personnel can upload new PDF documents (e.g., new scheme brochures, local health advisories) to instantly update the AI's knowledge base.

Automated Health Outreach:

Daily SMS Health Tips: Subscribed users receive a daily health tip via SMS, scheduled to run automatically.

Weekly Email Newsletter: A weekly email is sent out with a digest of health information and seasonal advice.

Persistent User Experience: The platform saves user profiles and chat history, allowing for a continuous and personalized experience across sessions. Language preferences are also saved per user.

🛠️ Tech Stack
This project is built with a modern, scalable, and cost-effective tech stack.

Frontend (User & Admin)
Framework: React with TypeScript + Vite

Styling: Tailwind CSS

Routing: React Router

State Management & Data Fetching: TanStack Query

Internationalization (i18n): i18next & react-i18next

PWA Support: vite-plugin-pwa

Backend
Framework: Node.js + Express.js with TypeScript

Real-time Communication: Twilio Webhooks

Scheduled Jobs: node-cron

Email: Nodemailer with Gmail

File Uploads: Multer

AI & Data Pipeline
Orchestration: LangChain.js

LLM (Production): Groq (Llama 3.1)

Embeddings Model: Xenova/all-MiniLM-L6-v2 (running via HuggingFace Transformers)

Vector Database: Pinecone (Managed Cloud Service)

Document Loading: pdf-parse

Database & Authentication
User Authentication: Supabase Auth (Phone OTP & Email/Password)

Database: Supabase (PostgreSQL)

Deployment & Infrastructure
Frontend (User & Admin): Vercel

Backend: Render

SMS & Communication: Twilio

🚀 Getting Started (Local Development)
To set up and run this project on your local machine, you will need to clone the repository and configure each of the three main parts.

Prerequisites
Node.js and npm

Git

1. Clone the Repository
git clone [https://github.com/your-username/SwasthyaSetu.git](https://github.com/your-username/SwasthyaSetu.git)
cd SwasthyaSetu

2. Set Up the Backend
cd backend
npm install
# Create a .env file and add all the required API keys and credentials
npm run ingest  # Run this one time to populate your Pinecone database
npm run dev

3. Set Up the Main Frontend
cd frontend
npm install
# Create a .env file and add the required Supabase and Admin Panel URLs
npm run dev

4. Set Up the Admin Frontend
cd admin-frontend
npm install
# Create a .env file and add the required Supabase and Main Site URLs
npm run dev

You will need to have all three development servers running simultaneously for the full local experience.
