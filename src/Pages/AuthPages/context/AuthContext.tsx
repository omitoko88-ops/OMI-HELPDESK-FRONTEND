import { createContext, useContext } from 'react'
import { useAuthHooks } from '../hooks/useAuthHooks'

const AuthContext = createContext<ReturnType<typeof useAuthHooks> | null>(null)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthHooks()

  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}
