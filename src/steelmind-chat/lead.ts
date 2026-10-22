import { smConfig } from "./config.ts";
import { safeStorage } from "./storage.ts";

export type LeadReason = "close" | "idle" | "leave" | "hot";

export interface LeadMessage {
  role: string;
  text: string;
  ts?: string | number | Date;
}

export interface SendLeadStoreState {
  sessionId?: string;
  visitor?: any;
  startedAt?: string | number | Date;
  endedAt?: string | number | Date;
  rating?: string;
  comment?: string;
  needsHuman?: boolean;
  companyWebsite?: string;
  messages: LeadMessage[];
}

export async function sendLead(
  reason: LeadReason,
  storeState: SendLeadStoreState
): Promise<void> {
  // Honeypot check: strictly prevent sending if filled
  if (
    storeState.companyWebsite ||
    storeState.visitor?.company_website ||
    storeState.visitor?.companyWebsite ||
    safeStorage.get("sm_honeypot")
  ) {
    return;
  }

  const endpoint = "/api/lead";

  const payload = {
    sessionId: storeState.sessionId || safeStorage.get("sm_session_id") || "",
    reason,
    visitor: storeState.visitor || null,
    startedAt: new Date(storeState.startedAt || Date.now()).toISOString(),
    endedAt: new Date().toISOString(),
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    rating: storeState.rating || "",
    comment: storeState.comment || "",
    needsHuman: storeState.needsHuman || false,
    messages: (storeState.messages || []).map((m) => ({
      role: m.role,
      text: m.text,
      ts: new Date(m.ts || Date.now()).toISOString(),
    })),
  };

  // If reason === "leave", use navigator.sendBeacon
  if (reason === "leave" && typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "text/plain",
      });
      navigator.sendBeacon(endpoint, blob);
    } catch (err) {
      console.error("[SteelMindChat] sendBeacon error:", err);
    }
    return;
  }

  // For ALL other reasons (close, idle, hot), use fetch with keepalive: true and retry up to 3 times (5-second delay)
  const sendWithRetry = async (attempt = 1): Promise<void> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!res.ok && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return sendWithRetry(attempt + 1);
      }
    } catch (err) {
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return sendWithRetry(attempt + 1);
      } else {
        console.error("[SteelMindChat] sendLead failed after retries:", err);
      }
    }
  };

  await sendWithRetry();
}

export default sendLead;
