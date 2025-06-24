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
        title: "History",
        url: "#",
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
