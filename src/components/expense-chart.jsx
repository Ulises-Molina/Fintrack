
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


function ExpenseChart() {

    const data = [
        { date: "1 Oct", gastos: 120, ingresos: 0 },
        { date: "5 Oct", gastos: 250, ingresos: 5000 },
        { date: "10 Oct", gastos: 180, ingresos: 0 },
        { date: "15 Oct", gastos: 320, ingresos: 0 },
        { date: "20 Oct", gastos: 290, ingresos: 0 },
        { date: "25 Oct", gastos: 410, ingresos: 0 },
        { date: "30 Oct", gastos: 380, ingresos: 0 },
      ]
  return (

    <div className="p-6  border-1 border-[#11111133] bg-[#f4f4f4] rounded-2xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111]">Flujo de Efectivo</h3>
          <p className="text-sm text-muted-foreground">Últimos 30 días</p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--div))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--div-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#colorGastos)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="hsl(var(--success))"
                fillOpacity={1}
                fill="url(#colorIngresos)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart

