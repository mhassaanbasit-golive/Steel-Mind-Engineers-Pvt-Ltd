import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./_prompt.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledgeJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_knowledge.json"), "utf-8")
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 500) {
      return res.status(200).json({
        ok: true,
        reply: "Please call +92 300 4253966 or send the quote form, and an engineer will answer.",
      });
    }

    const validHistory: Array<{ role: "bot" | "user"; text: string }> = Array.isArray(history)
      ? history.slice(-12).filter((h) => h && typeof h.text === "string")
      : [];

    const knowledgeText = JSON.stringify(knowledgeJson);
    const systemText = `${SYSTEM_PROMPT}\n\nKNOWLEDGE:\n${knowledgeText}`;

    const provider = process.env.AI_PROVIDER || "gemini";
    let rawReply = "";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      const openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const messages = [
        { role: "system", content: systemText },
        ...validHistory.map((h) => ({
          role: h.role === "bot" ? "assistant" : "user",
          content: h.text,
        })),
        { role: "user", content: message.trim() },
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: openAiModel,
          messages,
          temperature: 0.3,
          max_tokens: 160,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();
      rawReply = data.choices?.[0]?.message?.content || "";
    } else {
      // Default to Gemini API
      const geminiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

      if (!geminiKey) {
        clearTimeout(timeout);
        return res.status(200).json({
          ok: true,
          reply: "Steel Mind designs and fabricates steel structures across Pakistan. Please call +92 300 4253966 or submit the quote form to discuss your project.",
        });
      }

      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        const contents = [
          ...validHistory.map((h) => ({
            role: h.role === "bot" ? ("model" as const) : ("user" as const),
            parts: [{ text: h.text }],
          })),
          { role: "user" as const, parts: [{ text: message.trim() }] },
        ];

        const aiResponse = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemText,
            temperature: 0.3,
            maxOutputTokens: 160,
          },
        });

        clearTimeout(timeout);
        rawReply = aiResponse.text || "";
      } catch (genErr) {
        clearTimeout(timeout);
        console.warn("[API/CHAT] GenAI call error, falling back:", genErr);
        rawReply = "Steel Mind designs and fabricates steel structures across Pakistan. Please call +92 300 4253966 or submit the quote form to discuss your project.";
      }
    }

    // Post-processing rules (Section 16.8)
    // 1. Remove markdown (*, #, backticks) and emoji
    let cleaned = rawReply
      .replace(/[*#`_~]/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    // 2. Keep first two sentences only (split on (?<=[.!?])\s+)
    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 2) {
      cleaned = sentences.slice(0, 2).join(" ");
    }

    // 3. Fallback check for AI disclosures or empty response
    const lower = cleaned.toLowerCase();
    if (
      !cleaned ||
      lower.includes("i don't know") ||
      lower.includes("i do not know") ||
      lower.includes("as an ai") ||
      lower.includes("i am an ai") ||
      lower.includes("language model")
    ) {
      cleaned = "Please call +92 300 4253966 or send the quote form, and an engineer will answer.";
    }

    return res.status(200).json({ ok: true, reply: cleaned });
  } catch (err) {
    console.error("[API/CHAT] Error:", err);
    return res.status(200).json({ ok: false, error: "unavailable" });
  }
}
