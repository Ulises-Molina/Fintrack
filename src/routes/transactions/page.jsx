import { useEffect, useMemo, useState } from "react"
import HeaderDashboard from "../../components/headerdashboard"
import { TransactionSkeleton } from "../../components/ui/skeleton"
import { supabase } from "../../lib/supabaseCliente"
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

const categoryIcons = {
  Alimentación: ShoppingBag,
  Vivienda: Home,
  Entretenimiento: Smartphone,
  Transporte: Car,
  Servicios: Smartphone,
  Salud: HeartPulse,
  Educación: GraduationCap,
  Otros: Utensils,
}

const toTransactionItem = (tx) => {
  const isIncome = tx.type === "income"
  const Icon = isIncome ? ArrowUpRight : categoryIcons[tx.category] || ArrowDownLeft

  return {
    id: tx.id,
    description: tx.description || (isIncome ? "Ingreso" : "Gasto"),
    category: tx.category || (isIncome ? "Ingreso" : "Gasto"),
    amount: Number(tx.amount) || 0,
    createdAt: tx.created_at,
    type: tx.type,
    icon: Icon,
  }
}

const formatAmount = (amount, type) => {
  const multiplier = type === "income" ? 1 : -1
  const absolute = Math.abs(amount).toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits:0,
  })

  return `${multiplier > 0 ? "+" : "-"}${absolute}`
}

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

function filterTransactions(transactions, typeFilter, search) {
  const searchQuery = search.trim().toLowerCase()

  return transactions.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesSearch =
      searchQuery.length === 0 ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)

    return matchesType && matchesSearch
  })
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [reloadFlag, setReloadFlag] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [search, setSearch] = useState("")

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
        setTransactions([])
        setIsLoading(false)
        return
      }

      const { data, error: txError } = await supabase
        .from("transactions")
        .select("id, description, amount, type, category, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (txError) {
        setError(txError.message)
        setTransactions([])
        setIsLoading(false)
        return
      }

      setTransactions((data || []).map(toTransactionItem))
      setIsLoading(false)
    }

    fetchTransactions()
  }, [reloadFlag])

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, typeFilter, search),
    [transactions, typeFilter, search]
  )

  const handleTransactionSaved = () => {
    setReloadFlag((prev) => !prev)
  }

  return (
    <>
      <HeaderDashboard onTransactionSaved={handleTransactionSaved} />

      <div className="min-h-screen bg-background pt-20">
        <main className="container mx-auto max-w-6xl py-10 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111]">Todas tus transacciones</h1>
              <p className="text-muted-foreground">
                Revisa el historial completo de ingresos y gastos registrados.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-[#1111111a] bg-white/80 p-1 shadow-inner">
                {["all", "income", "expense"].map((filter) => {
                  const labels = {
                    all: "Todos",
                    income: "Ingresos",
                    expense: "Gastos",
                  }

                  const isActive = typeFilter === filter

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTypeFilter(filter)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        isActive
                          ? "bg-primary text-white shadow"
                          : "text-muted-foreground hover:text-[#222]"
                      }`}
                    >
                      {labels[filter]}
                    </button>
                  )
                })}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por descripción o categoría"
                  className="w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/40 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-3 my-auto text-sm text-muted-foreground hover:text-[#222]"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-[#11111112] bg-white/70 p-6 shadow-sm backdrop-blur">
            {isLoading ? (
              <TransactionSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-700">
                Ocurrió un error al cargar las transacciones: {error}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#11111122] bg-white/80 py-10 text-center">
                <p className="text-sm font-semibold text-[#111]">No encontramos movimientos para tu búsqueda.</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Ajustá los filtros o registrá una nueva transacción para verla aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((item) => {
                  const Icon = item.icon
                  const formattedAmount = formatAmount(item.amount, item.type)
                  const isIncome = item.type === "income"

                  return (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#11111115] bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            isIncome ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111] text-start">{item.description}</p>
                          <div className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full border border-[#11111120] bg-[#11111110] px-2 py-0.5">
                              {item.category}
                            </span>
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <p className={isIncome ? "text-sm font-semibold text-green-700" : "text-sm font-semibold text-red-700"}>
                        {formattedAmount}
                      </p>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

export default TransactionsPage
