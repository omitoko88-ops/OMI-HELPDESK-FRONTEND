// src/components/Layout.tsx
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useTableContent } from "@/contexts/TableContentContext";
import Header from "../components/Header/Header";
import LayoutSidebar from "../components/Sidebar";
import Header2 from "../components/Header/Header2";

const Layout: React.FC = () => {
  const { tableContent } = useTableContent();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex flex-1 w-full mx-auto max-h-svh">
          <LayoutSidebar />
          <main
            className="
            flex-1
              min-w-0 
              overflow-y-auto
              px-36
              md:px-42
              scrollbar-thin
              border-x-1
            "
            >
            <Header2 />
            <Outlet />
          </main>
          {tableContent}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
