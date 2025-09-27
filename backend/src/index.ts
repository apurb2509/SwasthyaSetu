import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { askQuestion } from './services/rag.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Existing health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// New chat endpoint for the RAG pipeline
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    console.log(`Received question: "${question}"`);
    const answer = await askQuestion(question as string);

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error in /api/chat endpoint:', error);
    res.status(500).json({ error: 'Failed to get an answer.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});