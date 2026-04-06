import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CalculatorForm from './components/CalculatorForm'
import { AnimatedGroup } from './components/ui/animated-group'
import ShineBorder from './components/ui/shine-border'
import WhatIsSection from './components/WhatIsSection'


const AVATAR_POOL = [
  'https://randomuser.me/api/portraits/thumb/men/89.jpg',
  'https://randomuser.me/api/portraits/thumb/women/82.jpg',
  'https://randomuser.me/api/portraits/thumb/men/49.jpg',
  'https://randomuser.me/api/portraits/thumb/men/72.jpg',
  'https://randomuser.me/api/portraits/thumb/women/75.jpg',
  'https://randomuser.me/api/portraits/thumb/women/56.jpg',
  'https://randomuser.me/api/portraits/thumb/women/92.jpg',
  'https://randomuser.me/api/portraits/thumb/women/78.jpg',
  'https://randomuser.me/api/portraits/thumb/men/12.jpg',
  'https://randomuser.me/api/portraits/thumb/women/93.jpg',
  'https://randomuser.me/api/portraits/thumb/men/10.jpg',
  'https://randomuser.me/api/portraits/thumb/women/22.jpg',
  'https://randomuser.me/api/portraits/thumb/men/58.jpg',
  'https://randomuser.me/api/portraits/thumb/men/33.jpg',
  'https://randomuser.me/api/portraits/thumb/men/63.jpg',
  'https://randomuser.me/api/portraits/thumb/women/94.jpg',
  'https://randomuser.me/api/portraits/thumb/men/87.jpg',
  'https://randomuser.me/api/portraits/thumb/men/53.jpg',
  'https://randomuser.me/api/portraits/thumb/men/25.jpg',
  'https://randomuser.me/api/portraits/thumb/women/51.jpg',
  'https://randomuser.me/api/portraits/thumb/men/5.jpg',
  'https://randomuser.me/api/portraits/thumb/men/82.jpg',
  'https://randomuser.me/api/portraits/thumb/men/22.jpg',
  'https://randomuser.me/api/portraits/thumb/men/86.jpg',
  'https://randomuser.me/api/portraits/thumb/women/66.jpg',
  'https://randomuser.me/api/portraits/thumb/women/44.jpg',
  'https://randomuser.me/api/portraits/thumb/women/28.jpg',
  'https://randomuser.me/api/portraits/thumb/women/58.jpg',
  'https://randomuser.me/api/portraits/thumb/men/29.jpg',
  'https://randomuser.me/api/portraits/thumb/men/75.jpg',
]

