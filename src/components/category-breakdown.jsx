import { useEffect, useMemo, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { supabase } from "../lib/supabaseCliente"
import LoadingIndicator from "./ui/loading-indicator"

// Colores suaves separados en la rueda HSL
const getColorForIndex = (index, total) => {
  const hue = Math.round((index * 360) / total)
  const saturation = 55
  const lightness = 70
  return `hsl(${hue}deg ${saturation}% ${lightness}%)`
}

function CategoryBreakdown({ reloadFlag }) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError("")

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("No se pudo obtener el usuario")
        setData([])
        setIsLoading(false)
        return
      }

      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("category, amount")
        .eq("user_id", user.id)
        .eq("type", "expense")

      if (txError) {
        setError(txError.message)
        setData([])
        setIsLoading(false)
        return
      }

      const totals = new Map()

      ;(transactions || []).forEach((tx) => {
        const category = tx.category?.trim() || "Otros"
        const amount = Math.abs(Number(tx.amount) || 0)
        if (amount === 0) return

        totals.set(category, (totals.get(category) || 0) + amount)
      })

      const aggregated = Array.from(totals.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

      setData(aggregated)
      setIsLoading(false)
    }

    fetchCategories()
  }, [reloadFlag])

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  )

  const hasData = data.length > 0 && total > 0

  return (
    <div id="category-breackdown" className="relative p-8 border border-white/60 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 rounded-3xl" />
      
      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary/80">Análisis</span>
          </div>
          <h3 className="text-xl font-semibold text-[#0f172a]">
            Gastos por categoría
          </h3>
          <p className="text-sm text-muted-foreground/80 mt-1">
            Cómo se distribuyen tus gastos en este periodo
          </p>
        </div>

        {hasData && (
          <div className="text-right px-4 py-2 rounded-2xl bg-white/70 border border-white/50">
            <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground/90">
              Total gastado
            </p>
            <p className="text-lg font-semibold text-[#0f172a]">
              $
              {total.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingIndicator label="Cargando categorías..." />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">Error: {error}</p>
      ) : !hasData ? (
        <div className="rounded-2xl border border-dashed border-white/50 bg-white/40 backdrop-blur-sm px-6 py-8 text-center">
          <p className="text-sm font-medium text-[#111]">
            Aún no hay gastos para mostrar
          </p>
          <p className="text-xs text-muted-foreground/90 mt-1">
            Registrá tus primeros gastos y vas a ver acá cómo se reparten por
            categoría.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col lg:flex-row items-center gap-8">
          {/* Gráfico */}
          <div className="relative h-[240px] w-[240px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl" />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={700}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={getColorForIndex(index, data.length)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString("es-ES", {
                      minimumFractionDigits: 0,
                    })}`,
                    name,
                  ]}
                  wrapperStyle={{ outline: "none" }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total en el centro del donut */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground/80">
                Total
              </p>
              <p className="text-base font-semibold text-[#0f172a]">
                $
                {total.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          {/* Leyenda / listado */}
          <div className="flex-1 w-full space-y-2">
            {data.map((item, index) => {
              const color = getColorForIndex(index, data.length)
              const percentage = ((item.value / total) * 100).toFixed(1)

              return (
                <div
                  key={item.name}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 hover:bg-white/70 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)] transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#0f172a]">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/90 text-start">
                        {percentage}% del total
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0f172a]">
                      $
                      {item.value.toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryBreakdown
