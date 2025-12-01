import { Loader2 } from "lucide-react"

export default function LoadingIndicator({ label = "Cargando...", className = "", labelClassName = "", iconClassName = "" }) {
  return (
    <div
      className={`flex items-center gap-2 text-muted-foreground ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className={`size-5 animate-spin text-primary ${iconClassName}`} aria-hidden="true" />
      {label ? <span className={`text-sm font-medium ${labelClassName}`}>{label}</span> : null}
    </div>
  )
}
