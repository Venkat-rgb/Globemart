// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfPath = `./company-doc.pdf`;

// const loader = new PDFLoader(pdfPath, {
//   splitPages: false,
// });

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 100,
// });

// export const loadAndSplitDoc = async () => {
//   try {
//     const doc = await loader.load();
//     const texts = await textSplitter.splitText(doc[0].pageContent);
//     return texts;
//   } catch (err) {
//     console.log("LoadingDocError: ", err?.message);
//   }
// };
