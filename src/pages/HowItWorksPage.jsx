import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedGroup } from '../components/ui/animated-group'

const transitionVariants = {
  container: { visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { type: 'spring', bounce: 0.3, duration: 1.5 } },
  },
}

const steps = [
  {
    num: '01',
    icon: 'calculate',
    title: 'Learn What Your Case Could Be Worth',
    body: 'Answer a few simple questions about your auto accident online. Our AI cross-references real Nevada settlement data to give you an accurate estimate in under 2 minutes.',
    cta: null,
  },
  {
    num: '02',
    icon: 'phone_in_talk',
    title: 'Speak with Our Team Over the Phone',
    body: "Verify your accident details and case information with our representatives over the phone. We'll confirm your estimate and walk you through your legal options at no cost.",
    cta: null,
  },
  {
    num: '03',
    icon: 'description',
    title: 'Get a Copy of Your Accident Report',
    body: 'Learn how to obtain your accident report. Insurance carriers will ask for it when you file a case, and having it early strengthens your case significantly.',
    cta: null,
  },
  {
    num: '04',
    icon: 'gavel',
    title: 'Connect with an Auto Accident Attorney',
    body: 'Talk to an attorney who can discuss your situation and the factors that could affect your potential compensation. No upfront fees. You only pay if you win.',
    cta: null,
  },
]

export default function HowItWorksPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">

      {/* Nav */}
      

      <main className="pt-20 pb-24 px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Page heading */}
          <AnimatedGroup variants={transitionVariants} className="text-center pt-12 pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">The Process</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-on-background leading-tight">
              How Our Service <span className="text-primary italic">Works</span>
            </h1>
            <p className="text-base lg:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              From your first question to connecting with a Nevada attorney, here's exactly what happens and why it matters.
            </p>
          </AnimatedGroup>

          {/* Steps */}
          <AnimatedGroup
            variants={{ container: { visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } }, item: transitionVariants.item }}
            className="space-y-4 lg:space-y-6"
          >
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="relative flex flex-col sm:flex-row gap-6 p-6 lg:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 overflow-hidden group hover:border-primary/20 transition-colors duration-300"
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-6 text-7xl font-headline font-black text-outline/8 select-none pointer-events-none leading-none">
                  {step.num}
                </span>

                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 pr-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-label font-bold text-primary uppercase tracking-widest">Step {step.num}</span>
                    {i === 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20">Start here</span>
                    )}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-headline font-bold text-on-background leading-snug">{step.title}</h2>
                  <p className="text-on-surface-variant leading-relaxed text-sm lg:text-base">{step.body}</p>
                </div>
              </div>
            ))}
          </AnimatedGroup>

          {/* Connector line visual (desktop) */}

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <div className="p-6 lg:p-10 rounded-2xl bg-primary/5 border border-primary/15 space-y-4 max-w-2xl mx-auto">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              <h3 className="text-2xl lg:text-3xl font-headline font-bold text-on-background">
                Ready to find out what your case is worth?
              </h3>
              <p className="text-on-surface-variant text-sm lg:text-base max-w-md mx-auto">
                It takes under 2 minutes, costs nothing, and could be worth thousands more in your pocket.
              </p>
              <button
                onClick={() => navigate('/calculator')}
                className="cta-gradient text-on-primary-fixed w-full sm:w-auto px-8 py-4 rounded-xl font-headline font-bold text-base inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.2)] hover:shadow-[0_0_45px_rgba(164,230,255,0.35)] active:scale-95 transition-all duration-200 group"
              >
                Get My Free Estimate
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <p className="text-xs text-outline">No cost. No commitment. SSL encrypted.</p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
