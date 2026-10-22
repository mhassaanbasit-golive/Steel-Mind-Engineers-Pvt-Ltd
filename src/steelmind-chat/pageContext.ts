export interface PageContext {
  url: string;
  title: string;
}

export function getPageContext(): PageContext {
  if (typeof window === "undefined") {
    return { url: "", title: "" };
  }
  return {
    url: window.location.href,
    title: document.title,
  };
}

type Listener = (context: PageContext) => void;
const listeners = new Set<Listener>();

let historyWrapped = false;

function notify() {
  const ctx = getPageContext();
  listeners.forEach((fn) => {
    try {
      fn(ctx);
    } catch (err) {
      console.error("[SteelMindChat] Listener error:", err);
    }
  });
}

function initHistoryWatcher() {
  if (typeof window === "undefined" || historyWrapped) return;
  historyWrapped = true;

  const originalPush = window.history.pushState;
  window.history.pushState = function (...args) {
    const res = originalPush.apply(this, args);
    window.dispatchEvent(new Event("sm:locationchange"));
    return res;
  };

  const originalReplace = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const res = originalReplace.apply(this, args);
    window.dispatchEvent(new Event("sm:locationchange"));
    return res;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("sm:locationchange"));
  });

  window.addEventListener("sm:locationchange", () => {
    setTimeout(notify, 0);
  });
}

export function subscribePageContext(listener: Listener): () => void {
  initHistoryWatcher();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
