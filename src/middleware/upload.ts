import multer from "multer";
import { HttpError } from "../utils/httpError.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new HttpError(400, "Only PDF files are allowed"));
  },
});