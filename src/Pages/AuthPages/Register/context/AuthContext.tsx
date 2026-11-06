import { createContext, type ReactNode, useContext } from 'react'
import { useRegisterHooks } from '../hooks/useRegisterHooks'

const RegisterContext = createContext<ReturnType<
  typeof useRegisterHooks
> | null>(null)

export function RegisterContextProvider({ children }: { children: ReactNode }) {
  const register = useRegisterHooks()

  return (
    <RegisterContext.Provider value={register}>
      {children}
    </RegisterContext.Provider>
  )
}

export function useRegisterContext() {
  const context = useContext(RegisterContext)
  if (!context) {
    throw new Error(
      'useRegisterContext must be used within RegisterContextProvider',
    )
  }
  return context
}
