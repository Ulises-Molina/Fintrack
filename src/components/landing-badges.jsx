import { BarChart3, Wallet, CalendarCheck, PieChart } from "lucide-react"
import { motion } from "motion/react"

const badges = [
  {
    icon: BarChart3,
    title: "Dashboards claros",
    description: "Visualiza tus ingresos, gastos y objetivos con gráficos dinámicos y filtros inteligentes.",
  },
  {
    icon: Wallet,
    title: "Control de presupuestos",
    description: "Define límites por categoría y recibe alertas cuando estás por excederte.",
  },
  {
    icon: CalendarCheck,
    title: "Recordatorios automáticos",
    description: "Programa pagos recurrentes y evita cargos extras con notificaciones oportunas.",
  },
  {
    icon: PieChart,
    title: "Análisis por segmentos",
    description: "Compara períodos y detecta tendencias para tomar decisiones con mayor confianza.",
  },
]

const MotionSection = motion.section
const MotionDiv = motion.div
const MotionArticle = motion.article
const MotionParagraph = motion.p
const MotionHeading2 = motion.h2
const MotionHeading3 = motion.h3

function LandingBadges() {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const fadeCard = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <MotionSection
      className="relative isolate w-full overflow-hidden py-16 sm:py-18 before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-white before:via-white/70 before:to-transparent before:content-[''] before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-24 after:bg-gradient-to-b after:from-transparent after:via-white/80 after:to-white after:content-[''] after:pointer-events-none"
      id="features"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={container}
    >
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(19,121,139,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(19,121,139,0.1),transparent_55%)]" />
      <div className="absolute -top-36 right-1/4 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="container mx-auto max-w-6xl px-4">
      <MotionDiv className="mx-auto mb-12 max-w-2xl text-center" variants={fadeInUp}>
        <MotionParagraph
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-sm font-medium text-primary"
          variants={fadeInUp}
        >
          Funcionalidades clave
        </MotionParagraph>
        <MotionHeading2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1e1e1e] sm:text-4xl" variants={fadeInUp}>
          Todo lo que necesitas para simplificar tus finanzas
        </MotionHeading2>
      </MotionDiv>

      <MotionDiv className="grid gap-6 sm:grid-cols-2" variants={container}>
        {badges.map(({ icon, title, description }) => {
          const Icon = icon

          return (
            <MotionArticle
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-lg shadow-primary/5 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/20"
              variants={fadeCard}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <MotionDiv
                className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <MotionDiv className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary" variants={fadeInUp}>
                <Icon className="size-6" />
              </MotionDiv>
              <MotionHeading3 className="text-lg font-semibold text-[#1f1f1f]" variants={fadeInUp}>
                {title}
              </MotionHeading3>
              <MotionParagraph className="mt-2 text-sm leading-6 text-[#666]" variants={fadeInUp}>
                {description}
              </MotionParagraph>
            </MotionArticle>
          )
        })}
      </MotionDiv>
      </div>
    </MotionSection>
  )
}

export default LandingBadges
