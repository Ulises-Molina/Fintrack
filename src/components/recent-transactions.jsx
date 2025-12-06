import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Home,
  ShoppingBag,
  Smartphone,
  Utensils,
  Car,
  GraduationCap,
  HeartPulse,
} from "lucide-react"
import { supabase } from "../lib/supabaseCliente"
import { TransactionSkeleton } from "./ui/skeleton"

const categoryIcons = {
  Alimentación: ShoppingBag,
  Vivienda: Home,
  Entretenimiento: Smartphone,
  Transporte: Car,
  Servicios: Smartphone,
  Salud: HeartPulse,
  Educación: GraduationCap,
}

const formatAmount = (amount) => {
  const isIncome = amount > 0
  const currency = Math.abs(amount).toLocaleString("es-ES", {
    style: "currency",
    currency: "ars",
    minimumFractionDigits: 0,
  })

  return `${isIncome ? "+" : "-"}${currency}`
}

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const mapCategoryIcon = (category, type) => {
  if (type === "income") return ArrowUpRight

  return categoryIcons[category] || ArrowDownLeft
}

const toTransactionItem = (tx) => {
  const Icon = mapCategoryIcon(tx.category, tx.type)
  const isIncome = tx.type === "income"

  return {
    id: tx.id,
    description: tx.description || (isIncome ? "Ingreso" : "Gasto"),
    category: tx.category || (isIncome ? "Ingreso" : "Gasto"),
    amount: Number(tx.amount) || 0,
    createdAt: tx.created_at,
    icon: Icon,
    isIncome,
  }
}

export default function RecentTransactions({ reloadFlag }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      setError("")

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("No se pudo obtener el usuario")
        setItems([])
        setIsLoading(false)
        return
      }

      const { data, error: txError } = await supabase
        .from("transactions")
        .select("id, description, amount, type, category, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6)

      if (txError) {
        setError(txError.message)
        setItems([])
        setIsLoading(false)
        return
      }

      setItems((data || []).map(toTransactionItem))
      setIsLoading(false)
    }

    fetchTransactions()
  }, [reloadFlag])

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 border border-white/60 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg shadow-primary/10 mt-8" id="recent-transactions">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 rounded-2xl sm:rounded-3xl" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary/80">Actividad</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#0f172a]">Transacciones recientes</h3>
          <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">Tus últimos movimientos financieros</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/transactions")}
          className="text-xs sm:text-sm font-medium text-primary hover:underline cursor-pointer px-3 sm:px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
        >
          Ver todas
        </button>
      </div>

      {isLoading ? (
        <TransactionSkeleton />
      ) : error ? (
        <p className="mt-4 sm:mt-6 text-sm text-red-600">Error: {error}</p>
      ) : items.length === 0 ? (
        <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-dashed border-white/50 bg-white/40 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm font-medium text-[#111]">Todavía no registraste transacciones</p>
          <p className="text-xs text-muted-foreground/90 mt-1">Creá tu primer ingreso o gasto para verlas acá.</p>
        </div>
      ) : (
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          {items.map((item) => {
            const Icon = item.icon
            const formattedAmount = formatAmount(item.amount * (item.isIncome ? 1 : -1))

            return (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-xl bg-white/60 backdrop-blur-sm p-3 sm:p-4 border border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div
                    className={`rounded-xl p-2 sm:p-2.5 transition-transform group-hover:scale-110 border border-black/30 flex-shrink-0`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#111] text-start truncate">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground/90 text-start inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-black/20 truncate">{item.category}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      item.isIncome ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {formattedAmount}
                  </p>
                  <p className="text-xs text-muted-foreground/90 mt-1 hidden sm:block">{formatDate(item.createdAt)}</p>
                  <p className="text-xs text-muted-foreground/90 mt-1 sm:hidden">{new Date(item.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
