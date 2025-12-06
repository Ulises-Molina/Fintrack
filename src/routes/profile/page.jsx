import { useEffect, useState } from "react"
import HeaderDashboard from "../../components/headerdashboard"
import { useAuth } from "../../hooks/useAuth"
import { supabase } from "../../lib/supabaseCliente"
import { Skeleton } from "../../components/ui/skeleton"


function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: null, message: "" })

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name ?? "")
      const savedAvatar = user.user_metadata?.avatar_url ?? ""
      setAvatarUrl(savedAvatar)
      setAvatarPreview(savedAvatar)
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setFeedback({ type: null, message: "" })

    try {
      let newAvatarUrl = avatarUrl

      if (avatarFile) {
        const extensionFromName = avatarFile.name.split(".").pop()
        const extensionFromType = avatarFile.type.split("/").pop()
        const fileExt = extensionFromName || extensionFromType || "png"
        const filePath = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath)

        if (!publicUrlData?.publicUrl) {
          throw new Error("No se pudo obtener la URL pública del avatar")
        }

        newAvatarUrl = publicUrlData.publicUrl
        setAvatarUrl(newAvatarUrl)
        setAvatarFile(null)
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          avatar_url: newAvatarUrl,
        },
      })

      if (updateError) {
        throw updateError
      }

      setFeedback({
        type: "success",
        message: "Perfil actualizado correctamente.",
      })

      if (!avatarFile) {
        setAvatarPreview(newAvatarUrl)
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message ?? "Ocurrió un error al actualizar el perfil. Intenta nuevamente.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No hay información de usuario disponible.</p>
      </div>
    )
  }

  const initials =
    user.user_metadata?.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "U"

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f7f8fc] via-white to-primary/10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" aria-hidden />
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl mt-24">
        <HeaderDashboard />

        <header className="mb-12 max-w-2xl text-center mx-auto">
          <p className="inline-flex items-center rounded-full  bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Perfil y preferencias
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111827]">
            Tu espacio personal en Fintrack
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Actualiza tu identidad visual y mantén tu información sincronizada.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 xl:grid-cols-[360px,minmax(0,1fr)] items-start"
        >
          <section className="group  relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-transform duration-500 group-hover:scale-110" aria-hidden />

            <div className="relative flex flex-col items-center gap-6 text-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar del usuario"
                  className="h-32 w-32 rounded-full border-4 border-white/70 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/70 bg-gradient-to-br from-primary/80 to-primary text-4xl font-semibold text-white shadow-lg">
                  {initials}
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[#0f172a]">Avatar</h2>
                <p className="text-sm text-muted-foreground">
                  Personaliza tu imagen para mantener una presencia consistente en el dashboard.
                </p>
              </div>

              <label className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-primary/90 hover:to-primary/70">
                Subir nueva imagen
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleAvatarChange}
                  disabled={saving}
                />
              </label>

              <ul className="w-full space-y-2 rounded-2xl border border-primary/10 bg-white/40 p-4 text-left text-xs text-muted-foreground backdrop-blur">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />Formate JPG, PNG o WEBP hasta 2 MB.
                </li>
                
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />Puedes reemplazar tu avatar cuantas veces quieras.
                </li>
              </ul>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="absolute -top-16 -left-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl" aria-hidden />

            <div className="relative space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#0f172a]">Información personal</h2>
                <p className="text-sm text-muted-foreground">
                  Los cambios se sincronizan automáticamente con tu perfil de Supabase.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <label htmlFor="name" className="text-sm font-medium text-[#0f172a]">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ej. Ana Gómez"
                    className="w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-[#0f172a] shadow-inner transition focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/20"
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-3">
                  <label htmlFor="email" className="text-sm font-medium text-[#0f172a]">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-2xl border border-white/50 bg-white/60 px-4 py-3 text-sm text-muted-foreground shadow-inner"
                  />
                </div>
              </div>

              {feedback.message && (
                <div
                  className={`relative overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium ${
                    feedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50/80 text-emerald-700"
                      : "border-red-200 bg-red-50/80 text-red-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" aria-hidden />
                  <span className="relative">{feedback.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Última actualización segura
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Guardando cambios..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}

export default ProfilePage
