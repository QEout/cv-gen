import { GoogleGenAI } from "@google/genai";
import { PolishRequest } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const polishContent = async (request: PolishRequest): Promise<string> => {
  try {
    const ai = getClient();
    
    let prompt = "";
    
    const baseInstruction = "You are a professional Ivy League admission consultant helper. Your task is to rewrite the user's input for a Study Abroad CV (English). If the input is in Chinese, translate it to professional, academic English first, then polish it. If the input is English, refine it to be more impactful. Do not add markdown formatting like **bold**. Keep it concise.";

    if (request.type === 'experience') {
      prompt = `${baseInstruction} 
      
      Task: Rewrite the following work experience bullet points. Use strong action verbs (e.g., Spearheaded, Developed, Optimized). Quantify results where possible.
      
      Text to rewrite: "${request.text}"`;
    } else if (request.type === 'project') {
      prompt = `${baseInstruction} 
      
      Task: Rewrite the following academic or personal project description. Focus on technical skills used, the problem solved, and the outcome.
      
      Text to rewrite: "${request.text}"`;
    } else if (request.type === 'summary') {
      prompt = `${baseInstruction} 
      
      Task: Rewrite the following professional summary. Make it compelling, highlighting academic potential and career goals. Keep it under 4 sentences.
      
      Text to rewrite: "${request.text}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response needed for UI tool
        temperature: 0.7,
      }
    });

    return response.text?.trim() || request.text;
  } catch (error) {
    console.error("Error polishing content:", error);
    throw error;
  }
};