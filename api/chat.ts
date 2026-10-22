import knowledge from "./_knowledge.json";

export default async function handler(req: any, res: any) {
  // Handle CORS & preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Set SSE response headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) {
    res.flushHeaders();
  }

  try {
    const rawBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(rawBody.messages) ? rawBody.messages : [];

    const systemPrompt =
      "You are the assistant for Steel Mind Engineers. Use this knowledge: " +
      JSON.stringify(knowledge) +
      "\nRules: No fake prices. Offer phone +92 300 4253966. Act professional. Match the user's language.";

    const nvidiaApiKey = process.env.NVIDIA_API_KEY;

    if (!nvidiaApiKey) {
      console.warn("[API/CHAT] NVIDIA_API_KEY is not set. Streaming knowledge fallback response.");
      const fallbackText =
        "Steel Mind Engineers specializes in design, fabrication, and erection of Pre-Engineered Steel Buildings (PEB) and industrial structures across Pakistan. Please call +92 300 4253966 or visit /contact-us/#quote to discuss your project.";
      res.write(`event: token\ndata: ${JSON.stringify({ t: fallbackText })}\n\n`);
      res.write("event: done\ndata: {}\n\n");
      return res.end();
    }

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "bot" ? "assistant" : m.role || "user",
      content: typeof m.content === "string" ? m.content : typeof m.text === "string" ? m.text : "",
    }));

    const nvidiaResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nvidiaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4.1-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...formattedMessages,
        ],
        temperature: 0.3,
        stream: true,
      }),
    });

    if (!nvidiaResponse.ok || !nvidiaResponse.body) {
      const errText = await nvidiaResponse.text().catch(() => "");
      console.error(`[API/CHAT] NVIDIA API error ${nvidiaResponse.status}:`, errText);
      const fallbackText =
        "Steel Mind designs and fabricates steel structures across Pakistan. Please call +92 300 4253966 or visit /contact-us/#quote to discuss your project.";
      res.write(`event: token\ndata: ${JSON.stringify({ t: fallbackText })}\n\n`);
      res.write("event: done\ndata: {}\n\n");
      return res.end();
    }

    const reader = nvidiaResponse.body.getReader();
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
          const raw = trimmed.slice(5).trim();
          if (raw === "[DONE]") {
            continue;
          }
          try {
            const data = JSON.parse(raw);
            const content = data?.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`event: token\ndata: ${JSON.stringify({ t: content })}\n\n`);
            }
          } catch {}
        }
      }
    }

    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (err: any) {
    console.error("[API/CHAT] Stream error:", err);
    const fallbackText =
      "Steel Mind designs and fabricates steel structures across Pakistan. Please call +92 300 4253966 or visit /contact-us/#quote to discuss your project.";
    res.write(`event: token\ndata: ${JSON.stringify({ t: fallbackText })}\n\n`);
    res.write("event: done\ndata: {}\n\n");
    res.end();
  }
}
