import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalculatorForm from '../components/CalculatorForm'
import { AnimatedGroup } from '../components/ui/animated-group'
import ShineBorder from '../components/ui/shine-border'
import FaqAccordion from '../components/FaqAccordion'

const transitionVariants = {
  container: { visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { type: 'spring', bounce: 0.3, duration: 1.5 } },
  },
}

const faqs = [
  {
    q: "How does this AI Case Calculator work?",
    a: "Our proprietary AI Case Calculator helps you understand the potential value of your case before talking to an insurance company or hiring a lawyer. Answer a few quick questions about your accident and you'll get an instant estimate based on real settlement data and AI-powered analysis.\n\nTrained on thousands of verified cases, the calculator identifies similar accidents and predicts a fair compensation range. This gives you real numbers and confidence when dealing with insurance, so you don't accept a lowball offer."
  },
  {
    q: "What compensation or damages can I recover?",
    a: "After a car accident, compensation is meant to cover both the financial hit and the personal impact. Missing even one category can leave real money on the table.\n\n• Economic Compensation: Medical bills (including future treatment), lost wages, reduced earning potential, vehicle repair/replacement, and out-of-pocket expenses.\n• Non-Economic Compensation: Pain and suffering, emotional distress, loss of enjoyment, scarring, and strain on relationships."
  },
  {
    q: "Can I trust my insurance to handle all this for me?",
    a: "Insurance carriers are trained to minimize payouts. Handling a case without an attorney often leads to recovering only obvious items, accepting early lowball offers, undervaluing pain/suffering, and overlooking cases for diminished value."
  },
  {
    q: "Is it best to speak with a lawyer after an accident?",
    a: "A car accident attorney helps you navigate complex cases and face insurance companies on equal footing. They work to maximize your compensation, handle denied or underpaid cases, negotiate directly with the insurer, and litigate if necessary. Initial consultations are completely free. You're under no obligation to hire unless it's the right fit."
  },
  {
    q: "What is the typical timeline for case resolution and payment?",
    a: "The timeline varies based on injuries and fault disputes. Quick, straightforward cases with minor injuries usually settle in 1 to 3 months. Injury cases with longer treatment typically take 3 to 12+ months because settlement timing depends on your medical stabilization."
  },
  {
    q: "Do I need a copy of my accident report to file a case?",
    a: "You do not technically need a copy to open a case, but having it makes the process smoother. It usually becomes necessary when fault is disputed, injuries appear later, or you are pursuing compensation beyond immediate quick repairs. The police report is an objective account that insurance adjusters rely on."
  },
  {
    q: "How do I make a diminished value case for my car?",
    a: "Most people don't realize they can pursue diminished value, and insurance companies rarely bring it up. First, confirm your state allows it. Nevada does. File the property damage case, then gather evidence that the vehicle is worth less even after repairs."
  },
  {
    q: "What are the best steps to take after a car accident?",
    a: "1. Safety First: Move to a safe location if possible.\n2. Call for Help: Dial 911 if there are injuries. Report the accident to law enforcement.\n3. Exchange info: Get names, contact, insurance, and license plates.\n4. Document the scene: Take photos of damages and the scene.\n5. Wait to speak to insurance until you understand the true value of your case."
  }
]

export default function CalculatorPage() {
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      
      <main className="flex-1 flex flex-col px-4 py-6 lg:py-10 max-w-3xl mx-auto w-full relative z-10">
        <AnimatedGroup variants={transitionVariants} className="text-center mb-6 space-y-2 max-w-2xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
            <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">Free · 2 min · No obligation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline text-on-background leading-tight">
            What is your case <span className="text-primary italic">worth?</span>
          </h1>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
            Answer a few quick questions and get your Nevada settlement estimate.
          </p>
        </AnimatedGroup>

        <motion.div
          className="flex-none max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.6, delay: 0.4 }}
        >
          <ShineBorder borderWidth={2} duration={4} gradient="from-[#a4e6ff] via-white to-[#00d1ff]">
            <CalculatorForm />
          </ShineBorder>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          className="mt-12 sm:mt-16 max-w-4xl mx-auto w-full px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Our Case Valuation */}
            <div className="rounded-2xl bg-surface-container-low border border-[#4ADE80]/20 overflow-hidden flex flex-col items-center p-6 sm:p-8 text-center shadow-[0_4px_30px_rgba(74,222,128,0.03)] hover:shadow-[0_4px_30px_rgba(74,222,128,0.08)] transition-shadow">
              <span className="material-symbols-outlined text-5xl text-[#4ADE80] mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="text-xl sm:text-2xl font-headline text-on-background mb-6">Our Case <span className="text-[#4ADE80] italic">Valuation</span></h3>
              <ul className="space-y-4 text-left w-full max-w-xs">
                {[
                  "Assesses total compensation available",
                  "Shows you the best next steps to take",
                  "Provides access to legal resources that protect your interests",
                  "Helps you receive the maximum compensation for your case"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface-variant items-start">
                    <span className="material-symbols-outlined text-[#4ADE80] text-lg flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typical Insurance Offer */}
            <div className="rounded-2xl bg-surface-container-highest border border-error/20 overflow-hidden flex flex-col items-center p-6 sm:p-8 text-center opacity-80 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-error mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              <h3 className="text-xl sm:text-2xl font-headline text-on-background mb-6">Typical Insurance <span className="text-error italic">Offer</span></h3>
              <ul className="space-y-4 text-left w-full max-w-xs">
                {[
                  "Only offers compensation for property damage",
                  "Won't award payment for lingering injuries",
                  "Doesn't account for lost wages or work impairment",
                  "Won't assess your car's diminished value"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface-variant items-start">
                    <span className="material-symbols-outlined text-error text-lg flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16 sm:mt-24 max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-headline text-on-background mb-3">Frequently Asked <span className="text-primary italic">Questions</span></h2>
            <p className="text-sm font-body text-on-surface-variant">Everything you need to know about your case and what to expect from the process.</p>
          </div>
          
          <FaqAccordion items={faqs} />
        </motion.div>

      </main>

    </div>
  )
}

