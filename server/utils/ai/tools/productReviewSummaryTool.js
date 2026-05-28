import { tool } from "langchain";
import * as z from "zod";
import { Product } from "../../../models/Product.js";
import { Review } from "../../../models/Review.js";
import { logger } from "../../logger.js";

export const productReviewSummary = tool(
  async ({ productName }, config) => {
    try {
      let productId = config.configurable.productId;

      // Checking product using productId
      if (!productId) {
        if (productName) {
          // Fetching product using productName
          const product = await Product.findOne({
            title: productName,
          }).select(`_id`);

          // If product doesn't exist
          if (!product) {
            return `Sorry! Product you want details for is not available`;
          }

          productId = product._id;
        } else {
          // When both productId and productName are missing
          return `Sorry! Could not determine which product reviews you are looking for. Please navigate to product page (or) provide product name.`;
        }
      }

      // Get top 5 latest reviews
      const reviews = await Review.find({
        productId,
      })
        .sort("-createdAt")
        .select("review")
        .limit(5);

      // If product reviews are empty
      if (reviews.length === 0) {
        return `Sorry! Reviews for the product you want are not available as no one gave review`;
      }

      // Formatting reviews into a string
      const reviewsText = reviews
        .map((text, i) => `Review ${i + 1}: ${text.review}`)
        .join("\n\n");

      // Returning the reviews to LLM
      return reviewsText;
    } catch (err) {
      logger.info(`productReviewSummaryTool Error: ${err.message}`);

      // Fallback message if productReviewSummary tool fails
      return `I apologize, but I'm having trouble summarizing your product reviews`;
    }
  },
  {
    name: "product_reviews_summary",
    description:
      "Use when customer asks about summarizing reviews for a specific product",
    schema: z.object({
      productName: z
        .string()
        .optional()
        .describe(
          `Product name customer is asking about. If customer doesn't provide product name then leave it empty ""`,
        ),
    }),
  },
);
