# Steel Mind Engineers Pvt. Ltd.

Where Steel Meets Intelligence. Pre-Engineered Buildings (PEB) and Structural Steel Fabrication in Pakistan.

## Overview
Steel Mind Engineers is an engineering and steel fabrication company headquartered in Lahore, Pakistan, operating across Punjab, Sindh, KPK, and Balochistan. This application serves as the production-grade digital platform for Steel Mind, featuring 68 indexed service/hub/knowledge pages, 12 in-depth technical engineering guides, published project portfolios with photographic galleries, engineering diagrams, an interactive AI consultation chatbot grounded in verified project specifications, automated lead routing, and dynamic quote request workflows.

---

## Environment Variables

The following environment variables configure mail delivery, AI assistant grounding, and search indexing:

| Variable | Description | Required | Default / Example |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Resend API key for sending emails (quote inquiries, chat transcripts, customer satisfaction surveys, and newsletter subscriptions). If omitted, logs payload to console in demo mode without errors. | Optional (Demo stub active) | `re_123456789...` |
| `MAIL_FROM` | Sender display name and email address used for outgoing notifications. | Optional | `Steel Mind Website <website@steelmind.pk>` |
| `MAIL_TO_PRIMARY` | Primary recipient email for website quote requests and lead submissions. | Optional | `info@steelmind.pk` |
| `MAIL_TO_DEMO` | Secondary notification address for founder/demo monitoring. | Optional | `founder@getgolive.io` |
| `AI_PROVIDER` | Selection of AI service provider for chat assistant (`gemini` or `openai`). | Optional | `gemini` |
| `GEMINI_API_KEY` | Google Gemini API key for intelligent, verified chatbot responses. | Optional (Graceful fallback) | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini model identifier. | Optional | `gemini-2.5-flash` |
| `OPENAI_API_KEY` | OpenAI API key if `AI_PROVIDER=openai` is selected. | Optional | `sk-...` |
| `OPENAI_MODEL` | OpenAI model identifier if OpenAI is active. | Optional | `gpt-4o-mini` |
| `VITE_GSC_TOKEN` | Google Search Console site verification meta token. | Optional | `google-site-verification-token` |
| `APP_URL` | Canonical URL of the deployed application. | Optional | `https://www.steelmind.pk` |

---

## Build and Run Scripts

- `npm run content`: Compiles raw datasets and outputs structured, validated JSON files for all 68 pages and 12 articles.
- `npm run verify`: Enforces strict schema validations, SEO length boundaries, link integrity, and prohibited terminology.
- `npm run knowledge`: Generates the vectorized and indexed knowledge base file (`api/_knowledge.json`) for the chat assistant.
- `npm run dev`: Runs content generation and launches the development server on port 3000.
- `npm run build`: Generates content, verifies schemas, builds knowledge indices, compiles the Vite application, outputs `sitemap.xml`, and builds `llms.txt`.
- `npm run preview`: Previews the production build locally.
