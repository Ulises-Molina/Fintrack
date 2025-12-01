import React, { useEffect, useState } from "react"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { supabase } from "../lib/supabaseCliente"
import LoadingIndicator from "./ui/loading-indicator"

function ExpenseSummary({ reloadFlag }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("No se pudo obtener el usuario")
        setLoading(false)
        return
      }

      const { data, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)

      if (txError) {
        setError(txError.message)
        setLoading(false)
        return
      }

      let income = 0
      let expenses = 0

      ;(data || []).forEach((tx) => {
        if (tx.type === "income") {
          income += Number(tx.amount) || 0
        } else if (tx.type === "expense") {
          expenses += Number(tx.amount) || 0
        }
      })

      const balance = income - expenses
      const trend = 0 // TODO: calcular mes a mes

      setStats({ income, expenses, balance, trend })
      setLoading(false)
    }

    fetchData()
  }, [reloadFlag]) // 👈 cada vez que cambia, recarga datos

  const evaluarColor = (valor) => {
    if (valor > 0) return "text-green-700"
    if (valor === 0) return "text-[#111]"
    return "text-gray-700"
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingIndicator label="Cargando resumen..." />
      </div>
    )
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!stats) return null

  const { balance, income, expenses, trend } = stats
  const savingsRate =
    income > 0 ? ((balance / income) * 100).toFixed(1) : "0.0"

  return (
    <div id="expense-summary" className="grid gap-6 md:grid-cols-3">
      {/* Balance total */}
      <div className="group relative p-6 border border-white/60 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground/90 text-start">
              Balance Total
            </p>
            <p className="text-3xl font-bold text-[#111] mt-2 text-start">
              $
              {balance.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2 text-start">
              Tasa de ahorro: {" "}
              <span className={`font-medium ${evaluarColor(balance)}`}>
                {savingsRate}%
              </span>
            </p>
          </div>
          <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center shadow-sm">
            <Wallet className="size-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Ingresos */}
      <div className="group relative p-6 border border-white/60 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/15 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground/90 text-start">
              Ingresos
            </p>
            <p
              className={`text-3xl font-bold mt-2 text-start ${evaluarColor(
                income
              )}`}
            >
              $
              {income.toLocaleString("es-ES", {
                minimumFractionDigits: 0  ,
              })}
            </p>
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${evaluarColor(
                trend
              )}`}
            >
              <TrendingUp className="size-3" />
              {trend}% vs mes anterior
            </p>
          </div>
          <div className="size-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/40 flex items-center justify-center shadow-sm">
            <TrendingUp className="size-6 text-green-700" />
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="group relative p-6 border border-white/60 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/15 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground/90 text-start">
              Gastos
            </p>
            <p className="text-3xl font-bold mt-2 text-red-700 text-start">
              $
              {expenses.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2 text-start">
              {income > 0
                ? `${((expenses / income) * 100).toFixed(
                    1
                  )}% de tus ingresos`
                : "Sin ingresos registrados"}
            </p>
          </div>
          <div className="size-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/40 flex items-center justify-center shadow-sm">
            <TrendingDown className="size-6 text-red-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSummary
