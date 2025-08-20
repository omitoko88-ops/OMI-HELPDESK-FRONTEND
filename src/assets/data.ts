import { DocData } from "@/interfaces/doc";
import { SquareTerminal } from "lucide-react";

export const navMain = [
  {
    title: "Playground",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/",
      },
      {
        title: "Editor",
        url: "/edit",
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
];

// data/dummyDoc.ts
export const dummyDoc: DocData = {
  id: 1,
  title: "Getting Started",
  slug: "getting-started",
  content: `
  Welcome to the documentation!

  ## Installation

  Run the following command to install:

  \`\`\`bash
  npm install my-library
  \`\`\`

  ## Usage

  Here’s how you use it:

  \`\`\`tsx
  import { Button } from "my-library";
  \`\`\`

  ## Features

  - Easy to use
  - TypeScript support
  - Customizable components
  # **Hello Markdown 👋**

***Halo* dunia** tipu ***~~tipu~~***

asca\\

~~AAX~~
  `,
};

export const mdContent = `
# Welcome to the Documentation!

This is **bold** text and this is *italic* text.

## Installation

Run the following command:

\`\`\`bash
npm install my-library
\`\`\`

## Usage

Here's how you use it:

\`\`\`tsx
import { Button } from "my-library";

function App() {
  return <Button />;
}
\`\`\`

## Features

- Easy to use
- TypeScript support
- Customizable components

## Table Example

| Name    | Age |
|---------|-----|
| Alice   | 25  |
| Bob     | 30  |

## Task List

- [x] Install library
- [ ] Write documentation

## Strikethrough

~~This feature was removed.~~

## Hello Heading

Clicking this heading should generate an anchor link!
`;
