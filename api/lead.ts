export default async function handler(req: any, res: any) {
  // CORS & preflight headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const scriptUrl = process.env.APPS_SCRIPT_URL;
    const scriptSecret = process.env.APPS_SCRIPT_SECRET || "SteelmindengineersPass123";

    // Extract visitor contact information
    const visitor = {
      name: body?.visitor?.name || body?.name || "Website Visitor",
      email: body?.visitor?.email || body?.email || "",
      phone: body?.visitor?.phone || body?.phone || "",
    };

    // Extract and normalize chat messages
    const rawMessages = Array.isArray(body?.messages)
      ? body.messages
      : Array.isArray(body?.conversation)
      ? body.conversation
      : [];

    const messages = rawMessages.map((m: any) => ({
      role: m?.role || "user",
      text: typeof m?.text === "string" ? m.text : (typeof m?.content === "string" ? m.content : ""),
    }));

    const rating = body?.rating || "";
    const comment = body?.comment || "";

    // Exact payload expected by your Google Apps Script
    const payload = {
      secret: scriptSecret,
      lead: {
        visitor,
        messages,
        rating,
        comment,
      },
    };

    if (!scriptUrl) {
      console.warn("[API/LEAD] APPS_SCRIPT_URL is not set. Lead payload:", JSON.stringify(payload));
      return res.status(200).json({ ok: true, fallback: true });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(payload),
    });

    const isOk = response.ok;
    return res.status(200).json({ ok: isOk });
  } catch (err: any) {
    console.error("[API/LEAD] Error sending lead to Google Apps Script:", err);
    return res.status(200).json({ ok: false, error: err?.message || "forward_failed" });
  }
}

