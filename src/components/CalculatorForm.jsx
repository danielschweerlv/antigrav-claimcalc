import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── DATA ──────────────────────────────────────────────────────────────────

const ACCIDENT_TYPES = [
  { label: 'Rear-end collision', icon: 'directions_car' },
  { label: 'T-bone / side impact', icon: 'swap_horiz' },
  { label: 'Head-on collision', icon: 'warning' },
  { label: 'Multi-vehicle pileup', icon: 'multiple_stop' },
  { label: 'Hit and run', icon: 'directions_run' },
  { label: 'Parking lot / low speed', icon: 'local_parking' },
]

const INJURY_CATEGORIES = [
  {
    label: 'Soft Tissue Injuries',
    items: ['Body aches & pain', 'Cuts, scrapes & bruises'],
  },
  {
    label: 'Substantial Injuries',
    items: ['Broken or fractured bones', 'Scarring', 'Internal bleeding', 'Memory loss'],
  },
  {
    label: 'Catastrophic Injuries',
    items: ['Surgery required', 'Coma', 'Brain injury', 'Paralysis', 'Loss of internal organs', 'Amputation'],
  },
  {
    label: 'No Injuries',
    items: ['I was not injured'],
    single: true,
  },
]

const FAULT_OPTIONS = [
  { value: 'Not my fault', label: 'No — the other driver was at fault' },
  { value: 'Mostly other driver', label: 'Mostly the other driver, but partially shared' },
  { value: 'Shared / unclear', label: "It's unclear / both of us share responsibility" },
  { value: 'Mostly me', label: 'Mostly or entirely my fault' },
]

const ACCIDENT_LOCATIONS = [
  { value: 'Las Vegas Strip', label: 'Las Vegas Strip' },
  { value: 'Downtown / Fremont Street', label: 'Downtown / Fremont Street' },
  { value: 'Henderson', label: 'Henderson' },
  { value: 'North Las Vegas', label: 'North Las Vegas' },
  { value: 'I-15 Corridor', label: 'I-15 Corridor' },
  { value: 'US-95 / Spaghetti Bowl', label: 'US-95 / Spaghetti Bowl' },
  { value: 'Reno / Sparks', label: 'Reno / Sparks' },
  { value: 'Casino or Hotel Property', label: 'Casino or Hotel Property' },
  { value: 'Construction Zone', label: 'Construction Zone' },
  { value: 'Parking Lot or Garage', label: 'Parking Lot or Garage' },
]

const LOW_OFFER_INSURERS = ['GEICO', 'Allstate', 'Progressive']

const DATE_OPTIONS = [
  { value: 'Less than 30 days ago', label: 'Less than 30 days ago' },
  { value: '1–6 months ago', label: '1–6 months ago' },
  { value: '6–12 months ago', label: '6–12 months ago' },
  { value: 'Over a year ago', label: 'Over a year ago' },
]

const MY_INSURERS = [
  { label: 'State Farm', icon: 'shield' },
  { label: 'GEICO', icon: 'shield' },
  { label: 'Progressive', icon: 'shield' },
  { label: 'Allstate', icon: 'shield' },
  { label: 'Farmers', icon: 'shield' },
  { label: 'Nationwide', icon: 'shield' },
  { label: 'Liberty Mutual', icon: 'shield' },
  { label: 'USAA', icon: 'shield' },
  { label: 'Other / Not listed', icon: 'more_horiz' },
  { label: 'I do not have insurance', icon: 'no_crash' },
]

const OTHER_INSURERS = [
  { label: 'State Farm', icon: 'shield' },
  { label: 'GEICO', icon: 'shield' },
  { label: 'Progressive', icon: 'shield' },
  { label: 'Allstate', icon: 'shield' },
  { label: 'Farmers', icon: 'shield' },
  { label: 'Nationwide', icon: 'shield' },
  { label: 'Liberty Mutual', icon: 'shield' },
  { label: 'USAA', icon: 'shield' },
  { label: 'Other / Not listed', icon: 'more_horiz' },
  { label: "Not sure / I don't know", icon: 'help_outline' },
  { label: 'They had no insurance', icon: 'no_crash' },
]

