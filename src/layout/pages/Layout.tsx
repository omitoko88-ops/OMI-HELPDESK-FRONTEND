import { Outlet } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useTableContent } from '@/contexts/TableContentContext'
import LayoutSidebar from '../components/Sidebar'
import Header2 from '../components/Header/Header2'

const Layout: React.FC = () => {
  const { tableContent } = useTableContent()

  return (
    <SidebarProvider>
      <div className="h-dvh w-full overflow-hidden flex flex-col">
        <div className="flex flex-1 min-h-0 w-full overflow-hidden">
          <LayoutSidebar />

          <main className="flex-1 min-w-0 min-h-0 flex flex-col border-x overflow-hidden">
            {/* Header tidak ikut scroll */}
            <Header2 />

            {/* Hanya area Outlet yang bisa scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto w-full max-w-3xl px-4 py-4">
                <Outlet />
              </div>
            </div>
          </main>

          {tableContent}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
