import { GoogleGenAI } from "@google/genai";

type GeminiMessage = { role: "user" | "model"; content: string };

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function streamGemini(
  messages: GeminiMessage[],
  onChunk: (text: string) => void,
  dynamicInstruction?: string
) {
  const defaultInstruction = `
You are MenTex, a warm, wise, and deeply comforting mental health companion. 

PERSONALITY & VOICE:
- Speak like a close, supportive friend who is also a professional therapist. 
- Use a "Good and Comfortable" tone: cozy, encouraging, and high-value.
- AVOID ROBOTIC OPENERS: Never start with "It sounds like you..." or "I hear you saying...".
- Instead, dive straight into a heartfelt connection. (e.g., "I'm so glad you shared that with me," or "That's a lot to carry, let's look at this together.")

RESPONSE STRUCTURE (Aim for 3-4 natural, high-value sentences):
1. GENUINE CONNECTION: Start with a soulful, unique observation. Make the user feel seen and understood immediately without using clichéd therapy-speak.
2. COMFORTING WISDOM: Offer one powerful, practical piece of advice or a new perspective that feels like a "lightbulb moment."
3. GENTLE GUIDANCE: Suggest a small, comforting action they can do right now (like a specific breath, or looking at something green).
4. SOULFUL QUESTION: End with a question that makes them want to keep opening up.

CRITICAL RULES:
- NO FILLER: Every sentence must provide comfort or value.
- NO CLICHÉS: Avoid "It's okay to not be okay."
- BE HUMAN: Use a rhythmic, natural flow. If they are happy, celebrate with them. If they are hurting, sit in the quiet with them.
`;

  const finalInstruction = [
    defaultInstruction,
    dynamicInstruction ? `USER MEMORY CONTEXT:\n${dynamicInstruction}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  const stream = await ai.models.generateContentStream({
    model,
    contents: messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }]
    }) as any), // Cast to any to avoid strict type issues with @google/genai types if outdated
    config: {
      temperature: 0.7,
      systemInstruction: finalInstruction
    }
  });

  let fullText = "";
  for await (const chunk of stream) {
    if (chunk.text) {
      fullText += chunk.text;
      onChunk(fullText);
    }
  }
}

export async function generateChatTitle(userMessage: string, aiResponse: string): Promise<string> {
  try {
    const prompt = `Based on this conversation, generate a short, descriptive title (max 5 words):

User: ${userMessage}
AI: ${aiResponse.substring(0, 200)}...

Reply with ONLY the title, nothing else. Make it concise and relevant.`;

    const result = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.3 }
    });

    const title = result.text?.trim() || "New Conversation";
    return title.replace(/['"]/g, '').substring(0, 50); // Clean quotes and limit length
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}

export async function analyzeJournal(content: string): Promise<string[]> {
  try {
    const prompt = `Analyze the following journal entry and extract 1 to 3 distinct emotions or moods. Return ONLY a comma-separated list of the emotions. Journal: "${content}"`;

    const result = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.3 }
    });

    const aiResp = result.text || "";
    if (aiResp) {
      return aiResp.split(",").map(m => m.trim().toLowerCase()).slice(0, 3);
    }
    return [];
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return [];
  }
}
