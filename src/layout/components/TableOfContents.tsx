import { TocItem } from "@/lib/parseToc";

export const TableOfContents = ({ toc }: { toc: TocItem[] }) => {
  return (
    <aside className="hidden lg:block w-64 border-l px-4 py-8 text-sm">
      <div className="font-semibold mb-2">On This Page</div>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id} className={`ml-${(item.depth - 2) * 4}`}>
            <a href={`#${item.id}`} className="hover:underline block truncate">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
