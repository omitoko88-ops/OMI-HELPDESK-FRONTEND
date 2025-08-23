import { dummyDoc, mdContent } from "@/assets/data";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { TableOfContents } from "@/layout/components/TableOfContents";
import { extractToc } from "@/lib/parseToc";
import { useTableContent } from "@/contexts/TableContentContext";
import { useEffect } from "react";
import rehypePrism from "rehype-prism";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSpecificDocs } from "@/hooks/api/useDocumentation";
import { useActiveVersion } from "@/stores/versionStore";
import { ApiError } from "@/lib/ApiError";
import { ErrorAlert } from "@/components/common/CustomErrorAlert";
import mdFile from "../assets/docs/getting-started.md?raw";
import { Components } from "react-markdown";
import { markdownComponents } from "./Markdown/MarkdownComponents";



export const DocContent = () => {
  const { version } = useActiveVersion();

  const {
    data: doc,
    isLoading: docLoading,
    isError,
    error,
  } = useSpecificDocs("getting-started", version ?? "");

  const { setTableContent } = useTableContent();
  const isMd = useMediaQuery("(min-width: 868px)");

  useEffect(() => {
    if (doc?.content && isMd) {
      const toc = extractToc(mdContent);
      setTableContent(<TableOfContents toc={toc} />);
    } else {
      setTableContent(null);
    }
  }, [doc?.content, isMd, setTableContent]);

  if (docLoading) {
    return <p>Loading documentation...</p>;
  }

  return (
    <div className="prose max-w-none dark:prose-invert py-8 scrollbar-thin">
      {isError && error instanceof ApiError && <ErrorAlert error={error} />}
      <h1>{doc?.title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypePrism]}
        components={markdownComponents}
      >
        {/* {doc?.content ?? ""} */}
        {mdFile}
      </ReactMarkdown>
    </div>
  );
};
