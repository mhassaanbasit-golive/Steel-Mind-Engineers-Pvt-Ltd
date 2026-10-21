import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import chatHandler from "./api/chat.ts";
import leadHandler from "./api/lead.ts";
import quoteHandler from "./api/quote.ts";
import surveyHandler from "./api/survey.ts";
import newsletterHandler from "./api/newsletter.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// API Endpoints
app.all("/api/chat", (req, res) => chatHandler(req, res));
app.all("/api/lead", (req, res) => leadHandler(req, res));
app.all("/api/quote", (req, res) => quoteHandler(req, res));
app.all("/api/survey", (req, res) => surveyHandler(req, res));
app.all("/api/newsletter", (req, res) => newsletterHandler(req, res));

async function startServer() {
  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("./dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
