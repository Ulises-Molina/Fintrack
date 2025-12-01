import { TrendingUp } from "lucide-react"


function  Footer() {
    return(
        <footer className="relative isolate w-full overflow-hidden border-t border-white/60 bg-white/90 pt-12 before:absolute before:inset-x-0 before:top-0 before:h-0 before:bg-gradient-to-b before:from-transparent before:via-white/70 before:to-white before:content-[''] before:pointer-events-none">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(19,121,139,0.08),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(19,121,139,0.1),transparent_55%)]" />
        <div className="absolute -top-24 left-1/5 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 -z-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/logo3.png" alt="Fintrack" className="w-28 sm:w-32"></img>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground mb-8">
              La forma más inteligente de gestionar tus finanzas personales.
            </p>
          </div>

          <div className="mt-8 border-t border-white/60 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Fintrack. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    )
}

export default Footer
