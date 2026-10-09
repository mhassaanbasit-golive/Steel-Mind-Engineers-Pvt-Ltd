import { ContentData, ContentBlock, FAQItem } from "./types.ts";

export type { ContentData, ContentBlock, FAQItem };

// Helper to eagerly import all generated pages & articles using Vite's import.meta.glob
const pageModules = import.meta.glob<ContentData>("./generated/page-*.json", { eager: true, import: "default" });
const articleModules = import.meta.glob<ContentData>("./generated/article-*.json", { eager: true, import: "default" });

export const ALL_PAGES: ContentData[] = Object.values(pageModules);
export const ALL_ARTICLES: ContentData[] = Object.values(articleModules);

export const CONTENT_BY_URL: Record<string, ContentData> = {};

ALL_PAGES.forEach((page) => {
  CONTENT_BY_URL[page.url] = page;
});

ALL_ARTICLES.forEach((art) => {
  CONTENT_BY_URL[art.url] = art;
});

export function getContentByUrl(url: string): ContentData | undefined {
  return CONTENT_BY_URL[url];
}
