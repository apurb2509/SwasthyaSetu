import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import twilio from 'twilio';
import multer from 'multer';

// --- Create necessary directories on startup ---
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory at: ${dataDir}`);
}
// ---

// --- Crash and Error Logging Setup ---
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
// --- End of Logging Setup ---

import { askQuestion } from './services/rag.service';
import { processIncomingMessage } from './services/language.service';
import { authMiddleware } from './middleware/auth.middleware';
import { main as ingestDocuments } from './scripts/ingest';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }
    const answer = await askQuestion(question as string);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get an answer.' });
  }
});

app.post('/api/sms', async (req: Request, res: Response) => {
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
  (req, res, next) => {
    console.log('STEP 1: Upload request received by server.');
    next();
  },
  authMiddleware, 
  upload.single('document'), 
  async (req: Request, res: Response) => {
    console.log('STEP 4: Entering final request handler.');
    if (!req.file) {
      console.log('FINAL HANDLER: No file found on request. Sending 400 error.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    console.log('FINAL HANDLER: File received. Sending immediate 200 OK response.');
    res.status(200).json({ message: 'File received. Knowledge base update started in the background.' });
    console.log('STEP 5: Response sent to frontend.');

    console.log(`Triggering background re-ingestion for ${req.file.originalname}...`);
    
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});