import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) res.flushHeaders();

  const sendStatus = (step: string, label: string) => res.write(`event: status\ndata: ${JSON.stringify({ step, label })}\n\n`);
  const sendToken = (text: string) => res.write(`event: token\ndata: ${JSON.stringify({ t: text })}\n\n`);

  try {
    sendStatus("understand", "Understanding your question");

    const knowledgePath = path.join(process.cwd(), "api", "_knowledge.json");
    let knowledge = {};
    try { knowledge = JSON.parse(fs.readFileSync(knowledgePath, "utf8")); } catch (e) {}

    const rawBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(rawBody.messages) ? rawBody.messages : [];

    const systemPrompt = "You are the assistant for Steel Mind Engineers. Use this knowledge: " + JSON.stringify(knowledge) + "\nRules: No fake prices. Offer phone +92 300 4253966. Act professional.";
    
    sendStatus("knowledge", "Checking Steel Mind knowledge");
    sendStatus("write", "Writing your answer");

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      sendToken("Error: GEMINI_API_KEY is missing in Vercel.");
      res.write("event: done\ndata: {}\n\n");
      return res.end();
    }

    const geminiContents = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "bot" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : m.text }]
    }));

    // UPDATED: Using gemini-3.8-flash
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse&key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiContents
      })
    });

    if (!geminiResponse.ok || !geminiResponse.body) {
      const errText = await geminiResponse.text();
      sendToken(`Gemini API Error: ${geminiResponse.status} ${errText}`);
      res.write("event: done\ndata: {}\n\n");
      return res.end();
    }

    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          try {
            const data = JSON.parse(trimmed.slice(5).trim());
            const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) { sendToken(content); }
          } catch {}
        }
      }
    }

    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (err: any) {
    sendToken("Server Error: " + err.message);
    res.write("event: done\ndata: {}\n\n");
    res.end();
  }
}
