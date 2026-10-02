import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  OPENAI_API_KEY: z.string().optional(),
  CHAT_MODEL: z.string().default("gpt-4o-mini"),
  EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  CHROMA_URL: z.string().default("http://localhost:8000"),
  CHROMA_COLLECTION: z.string().default("pdf_chunks"),
  CHUNK_SIZE: z.coerce.number().default(1000),
  CHUNK_OVERLAP: z.coerce.number().default(200),
  TOP_K: z.coerce.number().default(4),
});

export const env = schema.parse(process.env);