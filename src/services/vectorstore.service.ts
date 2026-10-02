import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { env } from "../config/env.js";

const embeddings = new OllamaEmbeddings({
  model: env.EMBEDDING_MODEL,
  baseUrl: "http://localhost:11434",
});

export const vectorStore = new Chroma(embeddings, {
  collectionName: env.CHROMA_COLLECTION,
  url: env.CHROMA_URL,
});