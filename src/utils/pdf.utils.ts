// @ts-ignore
const pdf = require("pdf-extraction");
import fetch from "node-fetch";

export async function extractTextFromPDF(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.buffer();

  const data = await pdf(buffer);

  return data.text;
}