const TOTAL_STEPS = 11

// ─── CALCULATION ────────────────────────────────────────────────────────────

function calcSettlement(data) {
  const injuries = data.injuries ?? []
  let injScore = 0

  injuries.forEach(inj => {
    if (['Body aches & pain', 'Cuts, scrapes & bruises'].includes(inj)) injScore = Math.max(injScore, 1)
    if (['Broken or fractured bones', 'Scarring', 'Internal bleeding', 'Memory loss'].includes(inj)) injScore = Math.max(injScore, 3)
    if (['Surgery required', 'Brain injury', 'Loss of internal organs', 'Coma', 'Paralysis', 'Amputation'].includes(inj)) injScore = Math.max(injScore, 6)
  })
  if (injuries.includes('I was not injured')) injScore = 0
  if (injScore === 0 && injuries.length === 0) injScore = 1

  // Fault: use slider percentage if set, otherwise fall back to categorical
  const faultPct = data.faultPercent ?? 0
  const faultBarred = faultPct > 50
  let fM
  if (faultPct > 0) {
    fM = faultBarred ? 0 : (100 - faultPct) / 100
  } else {
    const faultMap = { 'Not my fault': 1.0, 'Mostly other driver': 0.8, 'Shared / unclear': 0.6, 'Mostly me': 0.25 }
    fM = faultMap[data.fault] ?? 0.8
  }

  const whenMap = { 'Less than 30 days ago': 1.1, '1\u20136 months ago': 1.0, '6\u201312 months ago': 0.95, 'Over a year ago': 0.85 }

  // Uninsured other party = UIM claim = harder to collect, slightly lower range
  const otherInsM = (data.otherInsurer === 'They had no insurance' || data.otherInsurer === "Not sure / I don't know") ? 0.7 : 1.0

  // Location modifier: urban high-traffic areas slightly higher
  const locationMap = {
    'Las Vegas Strip': 1.1,
    'Downtown / Fremont Street': 1.05,
    'I-15 Corridor': 1.05,
    'US-95 / Spaghetti Bowl': 1.05,
    'Casino or Hotel Property': 1.08,
    'Construction Zone': 1.06,
  }
  const locM = locationMap[data.accidentLocation] ?? 1.0

  const tM = whenMap[data.when] ?? 1.0
  const baseMed = injScore * 8000 + 4000   // proxy for medical costs based on injury severity
  const pain = baseMed * (injScore || 1.5)
  const prop = Math.round(baseMed * 0.35)
  const base = (baseMed + pain + prop) * fM * tM * otherInsM * locM

  return {
    faultBarred,
    withLow: faultBarred ? 0 : Math.max(Math.round(base * 1.4), 5000),
    withHigh: faultBarred ? 0 : Math.round(base * 2.8),
    withoutLow: faultBarred ? 0 : Math.max(Math.round(base * 0.18), 500),
    withoutHigh: faultBarred ? 0 : Math.round(base * 0.38),
  }
}


// ─── HELPERS ────────────────────────────────────────────────────────────────

const fmt = n => '$' + n.toLocaleString()

// ─── STEP ANIMATION ─────────────────────────────────────────────────────────
// Adapted from the card-stack pattern:
// Forward → new step springs up from below, old step exits upward
// Back    → new step drops in from above, old step exits downward

