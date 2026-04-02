import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CalculatorForm from './components/CalculatorForm'
import { AnimatedGroup } from './components/ui/animated-group'
import ShineBorder from './components/ui/shine-border'

const transitionVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  },
}

const TESTIMONIALS = [
  {
    quote: "I was unsure if my claim was worth pursuing after my accident in Summerlin. ClaimCalculator.ai gave me the confidence to seek legal help, and I ended up settling for 3x what the insurance company initially offered.",
    name: "Michael S.",
    location: "Las Vegas, NV",
    initials: "MS"
  },
  {
    quote: "The whole process took less than two minutes. Seeing the upper end of the settlement estimation made me realize I shouldn't accept the first lowball offer from my insurer.",
    name: "Sarah J.",
    location: "Henderson, NV",
    initials: "SJ"
  },
  {
    quote: "Fast, easy, and completely free. The attorney they connected me with was incredible and handled all the stress while I focused on recovering.",
    name: "David T.",
    location: "Reno, NV",
    initials: "DT"
  }
]

function App() {
  const navigate = useNavigate()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-transparent">


      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      

      <main className="relative z-10 pt-16 lg:pt-20">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative flex items-center px-4 lg:px-6 py-16 lg:py-28 min-h-[600px] lg:min-h-[720px] overflow-hidden">
          
          {/* Background glow — cosmetic only */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left column — visible on all sizes */}
            <AnimatedGroup variants={transitionVariants} className="space-y-6 lg:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0"></span>
                <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">Free AI-Powered Claim Analysis</span>
              </div>

              {/* Headline — large on mobile, huge on desktop */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-on-background leading-[0.95] tracking-tight">
                Insurance companies have lawyers.{' '}
                <span className="text-primary italic">Now you have AI.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Answer 9 quick questions. Our AI cross-references thousands of Nevada settlements to show you what you're really owed.
              </p>

              {/* Social proof — avatars */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2.5">
                  {[
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUUSlwtNdlTQyrWVYdQnqEG2G2D2qWsw8r3tEiX44M9NjTr6eGMRe5iNyh1igPZcX65tvaKU24HKD_ViEu1-vmm1ZyazdoVFdaBd-gOB-iJopbsj7CWmPEh_z2k5lhJbcUa1BQNSwHpD7Q9mFujNPUpbTPzfQ-3s8i-aCFYAKSA7ToQBPjYxtWPKZ9vcMOxxLWWwoiSpbTZoukQ2UJdSse3T5EGjjJTH_EbQZXwioeOefNc3mdh8fCnEIaf6hhgfpIyoutzG0uHBg',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDiiq9OcBBRXDRd1IO8Q3jyBqM9sfQ-enET6QgJD7RfCodMdVApoZPPMLpwObQxVZS679HErC21H0TqZMHW7P5HGJ94mqeUuWZHKdb9ZGXrbBCYqKaOfbE_Pf20f2Oindpn_H5fXvT1exHXEpMzVstozNUbT7OoHxTcIqOeloguSCUGiBQ0CLYcfNhjvk6vxe7H6o7C96bIOnwhWF4K-MJg0T8bGZHoEhjsSTJX0tmbUGIZ1F8G3TeDNibUacJt1o34L3Ix2vUvrrU',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2xiR_WMueO6jb2T0wmxvLry5Jkp3XF11qlJC13GEG-_g5HSypgEXr1K05c4Hi7IKOyiz1cqcsMTamtRolNarJ0tI1SNJVbNxJc1AfKNukt8fW7sMTmcGhX94viu-6QrSuUdAR896ovbG5XTR-GuPOh8dTj1xgzan7n8t6U6Y1WtHwjr7e7WfBUn8vAOMX8ot4yquiRTUyp4OthMggfdxWbyWivY1jeRZkTFL53MsPaAJs1R5mz7eUrBPaYlxJ0H2tcYBoTgaP4EE',
                  ].map((src, i) => (
                    <img key={i} className="w-9 h-9 rounded-full border-2 border-[#111318] object-cover" src={src} alt={`lawyer ${i + 1}`} />
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant">
                  Join <span className="text-on-background font-bold">2,400+</span> people who discovered they were owed more
                </p>
              </div>

              {/* Primary CTA — BIG on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/calculator')}
                  className="cta-gradient text-on-primary-fixed px-8 py-4 sm:py-5 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.2)] hover:shadow-[0_0_45px_rgba(164,230,255,0.35)] active:scale-95 transition-all duration-200 group"
                >
                  Check My Claim Free
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                </button>
                <p className="text-xs text-outline self-center text-center">Free · 2 min · No obligation</p>
              </div>
            </AnimatedGroup>

            {/* Right column — DESKTOP ONLY: embedded calculator preview */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl transform rotate-3" />
              <ShineBorder borderWidth={2} duration={4} gradient="from-[#a4e6ff] via-white to-[#00d1ff]">
                <CalculatorForm />
              </ShineBorder>
            </motion.div>

          </div>
        </section>

        {/* ── TRUST STATS (mobile-friendly) ─────────────────────────────── */}
        <section className="py-16 lg:py-24 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6"
            >
              {[
                { stat: '67%', label: 'Avg. Claim Undervalued', icon: 'verified' },
                { stat: '2,400+', label: 'Claims This Month', icon: 'groups' },
                { stat: '3.2x', label: 'Avg. Attorney Boost', icon: 'trending_up' },
                { stat: '$0', label: 'Cost to Evaluate', icon: 'payments' },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="p-5 lg:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/5 text-center space-y-2">
                  <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <p className="text-2xl lg:text-3xl font-headline font-black text-on-background">{stat}</p>
                  <p className="text-xs text-on-surface-variant leading-snug">{label}</p>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="py-16 lg:py-32 px-4 lg:px-6 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
              className="text-center space-y-3 mb-12"
            >
              <h2 className="text-3xl lg:text-5xl font-headline font-bold">
                The Path to <span className="text-primary italic">Recovery.</span>
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg max-w-xl mx-auto">
                Three simple steps between you and the compensation you deserve.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 mb-10"
            >
              {[
                { num: '01', title: 'Report Details', body: 'Answer 9 quick questions about your accident and injuries in our secure AI calculator.' },
                { num: '02', title: 'AI Valuation', body: 'Our engine cross-references your case with current Nevada legal precedents and insurance payouts.' },
                { num: '03', title: 'Expert Match', body: 'Get connected with top Nevada attorneys who specialize in maximizing your specific claim type.' },
              ].map(({ num, title, body }) => (
                <div key={num} className="space-y-3 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                  <span className="text-5xl font-headline font-black text-outline/20">{num}</span>
                  <h4 className="text-lg font-headline font-bold text-on-background">{title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </AnimatedGroup>

            {/* CTA within section */}
            <div className="text-center">
              <button
                onClick={() => navigate('/calculator')}
                className="cta-gradient text-on-primary-fixed px-8 py-4 rounded-xl font-headline font-bold text-base inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.15)] hover:shadow-[0_0_45px_rgba(164,230,255,0.3)] active:scale-95 transition-all duration-200 group"
              >
                Start Free Evaluation
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="relative p-8 lg:p-12 pb-14 glass-card rounded-3xl border border-outline-variant/10 min-h-[300px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.4 }}
            >
              <span className="material-symbols-outlined text-primary text-5xl absolute -top-7 left-6 bg-[#111318] px-2" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <p className="text-lg sm:text-xl lg:text-2xl font-headline font-medium leading-snug italic text-on-background">
                    &quot;{TESTIMONIALS[activeTestimonial].quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">{TESTIMONIALS[activeTestimonial].initials}</div>
                    <div>
                      <h5 className="font-bold text-on-background text-[13px] sm:text-sm">{TESTIMONIALS[activeTestimonial].name}</h5>
                      <p className="text-[11px] sm:text-xs text-outline">{TESTIMONIALS[activeTestimonial].location} Resident</p>
                    </div>
                    {/* Stars */}
                    <div className="ml-auto flex flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-yellow-400 text-sm sm:text-base -mx-0.5 sm:mx-0" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Indicators */}
              <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-primary w-5' : 'bg-outline-variant/40 hover:bg-outline-variant w-1.5'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA BANNER ─────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 px-4 lg:px-6 bg-surface-container-lowest">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-headline font-bold">
              The insurance adjuster <span className="text-primary italic">isn't on your side.</span>
            </h2>
            <p className="text-on-surface-variant text-base">
              Nevadans who hire an attorney recover an average of <span className="text-on-background font-bold">3.2× more</span> than those who don't. See where you stand — free.
            </p>
            <button
              onClick={() => navigate('/calculator')}
              className="cta-gradient text-on-primary-fixed w-full sm:w-auto px-10 py-5 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(164,230,255,0.2)] hover:shadow-[0_0_60px_rgba(164,230,255,0.35)] active:scale-95 transition-all duration-200 group"
            >
              Get My Free Estimate
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-xs text-outline">No cost. No commitment. SSL encrypted.</p>
          </motion.div>
        </section>

      </main>

      {/* Footer is now handled by the global Layout in main.jsx */}

    </div>
  )
}

export default App
