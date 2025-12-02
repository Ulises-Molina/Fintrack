import HeaderDashboard from "../../components/headerdashboard";
import ExpenseSummary from "../../components/expense-summary";
import CategoryBreakdown from "../../components/category-breakdown";
import RecentTransactions from "../../components/recent-transactions";
import FinancialSummary from "../../components/financial-summary";
import { useState } from "react";

function DashboardPage() {
  const [reloadFlag, setReloadFlag] = useState(false)

   const handleTransactionSaved = () => {
    setReloadFlag((prev) => !prev) // cambia true/false para disparar el useEffect
  }
  return (
    <>
    <HeaderDashboard onTransactionSaved={handleTransactionSaved}/>
    <div className="min-h-screen relative">
      {/* Fondo con gradientes y efectos */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-white via-slate-50 to-primary/5" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(19,121,139,0.08),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(19,121,139,0.06),transparent_60%)]" />
      <div className="fixed -top-40 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="fixed -bottom-48 left-1/4 -z-10 h-[22rem] w-[22rem] rounded-full bg-cyan-200/20 blur-3xl" />
      
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl relative z-10 mt-20">
        <div className="space-y-6 sm:space-y-8">
          <div className="px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111] tracking-tight mb-2 text-start">Escritorio</h1>
            <p className="text-muted-foreground text-start text-sm sm:text-base">Resumen de tus finanzas personales</p>
          </div>

          <div className="px-2 sm:px-0">
            <ExpenseSummary reloadFlag={reloadFlag}/>
          </div>

          <div className="grid gap-6 lg:grid-cols-1 px-2 sm:px-0">
            <CategoryBreakdown reloadFlag={reloadFlag} />
          </div>

        </div>

        <div className="mt-6 sm:mt-8 px-2 sm:px-0">
          <RecentTransactions  reloadFlag={reloadFlag} />
        </div>
        <div className="px-2 sm:px-0">
          <FinancialSummary />
        </div>
      </main>
    </div>
    </>
  )
}

export default DashboardPage

