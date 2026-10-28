import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS & Preflight headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  // Server-Sent Events headers for smooth streaming
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) res.flushHeaders();

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent("status", { step: "Understanding your question" });

    // Load company knowledge base
    const knowledgePath = path.join(process.cwd(), "api", "_knowledge.json");
    let knowledge = {};
    try {
      knowledge = JSON.parse(fs.readFileSync(knowledgePath, "utf8"));
    } catch (e) {
      console.warn("[API/CHAT] Could not read _knowledge.json:", e);
    }

    sendEvent("status", { step: "Checking Steel Mind knowledge" });
    sendEvent("status_done", { step: "Understanding your question" });
    sendEvent("status_done", { step: "Checking Steel Mind knowledge" });

    const rawBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(rawBody.messages) ? rawBody.messages : [];

    const systemPrompt = `You are the technical AI engineering assistant for Steel Mind Engineers (Pvt. Ltd.), Pakistan's premier Pre-Engineered Building (PEB) design, steel fabrication, and erection company.
Head Office: 35-D Commercial, DHA EME Sector, Lahore.
Factory: Karol Ghati, Lahore.
Direct Phone: +92 300 4253966, +92 307 7077549. Email: info@steelmindengineers.com.

Reference company knowledge:
${JSON.stringify(knowledge)}

CRITICAL FORMATTING AND LENGTH RULES (MUST FOLLOW STRICTLY):
1. NO ASTERISKS: NEVER output asterisks ('*' or '**') anywhere in your reply. Do NOT use markdown bold, italics, or asterisk bullets. Use plain text only.
2. STRICT LENGTH: Keep your entire response strictly within 2 to 4 lines maximum. Never write long essays or prolong your answers. Be concise and to the point.
3. NO MARKDOWN HEADERS OR LINKS: Do NOT use '###', '---', or markdown link syntax like '[label](url)'. Write phone numbers and emails as plain text. The user interface already displays direct action buttons.
4. FACTORY TOUR: If the visitor asks to visit or schedule a factory tour, warmly welcome them to our Karol Ghati factory in Lahore, and tell them to call or WhatsApp +92 300 4253966 to confirm their visit with our engineers.
5. PRICING & QUOTES: Clarify that steel building prices depend on specific parameters (width, length, clear span, eave height, loads). Never guess or invent numbers. Invite them to call +92 300 4253966 or submit the quote form.
6. TONE: Professional, consultative, Pakistani industrial engineering expertise.`;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      sendEvent("token", {
        t: "Welcome to Steel Mind Engineers! Please contact our engineering team directly at +92 300 4253966 or info@steelmindengineers.com for assistance.",
      });
      sendEvent("done", {});
      return res.end();
    }

    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
        },
      },
    });

    // Clean and normalize messages to ensure strict user/model alternation
    const validMessages: Array<{ role: "user" | "model"; text: string }> = [];
    for (const m of messages) {
      const role = m.role === "assistant" || m.role === "bot" || m.role === "model" ? "model" : "user";
      const text = (typeof m.content === "string" ? m.content : (typeof m.text === "string" ? m.text : "")).trim();
      if (!text) continue;

      if (validMessages.length === 0) {
        // First message must be 'user' for Gemini API compliance
        validMessages.push({ role: "user", text });
      } else {
        const last = validMessages[validMessages.length - 1];
        if (last.role === role) {
          // Merge consecutive same-role messages
          last.text += `\n\n${text}`;
        } else {
          validMessages.push({ role, text });
        }
      }
    }

    const geminiContents = validMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const modelsToTry = Array.from(
      new Set(
        [
          process.env.GEMINI_MODEL,
          "gemini-3.5-flash",
          "gemini-flash-lite-latest",
          "gemini-3-flash-preview",
          "gemini-2.5-flash",
        ].filter(Boolean) as string[]
      )
    );

    let streamSucceeded = false;
    let lastError: any = null;

    for (const model of modelsToTry) {
      let tokensSentForThisModel = 0;
      try {
        const responseStream = await ai.models.generateContentStream({
          model,
          contents: geminiContents.length > 0 ? geminiContents : [{ role: "user", parts: [{ text: "Hello" }] }],
          config: {
            systemInstruction: systemPrompt,
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            // Strip any asterisks (* or **), markdown headers (###), or markdown horizontal rules
            const clean = chunk.text
              .replace(/\*/g, "")
              .replace(/#{1,6}\s*/g, "")
              .replace(/---/g, "");
            if (clean) {
              sendEvent("token", { t: clean });
              tokensSentForThisModel++;
            }
          }
        }

        streamSucceeded = true;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[API/CHAT] Model ${model} unavailable (${err?.status || err?.message}). Trying next candidate...`);
        if (tokensSentForThisModel > 0) {
          streamSucceeded = true;
          break;
        }
      }
    }

    if (!streamSucceeded) {
      throw lastError || new Error("All Gemini models were unavailable.");
    }

    sendEvent("action", {
      type: "contact",
      label: "Call Engineers: +92 300 4253966",
      href: "tel:+923004253966",
    });

    sendEvent("suggestions", {
      chips: ["Schedule factory tour", "Request a quote", "See Haier project details"],
    });

    sendEvent("done", {});
    res.end();
  } catch (err: any) {
    console.error("[API/CHAT] Error generating response:", err);
    sendEvent("token", {
      t: "Thank you for reaching out to Steel Mind Engineers. For immediate assistance and quotes, please call our engineering team at +92 300 4253966.",
    });
    sendEvent("done", {});
    res.end();
  }
}
