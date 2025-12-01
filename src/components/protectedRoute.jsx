// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoadingIndicator from "./ui/loading-indicator"

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingIndicator label="Verificando sesión..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // si hay usuario, renderizamos el contenido protegido
  return children
}
