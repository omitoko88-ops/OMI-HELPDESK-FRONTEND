import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, LucideIcon } from "lucide-react";
import { useLocation } from "react-router";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Buka menu otomatis saat lokasi berubah
  useEffect(() => {
    const activeItem = items.find((item) =>
      item.items?.some((sub) => location.pathname === sub.url)
    );
    if (activeItem) {
      setOpenMenu(activeItem.title);
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname, items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openMenu === item.title;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={(open) => {
                setOpenMenu(open ? item.title : null);
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        className={`relative pl-6 ${
                          subItem.url === location.pathname ? "bg-muted" : ""
                        }`}
                      >
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                        {subItem.url === location.pathname && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-primary to-sky-400 dark:to-green-600" />
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
