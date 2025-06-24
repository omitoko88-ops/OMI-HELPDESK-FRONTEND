// src/components/Layout.tsx
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "../components/Header";
import LayoutSidebar from "../components/Sidebar";
import { TableOfContents } from "../components/TableOfContents";
import { useTableContent } from "@/contexts/TableContentContext";
// import TableOfContents from "../components/TableOfContents";

const Layout = () => {
  const { tableContent } = useTableContent();
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex flex-1 max-w-[1440px] w-full mx-auto">
          <LayoutSidebar />
          <main className="flex-1 min-w-0 max-w-6xl px-6 pt-4 md:px-12">
            <Outlet />
          </main>
          {tableContent}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
