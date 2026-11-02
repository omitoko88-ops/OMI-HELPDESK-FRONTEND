import { useSidebar } from '@/components/ui/sidebar'
import React from 'react'

export default function useSidebarHooks() {
  const { isMobile } = useSidebar()

  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false)
  return {
    isMobile,
    isDropdownOpen,
    setIsDropdownOpen,
  }
}
