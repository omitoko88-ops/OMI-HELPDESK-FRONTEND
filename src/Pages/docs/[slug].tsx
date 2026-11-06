import { dummyDoc } from "@/assets/data";
import { extractTocFromHtml } from "@/lib/parseToc";
import { DocContent } from "../DocContent";
import { TableOfContents } from "@/layout/components/TableOfContents";

export default function DocPage() {
  const toc = extractTocFromHtml(dummyDoc.content);

  return (
    <div className="flex max-w-screen-xl mx-auto">
      <main className="flex-1 p-6 md:p-12">
        <h1 className="text-3xl font-bold mb-4">{dummyDoc.title}</h1>
        <DocContent />
      </main>

      <TableOfContents toc={toc} />
    </div>
  );
}
