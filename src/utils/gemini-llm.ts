/**
 * LLM Integration for CookScheduler
 *
 * Handles LLM functionality using Google's Gemini API.
 * The LLM prompt is hardwired with user preferences and doesn't take external hints.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
// This import automatically loads environment variables from .env
import "jsr:@std/dotenv/load";

export class GeminiLLM {
  private apiKey: string;

  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (apiKey !== undefined) {
      this.apiKey = apiKey;
    } else {
      throw new Error("API Key undefined");
    }
  }

  async executeLLM(prompt: string): Promise<string> {
    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      // Execute the LLM
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("❌ Error calling Gemini API:", (error as Error).message);
      throw error;
    }
  }
}
