import { Request, Response } from "express";
import OpenAI from "openai";
import asyncHandler from "express-async-handler";

interface CustomError extends Error {
  statusCode?: number;
}

// Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
    "X-Title": process.env.SITE_NAME || "YummyYummy", 
  },
});

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity?: string;
}

interface ScanFoodResponse {
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

// Scan food from image
export const scanFood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const { imageUrl, imageBase64 } = req.body;

  if (!imageUrl && !imageBase64) {
    const error = new Error("Either imageUrl or imageBase64 is required") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error("OpenRouter API key not configured") as CustomError;
    error.statusCode = 500;
    throw error;
  }

  // Determine image URL format
  let imageUrlForAPI: string;
  if (imageBase64) {
    // If base64, ensure it has the data URL prefix
    imageUrlForAPI = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;
  } else {
    imageUrlForAPI = imageUrl;
  }

  try {
    // Create the prompt for food analysis
    const prompt = `
      Analyze this food image and identify all food items and ingredients visible. For each food item, provide:
      1. The name of the food/ingredient
      2. Estimated quantity (e.g., "1 cup", "200g", "1 serving")
      3. Calories
      4. Protein in grams
      5. Carbs in grams
      6. Fats in grams

      Return the response as a JSON object with this exact structure:
      {
        "foods": [
          {
            "name": "food name",
            "quantity": "estimated quantity",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fats": number
          }
        ]
      }

      Be as accurate as possible with the nutritional information. If you cannot identify a food item clearly, estimate based on common serving sizes. Return ONLY valid JSON, no additional text.
      `;

    // Open Router call for gpt-4o-mini
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrlForAPI,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent nutritional data
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      const error = new Error("No response from AI model") as CustomError;
      error.statusCode = 500;
      throw error;
    }

    // Parse the JSON response
    let parsedResponse: { foods: FoodItem[] };
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract JSON from the response if it's wrapped in markdown or text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Validate and calculate totals
    if (!parsedResponse.foods || !Array.isArray(parsedResponse.foods)) {
      const error = new Error("Invalid response format from AI") as CustomError;
      error.statusCode = 500;
      throw error;
    }

    // Calculate totals
    const totals = parsedResponse.foods.reduce(
      (acc, food) => ({
        calories: acc.calories + (food.calories || 0),
        protein: acc.protein + (food.protein || 0),
        carbs: acc.carbs + (food.carbs || 0),
        fats: acc.fats + (food.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const response: ScanFoodResponse = {
      foods: parsedResponse.foods,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFats: totals.fats,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error scanning food:", error);
    if (error instanceof Error && (error as CustomError).statusCode) {
      throw error;
    }
    const customError = new Error(
      `Failed to scan food: ${error instanceof Error ? error.message : "Unknown error"}`
    ) as CustomError;
    customError.statusCode = 500;
    throw customError;
  }
});

