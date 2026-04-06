import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedGroup } from './ui/animated-group'

const transitionVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 16 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring', bounce: 0.25, duration: 1.4 },
    },
  },
}

const STORIES = [
  {
    initial: 12000,
    final: 85000,
    quote: "I got rear-ended on I-15 near Flamingo and the adjuster acted like my back pain wasn't even real. ClaimCalculator showed me my case was worth a lot more — I stopped second-guessing myself and got an attorney.",
    initials: 'M.R.',
    location: 'Las Vegas, NV',
    weeks: 12,
    type: 'Rear-End Collision',
    date: 'October 2025',
  },
  {
    initial: 25000,
    final: 175000,
    quote: "I had no idea what my case was actually worth after my motorcycle accident on US-95. The free estimate gave me something real to compare against — what the insurance company was offering didn't even come close.",
    initials: 'J.T.',
    location: 'Henderson, NV',
    weeks: 16,
    type: 'Motorcycle Accident',
    date: 'July 2025',
  },
  {
    initial: 18000,
    final: 125000,
    quote: "I slipped in a casino parking garage off the Strip and they tried to say it was my own fault. Once I saw the estimate, I knew I had a real case. Ended up settling for way more than they initially put on the table.",
    initials: 'D.M.',
    location: 'Las Vegas, NV',
    weeks: 14,
    type: 'Premises Liability',
    date: 'October 2025',
  },
  {
    initial: 22000,
    final: 165000,
    quote: "The Lyft driver ran a red light on Tropicana and they tried to dodge responsibility. I honestly didn't know who to go after. ClaimCalculator pointed me in the right direction and my attorney handled the rest.",
    initials: 'M.T.',
    location: 'Las Vegas, NV',
    weeks: 16,
    type: 'Rideshare Accident',
    date: 'April 2025',
  },
  {
    initial: 35000,
    final: 210000,
    quote: "I was hit by an 18-wheeler on I-15 between Vegas and the California border. The trucking company's lawyers were aggressive from day one. Getting that estimate gave me the confidence to not back down.",
    initials: 'P.L.',
    location: 'North Las Vegas, NV',
    weeks: 20,
    type: 'Truck Accident',
    date: 'January 2025',
  },
  {
    initial: 22000,
    final: 95000,
    quote: "Got doored by a delivery driver near Fremont Street while I was on my bicycle. The city and the driver both tried to point fingers at each other. I had no idea I could go after both — ClaimCalculator opened my eyes.",
    initials: 'S.K.',
    location: 'Las Vegas, NV',
    weeks: 18,
    type: 'Bicycle Accident',
    date: 'November 2024',
  },
  {
    initial: 40000,
    final: 285000,
    quote: "Construction zone on US-95 near the Spaghetti Bowl — lane shifts, missing signage, and no warning. After seeing the estimate I realized this wasn't just a fender bender claim. My attorney got way more than I expected.",
    initials: 'R.H.',
    location: 'Las Vegas, NV',
    weeks: 22,
    type: 'Construction Zone Crash',
    date: 'September 2024',
  },
  {
    initial: 15000,
    final: 78000,
    quote: "I tripped on a broken curb outside a casino resort near the Strip. Security footage existed but they said it was inconclusive. ClaimCalculator showed me premises cases like mine had real value — I kept pushing.",
    initials: 'J.W.',
    location: 'Paradise, NV',
    weeks: 15,
    type: 'Slip & Fall',
    date: 'July 2024',
  },
  {
    initial: 20000,
    final: 92000,
    quote: "I was a pedestrian crossing at a marked crosswalk near UNLV and got hit. The driver's insurance only offered enough to cover my ER bill. The estimate showed me the full picture — pain, lost wages, the whole thing.",
    initials: 'M.C.',
    location: 'Las Vegas, NV',
    weeks: 24,
    type: 'Pedestrian Accident',
    date: 'May 2024',
  },
  {
    initial: 8000,
    final: 52000,
    quote: "Rear-ended in a parking structure at one of the casino resorts. The other driver's insurance offered practically nothing. I almost just let it go — then I ran my case through the calculator and changed my mind.",
    initials: 'L.M.',
    location: 'Summerlin, NV',
    weeks: 10,
    type: 'Parking Lot Accident',
    date: 'March 2024',
  },
  {
    initial: 30000,
    final: 145000,
    quote: "They tried to use my old shoulder injury against me to lower my payout after a crash on Sahara Ave. My attorney used the calculator estimate as a starting point and proved the accident made everything significantly worse.",
    initials: 'C.R.',
    location: 'Henderson, NV',
    weeks: 16,
    type: 'Car Accident',
    date: 'February 2024',
  },
  {
    initial: 15000,
    final: 88000,
    quote: "I was a passenger in an Uber that got T-boned near Nellis. Both the at-fault driver and Uber's policy were in play — I had no idea how to navigate that. The calculator and the attorney they matched me with figured it all out.",
    initials: 'K.J.',
    location: 'Las Vegas, NV',
    weeks: 18,
    type: 'Uber Accident',
    date: 'January 2024',
  },
]

const PAGE_SIZE = 6

function pct(initial, final) {
  return Math.round(((final - initial) / initial) * 100)
}

function fmt(n) {
  return '$' + n.toLocaleString()
}

export default function SuccessStoriesSection() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(STORIES.length / PAGE_SIZE)
  const visible = STORIES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="py-20 lg:py-28 px-4 lg:px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <AnimatedGroup
          variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
          className="text-center space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 mb-2">
            <span className="material-symbols-outlined text-[#4ADE80] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[11px] font-label font-semibold text-[#4ADE80] uppercase tracking-widest">Real Nevada Results</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-headline font-bold">
            What Nevada Residents{' '}
            <span className="text-primary italic">Actually Recovered</span>
          </h2>
          <p className="text-on-surface-variant text-base lg:text-lg max-w-2xl mx-auto">
            These are real outcomes from people who discovered their case was worth far more than the insurance company's first offer.
          </p>
        </AnimatedGroup>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {visible.map((s, i) => {
              const increase = pct(s.initial, s.final)
              return (
                <motion.div
                  key={`${page}-${i}`}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 1.2, delay: i * 0.06 }}
                  className="flex flex-col gap-4 p-6 rounded-xl bg-surface-container-low border border-white/[0.06] hover:border-primary/20 transition-all duration-300 group"
                >
                  {/* Before / After */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-outline uppercase tracking-widest font-semibold">Initial Offer</p>
                      <p className="text-lg font-headline font-bold text-on-surface-variant line-through decoration-outline/50">{fmt(s.initial)}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-base mt-3">arrow_forward</span>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[10px] text-outline uppercase tracking-widest font-semibold">Final Settlement</p>
                      <p className="text-lg font-headline font-black text-[#4ADE80]">{fmt(s.final)}</p>
                    </div>
                    {/* % badge */}
                    <div className="ml-1 flex-shrink-0 self-start mt-1 px-2 py-1 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                      <span className="text-[11px] font-headline font-bold text-[#4ADE80]">+{increase}%</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.06]" />

                  {/* Quote */}
                  <p className="text-sm text-on-surface-variant leading-relaxed flex-1 italic">
                    &ldquo;{s.quote}&rdquo;
                  </p>

                  {/* Footer */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="text-[13px] font-bold text-on-background">{s.initials}</p>
                      <p className="text-[11px] text-outline">{s.location}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[11px] text-outline">{s.type}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="material-symbols-outlined text-outline text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                        <p className="text-[11px] text-outline">{s.weeks} weeks · {s.date}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-on-surface-variant hover:border-primary/30 hover:text-on-background disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
              Previous
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${page === i ? 'bg-primary w-6' : 'bg-outline-variant/30 hover:bg-outline-variant w-2'}`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-on-surface-variant hover:border-primary/30 hover:text-on-background disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        )}

        {/* Bottom stat summary */}
        <motion.div
          className="mt-14 p-6 lg:p-8 rounded-xl border border-white/[0.06] bg-surface-container-low flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
        >
          <span className="material-symbols-outlined text-primary text-4xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          <div className="flex-1">
            <p className="text-base font-headline font-bold text-on-background">
              Nevada injury victims who use an attorney recover an average of <span className="text-primary">3.2× more</span> than those who don't.
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              Don't leave money on the table. Your free estimate takes under 2 minutes.
            </p>
          </div>
          <a
            href="/calculator"
            className="cta-gradient cta-shimmer text-on-primary-fixed px-6 py-3 rounded-[14px] font-headline font-bold text-sm flex items-center gap-2 flex-shrink-0 shadow-[0_0_20px_rgba(164,230,255,0.15)] hover:shadow-[0_6px_30px_rgba(164,230,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
          >
            Get My Free Estimate
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
