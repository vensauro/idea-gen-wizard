import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateInsights(prompt: string, maxRetries = 3) {
  let retries = 0;
  while (retries <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error: any) {
      console.error("Error generating insights:", error);
      
      // Check for 429 Resource Exhausted
      const isRateLimit = error.status === 429 || 
                          error.message?.includes('429') || 
                          error.message?.includes('RESOURCE_EXHAUSTED') ||
                          error.message?.includes('quota');
                          
      if (isRateLimit) {
        if (retries < maxRetries) {
          const waitTime = Math.pow(2, retries) * 2000 + Math.random() * 1000; // 2s, 4s, 8s + jitter
          console.log(`Rate limit hit. Retrying in ${Math.round(waitTime/1000)}s...`);
          await delay(waitTime);
          retries++;
          continue;
        } else {
          throw new Error("O limite de uso da IA foi atingido. Por favor, aguarde alguns instantes e tente novamente.");
        }
      }
      
      throw new Error(error.message || "Falha ao gerar insights. Tente novamente.");
    }
  }
}
