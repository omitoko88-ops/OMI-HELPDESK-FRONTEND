import { TocItem } from "@/lib/parseToc";
import { useActiveVersion } from "@/stores/versionStore";
import clsx from "clsx";

type TableOfContentsProps = {
  toc: TocItem[];
};

const getIndentClass = (depth: number) => {
  switch (depth) {
    case 2:
      return "ml-4";
    case 3:
      return "ml-8";
    case 4:
      return "ml-12";
    case 5:
      return "ml-16";
    case 6:
      return "ml-20";
    default:
      return "ml-0";
  }
};

export const TableOfContents = ({ toc }: TableOfContentsProps) => {
  const { version } = useActiveVersion();

  if (!toc || toc.length === 0) return null;

  return (
    <aside className="sticky right-0 top-0 h-full bg-background w-64 border-l px-4 py-8 text-sm">
      <div className="font-semibold mb-2">On This Page</div>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id} className={getIndentClass(item.depth)}>
            <a
              href={`#${item.id}`}
              className={clsx(
                "hover:underline block truncate",
                // contoh tambahan styling kalau mau highlight versi tertentu
                version && "text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
