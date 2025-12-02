import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AuthRedirect({ to = '/dashboard' }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Usuario ya autenticado, redirigiendo a:', to)
        navigate(to, { replace: true })
      }
    }
  }, [user, loading, navigate, to])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, renderizar null (el componente padre manejará el contenido)
  return null
}
