import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { genAI } from "../server.js";

export const getResult = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return next(new AppError("Please enter the message!", 400));
  }

  const prompt = `User Input: ${message}
  Answer: `;

  const response = await genAI.models.generateContent({
    model: "gemma-3-27b-it",
    contents: prompt,
    config: {
      maxOutputTokens: 100,
      temperature: 0,
    },
  });

  res.status(200).json({
    message: response.text,
  });
});
