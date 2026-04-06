import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    icon: 'analytics',
    title: 'Built on Real Nevada Data',
    body: 'Your estimate pulls from actual Nevada settlement records, court outcomes, and insurance payouts. Not national averages. Not guesses.',
  },
  {
    icon: 'gavel',
    title: 'Know Before You Decide',
    body: 'Insurance adjusters already have a number in mind. Now you do too. See what your case may be worth before you sign anything or take a call.',
  },
  {
    icon: 'lock',
    title: 'Free and Completely Private',
    body: 'No account. No credit card. No recorded statement. Your answers stay encrypted and are never shared without your permission.',
  },
  {
    icon: 'person_search',
    title: 'Attorney Match If You Need One',
    body: 'If your results show your case has real value, we can connect you with a Nevada attorney who handles cases like yours. The call is free.',
  },
]

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.25, duration: 1.3 },
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
}

export default function WhatIsSection() {
  const navigate = useNavigate()

  return (
    <section
      style={{ backgroundColor: '#0D0D0D' }}
      className="py-20 lg:py-28 px-4 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
        >
          <h2
            className="font-headline font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
          >
            What is ClaimCalculator.ai?
          </h2>
          <p
            className="mx-auto"
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '600px',
            }}
          >
            It's a free AI tool built for Nevada drivers. Answer a few questions about your accident and get a real estimate of what your case may be worth — before you talk to an adjuster or sign anything.
          </p>
        </motion.div>

        {/* ── 2×2 Feature Grid ────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {FEATURES.map(({ icon, title, body }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="flex flex-col gap-4 p-7 rounded-xl border transition-all duration-300 hover:border-primary/25 group"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(164,230,255,0.10)' }}
              >
                <span
                  className="material-symbols-outlined text-primary text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
              </div>
              <h4 className="font-headline font-bold text-white text-lg leading-tight">
                {title}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div className="text-center">
          <button
            onClick={() => navigate('/calculator')}
            className="cta-gradient cta-shimmer text-on-primary-fixed px-8 py-4 rounded-[16px] font-headline font-bold text-base inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.15)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
          >
            See What Your Case Is Worth
            <span
              className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              arrow_forward
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}
