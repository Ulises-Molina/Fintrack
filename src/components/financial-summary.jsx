import { useMemo, useState } from "react"
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { FinancialSummarySkeleton } from "./ui/skeleton"
import { supabase } from "../lib/supabaseCliente"

const DEFAULT_OPENROUTER_URL =
  import.meta.env.VITE_OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free"
const OPENROUTER_REFERER = import.meta.env.VITE_OPENROUTER_REFERER ?? window?.location?.origin ?? "https://fintrackgastos.vercel.app"
const OPENROUTER_TITLE = import.meta.env.VITE_OPENROUTER_TITLE ?? "Fintrack"
const MAX_TRANSACTIONS_FOR_PROMPT = 120
const MAX_RECENT_TRANSACTIONS_IN_PROMPT = 20

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0)

const formatDateForPrompt = (isoDate) =>
  new Date(isoDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const buildPrompt = (transactions) => {
  const limited = transactions.slice(0, MAX_TRANSACTIONS_FOR_PROMPT)

  const totals = limited.reduce(
    (acc, tx) => {
      const amount = Number(tx.amount) || 0
      if (tx.type === "income") {
        acc.income += amount
      } else {
        acc.expense += amount
      }
      return acc
    },
    { income: 0, expense: 0 }
  )

  const categoryMap = new Map()
  limited.forEach((tx) => {
    const key = tx.category || (tx.type === "income" ? "Ingreso" : "Gasto")
    const amount = Number(tx.amount) || 0
    const signedAmount = tx.type === "income" ? amount : -amount
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + signedAmount)
  })

  const categoryLines = Array.from(categoryMap.entries())
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 8)
    .map(([name, amount]) => `- ${name}: ${formatCurrency(amount)}`)

  const recentLines = limited
    .slice(0, Math.min(MAX_RECENT_TRANSACTIONS_IN_PROMPT, limited.length))
    .map((tx) => {
      const direction = tx.type === "income" ? "Ingreso" : "Gasto"
      const dateLabel = tx.created_at ? formatDateForPrompt(tx.created_at) : "Sin fecha"
      const description = tx.description?.trim() || "Sin descripción"
      const category = tx.category?.trim() || "Sin categoría"
      return `- ${dateLabel} · ${direction} de ${formatCurrency(tx.amount)} en "${description}" (categoría: ${category})`
    })

  const balance = totals.income - totals.expense

  return `Análisis de datos financieros del usuario:

RESUMEN FINANCIERO:
- Ingresos totales: ${formatCurrency(totals.income)}
- Gastos totales: ${formatCurrency(totals.expense)}
- Balance neto: ${formatCurrency(balance)}

DISTRIBUCIÓN POR CATEGORÍAS (principales):
${categoryLines.length ? categoryLines.join("\n") : "- Sin categorías registradas"}

MOVIMIENTOS RECIENTES (últimos ${Math.min(MAX_RECENT_TRANSACTIONS_IN_PROMPT, limited.length)}):
${recentLines.length ? recentLines.join("\n") : "- No hay movimientos registrados"}

CONTEXTO: Usuario de aplicación de finanzas personales en Argentina. Los montos están en pesos argentinos (ARS).

INSTRUCCIONES ESPECÍFICAS:
1. Estructurá tu respuesta en 3-4 párrafos breves y claros
2. Primer párrafo: Estado general de las finanzas (balance, situación actual)
3. Segundo párrafo: Patrones y tendencias principales (dónde gasta más, categorías destacadas)
4. Tercer párrafo: Alertas y preocupaciones (si las hay)
5. Cuarto párrafo: 3 recomendaciones concretas y accionables
6. Usá tono profesional pero cercano y accesible
7. Evita formato markdown, negritas o listas con viñetas
8. Sé específico y basate en los datos proporcionados
9. Si hay balance negativo, mencionalo como área de atención prioritaria`
}

const extractContentFromResponse = (data) =>
  data?.choices?.[0]?.message?.content?.trim() ?? ""

const sanitizeSummaryParagraphs = (content) =>
  content
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[\s>*#-]+/, "").trim())
    .filter(Boolean)
    .map(line => line.replace(/\*\*/g, '').replace(/\*/g, ''))

async function generateSummaryWithOpenRouter(transactions) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("Configurá la variable VITE_OPENROUTER_API_KEY para habilitar el análisis con IA.")
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  }

  if (OPENROUTER_REFERER) {
    headers["HTTP-Referer"] = OPENROUTER_REFERER
  }

  if (OPENROUTER_TITLE) {
    headers["X-Title"] = OPENROUTER_TITLE
  }

  const response = await fetch(DEFAULT_OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: DEFAULT_OPENROUTER_MODEL,
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content:
            "Actuá como un asesor financiero experto especializado en finanzas personales para usuarios en Argentina. Tu objetivo es proporcionar análisis claros, estructurados y fácilmente comprensibles que ayuden al usuario a tomar mejores decisiones financieras. Enfocate en insights prácticos y accionables basados exclusivamente en los datos proporcionados. Mantené un tono profesional pero cercano, evitando tecnicismos complejos.",
        },
        {
          role: "user",
          content: buildPrompt(transactions),
        },
      ],
    }),
  })

  if (!response.ok) {
    const rawText = await response.text()
    let parsed
    try {
      parsed = rawText ? JSON.parse(rawText) : null
    } catch {
      parsed = null
    }

    if (response.status === 402) {
      throw new Error(
        "OpenRouter informó saldo insuficiente. Recargá tu cuenta o asegurate de usar un modelo gratuito antes de volver a intentarlo."
      )
    }

    const apiMessage =
      parsed?.error?.message || (rawText ? rawText.slice(0, 180) : "Revisá la configuración e intentá nuevamente.")

    throw new Error(`OpenRouter respondió con un error (${response.status}). ${apiMessage}`)
  }

  const data = await response.json()
  const content = extractContentFromResponse(data)

  if (!content) {
    throw new Error("No recibimos contenido válido desde OpenRouter.")
  }

  return content
}

