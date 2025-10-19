// const delay = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

// const savePolicyEmbeddings = async () => {
//   try {
//     // Loading the pdf chunks
//     const chunks = await loadAndSplitDoc();

//     for (let i = 0; i < chunks.length; ++i) {
//       // Cleaning each text chunk to remove leading, trailing space, special characters
//       const cleanedChunk = cleanChunkText(chunks[i]);

//       // Generate embedding for each chunk
//       const embedding = await generateEmbedding(
//         cleanedChunk,
//         "RETRIEVAL_DOCUMENT"
//       );

//       const infoObj = {
//         embeddingText: cleanedChunk,
//         embedding,
//       };

//       // Saving each chunk in DB with 700ms delay
//       const info = new Company(infoObj);
//       await info.validate();
//       await info.save();

//       console.log(`Saved chunk ${i}`);
//       await delay(700);
//     }

//     console.log("Saved all embeddings!");
//   } catch (err) {
//     console.log("saveEmbeddingsError: ", err?.message);
//   }
// };
