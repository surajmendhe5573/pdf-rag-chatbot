import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err instanceof ZodError) return res.status(400).json({ error: "Invalid request", details: err.flatten() });
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}