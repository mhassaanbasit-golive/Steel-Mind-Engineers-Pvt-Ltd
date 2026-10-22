import React from "react";
import { createRoot } from "react-dom/client";
import { SteelMindChat } from "./SteelMindChat.tsx";
import { smConfig } from "./config.ts";
import { getPageContext } from "./pageContext.ts";

declare global {
  interface Window {
    __smChatDebug?: {
      config: typeof smConfig;
      page: typeof getPageContext;
    };
  }
}

export interface MountOptions {
  containerId?: string;
}

export function mountSteelMindChat(options?: MountOptions): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // Debug Hook: expose window.__smChatDebug only when ?smdebug=1 is present
  try {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("smdebug") === "1") {
      window.__smChatDebug = {
        config: smConfig,
        page: getPageContext,
      };
    }
  } catch {}

  const targetId = options?.containerId || "sm-chat-root";

  // Prevent duplicate mounts under React strict mode and hot reload
  if (document.getElementById(targetId)) {
    return;
  }

  const container = document.createElement("div");
  container.id = targetId;
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(React.createElement(SteelMindChat));
}

export default mountSteelMindChat;
