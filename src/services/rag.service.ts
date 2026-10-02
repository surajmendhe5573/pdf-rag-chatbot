import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { env } from "../config/env.js";
import { vectorStore } from "./vectorstore.service.js";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: env.CHAT_MODEL,
  baseUrl: "http://localhost:11434",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You answer questions about a PDF document using ONLY the context provided. " +
      "If the answer is not in the context, say you couldn't find it in the document. " +
      "Mention page numbers when useful.",
  ],
  ["human", "Context:\n{context}\n\nQuestion: {question}"],
]);

const chain = prompt.pipe(llm).pipe(new StringOutputParser());

export async function askQuestion(question: string, documentId: string) {
  // 1. embed the question + similarity search, scoped to one PDF
  const results = await vectorStore.similaritySearch(question, env.TOP_K, { documentId });

  if (results.length === 0) {
    return { answer: "I couldn't find any content for that document.", sources: [] };
  }

  // 2. build context from the retrieved chunks
  const context = results
    .map((d) => `[Page ${d.metadata.page}]\n${d.pageContent}`)
    .join("\n\n---\n\n");

  // 3. ask the LLM
  const answer = await chain.invoke({ context, question });

  return {
    answer,
    sources: results.map((d) => ({
      page: d.metadata.page,
      snippet: d.pageContent.slice(0, 200),
    })),
  };
}