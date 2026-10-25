import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight, FileText, LucideIcon } from 'lucide-react'
import { useLocation } from 'react-router'
import { Link } from 'react-router'
import { useEffect, useState } from 'react'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Buka menu otomatis saat lokasi berubah
  useEffect(() => {
    const activeItem = items.find((item) =>
      item.items?.some((sub) => location.pathname === sub.url),
    )
    if (activeItem) {
      setOpenMenu(activeItem.title)
    } else {
      setOpenMenu(null)
    }
  }, [location.pathname, items])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>DOKUMENTASI</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openMenu === item.title

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={(open) => {
                setOpenMenu(open ? item.title : null)
              }}
              className="group/collapsible"
            >
              {/* {SIDEBAR NAVIGATION BUTTON} */}
              <SidebarMenuItem>
                {}
                {/* {PARENT DARI SUBMENU} */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="text-slate-600 
                                group-data-[state=open]/collapsible:text-indigo-700 group-data-[state=open]/collapsible:bg-indigo-50"
                  >
                    <ChevronRight
                      className="transition-transform duration-200 text-slate-400
                                  group-data-[state=open]/collapsible:rotate-90  group-data-[state=open]/collapsible:text-indigo-700"
                    />
                    <FileText
                      className="w-4 h-4 text-slate-400
                                  group-data-[state=open]/collapsible:text-indigo-700"
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {}
                {/* {CHILD DARI SUBMENU} */}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <Link to={subItem.url}>
                          <SidebarMenuSubButton
                            asChild
                            className={`px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${subItem.url === location.pathname ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </Link>

                        {subItem.url === location.pathname && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-primary to-sky-400 dark:to-green-600" />
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
