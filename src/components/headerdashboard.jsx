import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { useAuth } from "../hooks/useAuth"
import { supabase } from "../lib/supabaseCliente"
import LoadingIndicator from "./ui/loading-indicator"

const DEFAULT_EXPENSE_CATEGORIES = [
  "Alimentación",
  "Vivienda",
  "Entretenimiento",
  "Transporte",
  "Servicios",
  "Salud",
  "Educación",
  "Otros",
]

const DEFAULT_INCOME_CATEGORIES = ["Salario", "Otros"]

const normalizeCategory = (value) =>
  value
    ?.toString()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()

const mergeUniqueCategories = (base = [], additions = []) => {
  const result = []
  const extras = []
  const seen = new Set()

  const tryAdd = (item, target) => {
    const trimmed = item?.trim()
    if (!trimmed) return

    const normalized = normalizeCategory(trimmed)
    if (!normalized || seen.has(normalized)) return

    seen.add(normalized)
    target.push(trimmed)
  }

  base.forEach((item) => tryAdd(item, result))
  additions.forEach((item) => tryAdd(item, extras))

  return [...result, ...extras.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))]
}

function HeaderDashboard({ onTransactionSaved, isDialogOpen, setIsDialogOpen }) {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [categoriesError, setCategoriesError] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryError, setNewCategoryError] = useState("")
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const userInitial =
    (user?.user_metadata?.name?.charAt(0)?.toUpperCase()) ||
    (user?.email?.charAt(0)?.toUpperCase()) ||
    "U"

  const avatarUrl = user?.user_metadata?.avatar_url
  const hasAvatar = Boolean(avatarUrl)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const fetchCategories = useCallback(
    async (type) => {
      if (!user) return

      setIsLoadingCategories(true)
      setCategoriesError("")

      const defaults =
        type === "income" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES

      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("category", { distinct: true })
          .eq("user_id", user.id)
          .eq("type", type)
          .not("category", "is", null)
          .neq("category", "")
          .order("category")

        if (error) {
          throw error
        }

        const dbCategories = (data || []).map((item) => item.category).filter(Boolean)
        const merged = mergeUniqueCategories(defaults, dbCategories)

        setCategories(merged)
        setCategory((prev) => {
          if (prev && merged.includes(prev)) {
            return prev
          }
          return merged[0] ?? ""
        })
      } catch {
        setCategoriesError("No se pudieron cargar las categorías")
        const fallback = mergeUniqueCategories(defaults)
        setCategories(fallback)
        setCategory((prev) => {
          if (prev && fallback.includes(prev)) {
            return prev
          }
          return fallback[0] ?? ""
        })
      } finally {
        setIsLoadingCategories(false)
      }
    },
    [user]
  )

  useEffect(() => {
    if (!isDialogOpen) {
      setIsAddingCategory(false)
      setNewCategory("")
      setNewCategoryError("")
      return
    }

    fetchCategories(transactionType)
  }, [isDialogOpen, transactionType, fetchCategories])

  const handleStartAddCategory = () => {
    setIsAddingCategory(true)
    setNewCategory("")
    setNewCategoryError("")
  }

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false)
    setNewCategory("")
    setNewCategoryError("")
  }

  const handleSaveNewCategory = () => {
    const trimmed = newCategory.trim()

    if (!trimmed) {
      setNewCategoryError("Ingresá un nombre válido")
      return
    }

    const normalizedNew = normalizeCategory(trimmed)
    const exists = categories.some((item) => normalizeCategory(item) === normalizedNew)

    if (exists) {
      setNewCategoryError("La categoría ya existe")
      return
    }

    setCategories((prev) => mergeUniqueCategories(prev, [trimmed]))
    setCategory(trimmed)
    setIsAddingCategory(false)
    setNewCategory("")
    setNewCategoryError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user) return

    if (!category) {
      setCategoriesError("Seleccioná una categoría")
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      // acá podrías mostrar un toast o un error en pantalla
      return
    }

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        amount: parsedAmount,
        type: transactionType, // "income" | "expense"
        category,
        description,
      },
    ])
    

    if (error) {
      return
    }

    if (typeof onTransactionSaved === "function") {
      onTransactionSaved()
    }

    await fetchCategories(transactionType)

    // limpiar formulario
    setTransactionType("expense")
    setDescription("")
    setAmount("")
    setCategory("")
    setIsDialogOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/40 bg-white/60 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center">
            <div className="relative flex items-center justify-center rounded-2xl p-2">
              <img src="/logo3.png" alt="logo" className="h-12" />
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 text-sm font-medium text-[#3a3a3a] lg:flex">
          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary"
          >
            Escritorio
          </Link>
          <Link
            to="/transactions"
            className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary"
          >
            Transacciones
          </Link>
          <a
            href="/dashboard#financial-summary"
            className="rounded-full px-4 py-2 transition hover:bg-primary/10 hover:text-primary"
          >
            Resumen con IA
          </a>
        </nav>

        <div className="flex items-center gap-3 text-sm font-semibold" ref={menuRef}>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="hidden sm:inline-flex items-center rounded-xl cursor-pointer bg-primary px-4 py-2 text-white shadow-sm shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/80"
          >
            Nueva transacción
          </button>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl cursor-pointer bg-primary text-white shadow-sm shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/80"
            aria-label="Nueva transacción"
          >
            <span className="text-lg font-bold">+</span>
          </button>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-primary/20 bg-white/70 text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 ${
              hasAvatar ? "overflow-hidden p-0" : "font-bold"
            }`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            {hasAvatar ? (
              <img src={avatarUrl} alt="Avatar del usuario" className="h-full w-full object-cover" />
            ) : (
              userInitial
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-10 top-12 w-48 rounded-xl border border-primary/20 bg-white/95 py-2 text-sm text-[#333] shadow-lg shadow-primary/20">
              <Link
                to="/profile"
                className="block w-full px-4 py-2 text-left transition hover:bg-primary/5 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full bg-transparent px-4 py-2 text-left transition hover:bg-primary/5 hover:text-primary"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="max-w-lg bg-white/70 p-3 sm:p-6 rounded-2xl w-[90vw] sm:w-full mx-auto max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-semibold text-[#111]">
              <span className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                $
              </span>
              Nueva transacción
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-3 sm:mt-6 space-y-3 sm:space-y-6">
            <section className="rounded-2xl border border-primary/10 bg-gradient-to-r from-white via-white to-primary/5 px-2 sm:px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-3 text-sm font-medium text-[#333]">
                <span className="text-center sm:text-left">Tipo de movimiento</span>
                <div className="flex items-center justify-center sm:justify-start gap-2 rounded-xl bg-white/70 p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setTransactionType("expense")}
                    className={`rounded-lg px-4 py-2 sm:px-3 sm:py-1 text-xs font-semibold transition ${
                      transactionType === "expense"
                        ? "bg-primary text-white shadow"
                        : "text-muted-foreground hover:text-[#222]"
                    }`}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType("income")}
                    className={`rounded-lg px-4 py-2 sm:px-3 sm:py-1 text-xs font-semibold transition ${
                      transactionType === "income"
                        ? "bg-primary text-white shadow"
                        : "text-muted-foreground hover:text-[#222]"
                    }`}
                  >
                    Ingreso
                  </button>
                </div>
              </div>
            </section>

            <div className="grid gap-4">
              <label className="space-y-1">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Descripción
                </span>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-transparent bg-white/85 px-3 sm:px-4 py-3 text-sm shadow-inner shadow-white/50 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ej: Compra en supermercado"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Monto
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary/70">
                    $
                  </span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-transparent bg-white/85 px-8 sm:px-10 py-3 text-sm shadow-inner shadow-white/50 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0.00"
                  />
                </div>
              </label>

              <div className="space-y-3">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Categoría
                </span>
                {isLoadingCategories ? (
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-white/70 p-4 text-center text-sm text-muted-foreground">
                    Cargando categorías...
                  </div>
                ) : categories.length > 0 ? (
                  <div className="rounded-2xl border border-primary/10 bg-white/70 p-3 shadow-inner">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 max-h-40 sm:max-h-36 overflow-y-auto pr-1">
                      {categories.map((item) => {
                        const isSelected = category === item
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setCategory(item)}
                            className={`rounded-xl px-2 py-3 sm:px-3 sm:py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 justify-center items-center min-h-[44px] sm:min-h-[auto] ${
                              isSelected
                                ? "bg-primary text-white shadow"
                                : "bg-white/80 text-[#333] border border-transparent hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-white/70 p-4 text-center text-sm text-muted-foreground">
                    Aún no registraste categorías. Podés crear una nueva abajo.
                  </div>
                )}
                {categoriesError && (
                  <p className="text-sm text-red-600">{categoriesError}</p>
                )}

                <div className="pt-1">
                  {isAddingCategory ? (
                    <div className="space-y-2 rounded-2xl border border-primary/10 bg-white/80 p-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(event) => {
                            setNewCategory(event.target.value)
                            setNewCategoryError("")
                          }}
                          className="flex-1 rounded-xl border border-transparent bg-white px-3 py-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25"
                          placeholder="Nombre de la nueva categoría"
                        />
                        <div className="flex gap-2 sm:gap-2">
                          <button
                            type="button"
                            onClick={handleSaveNewCategory}
                            className="flex-1 sm:flex-none rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/85 min-h-[44px]"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelAddCategory}
                            className="flex-1 sm:flex-none rounded-xl border border-[#11111133] px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-white min-h-[44px]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                      {newCategoryError && (
                        <p className="text-sm text-red-600">{newCategoryError}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartAddCategory}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/10"
                    >
                      <span className="text-base leading-none">+</span>
                      Crear nueva categoría
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-full rounded-2xl border border-[#1111111a] bg-white/70 px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-white/90 sm:w-auto min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:shadow-xl sm:w-auto min-h-[44px]"
              >
                Guardar transacción
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default HeaderDashboard
