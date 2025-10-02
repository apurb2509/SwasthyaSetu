import path from 'path';
import { connect } from 'vectordb';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { ChatGroq } from '@langchain/groq';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';

const lancedbDir = path.join(process.cwd(), 'lancedb');
const collectionName = 'swasthya_setu';

// Initialize the components
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2',
});

// --- THE FIX IS HERE: Changed 'modelName' to 'model' ---
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-8b-8192', // The correct property is 'model'
  temperature: 0.3,
});

const promptTemplate = PromptTemplate.fromTemplate(
  `You are a helpful AI assistant for providing health information in India. Answer the user's question based only on the following context. If the context doesn't contain the answer, state that you cannot find the information in the provided documents. Do not make up information. Your answer must be safe, educational, and encourage users to consult a doctor for serious issues.

Context:
{context}

Question:
{question}`
);

// Main function to handle a user's question
export async function askQuestion(question: string): Promise<string> {
  try {
    // Connect to the existing LanceDB vector store
    const db = await connect(lancedbDir);
    const table = await db.openTable(collectionName);
    const vectorStore = new LanceDB(embeddings, { table });

    const retriever = vectorStore.asRetriever(4);

    // Create the RAG chain
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(
          (docs) => docs.map((d) => d.pageContent).join('\n\n')
        ),
        question: new RunnablePassthrough(),
      },
      promptTemplate,
      llm,
      new StringOutputParser(),
    ]);

    console.log('Invoking RAG chain with Groq...');
    const result = await chain.invoke(question);
    console.log('RAG chain finished.');

    return result;
  } catch (error) {
    console.error('Error in RAG service:', error);
    return 'An error occurred while processing your question. Please try again.';
  }
}