
import { GoogleGenAI, Type } from "@google/genai";
import { MarketAnalysis } from "../types";

export const performProductAnalysis = async (keyword: string): Promise<MarketAnalysis> => {
  // Always create a fresh instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  /**
   * Use gemini-3-flash-preview for stability. 
   * Large grounding tasks with 'pro' models can sometimes trigger timeouts 
   * in the proxy layer resulting in 500 RPC errors.
   */
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a Senior AI Engineer & Cross-border E-commerce Analyst. 
    Analyze the market potential of a keyword on Amazon US.
    
    INSTRUCTIONS:
    1. Use Google Search grounding to retrieve real data from Amazon.com (search results), Google Trends, and Reddit threads.
    2. Focus on the current Amazon search result landscape (first page).
    3. Synthesize the data into a structured business report in JSON format.
    
    JSON Schema:
    - recommendation: "YES", "NO", or "CAUTION"
    - confidenceScore: number (0-100)
    - priceStrategy: string (e.g., "$25 - $35 range")
    - competitionLevel: number (1-10)
    - entryBarrier: number (1-10)
    - riskLevel: number (1-10)
    - opportunityPoints: string[] (3-5 points)
    - coreRisks: string[] (3-5 points)
    - competitors: Array of {title, price, bsr, reviews, launchDate, isNewRelease}
    - trends: Array of {month, value} (last 12 months search interest, normalized 0-100)
    - redditSentiment: {platform: "Reddit", sentiment: "Positive"|"Neutral"|"Negative", discussionVolume: string, keyConcerns: string[]}
  `;

  const prompt = `Perform a comprehensive market analysis for: "${keyword}" on Amazon US. 
    Identify the top 5 competitors, their review counts, and BSR. 
    Check Google search trends for seasonality. 
    Check Reddit for common customer complaints or desired features.
    
    Output the analysis strictly as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model.");
    }

    const result = JSON.parse(text);
    return result as MarketAnalysis;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    if (error.message?.includes("500") || error.message?.includes("Rpc failed")) {
      throw new Error("The analysis engine is currently overloaded. Please try a more specific keyword or wait a moment.");
    }
    throw error;
  }
};
