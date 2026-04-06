import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedGroup } from '../components/ui/animated-group'

const transitionVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  },
}

const GUIDES = [
  {
    icon: 'balance',
    tag: 'Fault',
    title: 'Comparative Fault in Nevada',
    desc: 'What comparative fault means and how it affects your case.',
    path: '/your-rights',
  },
  {
    icon: 'checklist',
    tag: 'Steps',
    title: 'What to Do After an Accident',
    desc: 'The steps you should take right after an accident in Nevada.',
    path: '/how-it-works',
  },
  {
    icon: 'timer',
    tag: 'Deadline',
    title: "Nevada's 2-Year Deadline",
    desc: 'Why the 2-year statute of limitations matters for your case.',
    path: '/your-rights',
  },
  {
    icon: 'visibility',
    tag: 'Tactics',
    title: 'Insurance Tactics to Watch For',
    desc: 'The tricks insurers use and how to spot them.',
    path: '/insurance-tactics',
  },
  {
    icon: 'apartment',
    tag: 'Liability',
    title: 'Casino & Premise Liability',
    desc: "How liability works when an accident happens on someone's property.",
    path: '/your-rights',
  },
  {
    icon: 'local_hospital',
    tag: 'Medical',
    title: 'Medical Bills & Your Case',
    desc: 'How your medical costs factor into what your case is worth.',
    path: '/how-it-works',
  },
]

const TAG_COLORS = {
  Fault: { bg: 'rgba(164,230,255,0.12)', border: 'rgba(164,230,255,0.25)', text: '#a4e6ff' },
  Steps: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: '#4ADE80' },
  Deadline: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)', text: '#FB923C' },
  Tactics: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  Liability: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.25)', text: '#FACC15' },
  Medical: { bg: 'rgba(216,217,255,0.12)', border: 'rgba(216,217,255,0.25)', text: '#d8d9ff' },
}

export default function CaseGuidesPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-transparent">
      <main className="relative z-10 pt-[58px]">

        {/* Hero Header */}
        <section className="px-4 lg:px-8 pt-16 lg:pt-24 pb-8 lg:pb-12">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-background">
              Nevada <span className="text-primary italic">Case Guides</span>
            </h1>
            <p className="text-on-surface-variant text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
              Straightforward guides on fault rules, deadlines, and how Nevada law affects your injury case.
            </p>
          </motion.div>
        </section>

        {/* 6-Card Grid */}
        <section className="px-4 lg:px-8 py-10 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={transitionVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
            >
              {GUIDES.map(({ icon, tag, title, desc, path }) => {
                const colors = TAG_COLORS[tag]
                return (
                  <div
                    key={title}
                    className="group p-5 rounded-xl border border-white/[0.06] hover:border-primary/20 transition-all duration-300 flex flex-col gap-3 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    onClick={() => { window.scrollTo(0, 0); navigate(path) }}
                  >
                    {/* Icon + Tag row */}
                    <div className="flex items-center justify-between">
                      <span
                        className="material-symbols-outlined text-2xl text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {icon}
                      </span>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      >
                        {tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-headline font-bold text-on-background group-hover:text-primary transition-colors leading-snug">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-on-surface-variant leading-relaxed flex-1">
                      {desc}
                    </p>

                    {/* Read Guide link */}
                    <div className="flex items-center gap-1 text-sm font-headline font-semibold text-primary mt-auto pt-2 border-t border-white/[0.06]">
                      Read Guide
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
                    </div>
                  </div>
                )
              })}
            </AnimatedGroup>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 lg:py-24 px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <h2 className="text-2xl lg:text-4xl font-headline font-bold text-on-background">
              Ready to see what your case is worth?
            </h2>
            <p className="text-on-surface-variant text-base lg:text-lg">
              Get a free, personalized estimate in about two minutes.
            </p>
            <button
              onClick={() => navigate('/calculator')}
              className="cta-gradient cta-shimmer text-on-primary-fixed px-10 py-5 rounded-[16px] font-headline font-bold text-lg inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.2)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
            >
              Get My Free Estimate
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
            </button>
          </motion.div>
        </section>

      </main>
    </div>
  )
}
