import { TableOfContents } from "@/layout/components/TableOfContents";
import { extractTocFromHtml } from "@/lib/parseToc";
import { useTableContent } from "@/contexts/TableContentContext";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSpecificDocs } from "@/hooks/api/useDocumentation";
import { useActiveVersion } from "@/stores/versionStore";
import { ApiError } from "@/lib/ApiError";
import { ErrorAlert } from "@/components/common/CustomErrorAlert";
import { TiptapViewer } from "./DocViewer/TiptapViewerHtml";

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
      const toc = extractTocFromHtml(doc.content);
      console.log("TOC = ", toc);

      setTableContent(<TableOfContents toc={toc} />);
    } else {
      setTableContent(null);
    }
  }, [doc?.content, isMd, setTableContent]);

  if (docLoading) {
    return <p>Loading documentation...</p>;
  }

  return (
    <div className="prose max-w-none dark:prose-invert py-8 scrollbar-thin min-w-full">
      {isError && error instanceof ApiError && <ErrorAlert error={error} />}
      <h1>{doc?.title}</h1>
      <TiptapViewer html={doc?.content ?? ""} />
    </div>
  );
};
