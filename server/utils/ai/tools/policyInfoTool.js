import { tool } from "langchain";
import * as z from "zod";
import { generateEmbedding } from "../generateEmbedding.js";
import { Company } from "../../../models/Company.js";
import { logger } from "../../logger.js";

export const policyInfo = tool(
  async ({ query }) => {
    try {
      // 1) Generate the embedding for the user query
      const queryEmbedding = await generateEmbedding(query, "RETRIEVAL_QUERY");

      // 2) Perform vector search to match top 3 documents
      const similarDocs = await Company.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            limit: 3,
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 200,
          },
        },
        {
          $project: {
            _id: 1,
            embeddingText: 1,
          },
        },
      ]);

      // If similar docs are found
      if (similarDocs.length === 0) {
        return "I couldn't find specific information related to your query";
      }

      // Formatting docs information into a string
      const docsText = similarDocs
        .map((info, i) => `Document ${i + 1}: ${info?.embeddingText}`)
        .join("\n\n");

      // Returning the policy info
      return docsText;
    } catch (err) {
      logger.info(`policyInfoTool Error: ${err.message}`);

      // Fallback message if policyInfo tool fails
      return `I apologize, but I'm having trouble accessing our policy information right now. Please switch to 'Chat with our Agent' to get your question answered`;
    }
  },
  {
    name: "policy_info",
    description:
      "Use when customer asks details about our globemart policies, returns/refunds, app related FAQs",
    schema: z.object({
      query: z
        .string()
        .describe(
          "This is policy related query customer is asking. Make sure to match the full exact query which customer is providing",
        ),
    }),
  },
);
