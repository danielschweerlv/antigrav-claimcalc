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

      <main className="relative z-10 pt-[72px]">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative flex items-center px-4 lg:px-8 py-16 lg:py-32 min-h-[600px] lg:min-h-[780px] overflow-hidden">
          
          {/* Background glow — positioned behind calculator */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-[15%] w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left column */}
            <AnimatedGroup variants={transitionVariants} className="space-y-6 lg:space-y-0 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 lg:mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse flex-shrink-0"></span>
                <span className="text-[11px] font-label font-semibold text-[#4ADE80] uppercase tracking-widest">Nevada Personal Injury Calculator</span>
              </div>

              {/* Headline — stronger size contrast */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-black text-on-background leading-[0.95] tracking-tight lg:mb-7">
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
                <div className="flex -space-x-2.5">
                  {[
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUUSlwtNdlTQyrWVYdQnqEG2G2D2qWsw8r3tEiX44M9NjTr6eGMRe5iNyh1igPZcX65tvaKU24HKD_ViEu1-vmm1ZyazdoVFdaBd-gOB-iJopbsj7CWmPEh_z2k5lhJbcUa1BQNSwHpD7Q9mFujNPUpbTPzfQ-3s8i-aCFYAKSA7ToQBPjYxtWPKZ9vcMOxxLWWwoiSpbTZoukQ2UJdSse3T5EGjjJTH_EbQZXwioeOefNc3mdh8fCnEIaf6hhgfpIyoutzG0uHBg',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDiiq9OcBBRXDRd1IO8Q3jyBqM9sfQ-enET6QgJD7RfCodMdVApoZPPMLpwObQxVZS679HErC21H0TqZMHW7P5HGJ94mqeUuWZHKdb9ZGXrbBCYqKaOfbE_Pf20f2Oindpn_H5fXvT1exHXEpMzVstozNUbT7OoHxTcIqOeloguSCUGiBQ0CLYcfNhjvk6vxe7H6o7C96bIOnwhWF4K-MJg0T8bGZHoEhjsSTJX0tmbUGIZ1F8G3TeDNibUacJt1o34L3Ix2vUvrrU',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2xiR_WMueO6jb2T0wmxvLry5Jkp3XF11qlJC13GEG-_g5HSypgEXr1K05c4Hi7IKOyiz1cqcsMTamtRolNarJ0tI1SNJVbNxJc1AfKNukt8fW7sMTmcGhX94viu-6QrSuUdAR896ovbG5XTR-GuPOh8dTj1xgzan7n8t6U6Y1WtHwjr7e7WfBUn8vAOMX8ot4yquiRTUyp4OthMggfdxWbyWivY1jeRZkTFL53MsPaAJs1R5mz7eUrBPaYlxJ0H2tcYBoTgaP4EE',
                  ].map((src, i) => (
                    <img key={i} className="w-9 h-9 rounded-full border-2 border-[#111318] object-cover" src={src} alt={`user ${i + 1}`} />
                  ))}
                </div>
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
                  See What Your Claim Is Worth
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
                </button>
                <p className="text-xs text-outline self-center text-center">No cost. No obligation. Built for Nevada injury claims.</p>
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
        <section className="px-4 lg:px-8 -mt-4 lg:-mt-8">
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
                    { src: '/logos/nevada-flag.svg', alt: 'State of Nevada' },
                    { src: '/logos/google-color.png', alt: 'Google' },
                    { src: '/logos/lvmpd-color.png', alt: 'LVMPD' },
                    { src: '/logos/nhp-color.png', alt: 'Nevada Highway Patrol' },
                    { src: '/logos/nvcourts-color.png', alt: 'Nevada Courts' },
                    { src: '/logos/bbb-color.svg', alt: 'Better Business Bureau' },
                    { src: '/logos/dmv-color.svg', alt: 'Nevada DMV' },
                    { src: '/logos/ag-color.png', alt: 'Nevada Attorney General' },
                  ].map(({ src, alt }) => (
                    <img
                      key={`${setIdx}-${alt}`}
                      src={src}
                      alt={alt}
                      className="h-9 w-auto object-contain shrink-0"
                      style={{ margin: '0 60px' }}
                      loading="eager"
                      onError={(e) => {
                        // Replace broken images with a text pill fallback
                        const pill = document.createElement('span');
                        pill.textContent = alt;
                        pill.style.cssText = 'display:inline-flex;align-items:center;height:36px;padding:0 16px;border:1px solid rgba(255,255,255,0.2);border-radius:999px;color:rgba(255,255,255,0.6);font-size:12px;font-weight:500;white-space:nowrap;margin:0 60px;';
                        e.target.replaceWith(pill);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <motion.p
            className="text-center mx-auto mt-5 px-5 lg:px-8"
            style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', maxWidth: '700px', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            All data sources are publicly available. ClaimCalculator.ai is not affiliated with or endorsed by any of the organizations listed below.
          </motion.p>
        </section>

        {/* ── TRUST STATS ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.1 } } }, item: transitionVariants.item }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {[
                { stat: '67%', label: 'Avg. Claim Undervalued', icon: 'verified' },
                { stat: '2,400+', label: 'Claims Evaluated', icon: 'groups' },
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
                Common Nevada <span className="text-primary italic">Injury Claims</span>
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg max-w-2xl mx-auto">
                Nevada roads, casinos, and construction zones create risks you won't find in other states. Here's what claims in your area typically look like.
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
                  desc: 'The most common injury claim in Nevada. Rear-end collisions, intersection crashes, and freeway pileups on I-15 and US-95.',
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
                  desc: 'The Las Vegas Strip sees some of the highest pedestrian traffic in the U.S. These claims tend to involve severe injuries.',
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
                See What Your Claim Is Worth
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
                { num: '03', title: 'Expert Match', body: 'Get connected with top Nevada attorneys who specialize in maximizing your specific claim type.' },
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
        <section className="py-20 lg:py-28 px-4 lg:px-8 bg-surface-container-lowest">
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
              See What Your Claim Is Worth
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
