import { Components } from "react-markdown";

const headingClass = "scroll-mt-16";

export const markdownComponents: Components = {
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
