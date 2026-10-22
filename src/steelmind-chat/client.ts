import { smConfig } from "./config.ts";
import { safeStorage } from "./storage.ts";
import { getPageContext } from "./pageContext.ts";

export interface StreamChatOptions {
  messages: any[];
  signal?: AbortSignal;
  onEvent: (name: string, data: any) => void;
  sessionId?: string;
  visitor?: any;
  memory?: string;
}

export function getChatStore() {
  let sessionId = safeStorage.get("sm_session_id");
  if (!sessionId) {
    sessionId =
      "sm_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    safeStorage.set("sm_session_id", sessionId);
  }

  let visitor: any = null;
  try {
    const raw = safeStorage.get("sm_visitor");
    if (raw) visitor = JSON.parse(raw);
  } catch {}

  const memory = safeStorage.get("sm_memory") || "";

  return { sessionId, visitor, memory };
}

// Helper to delay for fake responder
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake responder fallback for ?smfake=1
export async function fakeStreamChat(options: StreamChatOptions): Promise<void> {
  if (options.signal?.aborted) return;

  const emit = (name: string, data: any) => {
    if (!options.signal?.aborted) {
      options.onEvent(name, data);
    }
  };

  await sleep(200);
  emit("status", { step: "Understanding your question" });

  await sleep(400);
  emit("status", { step: "Searching company knowledge" });

  await sleep(400);
  emit("status_done", { step: "Understanding your question" });
  emit("status_done", { step: "Searching company knowledge" });

  const text =
    "Steel Mind Engineers specializes in design, fabrication, and erection of Pre-Engineered Steel Buildings (PEB) and industrial steel structures across Pakistan.";
  const words = text.split(" ");
  for (const word of words) {
    if (options.signal?.aborted) return;
    await sleep(50);
    emit("token", { t: word + " " });
  }

  await sleep(100);
  emit("action", {
    type: "contact",
    label: "Call Engineers: +92 300 4253966",
    href: "tel:+923004253966",
  });
  emit("suggestions", {
    chips: ["What is a PEB?", "Schedule a factory tour", "Request a quote"],
  });
  emit("done", {});
}

export async function streamChat(options: StreamChatOptions): Promise<void> {
  // Check for fake responder parameter ?smfake=1
  if (
    typeof window !== "undefined" &&
    window.location.search.includes("smfake=1")
  ) {
    return fakeStreamChat(options);
  }

  const store = getChatStore();
  const page = getPageContext();

  const formattedMessages = (options.messages || [])
    .slice(-12)
    .map((m: any) => ({
      role: m.role === "bot" ? "assistant" : m.role || "user",
      content: m.content || m.text || "",
    }));

  const payload = {
    sessionId: options.sessionId || store.sessionId,
    visitor: options.visitor || store.visitor,
    messages: formattedMessages,
    memory: options.memory || store.memory || "",
    language: "en",
    page: {
      url: page.url || (typeof window !== "undefined" ? window.location.href : ""),
      title: page.title || (typeof document !== "undefined" ? document.title : ""),
    },
    uiLang: "en",
    clientTime: new Date().toISOString(),
  };

  // Honeypot check: strictly prevent streamChat from running if filled
  if (
    payload.visitor?.company_website ||
    payload.visitor?.companyWebsite ||
    safeStorage.get("sm_honeypot")
  ) {
    return;
  }

  const endpoint = "/api/chat";
  console.log("FETCHING URL:", endpoint);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      signal: options.signal,
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    if (options.signal?.aborted) {
      return;
    }
    throw new Error("fail");
  }

  if (response.status === 429) {
    throw new Error("busy");
  }

  if (response.status !== 200) {
    throw new Error("fail");
  }

  if (!response.body) {
    throw new Error("fail");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const readWithTimeout = async (ms = 25000): Promise<ReadableStreamReadResult<Uint8Array>> => {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        try {
          reader.cancel();
        } catch {}
        reject(new Error("fail"));
      }, ms);
    });

    try {
      const res = await Promise.race([reader.read(), timeoutPromise]);
      return res;
    } finally {
      clearTimeout(timer!);
    }
  };

  while (true) {
    let result: ReadableStreamReadResult<Uint8Array>;
    try {
      result = await readWithTimeout(25000);
    } catch (err) {
      if (options.signal?.aborted) return;
      throw new Error("fail");
    }

    const { done, value } = result;
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split buffer by \n\n, keeping the last incomplete chunk in buffer
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      let eventName = "message";
      let eventData: any = null;

      const lines = trimmed.split("\n");
      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const raw = line.slice(5).trim();
          try {
            eventData = JSON.parse(raw);
          } catch {
            eventData = raw;
          }
        }
      }

      if (eventData !== null) {
        options.onEvent(eventName, eventData);
      }
    }
  }

  // Parse any remaining chunk
  if (buffer.trim()) {
    const trimmed = buffer.trim();
    let eventName = "message";
    let eventData: any = null;
    const lines = trimmed.split("\n");
    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const raw = line.slice(5).trim();
        try {
          eventData = JSON.parse(raw);
        } catch {
          eventData = raw;
        }
      }
    }
    if (eventData !== null) {
      options.onEvent(eventName, eventData);
    }
  }
}

export default streamChat;
