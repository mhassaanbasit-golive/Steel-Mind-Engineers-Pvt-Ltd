function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
    if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString("utf8"));
      } catch {}
    } else if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail =
      process.env.NOTIFICATION_EMAIL || "info@steelmindengineers.com";

    if (!resendApiKey) {
      console.warn("[API/LEAD] RESEND_API_KEY is not configured.");
      return res.status(200).json({ ok: false, error: "Missing RESEND_API_KEY" });
    }

    // Extract visitor contact information
    const visitor = {
      name:
        body?.visitor?.name ||
        body?.name ||
        body?.lead?.visitor?.name ||
        "Website Visitor",
      email:
        body?.visitor?.email ||
        body?.email ||
        body?.lead?.visitor?.email ||
        "",
      phone:
        body?.visitor?.phone ||
        body?.phone ||
        body?.lead?.visitor?.phone ||
        "",
    };

    // Extract and normalize chat messages
    const rawMessages = Array.isArray(body?.messages)
      ? body.messages
      : Array.isArray(body?.conversation)
      ? body.conversation
      : Array.isArray(body?.lead?.messages)
      ? body.lead.messages
      : [];

    const messages = rawMessages.map((m: any) => ({
      role: m?.role === "assistant" || m?.role === "bot" || m?.role === "model" ? "bot" : "user",
      text: typeof m?.text === "string" ? m.text : (typeof m?.content === "string" ? m.content : ""),
      time: m?.ts ? new Date(m.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
    }));

    const rating = body?.rating || body?.lead?.rating || "";
    const comment = body?.comment || body?.lead?.comment || "";
    const reason = body?.reason || "";

    // Do not send if no user messages exist and no contact info provided
    const hasUserQuestions = messages.some((m: any) => m.role === "user");
    if (!hasUserQuestions && !visitor.email && !visitor.phone) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    // Clean phone for tel: and wa.me links
    const rawPhoneDigits = visitor.phone.replace(/[^0-9]/g, "");
    let waPhone = rawPhoneDigits;
    if (waPhone.startsWith("03")) {
      waPhone = "92" + waPhone.substring(1);
    }

    // Build Transcript HTML
    const transcriptHtml = messages.length > 0
      ? messages
          .map((m: any) => {
            const isUser = m.role === "user";
            const senderLabel = isUser ? escapeHtml(visitor.name) : "Steel Mind Assistant";
            const bubbleBg = isUser ? "#F0F4FF" : "#F9FAFB";
            const borderColor = isUser ? "#1A3A8A" : "#E5E7EB";
            const labelColor = isUser ? "#1A3A8A" : "#4B5563";
            const formattedText = escapeHtml(m.text).replace(/\n/g, "<br />");

            return `
              <div style="margin-bottom: 14px; padding: 12px 16px; background-color: ${bubbleBg}; border-left: 4px solid ${borderColor}; border-radius: 6px;">
                <div style="font-size: 11px; font-weight: 700; color: ${labelColor}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                  ${senderLabel} ${m.time ? `<span style="font-weight: 400; color: #9CA3AF; margin-left: 6px;">${escapeHtml(m.time)}</span>` : ""}
                </div>
                <div style="font-size: 14px; line-height: 1.5; color: #1F2937;">
                  ${formattedText}
                </div>
              </div>
            `;
          })
          .join("")
      : `<p style="font-size: 13px; color: #6B7280; font-style: italic;">No conversation messages recorded.</p>`;

    // Format current date/time in Pakistan Standard Time (PKT)
    const nowPkt = new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "full",
      timeStyle: "short",
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Lead asked Query on Steel Mind Engineers Website</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F4F6; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E5E7EB;">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background-color: #1A3A8A; padding: 24px 32px; text-align: left;">
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 700; letter-spacing: -0.2px;">
                      Steel Mind Engineers (Pvt. Ltd.)
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #E0E7FF; font-size: 13px;">
                      New Lead Captured via Website AI Assistant
                    </p>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 28px 32px;">
                    
                    <!-- Lead Contact Card -->
                    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <h2 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #1E293B; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
                        Customer Contact Information
                      </h2>
                      <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 14px;">
                        <tr>
                          <td width="130" style="color: #64748B; font-weight: 600;">Full Name:</td>
                          <td style="color: #0F172A; font-weight: 700;">${escapeHtml(visitor.name)}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Email:</td>
                          <td>
                            ${visitor.email ? `<a href="mailto:${escapeHtml(visitor.email)}" style="color: #1A3A8A; text-decoration: underline; font-weight: 600;">${escapeHtml(visitor.email)}</a>` : `<span style="color: #94A3B8;">Not provided</span>`}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Phone / Mobile:</td>
                          <td>
                            ${visitor.phone ? `<a href="tel:${escapeHtml(visitor.phone)}" style="color: #1A3A8A; text-decoration: underline; font-weight: 600;">${escapeHtml(visitor.phone)}</a>` : `<span style="color: #94A3B8;">Not provided</span>`}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Captured At:</td>
                          <td style="color: #0F172A;">${escapeHtml(nowPkt)} (PKT)</td>
                        </tr>
                        ${reason ? `
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Trigger Event:</td>
                          <td style="color: #475569; text-transform: capitalize;">${escapeHtml(reason)}</td>
                        </tr>` : ""}
                        ${rating ? `
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Visitor Rating:</td>
                          <td style="color: #0F172A; font-weight: 600;">${rating === "up" ? "👍 Thumbs Up (Satisfied)" : "👎 Thumbs Down"}</td>
                        </tr>` : ""}
                        ${comment ? `
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">Visitor Feedback:</td>
                          <td style="color: #0F172A; font-style: italic;">"${escapeHtml(comment)}"</td>
                        </tr>` : ""}
                      </table>

                      <!-- Quick Action Buttons -->
                      <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #E2E8F0;">
                        ${visitor.email ? `
                          <a href="mailto:${escapeHtml(visitor.email)}?subject=Re: Your Inquiry with Steel Mind Engineers" style="display: inline-block; background-color: #1A3A8A; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 9px 18px; border-radius: 6px; margin-right: 8px; margin-bottom: 8px;">
                            ✉ Reply via Email
                          </a>
                        ` : ""}
                        ${visitor.phone ? `
                          <a href="tel:${escapeHtml(visitor.phone)}" style="display: inline-block; background-color: #059669; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 9px 18px; border-radius: 6px; margin-right: 8px; margin-bottom: 8px;">
                            📞 Call Customer
                          </a>
                        ` : ""}
                        ${waPhone ? `
                          <a href="https://wa.me/${escapeHtml(waPhone)}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 9px 18px; border-radius: 6px; margin-bottom: 8px;">
                            💬 Open WhatsApp
                          </a>
                        ` : ""}
                      </div>
                    </div>

                    <!-- Conversation Transcript -->
                    <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1E293B;">
                      Complete Conversation Transcript
                    </h2>
                    ${transcriptHtml}

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 18px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #6B7280; line-height: 1.4;">
                      This inquiry was automatically submitted by the technical assistant on 
                      <a href="https://www.steelmind.pk" style="color: #1A3A8A; text-decoration: none; font-weight: 600;">steelmindengineers.com</a>.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Resend API Request
    const resendPayload: any = {
      from: "Steel Mind Website <leads@getgolive.io>",
      to: [notificationEmail],
      subject: "New Lead asked Query on Steel Mind Engineers Website",
      html: emailHtml,
    };

    if (visitor.email && visitor.email.includes("@")) {
      resendPayload.reply_to = visitor.email;
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("[API/LEAD] Resend API Error:", resendData);
      return res.status(500).json({ ok: false, error: resendData });
    }

    console.log("[API/LEAD] Email dispatched successfully:", resendData);
    return res.status(200).json({ ok: true, id: resendData.id });
  } catch (err: any) {
    console.error("[API/LEAD] Internal Error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Internal error" });
  }
}
