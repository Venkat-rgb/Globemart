import { llm } from "../../server.js";

export const extractProductName = async (userMessage = "") => {
  try {
    // Prompt for LLM to extract product name
    const extractProductNamePrompt = `
   You are an e-commerce product name extractor.
   The user will give you the query, and you need to find and extract only the product name and nothing else (ignore other text)
   If the product name is present in the query, then return only the product name as text. If it is not present then return 'NA'.
   Do not include category keywords like camera, phone, laptop, product, item, etc after the product name
  
   Examples:
   User: What is the stock of Apple MacBook Pro?
   Answer: Apple MacBook Pro
  
   User: I recently purchased OnePlus 9 pro phone. I want to know its battery life.
   Answer: OnePlus 9 pro // Here keyword phone is ignored
  
   User: Show me the a product which is good for running?
   Answer: NA
  
   Now answer the user query: ${userMessage}`;

    const productName = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: extractProductNamePrompt,
      config: {
        temperature: 0,
        maxOutputTokens: 30,
      },
    });

    return productName.text.trim();
  } catch (err) {
    console.log("Error while extracting product name: ", err?.message);
  }
};
