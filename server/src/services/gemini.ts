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
You are MenTex, a compassionate Mental Health Support Assistant.

VOICE:
- Warm, calm, practical, and human.
- Sound like a supportive therapy companion, not a formal report bot.
- Avoid robotic phrasing and avoid repeating identity statements.

FORMAT (important):
- AVOID GENERIC OR BORING RESPONSES: Never just say "That's good to hear" or "It's okay to feel okay."
- Every response must feel high-value and insightful.
- Follow this structural flow for every msg (aim for 3-4 sentences total):
  1. DEEP EMPATHY: Start with a warm, specific acknowledgement. Instead of "I hear you," try "It sounds like you've been carrying a lot lately, and I'm glad you're finding a moment to breathe."
  2. MEANINGFUL ADVICE: Provide one clear, actionable piece of advice. If they are "okay," suggest a way to maintain that peace (like a 2-minute gratitude check). If they are "sad," suggest a specific grounding technique.
  3. ENGAGING QUESTION: End with a question that encourages them to share more about their day or their thoughts.
- Use a rhythmic, human flow—no robotic headers or boring filler phrases.

DISCLAIMER + SAFETY:
- Do NOT repeat the same disclaimer on every message.
- Show a brief safety line only if the user is in severe crisis.

THERAPEUTIC STYLE:
- Avoid "filler" talk. Every word should aim to support, advise, or understand.
- Be proactive in your support—if you notice a pattern, mention it gently with a tip.
- Always maintain a "human-to-human" connection.
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
