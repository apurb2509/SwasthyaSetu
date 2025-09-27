import { promises as fs } from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';
import { connect } from 'vectordb';

const dataDir = path.join(process.cwd(), 'data');
const lancedbDir = path.join(process.cwd(), 'lancedb');
const collectionName = 'swasthya_setu';

async function main() {
  console.log('Starting ingestion process with LanceDB...');
  
  if (await fs.stat(lancedbDir).catch(() => false)) {
    console.log('Removing old LanceDB directory...');
    await fs.rm(lancedbDir, { recursive: true, force: true });
  }

  // 1. Load documents
  const pdfDocs: Document[] = [];
  const files = await fs.readdir(dataDir);
  for (const file of files) {
    if (path.extname(file).toLowerCase() === '.pdf') {
      const filePath = path.join(dataDir, file);
      console.log(`- Loading document: ${file}`);
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdf(dataBuffer);
      if (pdfData.text) {
        pdfDocs.push(
          new Document({
            pageContent: pdfData.text,
            metadata: { source: file },
          })
        );
      }
    }
  }
  console.log(`Loaded ${pdfDocs.length} PDF documents with text.`);

  if (pdfDocs.length === 0) {
    console.log('No PDF documents with readable text found. Exiting.');
    return;
  }

  // 2. Split documents
  console.log('Splitting documents into chunks...');
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const chunks = await textSplitter.splitDocuments(pdfDocs);
  console.log(`Created ${chunks.length} text chunks.`);

  // 3. Initialize embeddings
  console.log('Initializing embedding model (this may download on first run)...');
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',
  });
  
  // 4. Ingest into LanceDB
  console.log('Ingesting chunks into LanceDB...');
  const db = await connect(lancedbDir);
  const table = await db.createTable({
    name: collectionName,
    data: [{
      vector: await embeddings.embedQuery(" "),
      text: " ",
      source: " "
    }]
  });
  
  await LanceDB.fromDocuments(chunks, embeddings, { table });
  
  console.log('✅ Ingestion complete!');
  console.log(`LanceDB vector store created in: ${lancedbDir}`);
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
});