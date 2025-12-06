// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Skeleton } from "./ui/skeleton"

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // si hay usuario, renderizamos el contenido protegido
  return children
}
