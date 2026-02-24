import express from "express";
import { streamGemini, generateChatTitle } from "../services/gemini.js";
import { db } from "../services/db.js";

const router = express.Router();

type GeminiMessage = { role: "user" | "model"; content: string };

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { messages, chatId, userId, message, moodContext } = req.body;

    // 1. Memory Context
    let fullContext = "";
    if (userId) {
      const profile = await db.getUserProfile(userId as string);
      if (profile.facts.length > 0) {
        fullContext += "USER FACTS:\n" + profile.facts.join("\n- ") + "\n\n";
      }
    }

    if (moodContext) {
      fullContext += "CURRENT MOOD CONTEXT:\n" + moodContext + "\n\n";
    }

    // 2. Chat Mode (History vs Legacy)
    let contextMessages: GeminiMessage[] = [];
    let finalUserMessage = "";

    if (chatId && message) {
      // HISTORY MODE
      // Load previous messages
      const chat = await db.getChat(chatId);
      if (chat) {
        contextMessages = chat.messages.map(m => ({ role: m.role, content: m.content }));
      }

      // Add user message to DB (async, don't await blocking stream start entirely? better await for consistency)
      await db.addMessage(chatId, 'user', message);

      // Add to context
      contextMessages.push({ role: 'user', content: message });
      finalUserMessage = message;

    } else if (Array.isArray(messages)) {
      // LEGACY MODE (Client manages history)
      contextMessages = messages as GeminiMessage[];
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'user') finalUserMessage = lastMsg.content;
    } else {
      res.write(`data: ${JSON.stringify({ error: "Invalid request format" })}\n\n`);
      res.end();
      return;
    }

    // 3. Simple Memory Extraction (Optimistic)
    // If user says "My name is X", save it.
    if (userId && finalUserMessage) {
      const nameMatch = finalUserMessage.match(/my name is ([a-z\s]+)/i);
      const likeMatch = finalUserMessage.match(/i like ([a-z\s]+)/i);

      if (nameMatch) {
        await db.updateUserProfile(userId, { facts: [`User's name is ${nameMatch[1]}`] });
      } else if (likeMatch) {
        // Just append to existing facts, ideally checking duplicates
        const pf = await db.getUserProfile(userId);
        if (!pf.facts.find(f => f.includes(likeMatch[1]))) {
          await db.updateUserProfile(userId, { facts: [...pf.facts, `User likes ${likeMatch[1]}`] });
        }
      }
    }

    // 4. Stream Response
    let fullAiResponse = "";

    await streamGemini(
      contextMessages,
      (text) => {
        fullAiResponse = text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      },
      fullContext // Inject memory + mood
    );

    // 5. Save AI Response
    if (chatId && fullAiResponse) {
      await db.addMessage(chatId, 'model', fullAiResponse);

      // 6. Generate smart title after first exchange
      const chat = await db.getChat(chatId);
      if (chat && chat.messages.length === 2) { // First user message + first AI response
        // Generate title asynchronously (don't block response)
        generateChatTitle(finalUserMessage, fullAiResponse)
          .then(title => db.updateChatTitle(chatId, title))
          .catch(err => console.error("Title generation error:", err));
      }
    }

    res.end();

  } catch (error) {
    const message = error instanceof Error ? error.message : "AI error";
    console.error("Chat error", error);
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
