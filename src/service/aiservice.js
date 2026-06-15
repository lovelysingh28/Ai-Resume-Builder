import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAISummary(data) {
  try {
    // 1. Initialize Gemini with your existing key
    const genAI = new GoogleGenerativeAI(
      import.meta.env.VITE_GEMINI_API_KEY
    );

    // 2. Use the active Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // 3. Map your existing resume data structure into the prompt
    const prompt = `
Write a professional ATS-friendly resume summary.

Name: ${data.name}
Title: ${data.title}
Skills: ${data.skills}
Experience: ${data.experience}
Education: ${data.education}
    `;

    // 4. Request and parse the text content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.log("GEMINI ERROR:", error.message || error);
    return "Failed to generate AI summary";
  }
}