import { sendMail, escapeHtml } from "./_mail.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { stage, name, email, phone, conversation, page, company_website } = req.body || {};

    // Bot honeypot check
    if (company_website) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const recipients = [
      process.env.MAIL_TO_PRIMARY || "info@steelmind.pk",
      process.env.MAIL_TO_DEMO || "founder@getgolive.io",
    ];

    const safeName = escapeHtml(name.slice(0, 120));
    const safeEmail = escapeHtml(email.slice(0, 160));
    const safePhone = escapeHtml((phone || "").slice(0, 40));
    const safePage = escapeHtml((page || "/").slice(0, 200));

    const timeString = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (stage === "start") {
      const subject = `New website chat lead: ${name}`;
      const html = `
        <h2>New Chat Lead Started</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone || "Not provided"}</p>
        <p><strong>Page:</strong> ${safePage}</p>
        <p><strong>Time (PKT):</strong> ${timeString}</p>
      `;
      const text = `New Chat Lead Started\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nPage: ${page}\nTime: ${timeString}`;

      await sendMail({
        to: recipients,
        replyTo: email,
        subject,
        html,
        text,
      });
    } else if (stage === "end") {
      if (!Array.isArray(conversation) || conversation.length === 0) {
        return res.status(200).json({ ok: true });
      }

      const subject = `Chat transcript: ${name}`;
      const transcriptLines = conversation.map((msg: { role: string; text: string }) => {
        const roleLabel = msg.role === "user" ? "Visitor" : "Assistant";
        return `<p><strong>${roleLabel}:</strong> ${escapeHtml(msg.text)}</p>`;
      });
      const transcriptText = conversation.map((msg: { role: string; text: string }) => {
        const roleLabel = msg.role === "user" ? "Visitor" : "Assistant";
        return `${roleLabel}: ${msg.text}`;
      }).join("\n");

      const html = `
        <h2>Chat Conversation Transcript</h2>
        <p><strong>Visitor:</strong> ${safeName} (${safeEmail}, ${safePhone || "No phone"})</p>
        <p><strong>Time (PKT):</strong> ${timeString}</p>
        <hr />
        ${transcriptLines.join("\n")}
      `;

      await sendMail({
        to: recipients,
        replyTo: email,
        subject,
        html,
        text: `Chat Transcript for ${name} (${email}):\n\n${transcriptText}`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[API/LEAD] Error:", err);
    return res.status(200).json({ ok: true });
  }
}
