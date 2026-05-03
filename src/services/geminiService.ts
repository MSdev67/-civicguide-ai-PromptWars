import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(prompt: string, history: { role: "user" | "model", parts: string }[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are CivicGuide AI, an expert assistant for election processes and civic engagement. 
        Your goal is to provide accurate, non-partisan information about voting, candidates, and election procedures.
        Always encourage civic participation and verify facts. 
        If asked about "fake news" or a specific claim, analyze it critically using known election facts and logic.
        Keep responses concise, helpful, and professional. Use markdown for formatting.`,
      },
    });

    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.parts }]
    }));

    const result = await chat.sendMessage({
      message: prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
}

export async function detectFakeNews(text: string) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following claim or news snippet related to elections for potential misinformation or fake news. 
      Provide a "Trust Score" (0-100), identify potential biases, and provide a short fact-check summary.
      
      Input text: "${text}"
      
      Return the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Fake News Detection Error:", error);
    return { trustScore: 50, summary: "Could not analyze the text accurately at this time.", biases: ["Unknown"] };
  }
}
