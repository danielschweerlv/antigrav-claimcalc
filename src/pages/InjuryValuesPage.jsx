import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import InjuryValuesSection from '../components/InjuryValuesSection'

export default function InjuryValuesPage() {
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
              Injury Values <span className="text-primary italic">in Nevada</span>
            </h1>
            <p className="text-on-surface-variant text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
              Here's what different injury types are worth in Nevada car accident cases based on recent court data and settlements.
            </p>
          </motion.div>
        </section>

        {/* Existing InjuryValuesSection */}
        <InjuryValuesSection />

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
