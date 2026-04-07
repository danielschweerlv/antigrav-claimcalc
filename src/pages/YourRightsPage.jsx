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

const rights = [
  {
    icon: 'gavel',
    num: '01',
    title: 'You Can Hire an Attorney Before You Speak to Anyone',
    summary: 'Get legal advice first. It costs you nothing upfront.',
    body: 'You have the right to hire an attorney before talking to any insurance adjuster. Nevada law does not require you to speak to the other driver\'s insurance company without one. Getting legal advice first costs you nothing upfront. Most personal injury attorneys work on contingency.',
    tag: 'Representation',
  },
  {
    icon: 'mic_off',
    num: '02',
    title: 'You Do Not Have to Give a Recorded Statement',
    summary: 'You are not legally required to give one.',
    body: 'The opposing insurance company may ask for a recorded statement to "process your case." You are not legally required to give one. Saying the wrong thing, even unintentionally, can reduce your payout. Decline politely. Consult an attorney first.',
    tag: 'Recorded Statement',
  },
  {
    icon: 'request_page',
    num: '03',
    title: 'You Can Request the At-Fault Driver\'s Policy Limits',
    summary: 'Know what is actually available for your case.',
    body: 'Under Nevada law, you can request the at-fault driver\'s insurance policy limits in writing. If the insurer has reasonable notice of your case, they must respond within 30 days. Knowing the policy limits helps you understand what is actually available for your case.',
    tag: 'Policy Limits',
  },
  {
    icon: 'timer',
    num: '04',
    title: 'Insurers Must Handle Your Case on a Timeline',
    summary: 'Dragging their feet may be a violation.',
    body: 'Nevada Administrative Code 686A requires insurance companies to acknowledge your case within 10 working days of notice. They must also accept or deny your case within 30 working days of receiving proof of loss. If they are dragging their feet, that may be a violation.',
    tag: 'Timeline',
  },
  {
    icon: 'undo',
    num: '05',
    title: 'A Denial Is Not the Final Word',
    summary: 'You have options when your case is denied.',
    body: 'If your case is denied, you have the right to request a written explanation. You can dispute the denial directly with the insurer. You can also file a complaint with the Nevada Division of Insurance. A denial does not mean you have no options.',
    tag: 'Appeals',
  },
  {
    icon: 'paid',
    num: '06',
    title: 'Nevada Law Allows You to Recover More Than Just Medical Bills',
    summary: 'Know the full scope of what you can recover.',
    body: 'Nevada law allows recovery for medical bills, lost wages, future medical expenses, pain and suffering, and loss of enjoyment of life. You do not have to accept a settlement that only covers your immediate bills. Know the full scope of what you can recover before you settle.',
    tag: 'Full Recovery',
  },
]

export default function YourRightsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">

      {/* Nav */}
      

      <main className="pt-20 pb-24 px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Page heading */}
          <AnimatedGroup variants={transitionVariants} className="text-center pt-12 pb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse flex-shrink-0" />
              <span className="text-xs font-label font-semibold text-tertiary uppercase tracking-widest">Nevada Policyholder Rights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline text-on-background leading-tight max-w-3xl mx-auto">
              Your Rights as an Injured Person in{' '}
              <span className="text-tertiary italic">Nevada</span>
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Nevada law gives you specific rights as an injured person. Most people do not know these rights exist. The insurance company is counting on that. Here is what you are actually entitled to.
            </p>
          </AnimatedGroup>

          {/* Nevada law source callout */}
          <div className="mb-12 p-5 lg:p-6 rounded-2xl border border-tertiary/20 bg-tertiary/5 flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-tertiary/15 border border-tertiary/25 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>balance</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-label font-bold text-tertiary uppercase tracking-widest">Based on Nevada Law</p>
              <p className="text-sm text-on-surface font-medium leading-relaxed">
                These rights come from Nevada statutes, administrative codes, and established case law.
              </p>
              <p className="text-xs text-outline leading-relaxed">
                Knowing your rights changes how you handle adjusters, deadlines, and settlement offers.
              </p>
            </div>
          </div>

          {/* Rights list */}
          <AnimatedGroup
            variants={{ container: { visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }, item: transitionVariants.item }}
            className="space-y-4"
          >
            {rights.map((right, i) => (
              <div
                key={right.num}
                className="flex flex-col sm:flex-row gap-5 lg:gap-8 p-6 lg:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/20 transition-colors duration-300 group relative overflow-hidden"
              >
                {/* Watermark number */}
                <span className="absolute top-4 right-6 text-7xl font-headline font-black text-outline/8 select-none pointer-events-none leading-none">{right.num}</span>

                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:bg-tertiary/15 transition-colors">
                  <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{right.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 pr-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-label font-bold text-tertiary uppercase tracking-widest">Right {right.num}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/10 text-outline uppercase tracking-widest">{right.tag}</span>
                  </div>
                  <h2 className="text-lg lg:text-xl font-headline text-on-background leading-snug">{right.title}</h2>
                  <p className="text-sm text-primary font-semibold italic">{right.summary}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{right.body}</p>
                </div>
              </div>
            ))}
          </AnimatedGroup>

          {/* Disclaimer */}
          <p className="mt-8 text-[11px] text-outline leading-relaxed text-center max-w-3xl mx-auto">
            The information on this page is for general educational purposes only and does not constitute legal advice. Consult a licensed Nevada attorney for advice specific to your situation.
          </p>

          {/* Bottom CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <div className="p-6 lg:p-10 rounded-2xl bg-primary/5 border border-primary/15 space-y-4 max-w-2xl mx-auto">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>balance</span>
              <h3 className="text-2xl lg:text-3xl font-headline text-on-background">
                Knowledge is your first line of defense.
              </h3>
              <p className="text-on-surface-variant text-sm lg:text-base max-w-md mx-auto">
                Start by understanding what your case is actually worth — before you speak to a single insurance adjuster.
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
