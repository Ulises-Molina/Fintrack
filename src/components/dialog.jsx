import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

const DialogContext = createContext(null)

const cn = (...classes) => classes.filter(Boolean).join(" ")

export function Dialog({ open = false, onOpenChange, children }) {
  const value = useMemo(
    () => ({
      open,
      onOpenChange,
    }),
    [open, onOpenChange]
  )

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange?.(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onOpenChange])

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

function useDialogContext(component) {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(`${component} debe usarse dentro de <Dialog> .`)
  }
  return context
}

export function DialogContent({ className, children, ...props }) {
  const { open, onOpenChange } = useDialogContext("DialogContent")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 outline-none transition-all duration-200",
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function DialogHeader({ className, children, ...props }) {
  useDialogContext("DialogHeader")

  return (
    <div className={cn("space-y-1.5 text-center sm:text-left", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ className, children, ...props }) {
  useDialogContext("DialogTitle")

  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  )
}
