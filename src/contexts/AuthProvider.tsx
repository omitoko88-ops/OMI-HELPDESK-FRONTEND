import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

interface LoginLocationState {
  from?: {
    pathname: string
    search?: string
    hash?: string
  }
}

const AuthProvider = () => {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'
  const isRegisterRoute = location.pathname === '/register'
  const isAuthRoute = isLoginRoute || isRegisterRoute

  if (!token && !isAuthRoute) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (token && isAuthRoute) {
    const from = (location.state as LoginLocationState | null)?.from
    const destination = from
      ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
      : '/'

    return <Navigate to={destination} replace />
  }

  return <Outlet />
}

export default AuthProvider
