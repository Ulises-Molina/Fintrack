import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseCliente"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1) obtener usuario actual
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setUser(null)
      } else {
        setUser(data.user)
      }
      setLoading(false)
    })

    // 2) escuchar cambios de auth (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}