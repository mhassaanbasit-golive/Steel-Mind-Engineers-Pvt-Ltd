import { sendMail, escapeHtml } from "./_mail.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { name, phone, email, city, projectType, size, message, file, company_website } = req.body || {};

    if (company_website) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !phone || !city || !projectType || !message) {
      return res.status(400).json({ ok: false, error: "missing_required_fields" });
    }

    const recipients = [
      process.env.MAIL_TO_PRIMARY || "info@steelmind.pk",
      process.env.MAIL_TO_DEMO || "founder@getgolive.io",
    ];

    const safeName = escapeHtml(name.slice(0, 120));
    const safeEmail = escapeHtml(email.slice(0, 160));
    const safePhone = escapeHtml(phone.slice(0, 40));
    const safeCity = escapeHtml(city.slice(0, 120));
    const safeType = escapeHtml(projectType.slice(0, 100));
    const safeSize = escapeHtml((size || "Not specified").slice(0, 120));
    const safeMessage = escapeHtml(message.slice(0, 4000));

    const html = `
      <h2>New Quote Request Received</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Full Name</strong></td><td>${safeName}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${safePhone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${safeEmail}</td></tr>
        <tr><td><strong>City / Location</strong></td><td>${safeCity}</td></tr>
        <tr><td><strong>Project Type</strong></td><td>${safeType}</td></tr>
        <tr><td><strong>Approximate Size</strong></td><td>${safeSize}</td></tr>
        <tr><td><strong>Message</strong></td><td>${safeMessage}</td></tr>
      </table>
    `;

    const text = `Quote Request:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nType: ${projectType}\nSize: ${size || "N/A"}\nMessage:\n${message}`;

    const attachments = file && file.data
      ? [
          {
            filename: file.name || "attachment",
            content: file.data.split(",")[1] || file.data,
          },
        ]
      : undefined;

    await sendMail({
      to: recipients,
      replyTo: email,
      subject: `Quote request: ${projectType} in ${city}`,
      html,
      text,
      attachments,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[API/QUOTE] Error:", err);
    return res.status(200).json({ ok: true });
  }
}
