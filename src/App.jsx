import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CalculatorForm from './components/CalculatorForm'
import { AnimatedGroup } from './components/ui/animated-group'
import ShineBorder from './components/ui/shine-border'

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
    quote: "I was unsure if my case was worth pursuing after my accident in Summerlin. ClaimCalculator.ai gave me the confidence to seek legal help, and I ended up settling for 3x what the insurance company initially offered.",
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

      <main className="relative z-10 pt-[72px]">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative flex items-center px-4 lg:px-8 py-16 lg:py-32 min-h-[600px] lg:min-h-[780px] overflow-hidden">
          
          {/* Background glow — positioned behind calculator */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-[15%] w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />

          {/* Nevada state outline watermark */}
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '280px',
              height: 'auto',
              opacity: 0.04,
              color: 'white',
              pointerEvents: 'none',
              zIndex: 0,
            }}
            viewBox="0 0 200 280"
            xmlns="http://www.w3.org/2000/svg"
            className="nevada-watermark"
          >
            <path
              d="M 30 10 L 170 10 L 170 40 L 195 70 L 195 270 L 80 270 L 30 200 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left column */}
            <AnimatedGroup variants={transitionVariants} className="space-y-6 lg:space-y-0 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 lg:mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse flex-shrink-0"></span>
                <span className="text-[11px] font-label font-semibold text-[#4ADE80] uppercase tracking-widest">Nevada Personal Injury Calculator</span>
              </div>

              {/* Headline — stronger size contrast */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-black lg:font-extrabold text-on-background leading-[0.95] tracking-tight lg:mb-7">
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
                <p className="text-sm text-on-surface-variant">
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
                <p className="text-xs text-outline self-center text-center">No cost. No obligation. Built for Nevada injury cases.</p>
              </div>
            </AnimatedGroup>

            {/* Right column — DESKTOP ONLY: embedded calculator preview */}
            <motion.div
              className="relative hidden lg:block"
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
        <section className="relative overflow-visible px-4 lg:px-8 -mt-4 lg:-mt-8">
          {/* ── LAS VEGAS SKYLINE DIVIDER ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: 'translateY(-100%)',
              overflow: 'hidden',
              lineHeight: 0,
              opacity: 0.12,
              pointerEvents: 'none',
            }}
            className="lv-skyline-divider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1920 80"
              style={{ display: 'block', width: '100%', height: '60px' }}
              preserveAspectRatio="xMidYMax meet"
              aria-hidden="true"
            >
              {/* Ground baseline */}
              <rect x="0" y="72" width="1920" height="8" fill="white"/>

              {/* === LEFT: Venetian bridge + building === */}
              <rect x="10" y="55" width="60" height="17" fill="white"/>
              <rect x="20" y="45" width="40" height="12" fill="white"/>
              {/* bridge arch */}
              <path d="M10,72 Q40,58 70,72" fill="white"/>

              {/* === Eiffel Tower replica === */}
              {/* legs */}
              <path d="M130,72 L148,30 L152,30 L170,72 Z" fill="white"/>
              {/* upper tower */}
              <path d="M144,30 L149,10 L151,10 L156,30 Z" fill="white"/>
              {/* horizontal crossbar */}
              <rect x="138" y="38" width="24" height="3" fill="white"/>
              <rect x="145" y="22" width="10" height="2" fill="white"/>

              {/* === High Roller Ferris Wheel === */}
              <circle cx="250" cy="38" r="26" fill="white"/>
              <circle cx="250" cy="38" r="18" fill="black" opacity="0.99"/>
              {/* spokes */}
              <line x1="250" y1="12" x2="250" y2="64" stroke="white" strokeWidth="1.5"/>
              <line x1="224" y1="38" x2="276" y2="38" stroke="white" strokeWidth="1.5"/>
              <line x1="231" y1="19" x2="269" y2="57" stroke="white" strokeWidth="1.5"/>
              <line x1="269" y1="19" x2="231" y2="57" stroke="white" strokeWidth="1.5"/>
              {/* gondolas - dots around rim */}
              <circle cx="250" cy="12" r="2.5" fill="white"/>
              <circle cx="276" cy="38" r="2.5" fill="white"/>
              <circle cx="250" cy="64" r="2.5" fill="white"/>
              <circle cx="224" cy="38" r="2.5" fill="white"/>
              <circle cx="269" cy="19" r="2.5" fill="white"/>
              <circle cx="269" cy="57" r="2.5" fill="white"/>
              <circle cx="231" cy="19" r="2.5" fill="white"/>
              <circle cx="231" cy="57" r="2.5" fill="white"/>
              {/* support legs */}
              <path d="M236,64 L240,72 M264,64 L260,72" stroke="white" strokeWidth="2" fill="none"/>

              {/* === MSG Sphere (large globe) === */}
              <circle cx="370" cy="52" r="26" fill="white"/>
              {/* screen detail lines */}
              <path d="M344,52 Q370,44 396,52" stroke="black" strokeWidth="1" fill="none" opacity="0.6"/>
              <path d="M346,46 Q370,38 394,46" stroke="black" strokeWidth="1" fill="none" opacity="0.6"/>

              {/* === Casino mid-rises left cluster === */}
              <rect x="410" y="40" width="28" height="32" fill="white"/>
              <rect x="442" y="48" width="20" height="24" fill="white"/>
              <rect x="466" y="36" width="32" height="36" fill="white"/>
              <rect x="502" y="44" width="22" height="28" fill="white"/>

              {/* === Stratosphere Tower === */}
              {/* base building */}
              <rect x="540" y="50" width="30" height="22" fill="white"/>
              {/* tower shaft */}
              <rect x="551" y="18" width="8" height="34" fill="white"/>
              {/* observation pod */}
              <ellipse cx="555" cy="18" rx="12" ry="6" fill="white"/>
              {/* needle */}
              <rect x="554" y="2" width="2" height="16" fill="white"/>
              {/* top pod detail */}
              <rect x="549" y="14" width="12" height="4" fill="white"/>

              {/* === Mid-rises right of Strat === */}
              <rect x="582" y="38" width="26" height="34" fill="white"/>
              <rect x="612" y="44" width="20" height="28" fill="white"/>

              {/* === Wynn curved tower === */}
              <path d="M645,72 L645,28 Q660,20 680,28 L680,72 Z" fill="white"/>
              <path d="M655,28 Q668,22 678,28" fill="white"/>

              {/* === More casino mid-rises center-right === */}
              <rect x="695" y="35" width="30" height="37" fill="white"/>
              <rect x="729" y="42" width="22" height="30" fill="white"/>
              <rect x="755" y="38" width="28" height="34" fill="white"/>
              <rect x="787" y="46" width="18" height="26" fill="white"/>

              {/* === Statue of Liberty === */}
              {/* base/pedestal */}
              <rect x="815" y="58" width="14" height="14" fill="white"/>
              {/* body */}
              <rect x="818" y="44" width="8" height="16" fill="white"/>
              {/* head */}
              <ellipse cx="822" cy="42" rx="5" ry="4" fill="white"/>
              {/* crown spikes */}
              <path d="M818,40 L816,34 L820,38 M822,38 L820,32 L824,38 M826,40 L828,34 L824,38" stroke="white" strokeWidth="1.5" fill="none"/>
              {/* torch arm */}
              <path d="M826,48 L834,42 L836,40" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="836" cy="39" r="2" fill="white"/>

              {/* === Hotel towers right cluster === */}
              <rect x="850" y="32" width="32" height="40" fill="white"/>
              <rect x="886" y="40" width="24" height="32" fill="white"/>
              <rect x="914" y="36" width="28" height="36" fill="white"/>

              {/* === Welcome to Las Vegas Sign === */}
              <rect x="952" y="44" width="50" height="28" fill="white"/>
              {/* sign detail - oval top */}
              <ellipse cx="977" cy="44" rx="25" ry="8" fill="white"/>
              {/* sign pole */}
              <rect x="974" y="58" width="6" height="14" fill="white"/>

              {/* === More hotel blocks === */}
              <rect x="1016" y="38" width="34" height="34" fill="white"/>
              <rect x="1054" y="44" width="26" height="28" fill="white"/>
              <rect x="1084" y="36" width="30" height="36" fill="white"/>

              {/* === Luxor Pyramid === */}
              <path d="M1130,72 L1175,20 L1220,72 Z" fill="white"/>
              {/* capstone beam (light ray) */}
              <rect x="1174" y="8" width="2" height="12" fill="white"/>

              {/* === Sphinx === */}
              <path d="M1225,72 L1225,60 Q1240,52 1255,58 L1265,58 L1265,72 Z" fill="white"/>
              {/* sphinx head */}
              <ellipse cx="1255" cy="56" rx="10" ry="8" fill="white"/>
              <path d="M1248,56 L1240,62 L1248,62 Z" fill="white"/>

              {/* === Mandalay Bay right === */}
              <rect x="1280" y="40" width="40" height="32" fill="white"/>
              <rect x="1324" y="46" width="28" height="26" fill="white"/>

              {/* Right fill */}
              <rect x="1360" y="55" width="560" height="17" fill="white"/>
            </svg>
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
              Built on Verified Data
            </p>
            {/* Description */}
            <p style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '600px', color: 'rgba(255,255,255,0.88)' }} className="mx-auto mt-3">
              Our AI cross-references official Nevada government records, court data, and law enforcement databases to calculate your estimate.
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
                    { src: '/logos/google-color.png', alt: 'Google' },
                    { src: '/logos/lvmpd-color.png', alt: 'LVMPD' },
                    { src: '/logos/nvcourts-color.png', alt: 'Nevada Courts' },
                    { src: '/logos/bbb-color.svg', alt: 'Better Business Bureau' },
                    { src: '/logos/dmv-color.svg', alt: 'Nevada DMV' },
                    { src: '/logos/ag-color.png', alt: 'Nevada Attorney General' },
                    { src: '/logos/kbb-color.png', alt: 'Kelley Blue Book' },
                    { src: '/logos/carfax-color.png', alt: 'Carfax' },
                    { src: '/logos/carmax-color.png', alt: 'CarMax' },
                  ].map(({ src, alt }) => (
                    <img
                      key={`${setIdx}-${alt}`}
                      src={src}
                      alt={alt}
                      className="h-14 w-auto object-contain shrink-0"
                      style={{ margin: '0 64px' }}
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
                <div key={label} className="p-6 lg:p-8 rounded-xl bg-surface-container-low border border-white/[0.06] text-center space-y-2 hover:border-primary/20 transition-colors duration-300">
                  <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <p className="text-2xl lg:text-4xl font-headline font-black text-on-background">{stat}</p>
                  <p className="text-xs text-on-surface-variant leading-snug">{label}</p>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </section>

        {/* ── NEVADA CASE TYPES ──────────────────────────────────────── */}
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-headline font-bold">
                Common Nevada <span className="text-primary italic">Injury Cases</span>
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg max-w-2xl mx-auto">
                Nevada roads, casinos, and construction zones create risks you won't find in other states. Here's what cases in your area typically look like.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
            >
              {[
                {
                  icon: 'directions_car',
                  title: 'Car Accidents',
                  desc: 'The most common injury case in Nevada. Rear-end collisions, intersection crashes, and freeway pileups on I-15 and US-95.',
                  range: '$5,000 - $150,000+',
                },
                {
                  icon: 'local_taxi',
                  title: 'Uber & Lyft Accidents',
                  desc: 'Las Vegas is one of the busiest rideshare markets in the country. Active trips carry up to $1M in commercial coverage.',
                  range: '$15,000 - $100,000+',
                },
                {
                  icon: 'directions_walk',
                  title: 'Strip & Pedestrian',
                  desc: 'The Las Vegas Strip sees some of the highest pedestrian traffic in the U.S. These cases tend to involve severe injuries.',
                  range: '$30,000 - $500,000+',
                },
                {
                  icon: 'casino',
                  title: 'Casino & Hotel Injuries',
                  desc: 'Wet floors, dim lighting, escalator malfunctions. Nevada premises liability law holds property owners accountable.',
                  range: '$10,000 - $250,000+',
                },
                {
                  icon: 'two_wheeler',
                  title: 'Motorcycle Accidents',
                  desc: 'Year-round riding means year-round risk. Motorcyclists face severe injuries and higher medical costs.',
                  range: '$25,000 - $300,000+',
                },
                {
                  icon: 'local_shipping',
                  title: 'Truck & 18-Wheeler',
                  desc: 'I-15 between Las Vegas and LA is one of the heaviest commercial trucking corridors in the West.',
                  range: '$50,000 - $1,000,000+',
                },
                {
                  icon: 'construction',
                  title: 'Construction Zone Crashes',
                  desc: 'Narrowed lanes, sudden detours, and poor signage. Liability can fall on drivers, contractors, or government agencies.',
                  range: '$15,000 - $200,000+',
                },
                {
                  icon: 'local_parking',
                  title: 'Parking Lot & Garage',
                  desc: 'Casino garages, mall lots, and downtown structures. Low visibility and distracted drivers cause more damage than expected.',
                  range: '$5,000 - $75,000+',
                },
              ].map(({ icon, title, desc, range }) => (
                <div key={title} className="p-6 rounded-xl bg-surface-container-low border border-white/[0.06] hover:border-primary/20 transition-all duration-300 flex flex-col gap-3 group">
                  <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <h4 className="text-base font-headline font-bold text-on-background">{title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed flex-1">{desc}</p>
                  <p className="text-sm font-headline font-bold text-[#4ADE80] mt-auto pt-2 border-t border-white/[0.06]">{range}</p>
                </div>
              ))}
            </AnimatedGroup>

            <div className="text-center mt-10">
              <button
                onClick={() => navigate('/calculator')}
                className="cta-gradient cta-shimmer text-on-primary-fixed px-8 py-4 rounded-[16px] font-headline font-bold text-base inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.15)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
              >
                See What Your Case Is Worth
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="py-20 lg:py-32 px-4 lg:px-8 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
              className="text-center space-y-4 mb-16"
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
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 mb-12"
            >
              {[
                { num: '01', title: 'Report Details', body: 'Answer a few quick questions about your accident and injuries in our secure calculator.' },
                { num: '02', title: 'AI Valuation', body: 'Our engine cross-references your case with current Nevada legal precedents and insurance payouts.' },
                { num: '03', title: 'Expert Match', body: 'Get connected with top Nevada attorneys who specialize in maximizing your specific case type.' },
              ].map(({ num, title, body }) => (
                <div key={num} className="space-y-4 p-7 lg:p-8 rounded-xl bg-surface-container-low border border-white/[0.06] hover:border-primary/15 transition-all duration-300">
                  <span className="text-5xl font-headline font-black text-outline/15">{num}</span>
                  <h4 className="text-lg font-headline font-bold text-on-background">{title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
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

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
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
              
              {/* Verified badge */}
              <div className="flex items-center gap-1.5 mb-5">
                <span className="material-symbols-outlined text-[#4ADE80] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-[11px] font-semibold text-[#4ADE80] uppercase tracking-widest">Verified ClaimCalculator User</span>
              </div>

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
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-7"
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
              className="cta-gradient cta-shimmer text-on-primary-fixed w-full sm:w-auto px-10 py-5 rounded-[16px] font-headline font-bold text-lg flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(164,230,255,0.2)] hover:shadow-[0_8px_50px_rgba(164,230,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
            >
              See What Your Case Is Worth
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
            </button>
            <p className="text-xs text-outline">No cost. No commitment. SSL encrypted.</p>
          </motion.div>
        </section>

      </main>

    </div>
  )
}

export default App
