// utils/parseTocHtml.ts
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export function extractTocFromHtml(html: string): TocItem[] {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);
  const toc: TocItem[] = [];

  visit(tree, "element", (node: any) => {
    if (/^h[1-6]$/.test(node.tagName)) {
      // Ambil semua teks dalam heading (termasuk kalau ada <strong>, <em>, dsb.)
      const text = node.children
        .filter((c: any) => c.type === "text" || c.type === "element")
        .map((c: any) => (c.value ? c.value : c.children?.map((cc: any) => cc.value).join("")))
        .join("")
        .trim();

      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      const depth = Number(node.tagName.replace("h", "")); // "h1" -> 1, "h2" -> 2
      toc.push({ id, text, depth });
    }
  });

  return toc;
}
