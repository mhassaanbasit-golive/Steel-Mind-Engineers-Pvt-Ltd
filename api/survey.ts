import { sendMail, escapeHtml } from "./_mail.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { first, resolved, rating, name, email } = req.body || {};

    const demoRecipient = process.env.MAIL_TO_DEMO || "founder@getgolive.io";

    console.log("[API/SURVEY] Survey submitted:", { first, resolved, rating, name, email });

    const html = `
      <h2>Chat Feedback Survey</h2>
      <p><strong>First time chatting:</strong> ${escapeHtml(first || "N/A")}</p>
      <p><strong>Case resolved:</strong> ${escapeHtml(resolved || "N/A")}</p>
      <p><strong>Rating:</strong> ${escapeHtml(rating || "N/A")}</p>
      <p><strong>Lead Name:</strong> ${escapeHtml(name || "Anonymous")}</p>
      <p><strong>Lead Email:</strong> ${escapeHtml(email || "N/A")}</p>
    `;

    await sendMail({
      to: demoRecipient,
      subject: "Chat survey",
      html,
      text: `Chat Survey: First time: ${first}, Resolved: ${resolved}, Rating: ${rating}, Name: ${name}, Email: ${email}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[API/SURVEY] Error:", err);
    return res.status(200).json({ ok: true });
  }
}
