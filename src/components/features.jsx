
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"



function Features() {
    const MotionSection = motion.section
    const MotionDiv = motion.div
    const MotionHeading2 = motion.h2
    const MotionParagraph = motion.p
    const MotionButton = motion.button

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    }

    return(
        <MotionSection
        className="relative isolate w-full overflow-hidden py-24 before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-white before:via-white/70 before:to-transparent before:content-[''] before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-28 after:bg-gradient-to-b after:from-transparent after:via-white/75 after:to-white after:content-[''] after:pointer-events-none"
        id="benefits"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } } }}
      >
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(19,121,139,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(19,121,139,0.1),transparent_55%)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-3xl" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <MotionDiv className="relative rounded-3xl bg-primary p-12 md:p-16 text-center text-[#efefef] shadow-xl shadow-primary/20"
          variants={fadeIn}
          whileHover={{ y: -8 }}
        >
          <MotionHeading2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance" variants={fadeIn}>
            Comienza a controlar tus finanzas hoy
          </MotionHeading2>
          <MotionParagraph className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto" variants={fadeIn}>
            Únete a miles de usuarios que ya están tomando mejores decisiones financieras
          </MotionParagraph>
          <MotionButton
            className="text-[#333] h-12 px-8 bg-[#efefef] border-[#efefef] border-2 rounded-xl cursor-pointer"
            asChild
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <a href="/register" className="flex items-center gap-2">
              Crear cuenta gratis
              <ArrowRight className="ml-2 size-4" />
            </a>
          </MotionButton>
        </MotionDiv>
        </div>
      </MotionSection>
    )
}

export default Features
