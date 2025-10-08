import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { ChatGroq } from '@langchain/groq';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';

// --- PRODUCTION SAFEGUARD ---
// This code runs when the server starts. If any key is missing, the server will
// crash with a clear error message in the Render logs.
if (!process.env.GROQ_API_KEY || !process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error('FATAL ERROR: Missing GROQ or Pinecone environment variables on the server.');
}

const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2',
});

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-8b-8192',
  temperature: 0.3,
});

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

const promptTemplate = PromptTemplate.fromTemplate(
  `You are a helpful AI assistant for providing health information in India. Answer the user's question based only on the following context. If the context doesn't contain the answer, state that you cannot find the information in the provided documents. Do not make up information. Your answer must be safe, educational, and encourage users to consult a doctor for serious issues.

Context:
{context}

Question:
{question}`
);

export async function askQuestion(question: string): Promise<string> {
  try {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const retriever = vectorStore.asRetriever(4);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join('\n\n')),
        question: new RunnablePassthrough(),
      },
      promptTemplate,
      llm,
      new StringOutputParser(),
    ]);

    console.log('Invoking RAG chain with Pinecone & Groq...');
    const result = await chain.invoke(question);
    console.log('RAG chain finished.');

    return result;
  } catch (error) {
    console.error('Error in RAG service:', error);
    return 'An error occurred while processing your question. Please try again.';
  }
}