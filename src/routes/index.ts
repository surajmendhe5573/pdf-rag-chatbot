import { Router } from "express";
import { chat, removePdf, uploadPdf } from "../controllers/pdf.controller.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/pdf/upload", upload.single("file"), asyncHandler(uploadPdf));
router.delete("/pdf/:documentId", asyncHandler(removePdf));
router.post("/chat", asyncHandler(chat));

export default router;