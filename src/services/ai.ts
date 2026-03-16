import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInsights(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error: any) {
    console.error("Error generating insights:", error);
    throw new Error(error.message || "Falha ao gerar insights. Tente novamente.");
  }
}
