// src/components/layout/Header.tsx
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full h-14 border-b flex items-center justify-between px-6 z-50 bg-white">
      <div className="text-lg font-bold">My Project</div>

      <nav className="hidden md:flex items-center gap-6 text-sm">
        <a href="#about" className="hover:underline">
          About
        </a>
        <a href="#contact" className="hover:underline">
          Contact
        </a>
        <input
          type="text"
          placeholder="Search documentation..."
          className="ml-4 px-3 py-1 border rounded-md text-sm"
        />
      </nav>

      <div className="md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  );
};

export default Header;

const SidebarToggle = () => {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(!openMobile)}
      className="md:hidden"
    >
      {openMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </Button>
  );
};
