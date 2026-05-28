import { tool } from "langchain";
import * as z from "zod";
import { Product } from "../../../models/Product.js";
import { myCache } from "../../../server.js";
import { logger } from "../../logger.js";

export const productInfo = tool(
  async ({ productName }, config) => {
    try {
      // Get the productId from config
      const productId = config.configurable.productId;

      let product;
      const requiredFields = `title description productFeatures stock discountPrice`;

      // Checking product using productId
      if (productId) {
        // Check if product is present in cache
        const cacheKey = `product_${productId}`;

        if (myCache.has(cacheKey)) {
          product = JSON.parse(myCache.get(cacheKey));
        } else {
          // Fetching product from DB
          product = await Product.findById(productId).select(requiredFields);
        }
      } else if (productName) {
        // Fetching product using productName
        product = await Product.findOne({
          title: productName,
        }).select(requiredFields);
      }

      // If product not found
      if (!product) {
        return `Sorry! Product you want details for is not available`;
      }

      // Choosing only required fields for LLM
      const modifiedProduct = {
        title: product.title,
        description: product.description,
        productFeatures: product.productFeatures,
        stock: product.stock,
        discountPrice: product.discountPrice,
      };

      // Returning product info
      return JSON.stringify(modifiedProduct);
    } catch (err) {
      logger.info(`productInfoTool Error: ${err.message}`);
      // Fallback message if productInfo tool fails
      return "I apologize, but I'm having trouble accessing product info right now. Please check out the product page to know more about product features";
    }
  },
  {
    name: "product_info",
    description: "Use when customer asks details about a specific product",
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
