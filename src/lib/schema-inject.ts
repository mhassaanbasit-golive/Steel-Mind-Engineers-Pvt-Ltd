import { buildSchema } from "./schema.ts";
import { CONTENT_BY_URL } from "../content/index.ts";

function updateSchema(rawPath: string): void {
  if (typeof document === "undefined") return;

  const scriptId = "sm-jsonld";
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  let cleanPath = rawPath.split("?")[0].split("#")[0];
  cleanPath = cleanPath.replace(/\/+/g, "/");
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
  if (!cleanPath.endsWith("/")) cleanPath = cleanPath + "/";
  if (cleanPath === "/contact/") cleanPath = "/contact-us/";

  const schema = buildSchema(cleanPath, (url: string) => CONTENT_BY_URL[url]);

  if (!schema) {
    if (script) {
      script.remove();
    }
    return;
  }

  const json = JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");

  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = json;
}

if (typeof window !== "undefined") {
  window.addEventListener("sm:route", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const path = detail?.path || window.location.pathname;
    updateSchema(path);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      updateSchema(window.location.pathname);
    });
  } else {
    updateSchema(window.location.pathname);
  }
}
