import type { Request, Response } from "express";
import { z } from "zod";
import { deleteDocument, ingestPdf } from "../services/ingest.service.js";
import { askQuestion } from "../services/rag.service.js";
import { HttpError } from "../utils/httpError.js";

export async function uploadPdf(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'Attach a PDF in the "file" field');
  const result = await ingestPdf(req.file.buffer, req.file.originalname);
  res.status(201).json(result);
}

const chatSchema = z.object({
  documentId: z.string().uuid(),
  question: z.string().min(1).max(2000),
});

export async function chat(req: Request, res: Response) {
  const { documentId, question } = chatSchema.parse(req.body);
  res.json(await askQuestion(question, documentId));
}

const paramsSchema = z.object({
  documentId: z.string().uuid(),
});

export async function removePdf(req: Request, res: Response) {
  const { documentId } = paramsSchema.parse(req.params);
  await deleteDocument(documentId);
  res.status(204).end();
}