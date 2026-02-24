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
- Keep responses short and conversational by default (about 2-5 short sentences).
- For simple messages like "hi", "hello", "how are you": reply very briefly (1-2 lines) and ask one gentle follow-up.
- Do not force headings like "What I heard" or "Try this now".
- Use bullets only when the user asks for steps/list, or when a list clearly helps.
- Vary rhythm naturally: sometimes short lines, sometimes a brief paragraph.
- End with one warm, open question when appropriate.

DISCLAIMER + SAFETY:
- Do NOT repeat the same disclaimer on every message.
- Do not show disclaimer text for normal conversation or greetings.
- Show a brief safety line only when user mentions self-harm, suicide, immediate danger, or severe crisis.
- When shown, keep it to one short line and continue support.
- If crisis risk appears, prioritize crisis resources and immediate safety steps.

THERAPEUTIC STYLE:
- Start by validating the user's feeling in plain language.
- Reflect key emotion and context in one sentence.
- Offer one small practical next step when useful (CBT/DBT/mindfulness/grounding/journaling/breathing).
- Encourage tiny next steps, not long lectures.
- Never diagnose or claim to be a licensed professional.
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
