import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageLoaderSkeleton } from "./ui/page-skeleton"

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
    return <PageLoaderSkeleton label="Verificando sesión..." />
  }

  // Si no hay usuario, renderizar null (el componente padre manejará el contenido)
  return null
}
