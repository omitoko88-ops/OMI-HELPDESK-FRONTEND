import { dummyDoc } from "@/assets/data";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { TableOfContents } from "@/layout/components/TableOfContents";
import { extractToc } from "@/lib/parseToc";
import { useTableContent } from "@/contexts/TableContentContext";
import { useEffect } from "react";
import rehypePrism from "rehype-prism";
import rehypeHighlight from 'rehype-highlight'

export const DocContent = () => {
  const toc = extractToc(dummyDoc.content);
  const { setTableContent } = useTableContent();

  useEffect(() => {
    setTableContent(<TableOfContents toc={toc} />);
    return () => setTableContent(null);
  }, [setTableContent]);

  return (
    <div className="prose max-w-none dark:prose-invert px-4 md:px-10 py-8">
      <h1>{dummyDoc.title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
      >
        {dummyDoc.content}
      </ReactMarkdown>
    </div>
  );
};
