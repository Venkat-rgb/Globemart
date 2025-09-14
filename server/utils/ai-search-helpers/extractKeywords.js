import { genAI } from "../../server.js";

// Extracting keywords from user query
export const extractKeywords = async (query) => {
  try {
    const availableCategories = [
      "men clothes",
      "women clothes",
      "mobiles",
      "laptops",
      "cameras",
      "headphones",
      "earphones",
      "watches",
      "speakers",
      "shoes",
    ];

    const systemPrompt = `
    You are an expert e-commerce query analyzer. Extract price range and product category from user queries.

    IMPORTANT RULES:
    1. Only use these exact categories: ${availableCategories.join(", ")}
    2. For prices, extract numerical values and convert to appropriate MongoDB operators
    3. If the query contains a price, but no filters like: less than, under, greater than, or more, then apply $gte to the price
    4. Return valid JSON only, no additional text
    5. If no clear category match, return an empty object {}
    6. If no price is mentioned, omit the discountPrice field entirely. If no keyword in the query matches the provided categories, but the price is mentioned, then omit the category field, but include the discountPrice field
    7. Note that there are only 2 possible fields you can return in JSON (category, discountPrice). Do not create and return own fields on your own  


    EXAMPLES:
    Input: "I am going to a wedding, so show me a kurta pyjama from price 1000 to 2000"
    Output: {"category": "men clothes", "discountPrice": {"$gte": 1000, "$lte": 2000}}

    Input: "Show me laptops under price 800"
    Output: {"category": "laptops", "discountPrice": {"$lte": 800}}

    Input: "I need headphones of price above 5000"
    Output: {"category": "headphones", "discountPrice": {"$gte": 5000}}

    Input: "Show me watches of price 500"
    Output: {"category": "watches", "discountPrice": {"$gte: 500}}

    Input: "I want a nice white kurta"
    Output: {"category": "men clothes"}

    Now extract from the user query:`;

    const extractedKeywords = await genAI.models.generateContent({
      model: "gemma-3-27b-it",
      contents: `${systemPrompt}\n\n${query}`,
      config: {
        temperature: 0,
        maxOutputTokens: 100,
      },
    });

    return extractedKeywords.text;
  } catch (err) {
    console.log("keywordExtractingError: ", err?.message);
  }
};
