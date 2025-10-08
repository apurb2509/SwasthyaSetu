import { promises as fs } from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

const dataDir = path.join(process.cwd(), 'data');

export async function main() {
  console.log('Starting ingestion process for Pinecone...');

  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error('Pinecone API Key and Index name must be set in .env file.');
  }

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
  
  const pdfDocs: Document[] = [];
  const files = await fs.readdir(dataDir);
  for (const file of files) {
      if (path.extname(file).toLowerCase() === '.pdf') {
          const filePath = path.join(dataDir, file);
          console.log(`- Loading document: ${file}`);
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdf(dataBuffer);
          if(pdfData.text) {
            pdfDocs.push(new Document({ pageContent: pdfData.text, metadata: { source: file } }));
          }
      }
  }

  if (pdfDocs.length === 0) {
    console.log('No readable PDF documents found. Exiting.');
    return;
  }

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const chunks = await textSplitter.splitDocuments(pdfDocs);
  console.log(`Created ${chunks.length} text chunks.`);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',
  });
  
  console.log('Ingesting chunks into Pinecone...');
  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
  
  console.log('✅ Ingestion complete!');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('An unexpected error occurred during ingestion:', error);
  });
}