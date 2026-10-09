import { sendMail, escapeHtml } from "./_mail.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { email } = req.body || {};

    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    const recipient = process.env.MAIL_TO_PRIMARY || "info@steelmind.pk";
    const safeEmail = escapeHtml(email.slice(0, 160));

    await sendMail({
      to: recipient,
      subject: "Newsletter signup",
      html: `<h2>New Newsletter Subscription</h2><p>Email: ${safeEmail}</p>`,
      text: `New Newsletter Subscription\nEmail: ${email}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[API/NEWSLETTER] Error:", err);
    return res.status(200).json({ ok: true });
  }
}
