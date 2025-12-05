import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProjectDescription = async (title: string, client: string, keywords: string[]): Promise<string> => {
  if (!apiKey) {
    console.warn("API_KEY not set. Returning mock description.");
    return "This is a mock description because the API key is missing. Please configure the environment variable.";
  }

  try {
    const prompt = `
      Write a professional, compelling project description for a digital agency portfolio case study.
      Project Title: ${title}
      Client: ${client}
      Keywords/Tech Stack: ${keywords.join(', ')}
      
      The tone should be innovative, professional, and result-oriented. Keep it under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const generateImprovementSuggestion = async (currentText: string): Promise<string> => {
  if (!apiKey) return currentText;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Improve the following text for SEO and readability, keeping the same meaning but making it more punchy for a marketing website:\n\n"${currentText}"`,
    });
    return response.text || currentText;
  } catch (e) {
    return currentText;
  }
}