export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}

export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendMail(opts: SendMailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Steel Mind Website <website@steelmind.pk>";

  if (!apiKey) {
    console.warn("[MAIL] RESEND_API_KEY is missing. Demo mode active. Logging mail payload:", {
      from,
      to: opts.to,
      subject: opts.subject,
      replyTo: opts.replyTo,
      textLength: opts.text?.length,
    });
    return true;
  }

  try {
    const recipients = Array.isArray(opts.to) ? opts.to : [opts.to];
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        attachments: opts.attachments,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[MAIL] Resend API error:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[MAIL] Failed to send email via Resend:", err);
    return false;
  }
}
