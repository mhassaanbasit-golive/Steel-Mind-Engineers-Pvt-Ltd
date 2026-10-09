export interface ContentBlock {
  type: "h2" | "p" | "defs" | "steps" | "bullets" | "table" | "related";
  title?: string;
  text?: string;
  items?: Array<{ name: string; text: string }>;
  bullets?: string[];
  headers?: string[];
  rows?: string[][];
  links?: string[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ContentData {
  page?: number;
  article?: number;
  url: string;
  title: string;
  description: string;
  keyword: string;
  support: string[];
  h1: string;
  quickAnswer: string;
  alt: string;
  related: string[];
  faq: FAQItem[];
  blocks: ContentBlock[];
}
