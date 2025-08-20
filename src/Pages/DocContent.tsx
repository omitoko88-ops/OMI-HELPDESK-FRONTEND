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

const headingClass = "scroll-mt-16";

const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 {...props} className={`${headingClass} ${props.className || ""}`} />
  ),
  h2: ({ node, ...props }) => (
    <h2 {...props} className={`${headingClass} ${props.className || ""}`} />
  ),
  h3: ({ node, ...props }) => (
    <h3 {...props} className={`${headingClass} ${props.className || ""}`} />
  ),
  h4: ({ node, ...props }) => (
    <h4 {...props} className={`${headingClass} ${props.className || ""}`} />
  ),
  p(props: any) {
    const text = childrenToString(props.children);
    if (text.startsWith("::center")) {
      return (
        <p style={{ textAlign: "center" }}>
          {text.replace("::center", "").replace("::", "").trim()}
        </p>
      );
    }
    if (text.startsWith("::right")) {
      return (
        <p style={{ textAlign: "right" }}>
          {text.replace("::right", "").replace("::", "").trim()}
        </p>
      );
    }
    return <p {...props} />;
  },
};

// const components = {
//   p(props: any) {
//     const text = props.children.join("");
//     if (text.startsWith("::center")) {
//       return (
//         <p style={{ textAlign: "center" }}>
//           {text.replace("::center", "").replace("::", "").trim()}
//         </p>
//       );
//     }
//     return <p {...props} />;
//   },
// };

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

function childrenToString(children: any): string {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(childrenToString).join("");
  }
  if (typeof children === "object" && "props" in children) {
    return childrenToString(children.props.children);
  }
  return "";
}
