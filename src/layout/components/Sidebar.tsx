import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { navMain } from "@/assets/data";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

const LayoutSidebar = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="inset"
      className="border-r"
    >
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavUser user={user} /> */}
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="w-20 h-10 rounded-full bg-gray-300 dark:bg-gray-700 relative transition-colors duration-300 p-0"
        >
          <span
            className={`w-8 h-8 rounded-full shadow-md absolute top-1 left-1 transform transition-transform duration-300 flex items-center justify-center ${
              isDark ? "translate-x-10 bg-black" : "translate-x-0 bg-white"
            }`}
          >
            <Sun
              className={`absolute h-4 w-4 text-yellow-500 transform transition-all duration-300 ${
                isDark
                  ? "opacity-0 scale-0 rotate-90"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />
            <Moon
              className={`absolute h-4 w-4 text-blue-400 transform transition-all duration-300 ${
                isDark
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-0 -rotate-90"
              }`}
            />
          </span>
        </Button>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
};

export default LayoutSidebar;