function FinancialSummary() {
  const [isOpen, setIsOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState("info")

  const summaryParagraphs = useMemo(() => sanitizeSummaryParagraphs(summary), [summary])

  const handleGenerateSummary = async () => {
    if (isLoading) return

    setStep("loading")
    setIsLoading(true)
    setError("")
    setSummary("")

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("No pudimos obtener los datos del usuario. Iniciá sesión nuevamente.")
      }

      const { data, error: txError } = await supabase
        .from("transactions")
        .select("id, description, amount, type, category, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (txError) {
        throw new Error("No pudimos recuperar tus transacciones para analizarlas.")
      }

      const sanitized = (data || []).map((tx) => ({
        id: tx.id,
        description: tx.description ?? "",
        category: tx.category ?? (tx.type === "income" ? "Ingreso" : "Gasto"),
        amount: Number(tx.amount) || 0,
        type: tx.type === "income" ? "income" : "expense",
        created_at: tx.created_at,
      }))

      if (sanitized.length === 0) {
        setSummary(
          "Todavía no registraste transacciones, por lo que no hay información para analizar. Registrá movimientos y volvé a intentarlo."
        )
        setStep("result")
        return
      }

      const summaryText = await generateSummaryWithOpenRouter(sanitized)
      setSummary(summaryText)
      setStep("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al generar el resumen")
      setStep("result")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div id="financial-summary" className="relative p-8 border border-white/60 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-primary/10 mt-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 rounded-3xl" />
        
        <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 size-24 bg-cyan-200/20 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary/80">Inteligencia Artificial</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a]">Análisis de Finanzas con IA</h3>
            </div>
            <p className="text-muted-foreground/80 text-sm max-w-2xl mx-auto">
              Obtén un análisis personalizado impulsado por inteligencia artificial que examina tus transacciones y te
              proporciona insights valiosos sobre tus patrones de gasto.
            </p>
          </div>

          {/* Sección informativa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            <div className="group flex gap-3 p-3 rounded-2xl bg-white/60 border border-white/50 hover:bg-white/80 transition-all duration-200">
              <div className="mt-1">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-start">Análisis de Tendencias</p>
                <p className="text-xs text-muted-foreground/70">Identifica patrones en tus gastos</p>
              </div>
            </div>
            <div className="group flex gap-3 p-3 rounded-2xl bg-white/60 border border-white/50 hover:bg-white/80 transition-all duration-200">
              <div className="mt-1">
                <AlertCircle className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-start">Recomendaciones</p>
                <p className="text-xs text-muted-foreground/70">Consejos personalizados para ahorrar</p>
              </div>
            </div>
            <div className="group flex gap-3 p-3 rounded-2xl bg-white/60 border border-white/50 hover:bg-white/80 transition-all duration-200">
              <div className="mt-1">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-start">Categorización</p>
                <p className="text-xs text-muted-foreground/70">Desglose detallado por categoría</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setIsOpen(true)
                setStep("info")
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-white font-semibold py-4 flex items-center gap-2 justify-center rounded-2xl cursor-pointer px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              size="lg"
            >
              <Sparkles className="mr-2 size-5" />
              Generar Resumen de mis Finanzas
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-primary/15 bg-white/95 shadow-[0_45px_120px_-35px_rgba(17,24,39,0.4)] backdrop-blur-xl custom-scrollbar">
          <div className="relative isolate flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white/92 to-primary/10" />
            <DialogHeader className="relative border-b border-primary/10 px-10 py-7">
              <DialogTitle className="flex items-center justify-between gap-3 text-2xl font-semibold text-[#111]">
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  Tu Análisis Financiero
                </span>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    IA Asistida
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full cursor-pointer border border-primary/20 bg-white/80 p-2 text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </DialogTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Obtené insights listos para accionar en base a tus movimientos más recientes.
              </p>
            </DialogHeader>

            <div className="relative px-10 pb-10 pt-7">
              {step === "info" && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        title: "Cobertura completa",
                        description: "Recorremos tus ingresos y gastos recientes para detectar patrones.",
                      },
                      {
                        title: "Alertas inteligentes",
                        description: "Identificamos desvíos y puntos de atención sin ruido innecesario.",
                      },
                      {
                        title: "Recomendaciones",
                        description: "Recibís sugerencias concretas para optimizar tus finanzas personales.",
                      },
                      {
                        title: "Contexto local",
                        description: "El análisis se adapta a tus categorías y a la forma en la que cargás tus datos.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm"
                      >
                        <h3 className="text-sm font-semibold text-[#111]">{item.title}</h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Tip:</span> Cuantas más transacciones registres, más
                    preciso será el resumen generado.
                  </div>

                  <button
                    onClick={handleGenerateSummary}
                    className="w-full rounded-2xl bg-gradient-to-r from-primary cursor-pointer via-primary/90 to-primary px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30"
                  >
                    <span className="inline-flex items-center justify-center gap-2 ">
                      <Sparkles className="size-4" />
                      Comenzar análisis ahora
                    </span>
                  </button>
                </div>
              )}

              {step === "loading" && (
                <FinancialSummarySkeleton />
              )}

              {step === "result" && (
                <div className="space-y-6">
                  {error ? (
                    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-destructive" />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-destructive">No pudimos generar el resumen</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{error}</p>
                          <button
                            type="button"
                            onClick={handleGenerateSummary}
                            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                          >
                            Intentar nuevamente
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="size-5 text-primary" />
                          <div>
                            <p className="text-sm font-semibold text-[#111]">Análisis completado con éxito</p>
                            <p className="text-xs text-muted-foreground">
                              Estas conclusiones se generaron a partir de tus últimos movimientos registrados.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {summaryParagraphs.map((paragraph, index) => (
                          <p key={index} className="rounded-2xl bg-white/90 px-4 py-3 text-sm leading-relaxed text-[#1f2933]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FinancialSummary
