import { ArrowRight, TrendingUp, PieChart, Bell, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

function Hero() {
    const heroContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    }

    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    }

    return (
        <>
        <motion.section
          className="relative isolate w-full overflow-hidden py-24 md:py-32 after:absolute after:inset-x-0 after:bottom-0 after:h-20 after:bg-gradient-to-b after:from-transparent after:via-white/70 after:to-white after:pointer-events-none"
          id="hero"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroContainer}
        >
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-white via-slate-50 to-primary/10" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(19,121,139,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(19,121,139,0.12),transparent_55%)]" />
        <div className="absolute -top-40 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-48 left-1/4 -z-10 h-[22rem] w-[22rem] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 text-[#222]">
        <motion.div className="max-w-4xl mx-auto text-center space-y-8" variants={heroContainer}>
          <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium" variants={fadeUp}>
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Controla tus finanzas de forma inteligente
          </motion.div>

          <motion.h1 className="text-5xl md:text-8xl text-pr font-bold tracking-tight text-balance" variants={fadeUp}>
            Gestiona tus gastos con <span className="text-primary">claridad total</span>
          </motion.h1>

          <motion.p className="text-xl text-muted-foreground max-w-2xl text-[#777] mx-auto text-balance leading-relaxed" variants={fadeUp}>
            Toma el control de tus finanzas personales con herramientas intuitivas, visualizaciones claras y análisis en
            tiempo real.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" variants={fadeUp}>
            <motion.button
              size="lg"
              className="flex text-base h-12 px-8 bg-primary text-[#ededed] py-2 rounded-xl hover:bg-primary/80 cursor-pointer font-bold"
              asChild
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/dashboard" className="flex items-center">
                Comenzar gratis ahora
                <ArrowRight className="ml-2 mt-[2px] size-4" />
              </Link>
            </motion.button>
          </motion.div>

          <motion.div className="pt-8 text-sm text-muted-foreground text-[#777]" variants={fadeUp}>
            Sin tarjeta de crédito • Gratis para siempre • Configuración en 2 minutos
          </motion.div>
        </motion.div>
        </div>

        <motion.div
          className="absolute left-8 top-40 hidden w-60 rounded-2xl bg-white/80 p-4 text-left shadow-xl shadow-primary/10 backdrop-blur-md md:block"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: [0, -15, 0], 
            scale: 1 
          }}
          whileHover={{ y: -20, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.9, 
            ease: [0.22, 1, 0.36, 1],
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="flex items-center gap-3 text-primary">
            <TrendingUp className="size-5" />
            <span className="text-sm font-semibold">Progreso mensual</span>
          </div>
          <p className="mt-3 text-xs text-[#555]">Tus gastos bajaron un 18% en comparación al mes pasado.</p>
        </motion.div>

        <motion.div
          className="absolute right-6 bottom-36 hidden w-64 rounded-3xl bg-primary text-white/95 p-5 shadow-2xl shadow-primary/20 backdrop-blur-md md:block"
           initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: [0, -12, 0], 
            scale: 1 
          }}
          whileHover={{ y: -18, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.9, 
            ease: [0.22, 1, 0.36, 1],
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        >
          <div className="flex items-center gap-3">
            <PieChart className="size-5" />
            <span className="text-sm font-semibold">Resumen inteligente</span>
          </div>
          <p className="mt-3 text-xs text-white/80">
            Distribución optimizada de tus categorías para mantener un ahorro constante.
          </p>
        </motion.div>

        <motion.div
          className="absolute right-16 top-24 hidden rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-medium text-[#2f2f2f] backdrop-blur-lg md:flex items-center gap-3"
           initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0], 
            scale: 1 
          }}
          whileHover={{ y: -16, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.9, 
            ease: [0.22, 1, 0.36, 1],
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        >
          <Bell className="size-4 text-primary" />
          Alertas inteligentes activadas
        </motion.div>
      </motion.section>
        </>
    )
}

export default Hero