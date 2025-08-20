import { TocItem } from "@/lib/parseToc";
import { useActiveVersion } from "@/stores/versionStore";

type TableOfContentsProps = {
  toc: TocItem[];
};

const getMarginLeft = (depth: number) => {
  const remValue = (depth - 2) * 1;
  return remValue > 0 ? `ml-[${remValue}rem]` : "";
};

export const TableOfContents = ({ toc }: TableOfContentsProps) => {
  const { version } = useActiveVersion();

  return (
    <aside className="sticky right-0 top-0 h-[calc(100svh-3.5rem)] bg-background w-64 border-l px-4 py-8 text-sm">
      <div className="font-semibold mb-2">On This Page</div>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li
            key={item.id}
            className={getMarginLeft(item.depth)}
          >
            <a
              href={`#${item.id}`}
              className="hover:underline block truncate"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
