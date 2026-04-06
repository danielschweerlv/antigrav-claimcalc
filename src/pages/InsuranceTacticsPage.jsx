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

const tactics = [
  {
    icon: 'person_off',
    title: 'Initial Lowball Offers',
    body: 'Some insurance companies may offer an initial settlement lower than expected. If you are facing financial pressure, you may feel pushed to accept early. Timing matters. An attorney can walk you through your options during a free consultation.',
  },
  {
    icon: 'local_hospital',
    title: 'Full Medical History Requests',
    body: "Insurance companies may review your medical history as part of evaluating a case. In some cases, prior medical records may be cited to suggest that certain symptoms existed before the accident. An attorney can help review these issues and provide guidance during a consultation.",
  },
  {
    icon: 'mic',
    title: 'Recorded Statement Coercion',
    body: 'Insurance companies may request a recorded statement early in the case process, sometimes soon after the accident. Providing a statement at that time may limit what you are able to add later. You may wish to speak with an attorney first so you can better understand the process before responding to insurance questions.',
  },
  {
    icon: 'do_not_disturb',
    title: 'Denying Cases',
    body: 'Some large insurance companies have faced public criticism and regulatory scrutiny over case practices. Consumers have alleged that valid cases were denied and that internal performance goals influenced case decisions. That is why understanding the case process matters. Talk to an attorney if you have questions about a denial.',
  },
  {
    icon: 'hourglass_empty',
    title: 'Delaying Cases',
    body: 'Many insurance companies take a long time to review and process cases, and delays can be frustrating. Some investigations have raised concerns about how long certain files stay pending. Understanding how timing affects your case helps you know what to ask an attorney during a consultation.',
  },
  {
    icon: 'help_outline',
    title: 'Confusing Language',
    body: "Insurance policies can contain complex, highly technical language that is hard to interpret. Several states have passed plain-language requirements to help. Even so, you may still have questions about your coverage. An attorney can review those questions with you during a free consultation.",
  },
]

export default function InsuranceTacticsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">

      {/* Nav */}
      

      <main className="pt-20 pb-24 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Page heading */}
          <AnimatedGroup variants={transitionVariants} className="text-center pt-12 pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 border border-error/20">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse flex-shrink-0" />
              <span className="text-xs font-label font-semibold text-error uppercase tracking-widest">Know Your Rights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-background leading-tight max-w-3xl mx-auto">
              Understand the Tactics Insurance Companies Use That May{' '}
              <span className="text-error italic">Impact Case Settlements</span>
            </h1>
            <p className="text-base lg:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Being informed about these common practices can help you make better decisions and know when to seek legal guidance.
            </p>
          </AnimatedGroup>

          {/* Tactics grid */}
          <AnimatedGroup
            variants={{ container: { visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } } }, item: transitionVariants.item }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {tactics.map((tactic, i) => (
              <div
                key={tactic.title}
                className="flex flex-col gap-4 p-6 lg:p-7 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-error/20 transition-colors duration-300 group"
              >
                {/* Icon badge */}
                <div className="w-12 h-12 rounded-full bg-error/15 border border-error/20 flex items-center justify-center flex-shrink-0 group-hover:bg-error/20 transition-colors">
                  <span
                    className="material-symbols-outlined text-error text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {tactic.icon}
                  </span>
                </div>

                {/* Text */}
                <div className="space-y-3">
                  <h2 className="text-lg font-headline font-bold text-on-background leading-snug">{tactic.title}</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{tactic.body}</p>
                </div>
              </div>
            ))}
          </AnimatedGroup>

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <div className="p-6 lg:p-10 rounded-2xl bg-primary/5 border border-primary/15 space-y-4 max-w-2xl mx-auto">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <h3 className="text-2xl lg:text-3xl font-headline font-bold text-on-background">
                Don't face these tactics alone.
              </h3>
              <p className="text-on-surface-variant text-sm lg:text-base max-w-md mx-auto">
                An attorney can help you navigate insurance company pressure and fight for the full compensation you are owed under Nevada law.
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