function RotatingAvatars() {
  const STAGGER_MS = 180  // delay between each avatar swapping
  const FADE_MS    = 400  // fade duration per avatar
  const INTERVAL   = 5000

  const [slots, setSlots] = useState([0, 1, 2])       // current pool indices shown
  const [fadingSlot, setFadingSlot] = useState(null)  // which slot is mid-swap
  const offsetRef = useRef(3)
  const swapQueue = useRef([])
  const swapping  = useRef(false)

  const swapNext = () => {
    if (swapQueue.current.length === 0) { swapping.current = false; return }
    swapping.current = true
    const { slotIdx, newPoolIdx } = swapQueue.current.shift()
    // fade out
    setFadingSlot(slotIdx)
    setTimeout(() => {
      // swap image
      setSlots(prev => { const s = [...prev]; s[slotIdx] = newPoolIdx; return s })
      setFadingSlot(null)
      // wait a beat then do the next one
      setTimeout(swapNext, STAGGER_MS)
    }, FADE_MS)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // queue a staggered swap for each of the 3 slots in order
      swapQueue.current = [0, 1, 2].map(slotIdx => {
        const newPoolIdx = offsetRef.current % AVATAR_POOL.length
        offsetRef.current += 1
        return { slotIdx, newPoolIdx }
      })
      if (!swapping.current) swapNext()
    }, INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex -space-x-2.5">
      {slots.map((poolIdx, slot) => (
        <img
          key={`${slot}-${poolIdx}`}
          className="w-9 h-9 rounded-full border-2 border-[#111318] object-cover"
          style={{
            opacity: fadingSlot === slot ? 0 : 1,
            transform: fadingSlot === slot ? 'scale(0.85)' : 'scale(1)',
            transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
          }}
          src={AVATAR_POOL[poolIdx]}
          alt={`user ${slot + 1}`}
        />
      ))}
    </div>
  )
}

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
    quote: "I got rear-ended on I-15 near Flamingo and the adjuster acted like my back pain wasn't real. ClaimCalculator showed me my case was worth a lot more. I stopped second-guessing myself and got an attorney.",
    name: "M.R.",
    location: "Las Vegas, NV",
    initials: "MR",
    initial: 12000,
    final: 85000,
    type: "Rear-End Collision",
  },
  {
    quote: "I had no idea what my case was worth after my motorcycle accident on US-95. The free estimate gave me something real to go off of. What the insurance company offered didn't even come close.",
    name: "J.T.",
    location: "Henderson, NV",
    initials: "JT",
    initial: 25000,
    final: 175000,
    type: "Motorcycle Accident",
  },
  {
    quote: "I slipped in a casino parking garage and they tried to say it was my fault. Once I saw the estimate, I knew I had a real case. I stopped letting them push me around.",
    name: "D.M.",
    location: "Las Vegas, NV",
    initials: "DM",
    initial: 18000,
    final: 125000,
    type: "Premises Liability",
  },
  {
    quote: "The Ride Share driver ran a red light on Tropicana and tried to dodge responsibility. ClaimCalculator pointed me in the right direction. My attorney handled the rest.",
    name: "M.T.",
    location: "Las Vegas, NV",
    initials: "MT",
    initial: 22000,
    final: 165000,
    type: "Ride Share Accident",
  },
  {
    quote: "I was hit by an 18-wheeler on I-15 between Vegas and the California border. The trucking company's lawyers were aggressive from day one. That estimate gave me the confidence to not back down.",
    name: "P.L.",
    location: "North Las Vegas, NV",
    initials: "PL",
    initial: 35000,
    final: 210000,
    type: "Truck Accident",
  },
  {
    quote: "Got doored by a delivery driver near Fremont Street while I was on my bicycle. I had no idea I could go after both the city and the driver. ClaimCalculator opened my eyes to that.",
    name: "S.K.",
    location: "Las Vegas, NV",
    initials: "SK",
    initial: 22000,
    final: 95000,
    type: "Bicycle Accident",
  },
  {
    quote: "Construction zone on US-95 near the Spaghetti Bowl. Lane shifts, missing signage, no warning. After seeing the estimate I realized this was a serious case and got an attorney involved.",
    name: "R.H.",
    location: "Las Vegas, NV",
    initials: "RH",
    initial: 40000,
    final: 285000,
    type: "Construction Zone Crash",
  },
  {
    quote: "I tripped on a broken curb outside a casino resort near the Strip. ClaimCalculator showed me that premises cases like mine had real value. I kept pushing and it paid off.",
    name: "J.W.",
    location: "Paradise, NV",
    initials: "JW",
    initial: 15000,
    final: 78000,
    type: "Slip & Fall",
  },
  {
    quote: "I was crossing at a marked crosswalk near UNLV and got hit. The driver's insurance only offered enough to cover my ER bill. The estimate showed me the full picture, pain, lost wages, all of it.",
    name: "M.C.",
    location: "Las Vegas, NV",
    initials: "MC",
    initial: 20000,
    final: 92000,
    type: "Pedestrian Accident",
  },
  {
    quote: "Rear-ended in a parking structure at one of the casino resorts. I almost let it go. Then I ran my case through the calculator and completely changed my mind.",
    name: "L.M.",
    location: "Summerlin, NV",
    initials: "LM",
    initial: 8000,
    final: 52000,
    type: "Parking Lot Accident",
  },
  {
    quote: "They tried to use my old shoulder injury against me to lower my payout after a crash on Sahara Ave. My attorney used the estimate as a baseline and proved the accident made everything worse.",
    name: "C.R.",
    location: "Henderson, NV",
    initials: "CR",
    initial: 30000,
    final: 145000,
    type: "Car Accident",
  },
  {
    quote: "I was a passenger in a Ride Share that got T-boned near Nellis. Both the at-fault driver and the Ride Share policy were in play. The attorney they matched me with figured it all out.",
    name: "K.J.",
    location: "Las Vegas, NV",
    initials: "KJ",
    initial: 15000,
    final: 88000,
    type: "Ride Share Accident",
  },
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

      <main className="relative z-10 pt-[58px]">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative flex items-center px-4 lg:px-8 py-16 lg:py-32 min-h-[600px] lg:min-h-[780px]" style={{ isolation: 'isolate', zIndex: 2 }}>
          
          {/* Background glow — positioned behind calculator */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-[15%] w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />



          <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left column */}
            <AnimatedGroup variants={transitionVariants} className="space-y-6 lg:space-y-0 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 lg:mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse flex-shrink-0"></span>
                <span className="text-[11px] font-label font-semibold text-[#4ADE80] uppercase tracking-widest">Nevada Personal Injury Calculator</span>
              </div>

              {/* Headline — stronger size contrast */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline text-on-background leading-[0.95] tracking-tight lg:mb-7">
                Insurance companies{' '}
                <br className="hidden lg:block" />
                already know your number.{' '}
                <br />
                <span className="text-primary italic">Now you do too.</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant/85 max-w-md mx-auto lg:mx-0 leading-relaxed lg:mb-9">
                Find out what your Nevada injury case is actually worth before you talk to an adjuster, sign anything, or settle for less than you should.
              </p>

              {/* Social proof — avatars */}
              <div className="flex items-center gap-3 justify-center lg:justify-start lg:mb-6">
                <RotatingAvatars />
                <p className="text-base text-on-surface-variant">
                  Join <span className="text-on-background font-bold">2,400+</span> people who discovered they were owed more
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/calculator')}
                  className="cta-gradient cta-shimmer text-on-primary-fixed px-8 py-4 sm:py-5 rounded-[16px] font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.2)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
                >
                  See What Your Case Is Worth
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
                </button>
                <p className="text-sm text-outline self-center text-center">No cost. No obligation. Built for Nevada injury cases.</p>
              </div>
            </AnimatedGroup>

            {/* Right column — DESKTOP ONLY: embedded calculator preview */}
            <motion.div
              className="relative hidden lg:block self-center overflow-hidden z-20"
              initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-2xl transform rotate-3" />
              <ShineBorder borderWidth={2} duration={4} gradient="from-[#a4e6ff] via-white to-[#00d1ff]">
                <CalculatorForm />
              </ShineBorder>
            </motion.div>

          </div>
        </section>

        {/* ── TRUST BAR ──────────────────────────────────────────────────── */}
        <section className="relative overflow-visible px-4 lg:px-8 -mt-4 lg:-mt-8" style={{ zIndex: 1 }}>
          {/* ── LAS VEGAS SKYLINE DIVIDER ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: 'translateY(-100%)',
              opacity: 0.12,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: 0,
            }}
            className="lv-skyline-divider"
          >
            <img
              src="/lv-skyline.png"
              alt=""
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                filter: 'invert(1)',
              }}
            />
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 py-5 border-t border-b border-white/[0.06]">
              {[
                { icon: 'lock', text: '256-bit SSL Encrypted' },
                { icon: 'schedule', text: 'Results in 2 Minutes' },
                { icon: 'money_off', text: '100% Free — No Credit Card' },
                { icon: 'shield', text: 'Your Info Stays Private' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4ADE80] text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>{icon}</span>
                  <span className="text-[13px] text-on-surface-variant/50 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IS CLAIMCALCULATOR.AI ────────────────────── */}
        <WhatIsSection />

        {/* ── TRUSTED SOURCES ──────────────────────────────────── */}
        <section className="pt-16 lg:pt-20 pb-12 lg:pb-16">
          <motion.div
            className="text-center mb-8 px-5 lg:px-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            {/* Label */}
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }} className="uppercase font-semibold">
              REFERENCED & RECOGNIZED ACROSS NEVADA
            </p>
            {/* Description */}
            <p style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '600px', color: 'rgba(255,255,255,0.88)' }} className="mx-auto mt-3">
              ClaimCalculator.ai draws from publicly available Nevada data sources and has been referenced by Nevada media and community outlets. All estimates are for informational purposes only.
            </p>
          </motion.div>

          {/* Infinite Scrolling Logo Marquee */}
          <div
            className="w-full overflow-hidden"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div className="marquee-track" style={{ padding: '16px 0' }}>
              {[0, 1].map((setIdx) => (
                <div key={setIdx} className="flex items-center shrink-0">
                  {[
                    { src: '/logos/lvmpd-color.png', alt: 'LVMPD' },
                    { src: '/logos/nvcourts-color.png', alt: 'Nevada Courts' },
                    { src: '/logos/bbb-color.svg', alt: 'Better Business Bureau' },
                    { src: '/logos/dmv-color.svg', alt: 'Nevada DMV' },
                    { src: '/logos/ag-color.png', alt: 'Nevada Attorney General' },
                    { src: '/logos/kbb-color.png', alt: 'Kelley Blue Book' },
                    { src: '/logos/carfax-color.png', alt: 'Carfax' },
                    { src: '/logos/carmax-color.png', alt: 'CarMax' },
                    { src: '/logos/las-vegas-cvb.png', alt: 'Las Vegas CVB', height: '52px' },
                    { src: '/logos/las-vegas-weekly.png', alt: 'Las Vegas Weekly', height: '30px' },
                    { src: '/logos/fox5-kvvu.png', alt: 'Fox 5 KVVU-TV', height: '58px' },
                    { src: '/logos/lv-review-journal.png', alt: 'Las Vegas Review-Journal', height: '38px' },
                  ].map(({ src, alt, height }) => (
                    <img
                      key={`${setIdx}-${alt}`}
                      src={src}
                      alt={alt}
                      className="w-auto object-contain shrink-0"
                      style={{ margin: '0 64px', height: height || '56px' }}
                      loading="eager"
                      onError={(e) => {
                        // Replace broken images with a text pill fallback
                        const pill = document.createElement('span');
                        pill.textContent = alt;
                        pill.style.cssText = 'display:inline-flex;align-items:center;height:56px;padding:0 16px;border:1px solid rgba(255,255,255,0.2);border-radius:999px;color:rgba(255,255,255,0.6);font-size:14px;font-weight:500;white-space:nowrap;margin:0 64px;';
                        e.target.replaceWith(pill);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>


        </section>

        {/* ── TRUST STATS ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {[
                { stat: '67%', label: 'Avg. Case Undervalued', icon: 'verified' },
                { stat: '2,400+', label: 'Cases Evaluated', icon: 'groups' },
                { stat: '3.2x', label: 'Avg. Attorney Boost', icon: 'trending_up' },
                { stat: '$0', label: 'Cost to Evaluate', icon: 'payments' },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="p-5 lg:p-7 rounded-xl border border-white/[0.06] text-center space-y-2 hover:border-primary/20 transition-colors duration-300" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <p className="text-2xl lg:text-4xl font-headline font-black text-on-background">{stat}</p>
                  <p className="text-sm text-on-surface-variant leading-snug">{label}</p>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="py-20 lg:py-32 px-4 lg:px-8 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-headline ">
                The Path to <span className="text-primary italic">Recovery.</span>
              </h2>
              <p className="text-on-surface-variant text-[17px] lg:text-lg max-w-xl mx-auto">
                Three simple steps between you and the compensation you deserve.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 mb-12"
            >
              {[
                { num: '01', title: 'Report Details', body: 'Answer a few quick questions about your accident and injuries in our secure calculator.' },
                { num: '02', title: 'AI Valuation', body: 'Our engine cross-references your case with current Nevada legal precedents and insurance payouts.' },
                { num: '03', title: 'Expert Match', body: 'Get connected with top Nevada attorneys who specialize in maximizing your specific case type.' },
              ].map(({ num, title, body }) => (
                <div key={num} className="space-y-3 p-6 lg:p-7 rounded-xl border border-white/[0.06] hover:border-primary/15 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-headline font-black text-outline/20 leading-none">{num}</span>
                    <h4 className="text-lg font-headline text-on-background">{title}</h4>
                  </div>
                  <p className="text-on-surface-variant text-base leading-relaxed">{body}</p>
                </div>
              ))}
            </AnimatedGroup>

            {/* CTA within section */}
            <div className="text-center">
              <button
                onClick={() => navigate('/calculator')}
                className="cta-gradient cta-shimmer text-on-primary-fixed px-8 py-4 rounded-[16px] font-headline font-bold text-base inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.15)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
              >
                Start Free Evaluation
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS CAROUSEL ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="relative p-8 lg:p-12 pb-14 glass-card rounded-xl border border-white/[0.08] min-h-[300px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.4 }}
            >
              <span className="material-symbols-outlined text-primary text-5xl absolute -top-7 left-6 bg-[#111318] px-2" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>

              {/* Verified badge + "See all stories" link */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4ADE80] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[13px] font-semibold text-[#4ADE80] uppercase tracking-widest">Verified ClaimCalculator User</span>
                </div>
                <a
                  href="/success-stories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[13px] text-outline hover:text-primary transition-colors duration-200 group"
                >
                  See all stories
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">open_in_new</span>
                </a>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Before / After numbers */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <span className="text-[10px] text-outline uppercase tracking-widest font-semibold">Offered</span>
                      <span className="text-sm font-headline font-bold text-on-surface-variant line-through decoration-outline/60">
                        ${TESTIMONIALS[activeTestimonial].initial?.toLocaleString()}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4ADE80]/[0.08] border border-[#4ADE80]/20">
                      <span className="text-[10px] text-[#4ADE80] uppercase tracking-widest font-semibold">Settled</span>
                      <span className="text-sm font-headline font-bold text-[#4ADE80]">
                        ${TESTIMONIALS[activeTestimonial].final?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#4ADE80] px-2 py-0.5 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                      +{Math.round(((TESTIMONIALS[activeTestimonial].final - TESTIMONIALS[activeTestimonial].initial) / TESTIMONIALS[activeTestimonial].initial) * 100)}%
                    </span>
                  </div>

                  {/* Quote — clickable, opens success stories page in new tab */}
                  <a
                    href="/success-stories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group cursor-pointer"
                    aria-label="Read all success stories"
                  >
                    <p className="text-lg sm:text-xl lg:text-2xl font-headline font-medium leading-snug italic text-on-background group-hover:text-primary transition-colors duration-200">
                      &quot;{TESTIMONIALS[activeTestimonial].quote}&quot;
                    </p>
                  </a>

                  {/* Author row */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                      {TESTIMONIALS[activeTestimonial].initials}
                    </div>
                    <div>
                      <h5 className="text-on-background text-sm sm:text-[15px]">{TESTIMONIALS[activeTestimonial].name}</h5>
                      <p className="text-xs sm:text-[13px] text-outline">{TESTIMONIALS[activeTestimonial].location} &middot; {TESTIMONIALS[activeTestimonial].type}</p>
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
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-headline ">
              The insurance adjuster <span className="text-primary italic">isn't on your side.</span>
            </h2>
            <p className="text-on-surface-variant text-[17px]">
              Nevadans who hire an attorney recover an average of <span className="text-on-background font-bold">3.2× more</span> than those who don't. See where you stand — free.
            </p>
            <button
              onClick={() => navigate('/calculator')}
              className="cta-gradient cta-shimmer text-on-primary-fixed w-full sm:w-auto px-10 py-5 rounded-[16px] font-headline font-bold text-lg flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(164,230,255,0.2)] hover:shadow-[0_8px_50px_rgba(164,230,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
            >
              See What Your Case Is Worth
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
            </button>
            <p className="text-sm text-outline">No cost. No commitment. SSL encrypted.</p>
          </motion.div>
        </section>

      </main>

    </div>
  )
}

export default App
