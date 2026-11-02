import { createContext, useContext } from 'react'
import useSidebarHooks from './useSidebarHooks'

const SidebarContext = createContext<ReturnType<typeof useSidebarHooks> | null>(
  null,
)

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const sidebar = useSidebarHooks()

  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}
