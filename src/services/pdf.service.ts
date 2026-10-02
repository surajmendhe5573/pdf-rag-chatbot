import pdf from "pdf-parse/lib/pdf-parse.js";
import { HttpError } from "../utils/httpError.js";

/** Extracts text from a PDF buffer, one string per page. */
export async function extractPages(buffer: Buffer): Promise<string[]> {
  const pages: string[] = [];

  try {
    await pdf(buffer, {
      // pdf-parse calls this once per page, in order
      pagerender: async (pageData: any) => {
        const content = await pageData.getTextContent({ normalizeWhitespace: true });
        let text = "";
        let lastY: number | undefined;
        for (const item of content.items) {
          const y = item.transform[5];
          text += lastY === undefined || lastY === y ? item.str : "\n" + item.str;
          lastY = y;
        }
        pages.push(text);
        return text;
      },
    });
  } catch {
    throw new HttpError(422, "Could not read this PDF (corrupted or password-protected?)");
  }

  if (pages.every((p) => p.trim().length === 0)) {
    throw new HttpError(422, "No extractable text found (scanned PDF? OCR is not supported)");
  }
  return pages;
}