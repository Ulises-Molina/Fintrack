
import { TrendingUp } from "lucide-react"
import { supabase } from "../../lib/supabaseCliente"
import { useState } from "react"
import { Link } from "react-router-dom"
import { AuthRedirect } from "../../components/authRedirect"

function RegisterPage() {

const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [error, setError] = useState(null)
const [success, setSuccess] = useState(false)
const [isGoogleLoading, setIsGoogleLoading] = useState(false)

const handleForm = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    try {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })
        if (error) throw error
        setSuccess(true)
        setName("")
        setEmail("")
        setPassword("")
    } catch (error) {
        setError(error.message)
        setSuccess(false)
    }
}

const handleGoogleLogin = async () => {
    setError(null)
    setIsGoogleLoading(true)
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })
        if (error) throw error
    } catch (error) {
        setError(error.message)
        setIsGoogleLoading(false)
    }
}

    return (
    <>
      <AuthRedirect />
      <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] flex flex-col">
    {/* Header */}
    <header className="border-b border-[#d9d9d9] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 font-semibold text-lg">
          <img src="/logo3.png" className="w-28" alt="FinanzasPro" />
        </a>
        <a href="/login" className="text-sm font-medium text-primary">
          Iniciar sesión
        </a>
      </div>
    </header>

    {/* Register Form */}
    <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-semibold">Crear cuenta</h1>
            <p className="text-sm text-[#666]">
              Comienza a gestionar tus finanzas de forma inteligente.
            </p>
          </div>

          {/* mensaje de error */}
          {error && (
            <p className="mb-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleForm}>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                required
                className="w-full rounded-2xl border border-[#d9d9d9] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-[#9a9a9a]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@fintrack.com"
                required
                className="w-full rounded-2xl border border-[#d9d9d9] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-[#9a9a9a]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-[#d9d9d9] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-[#9a9a9a]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            

            <button
              type="submit"
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
            >
              Crear cuenta
            </button>
          </form>


        {/* Social */}
        <div className="mt-10 space-y-4">
          <div className="relative text-center text-xs uppercase text-[#999]">
            <span className="relative z-10 bg-white px-4">O regístrate con</span>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#e6e6e6]" />
          </div>

          <div className="grid gap-3">
            <button className="gsi-material-button"type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}>
  <div className="gsi-material-button-state"></div>
  <div className="gsi-material-button-content-wrapper">
    <div className="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span className="gsi-material-button-contents">Sign up with Google</span>
    <span style={{display: "none"}}>Sign up with Google</span>
  </div>{isGoogleLoading ? "Abriendo..." : "Google"}
</button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[#666]">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="font-semibold text-primary">
            Inicia sesión
          </a>
        </p>
      </div>
    </main>

    {success && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Usuario creado correctamente</h2>
          <p className="mt-2 text-sm text-[#666]">Confirmá tu cuenta desde el mail que recibiste y ya podes ingresar a Fintrack</p>
          <div className="mt-6 space-y-3">
            <a
              href="/login"
              className="block w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
            >
              Ir al login
            </a>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="block w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:border-primary hover:text-primary"
            >
              Seguir en registro
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
    </>
  )

}

export default RegisterPage
