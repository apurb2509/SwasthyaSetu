import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { askQuestion } from './services/rag.service';
import { processIncomingMessage } from './services/language.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Twilio's webhook sends data in a different format, so we need this middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Existing health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Existing web chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }
    console.log(`Received question via web: "${question}"`);
    const answer = await askQuestion(question as string);
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error in /api/chat endpoint:', error);
    res.status(500).json({ error: 'Failed to get an answer.' });
  }
});

// NEW SMS webhook endpoint
app.post('/api/sms', async (req: Request, res: Response) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMsg = req.body.Body;
  console.log(`Received SMS: "${incomingMsg}"`);

  try {
    // 1. Process the message (transliterate if needed)
    const processedQuestion = processIncomingMessage(incomingMsg);

    // 2. Get the answer from our RAG AI
    const answer = await askQuestion(processedQuestion);

    // 3. Prepare the reply using TwiML
    twiml.message(answer);

  } catch (error) {
    console.error('Error processing SMS:', error);
    twiml.message('Sorry, an error occurred while processing your request. Please try again.');
  }

  // 4. Send the reply back to Twilio
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});