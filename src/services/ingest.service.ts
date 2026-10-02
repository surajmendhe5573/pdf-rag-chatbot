import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { extractPages } from "./pdf.service.js";
import { vectorStore } from "./vectorstore.service.js";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: env.CHUNK_SIZE,
  chunkOverlap: env.CHUNK_OVERLAP,
});

export async function ingestPdf(buffer: Buffer, fileName: string) {
  const pages = await extractPages(buffer);
  const documentId = randomUUID();
  const docs: Document[] = [];

  for (let i = 0; i < pages.length; i++) {
    const chunks = await splitter.splitText(pages[i]);
    chunks.forEach((chunk, chunkIndex) => {
      if (!chunk.trim()) return;
      docs.push(
        new Document({
          pageContent: chunk,
          // Chroma metadata must be flat primitives (string | number | boolean)
          metadata: { documentId, fileName, page: i + 1, chunkIndex },
        })
      );
    });
  }

  if (docs.length === 0) throw new HttpError(422, "PDF produced no text chunks");

  await vectorStore.addDocuments(docs, { ids: docs.map(() => randomUUID()) });

  return { documentId, fileName, pages: pages.length, chunks: docs.length };
}

export async function deleteDocument(documentId: string) {
  await vectorStore.delete({ filter: { documentId } });
}