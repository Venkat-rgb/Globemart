import path from "path";
import { fileURLToPath } from "url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { logger } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, "company-doc.pdf");

const loader = new PDFLoader(pdfPath, {
  splitPages: false,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

export const loadAndSplitDoc = async () => {
  try {
    const doc = await loader.load();
    const texts = await textSplitter.splitText(doc[0].pageContent);
    return texts;
  } catch (err) {
    logger.error(`loadAndSplitDoc Error: ${err?.message}`);
  }
};