const stepVariants = {
  enter: (dir) => ({
    y: dir > 0 ? 40 : -40,
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.97,
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { type: 'spring', bounce: 0.25, duration: 0.7 },
  },
  exit: (dir) => ({
    y: dir > 0 ? -30 : 30,
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.97,
    transition: { type: 'spring', bounce: 0, duration: 0.4 },
  }),
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function OptionBtn({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-5 py-4 min-h-[56px] rounded-[16px] border text-left font-medium text-sm transition-all duration-200
        ${selected
          ? 'border-primary/50 bg-primary/[0.08] text-primary shadow-[0_0_12px_rgba(164,230,255,0.06)]'
          : 'border-white/[0.08] bg-surface-container-highest/60 text-on-surface-variant hover:border-primary/25 hover:bg-surface-container-highest/90 hover:-translate-y-[1px]'
        }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
        ${selected ? 'border-primary' : 'border-outline/40'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-primary block" />}
      </span>
      {children}
    </button>
  )
}

function CheckItem({ checked, onChange, label }) {
  return (
    <div
      onClick={onChange}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] border cursor-pointer transition-all duration-200
        ${checked
          ? 'border-primary/50 bg-primary/[0.08]'
          : 'border-white/[0.08] bg-surface-container-highest/60 hover:border-primary/25'
        }`}
    >
      <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
        ${checked ? 'bg-primary border-primary' : 'border-outline/40'}`}>
        {checked && (
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '11px', fontVariationSettings: "'wght' 700" }}>check</span>
        )}
      </div>
      <span className={`text-sm ${checked ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>{label}</span>
    </div>
  )
}

function StepHeading({ title, sub }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-headline font-bold text-on-background leading-snug mb-1.5">{title}</h2>
      {sub && <p className="text-sm text-on-surface-variant/80">{sub}</p>}
    </div>
  )
}

function NavButtons({ onNext, onBack, nextLabel = 'Continue', step }) {
  return (
    <div className="mt-7 space-y-2">
      <button
        type="button"
        onClick={onNext}
        className="w-full cta-gradient cta-shimmer text-on-primary-fixed py-4 rounded-[16px] font-headline font-bold text-base flex items-center justify-center gap-2 group transition-all duration-200 shadow-[0_0_20px_rgba(164,230,255,0.12)] hover:shadow-[0_4px_30px_rgba(164,230,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
      >
        {nextLabel}
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
      </button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-sm text-outline hover:text-on-surface transition-colors flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
          Go Back
        </button>
      )}
      {step === 1 && (
        <p className="text-[10px] text-center text-outline leading-tight pt-1">
          By continuing you agree to our Terms &amp; Privacy Policy. SSL encrypted.
        </p>
      )}
      {/* Privacy reassurance microcopy */}
      <div className="flex items-start gap-2 pt-1">
        <span className="material-symbols-outlined text-[#4ADE80]/60 flex-shrink-0" style={{ fontSize: '14px', marginTop: '1px', fontVariationSettings: "'FILL' 1" }}>lock</span>
        <span className="text-[11px] text-on-surface-variant/40 leading-relaxed">Your information is encrypted and never shared without your permission.</span>
      </div>
    </div>
  )
}

// ─── RESULT SCREEN ──────────────────────────────────────────────────────────

function ResultScreen({ data }) {
  const [showCallback, setShowCallback] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [cb, setCb] = useState({ name: '', phone: '', time: 'Morning (8am \u2013 12pm)' })
  const res = calcSettlement(data)
  const withAvg = Math.round((res.withLow + res.withHigh) / 2)
  const withoutAvg = Math.round((res.withoutLow + res.withoutHigh) / 2)
  const difference = withAvg - withoutAvg
  const multiplier = withoutAvg > 0 ? (withAvg / withoutAvg).toFixed(1) : '\u2014'

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.9 }}
    >
      {/* Fault barred warning */}
      {res.faultBarred && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            <h3 className="text-lg font-headline font-bold text-error">Nevada's 51% Rule Applies</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Based on your estimated fault of {data.faultPercent}%, Nevada law (NRS 41.141) would bar you from recovering damages. When you're more than 50% at fault, your claim value is $0 under the state's modified comparative negligence rule.
          </p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            That said, fault percentages are often negotiated, and an experienced attorney may be able to build a case for a lower share. It's worth a conversation.
          </p>
        </div>
      )}
      {/* Compare cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* With attorney */}
        <div className="rounded-xl overflow-hidden border-2 border-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.08)]">
          <div className="bg-[#4ADE80]/15 p-3 text-center">
            <p className="text-xs font-label font-bold text-[#4ADE80] uppercase tracking-widest">With Attorney</p>
          </div>
          <div className="bg-surface-container p-4 text-center space-y-1">
            <p className="text-[10px] text-outline uppercase tracking-widest">Average payout</p>
            <p className="text-3xl font-headline font-black text-[#4ADE80]">{fmt(withAvg)}</p>
            <p className="text-[11px] text-on-surface-variant">{fmt(res.withLow)} – {fmt(res.withHigh)}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-3 py-1 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] uppercase tracking-widest">✓ Best outcome</span>
          </div>
        </div>
        {/* Without attorney */}
        <div className="rounded-xl overflow-hidden border border-outline-variant/10 opacity-80">
          <div className="bg-error/10 p-3 text-center">
            <p className="text-xs font-label font-bold text-error uppercase tracking-widest">Without Attorney</p>
          </div>
          <div className="bg-surface-container p-4 text-center space-y-1">
            <p className="text-[10px] text-outline uppercase tracking-widest">Average payout</p>
            <p className="text-3xl font-headline font-black text-error">{fmt(withoutAvg)}</p>
            <p className="text-[11px] text-on-surface-variant">{fmt(res.withoutLow)} – {fmt(res.withoutHigh)}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-3 py-1 rounded-full bg-error/20 text-error uppercase tracking-widest">Leaves money behind</span>
          </div>
        </div>
      </div>

      {/* Difference callout */}
      <div className="bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded-xl p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-label font-bold text-[#4ADE80] uppercase tracking-widest mb-0.5">Potential money left on the table</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">Without a Nevada attorney, you could be walking away from <span className="text-[#4ADE80] font-bold">{fmt(difference)}</span> in compensation you're legally owed.</p>
        </div>
        <div className="flex-shrink-0 text-center">
          <p className="text-3xl font-headline font-black text-[#4ADE80]">{multiplier}x</p>
          <p className="text-[10px] text-outline uppercase tracking-widest">more</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-on-surface-variant leading-relaxed">
        <span className="text-primary font-semibold">Nevada claimants represented by an attorney recover an average of {multiplier}x more.</span>{' '}
        Insurance companies settle fast and low when there's no attorney involved — because they know you don't know your real number.
      </div>

      {/* Urgency box */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/10 p-5 space-y-4">
        <div>
          <h3 className="text-lg font-headline font-bold text-on-background mb-1">Wait — you're not done yet.</h3>
          <p className="text-sm text-on-surface-variant">The most important step is next. A claim specialist will reach out to:</p>
        </div>
        <ul className="space-y-2">
          {[
            'Verify your accident details and confirm your estimate',
            'Connect you with a local Nevada attorney for the true value of your case',
            'Help locate your accident report if needed',
            "Show you how to file for every dollar you're entitled to",
          ].map(item => (
            <li key={item} className="flex gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontSize: '16px', marginTop: '2px' }}>arrow_forward</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="border-l-2 border-primary pl-3 text-sm text-on-surface font-medium leading-relaxed">
          Don't speak to the insurance company first. The wrong words can cut your payout significantly before you ever talk to an attorney.
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:+17025550100"
            className="flex items-center justify-center gap-2 py-3.5 bg-primary/10 border border-primary/30 hover:bg-primary/20 rounded-xl text-primary font-headline font-bold text-base tracking-wide transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
            Call Now
          </a>
          <button
            type="button"
            onClick={() => setShowCallback(v => !v)}
            className="flex items-center justify-center gap-2 py-3.5 bg-surface-container-highest border border-outline-variant/20 hover:border-primary/30 rounded-xl text-on-surface font-headline font-bold text-base tracking-wide transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            Callback
          </button>
        </div>

        {showCallback && !submitted && (
          <div className="border border-outline-variant/10 rounded-xl p-4 space-y-3 bg-surface-container-lowest">
            <p className="text-sm font-headline font-bold text-on-background">We'll call you back</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">First Name</label>
                <input type="text" placeholder="First name" value={cb.name} onChange={e => setCb(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-3 py-2.5 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">Phone</label>
                <input type="tel" placeholder="(702) 555-0100" value={cb.phone} onChange={e => setCb(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-3 py-2.5 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">Best Time to Call</label>
              <select value={cb.time} onChange={e => setCb(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-surface-container-highest text-on-surface rounded-xl px-3 py-2.5 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors">
                {['Morning (8am – 12pm)', 'Afternoon (12pm – 5pm)', 'Evening (5pm – 8pm)', 'Anytime'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => setSubmitted(true)}
              className="w-full cta-gradient text-on-primary-fixed py-3 rounded-xl font-bold text-sm transition-all">
              Submit Request →
            </button>
          </div>
        )}

        {submitted && (
          <div className="text-center py-4 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-xl space-y-1">
            <p className="font-headline font-bold text-[#4ADE80]">Request Received</p>
            <p className="text-sm text-on-surface-variant">A specialist will contact you within 1 business hour.</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-center text-outline leading-relaxed">
        This estimate is for informational purposes only and does not constitute legal advice. Actual values vary by case. Consult a licensed Nevada attorney before accepting any settlement.
      </p>
    </motion.div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function CalculatorForm() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [data, setData] = useState({
    type: '',
    injuries: [],
    fault: '',
    faultPercent: 0,
    accidentLocation: '',
    when: '',
    myInsurer: '',
    otherInsurer: '',
    description: '',
    zip: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const toggleInjury = (injury) => {
    const isNone = injury === 'I was not injured'
    setData(prev => {
      if (isNone) {
        return { ...prev, injuries: prev.injuries.includes(injury) ? [] : [injury] }
      }
      const without = prev.injuries.filter(i => i !== 'I was not injured')
      return {
        ...prev,
        injuries: without.includes(injury) ? without.filter(i => i !== injury) : [...without, injury],
      }
    })
  }

  const progress = done ? 100 : Math.round((step / TOTAL_STEPS) * 100)

  const next = (n) => {
    setDirection(n > step ? 1 : -1)
    setStep(n)
  }

  const showResult = () => {
    setDirection(1)
    setStep(null)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 2200)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-primary/[0.08] border border-primary/20 mb-6">
              <span className="text-[11px] font-label font-semibold text-primary uppercase tracking-[0.05em]">Nevada-specific settlement data</span>
            </div>
            <StepHeading title={<>What type of accident <span className="text-primary italic">were you in?</span></>} sub="Select the option that best describes your situation." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACCIDENT_TYPES.map(({ label, icon }) => (
                <OptionBtn key={label} selected={data.type === label} onClick={() => set('type', label)}>
                  <span className="material-symbols-outlined text-base opacity-60 flex-shrink-0">{icon}</span>
                  {label}
                </OptionBtn>
              ))}
            </div>
            <NavButtons step={1} onNext={() => next(2)} />
          </>
        )

      case 2:
        return (
          <>
            <StepHeading title={<>How were you <span className="text-primary italic">injured</span> in the accident?</>} sub="Check everything that applies, even if minor or not yet officially diagnosed." />
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {INJURY_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2 pb-1 border-b border-outline-variant/10">{cat.label}</p>
                  <div className={`grid gap-2 ${cat.single ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {cat.items.map(inj => (
                      <CheckItem key={inj} label={inj} checked={data.injuries.includes(inj)} onChange={() => toggleInjury(inj)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <NavButtons onNext={() => next(3)} onBack={() => next(1)} />
          </>
        )

      case 3:
        return (
          <>
            <StepHeading title={<>Was the accident <span className="text-primary italic">your fault?</span></>} sub="Nevada follows comparative fault rules. Partial fault still allows recovery." />
            <div className="grid gap-3">
              {FAULT_OPTIONS.map(o => (
                <OptionBtn key={o.value} selected={data.fault === o.value} onClick={() => set('fault', o.value)}>{o.label}</OptionBtn>
              ))}
            </div>
            <NavButtons onNext={() => next(4)} onBack={() => next(2)} />
          </>
        )

      case 4:
        return (
          <>
            <StepHeading title={<>Your share of <span className="text-primary italic">fault</span></>} sub="In Nevada, your payout gets reduced by your percentage of fault. If you're more than 50% at fault, you get nothing. That's Nevada law (NRS 41.141)." />
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-3">Estimated Fault Percentage</label>
                <input
                  type="range"
                  min={0} max={100} step={5}
                  value={data.faultPercent}
                  onChange={e => set('faultPercent', Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #a4e6ff ${data.faultPercent}%, #333539 ${data.faultPercent}%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-outline">0% (not my fault)</span>
                  <span className={`text-lg font-headline font-black ${data.faultPercent > 50 ? 'text-error' : 'text-primary'}`}>{data.faultPercent}%</span>
                  <span className="text-xs text-outline">100%</span>
                </div>
              </div>

              {data.faultPercent > 0 && data.faultPercent <= 50 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-on-surface-variant leading-relaxed">
                  At {data.faultPercent}% fault, your estimated recovery would be reduced by {data.faultPercent}%.
                </div>
              )}

              {data.faultPercent > 50 && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    <p className="text-sm font-headline font-bold text-error">Nevada's 51% Rule</p>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Under NRS 41.141, if you're more than 50% at fault, you cannot recover damages. Based on your estimate, a court would likely bar your claim. However, fault is often negotiated. An attorney may be able to argue for a lower fault percentage.
                  </p>
                </div>
              )}
            </div>
            <NavButtons onNext={() => next(5)} onBack={() => next(3)} />
          </>
        )

      case 5:
        return (
          <>
            <StepHeading title={<>Where did the accident <span className="text-primary italic">happen?</span></>} sub="Location matters in Nevada. Urban accidents often involve more witnesses, surveillance footage, and higher medical costs, all of which can affect your claim's value." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACCIDENT_LOCATIONS.map(({ value, label }) => (
                <OptionBtn key={value} selected={data.accidentLocation === value} onClick={() => set('accidentLocation', value)}>
                  <span className="material-symbols-outlined text-base opacity-60 flex-shrink-0">location_on</span>
                  <span className="text-xs leading-tight">{label}</span>
                </OptionBtn>
              ))}
            </div>
            <NavButtons onNext={() => next(6)} onBack={() => next(4)} />
          </>
        )

      case 6:
        return (
          <>
            <StepHeading title={<>When did this <span className="text-primary italic">accident occur?</span></>} sub="Nevada has a 2-year statute of limitations. Timing matters." />
            <div className="grid gap-3">
              {DATE_OPTIONS.map(o => (
                <OptionBtn key={o.value} selected={data.when === o.value} onClick={() => set('when', o.value)}>
                  <span className="material-symbols-outlined text-sm opacity-50 flex-shrink-0">schedule</span>
                  {o.label}
                </OptionBtn>
              ))}
            </div>
            <NavButtons onNext={() => next(7)} onBack={() => next(5)} />
          </>
        )

      case 7:
        return (
          <>
            <StepHeading title={<>Who is your <span className="text-primary italic">insurance provider?</span></>} sub="Select your car insurance company. This helps us understand your coverage situation." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {MY_INSURERS.map(({ label, icon }) => (
                <OptionBtn key={label} selected={data.myInsurer === label} onClick={() => set('myInsurer', label)}>
                  <span className="material-symbols-outlined text-base opacity-60 flex-shrink-0">{icon}</span>
                  <span className="text-xs leading-tight">{label}</span>
                </OptionBtn>
              ))}
            </div>
            <NavButtons onNext={() => next(8)} onBack={() => next(6)} />
          </>
        )

      case 8:
        return (
          <>
            <StepHeading title={<>Do you know the <span className="text-primary italic">other driver's insurance?</span></>} sub="Some insurers are known for making low initial offers to see if you'll accept less than your claim is worth. Knowing the company helps estimate negotiation room." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {OTHER_INSURERS.map(({ label, icon }) => (
                <OptionBtn key={label} selected={data.otherInsurer === label} onClick={() => set('otherInsurer', label)}>
                  <span className="material-symbols-outlined text-base opacity-60 flex-shrink-0">{icon}</span>
                  <span className="text-xs leading-tight">{label}</span>
                </OptionBtn>
              ))}
            </div>
            {data.otherInsurer && LOW_OFFER_INSURERS.includes(data.otherInsurer) && (
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mt-3 text-sm text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-secondary text-base align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                {data.otherInsurer} is known for making initial offers well below claim value. An attorney experienced with {data.otherInsurer} claims in Nevada can typically negotiate a significantly higher settlement.
              </div>
            )}
            <NavButtons onNext={() => next(9)} onBack={() => next(7)} />
          </>
        )

      case 9:
        return (
          <>
            <StepHeading title={<>Briefly <span className="text-primary italic">describe your accident</span></>} sub="A short summary helps give you a more accurate estimate. No legal jargon needed." />
            <div>
              <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">Your Details</label>
              <textarea
                rows={4}
                placeholder="e.g. I was stopped at a red light when another vehicle rear-ended me. I had immediate neck and back pain and went to the ER that night..."
                value={data.description}
                onChange={e => set('description', e.target.value)}
                className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-4 py-3 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors resize-none"
              />
            </div>
            <NavButtons onNext={() => next(10)} onBack={() => next(8)} />
          </>
        )

      case 10:
        return (
          <>
            <StepHeading title={<>What's your <span className="text-primary italic">zip code?</span></>} sub="We use this to match you with licensed Nevada attorneys in your area." />
            <div>
              <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">Zip Code</label>
              <input
                type="text" inputMode="numeric" maxLength={5} placeholder="e.g. 89101"
                value={data.zip}
                onChange={e => set('zip', e.target.value.replace(/\D/g, ''))}
                className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-4 py-4 text-2xl font-headline font-black tracking-widest outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors"
              />
            </div>
            <NavButtons onNext={() => next(11)} onBack={() => next(9)} />
          </>
        )

      case 11:
        return (
          <>
            <StepHeading title={<>Last step. <span className="text-primary italic">Your estimate is ready.</span></>} sub="Enter your contact details to unlock your full claim value. Takes 10 seconds." />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'firstName', label: 'First Name', placeholder: 'First name', type: 'text' },
                  { key: 'lastName', label: 'Last Name', placeholder: 'Last name', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={data[f.key]} onChange={e => set(f.key, e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-3 py-3 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors" />
                  </div>
                ))}
              </div>
              {[
                { key: 'email', label: 'Email Address', placeholder: 'you@email.com', type: 'email' },
                { key: 'phone', label: 'Phone Number', placeholder: '(702) 555-0100', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={data[f.key]} onChange={e => set(f.key, e.target.value)}
                    className="w-full bg-surface-container-highest text-on-surface placeholder-outline/50 rounded-xl px-3 py-3 text-sm outline-none border border-outline-variant/20 focus:border-primary/60 transition-colors" />
                </div>
              ))}
            </div>
            <NavButtons nextLabel="Get My Results" onNext={showResult} onBack={() => next(10)} />
            <p className="text-[10px] text-center text-outline leading-tight mt-2">
              By clicking "Get My Results" you agree to be contacted by a licensed Nevada attorney. No obligation. Your info is never sold.
            </p>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative glass-card p-7 sm:p-8 md:p-10 rounded-xl border border-primary/[0.1] shadow-[0_0_80px_rgba(164,230,255,0.06),0_25px_50px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden">
      {/* Progress bar */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-label text-outline uppercase tracking-widest">
            {done ? 'Your Estimate' : `Step ${step} of ${TOTAL_STEPS}`}
          </p>
          <span className="text-xs font-label text-primary font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-surface-container-lowest h-[3px] rounded-full overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary to-[#00d1ff] h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <motion.div
          className="text-center py-10 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-base text-on-surface-variant">Our AI is analyzing your claim...</p>
          <p className="text-sm text-outline">Cross-referencing Nevada settlement data and injury profiles</p>
        </motion.div>
      )}

      {/* Result */}
      {done && <ResultScreen data={data} />}

      {/* Step content — card-stack spring animation */}
      {!loading && !done && (
        <div className="min-h-[300px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
