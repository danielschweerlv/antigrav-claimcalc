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
    icon: 'verified_user',
    num: '01',
    title: 'Right to Have Your Valid Claim Honored',
    summary: 'Claim denials should reflect the facts — not internal performance goals.',
    body: 'According to the AAJ report, some insurers have allegedly denied valid claims and implemented internal performance metrics tied to claim denials. If your claim was denied without a clear, documented reason, you have the right to challenge that decision with the help of a licensed attorney.',
    tag: 'Claim Denial',
  },
  {
    icon: 'timer',
    num: '02',
    title: 'Right to Timely Claims Processing',
    summary: 'You should not be financially harmed by deliberate delays.',
    body: "Many insurance companies have been reported to take significant time to review and process claims. Some investigations suggest these delays are not always accidental. Nevada law sets expectations for how quickly insurers must acknowledge and act on claims — you have the right to hold them to that standard.",
    tag: 'Claims Delay',
  },
  {
    icon: 'menu_book',
    title: 'Right to Clear, Understandable Policy Terms',
    num: '03',
    summary: "Complexity is not an excuse — you deserve to understand what you paid for.",
    body: "Insurance policies can contain highly technical language that few consumers can interpret without assistance. Several states have enacted 'plain-language' requirements to help address this. An attorney can review your policy and explain exactly what coverage you're entitled to before the insurer tells you otherwise.",
    tag: 'Policy Language',
  },
  {
    icon: 'credit_score',
    num: '04',
    title: 'Right to Know How Your Premiums Are Determined',
    summary: 'Your credit score can affect your insurance — and you may not know it.',
    body: 'Some insurers use credit-based scoring to influence your premiums and insurability, even when it has no direct connection to your driving record or accident history. You have the right to understand why you are being charged what you are — and to dispute factors that seem unfair or unrelated to your risk profile.',
    tag: 'Credit Scoring',
  },
  {
    icon: 'cancel',
    num: '05',
    title: 'Right to Policy Security When You Need It Most',
    summary: "Filing a claim shouldn't put your coverage at risk.",
    body: "Some insurers have been known to rescind (cancel) policies under certain circumstances when claim costs increase. While insurers have limited legal grounds to do this, it can leave claimants in a vulnerable position at exactly the wrong moment. An attorney can help you understand whether a rescission is legally justified.",
    tag: 'Rescission',
  },
  {
    icon: 'policy',
    num: '06',
    title: 'Right to Continued Coverage Without Retaliation',
    summary: 'Asking questions about your policy should not cost you your coverage.',
    body: "The AAJ report highlights cases where insurers have chosen not to renew policies in the period following a claim inquiry — even before a formal claim was filed. In Nevada, this type of retaliation may be actionable. You have the right to ask questions without fear of losing your coverage.",
    tag: 'Non-Renewal',
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
              <span className="text-xs font-label font-semibold text-tertiary uppercase tracking-widest">Nevada Claimant Rights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-background leading-tight max-w-3xl mx-auto">
              Understand the Tactics Insurance Companies Use That May{' '}
              <span className="text-tertiary italic">Impact Claim Settlements</span>
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              The following rights are drawn from documented research and industry analysis. Knowing them can change the outcome of your claim.
            </p>
          </AnimatedGroup>

          {/* AAJ Source callout */}
          <motion.div
            className="mb-12 p-5 lg:p-6 rounded-2xl border border-tertiary/20 bg-tertiary/5 flex flex-col sm:flex-row gap-4 items-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2, delay: 0.5 }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-tertiary/15 border border-tertiary/25 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-label font-bold text-tertiary uppercase tracking-widest">Source Document</p>
              <p className="text-sm text-on-surface font-medium leading-relaxed">
                American Association for Justice (AAJ) —{' '}
                <span className="italic text-on-surface-variant">"Tricks of the Trade: How Insurance Companies Deny, Delay, Confuse, and Refuse"</span>
              </p>
              <p className="text-xs text-outline leading-relaxed">
                This report identifies patterns and alleged practices within the insurance industry that may negatively impact claimants. The six rights below are based directly on its findings.
              </p>
            </div>
          </motion.div>

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
                  <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{right.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 pr-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-label font-bold text-tertiary uppercase tracking-widest">Right {right.num}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/10 text-outline uppercase tracking-widest">{right.tag}</span>
                  </div>
                  <h2 className="text-lg lg:text-xl font-headline font-bold text-on-background leading-snug">{right.title}</h2>
                  <p className="text-sm text-primary font-semibold italic">{right.summary}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{right.body}</p>
                </div>
              </div>
            ))}
          </AnimatedGroup>

          {/* Disclaimer */}
          <motion.p
            className="mt-8 text-[11px] text-outline leading-relaxed text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The information on this page is for general educational purposes only and does not constitute legal advice. The practices described are based on reported allegations and documented research, not conclusions of wrongdoing by any specific insurer. Consult a licensed Nevada attorney for advice specific to your situation.
          </motion.p>

          {/* Bottom CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <div className="p-6 lg:p-10 rounded-2xl bg-primary/5 border border-primary/15 space-y-4 max-w-2xl mx-auto">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>balance</span>
              <h3 className="text-2xl lg:text-3xl font-headline font-bold text-on-background">
                Knowledge is your first line of defense.
              </h3>
              <p className="text-on-surface-variant text-sm lg:text-base max-w-md mx-auto">
                Start by understanding what your claim is actually worth — before you speak to a single insurance adjuster.
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
