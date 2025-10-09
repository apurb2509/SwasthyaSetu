import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import twilio from 'twilio';
import multer from 'multer';
import cron from 'node-cron';
import { createClient, User } from '@supabase/supabase-js';

// --- Logging and Directory Setup (unchanged) ---
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(process.cwd(), 'error.log'), { flags: 'a' });
process.on('uncaughtException', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} Uncaught Exception:`, err);
  logStream.write(`${timestamp} Uncaught Exception: ${err.stack || err.message}\n`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} Unhandled Rejection at:`, promise, 'reason:', reason);
  logStream.write(`${timestamp} Unhandled Rejection: ${reason}\n`);
});

import { askQuestion } from './services/rag.service';
import { processIncomingMessage } from './services/language.service';
import { authMiddleware } from './middleware/auth.middleware';
import { main as ingestDocuments } from './scripts/ingest';
import { sendDailyHealthTips } from './services/scheduler.service';
import { sendWeeklyNewsletter } from './services/newsletter.service';
import { getChatHistory, saveChatMessage } from './services/chat.service';

const app = express();
const PORT = process.env.PORT || 3001;

// --- PRODUCTION CORS CONFIGURATION (UPDATED) ---
const allowedOrigins = [
    'https://swasthyasetu-frontend-1-12sunwkk7-apurb2509s-projects.vercel.app', // Your main frontend URL from the error log
    'https://swasthyasetu-admin-frontend-1-gkv6pax8r-apurb2509s-projects.vercel.app'  // Your admin frontend URL
];
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl) and from our Vercel domains
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error('CORS Error: Request from origin', origin, 'is not allowed.');
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));
// ---

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'data/'); },
    filename: (req, file, cb) => { cb(null, file.originalname); },
});
const upload = multer({ storage });

const getUser = async (token: string): Promise<User | null> => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return user;
};

// --- API ROUTES (unchanged) ---
app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP' }));

app.post('/api/chat', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!question || !token) {
      return res.status(400).json({ error: 'Question and token are required.' });
    }
    const user = await getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    await saveChatMessage(user.id, 'user', question as string);
    const answer = await askQuestion(question as string);
    await saveChatMessage(user.id, 'bot', answer);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get an answer.' });
  }
});

app.get('/api/chat/history', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        const user = await getUser(token);
        if (!user) return res.status(401).json({ error: 'Invalid user' });
        const history = await getChatHistory(user.id);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history.' });
    }
});

app.post('/api/sms', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMsg = req.body.Body;
  try {
    const processedQuestion = processIncomingMessage(incomingMsg);
    const answer = await askQuestion(processedQuestion);
    twiml.message(answer);
  } catch (error) {
    twiml.message('Sorry, an error occurred.');
  }
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.post('/api/admin/upload', 
  authMiddleware, 
  upload.single('document'), 
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(200).json({ message: 'File received. Knowledge base update started in the background.' });
    console.log(`File uploaded: ${req.file.originalname}. Triggering background re-ingestion...`);
    ingestDocuments().then(() => {
      console.log('✅ Background ingestion completed successfully.');
    }).catch(err => {
      console.error('❌ Background ingestion failed:', err);
    });
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("--- EXPRESS ERROR HANDLER CAUGHT AN ERROR ---");
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// --- SCHEDULED TASKS (unchanged) ---
cron.schedule('0 8 * * *', () => { console.log('--- Running Daily SMS Task ---'); sendDailyHealthTips(); }, { scheduled: true, timezone: "Asia/Kolkata" });
cron.schedule('0 9 * * 0', () => { console.log('--- Running Weekly Newsletter Task ---'); sendWeeklyNewsletter(); }, { scheduled: true, timezone: "Asia/Kolkata" });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});