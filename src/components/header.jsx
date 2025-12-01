import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="relative z-50 border-b border-slate-200/40 bg-white/65 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center rounded-2xl p-2">
            <img src="/logo3.png" alt="logo" className="h-10 sm:h-12" />
          </div>
        </div>

        <nav className="hidden items-center gap-2 text-sm font-medium text-[#3a3a3a] lg:flex">
          <a href="#hero" className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary">
            Inicio
          </a>
          <a href="#features" className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary">
            Características
          </a>
          <a href="#benefits" className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary">
            Beneficios
          </a>
        </nav>

        <div className="hidden items-center gap-3 text-sm font-semibold lg:flex">
          <Link to="/login" className="text-[#2c2c2c] transition hover:text-primary">
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-white shadow-sm shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/80"
          >
            Registrate
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-xl border border-primary/10 bg-white/70 p-2 text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary/80 lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="border-t border-slate-200/40 bg-white/95 px-4 py-4 shadow-lg shadow-primary/10">
            <nav className="flex flex-col gap-2 text-sm font-medium text-[#3a3a3a]">
              <a
                href="#hero"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary"
              >
                Inicio
              </a>
              <a
                href="#features"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary"
              >
                Características
              </a>
              <a
                href="#benefits"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary"
              >
                Beneficios
              </a>
            </nav>

            <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-primary/15 bg-white px-3 py-2 text-center text-[#2c2c2c] transition hover:border-primary/30 hover:text-primary"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-white shadow-sm shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/80"
              >
                Registrate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
