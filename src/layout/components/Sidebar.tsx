import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavMain } from './NavMain'
import { navMain } from '@/assets/data'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { ChevronDown, Command, Moon, Search, Settings, Sun } from 'lucide-react'
import { SidebarProvider } from './Sidebar/SidebarContext'

export function LayoutSidebarContent() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="inset"
      // className="border-r"
    >
      <SidebarHeader>
        {/* Workspace Header */}
        <div className="h-14 flex items-center px-4 hover:bg-slate-100 cursor-pointer border-b border-transparent transition-colors">
          <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
            N
          </div>
          <span className="font-semibold text-sm flex-1">Roshan Workspace</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </SidebarHeader>

      {/* Quick Actions */}
      <div className="px-3 pt-4 pb-2 space-y-1">
        <button
          onClick={() => {}}
          className="w-full flex items-center px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors group"
        >
          <Search className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
          <span className="flex-1 text-left">Search</span>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
        <button
          onClick={() => {}}
          className="w-full flex items-center px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors group"
        >
          <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
          <span>Settings</span>
        </button>
      </div>

      {/* SIDEBAR CONTENT (ISI SIDEBAR) */}
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
              isDark ? 'translate-x-10 bg-black' : 'translate-x-0 bg-white'
            }`}
          >
            <Sun
              className={`absolute h-4 w-4 text-yellow-500 transform transition-all duration-300 ${
                isDark
                  ? 'opacity-0 scale-0 rotate-90'
                  : 'opacity-100 scale-100 rotate-0'
              }`}
            />
            <Moon
              className={`absolute h-4 w-4 text-blue-400 transform transition-all duration-300 ${
                isDark
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'opacity-0 scale-0 -rotate-90'
              }`}
            />
          </span>
        </Button>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}

export default function LayoutSidebar() {
  return (
    <SidebarProvider>
      <LayoutSidebarContent />
    </SidebarProvider>
  )
}
