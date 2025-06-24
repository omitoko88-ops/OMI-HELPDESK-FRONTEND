import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export const MarkdownPreview = ({ markdown }: { markdown: string }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => {
            if (src?.startsWith("blob:")) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full rounded border"
                />
              );
            }

            return <img src={src || ""} alt={alt} className="max-w-full" />;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
