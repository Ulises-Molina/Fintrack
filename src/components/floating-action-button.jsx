import React from "react"
import { Plus } from "lucide-react"

export default function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/80 hover:shadow-xl"
      aria-label="Nueva transacción"
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}
