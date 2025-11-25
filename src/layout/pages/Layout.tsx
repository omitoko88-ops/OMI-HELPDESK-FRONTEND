// src/components/Layout.tsx
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useTableContent } from "@/contexts/TableContentContext";
import Header from "../components/Header";
import LayoutSidebar from "../components/Sidebar";

const Layout: React.FC = () => {
  const { tableContent } = useTableContent();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex flex-1 max-w-[1540px] w-full mx-auto pt-17 max-h-svh">
          <LayoutSidebar />
          <main
            className="
              flex-1
              min-w-0 
              overflow-y-auto
              px-6
              md:px-12
              scrollbar-thin
              border-x-1
            "
          >
            <Outlet />
          </main>
          {tableContent}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
