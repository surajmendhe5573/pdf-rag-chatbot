declare module "pdf-parse/lib/pdf-parse.js" {
  interface PdfResult {
    numpages: number;
    text: string;
    info: unknown;
  }
  const pdf: (data: Buffer, options?: Record<string, unknown>) => Promise<PdfResult>;
  export default pdf;
}