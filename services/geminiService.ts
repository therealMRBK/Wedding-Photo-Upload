
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWeddingCaption = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: "Analysiere dieses Hochzeitsfoto und schreibe einen kurzen, poetischen und herzlichen Kommentar oder Glückwunsch auf Deutsch (maximal 15 Wörter). Erzeuge nur den Text ohne Anführungszeichen."
            }
          ],
        },
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Ein unvergesslicher Moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ein wunderschöner Moment für die Ewigkeit.";
  }
};
