export default async function handler(req: any, res: any) {
  // CORS & preflight
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
    const scriptSecret = process.env.APPS_SCRIPT_SECRET;

    if (!scriptUrl) {
      console.warn("[API/LEAD] APPS_SCRIPT_URL not configured. Received payload:", body);
      return res.status(200).json({ ok: true, fallback: true });
    }

    const payload = {
      secret: scriptSecret,
      ...body,
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const isOk = response.ok;
    return res.status(200).json({ ok: isOk });
  } catch (err: any) {
    console.error("[API/LEAD] Failed to forward lead to Google Apps Script:", err);
    return res.status(200).json({ ok: false, error: err?.message || "forward_failed" });
  }
}
