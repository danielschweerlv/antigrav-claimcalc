# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the ClaimCalculator.ai homepage to an authoritative gold/dark law-firm aesthetic across 6 sections, plus add auto-advance UX and a passengers question to the calculator.

**Architecture:** `src/App.jsx` is fully rewritten in place (sections replaced one-by-one). `tailwind.config.js` and `index.css` are updated for the new color system. `src/components/CalculatorForm.jsx` receives targeted additions for the passengers step and auto-advance behavior.

**Tech Stack:** React 19, Vite, Tailwind CSS, Framer Motion, react-router-dom v7

---

## File Map

| File | Change |
|---|---|
| `tailwind.config.js` | `primary` token: cyan → gold `#c9a84c` |
| `src/index.css` | `.cta-gradient` and shadow colors: cyan → gold |
| `src/App.jsx` | Complete section rewrites (imports, hero, authority strip, case-for-knowing, how-it-works, testimonials, bottom CTA) |
| `src/components/CalculatorForm.jsx` | Add `passengers` step + auto-advance for single-choice steps |

**Do not touch:** `src/main.jsx`, `src/components/ui/canvas-reveal-effect.jsx`, any file under `src/pages/` (other pages are out of scope)

---

## Task 1: Update Color System

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Update `primary` token in tailwind.config.js**

In `tailwind.config.js`, change line 42:
```js
// Before:
"primary": "#a4e6ff",

// After:
"primary": "#c9a84c",
```

- [ ] **Step 2: Update `.cta-gradient` in index.css**

In `src/index.css`, change the `.cta-gradient` rule (line 35):
```css
/* Before: */
.cta-gradient {
  background: linear-gradient(135deg, #a4e6ff 0%, #00d1ff 100%);
}

/* After: */
.cta-gradient {
  background: linear-gradient(135deg, #d4a853 0%, #c9903c 100%);
}
```

- [ ] **Step 3: Update nav-link-animated underline color in index.css**

Change line 75 in `src/index.css`:
```css
/* Before: */
background: #a4e6ff;

/* After: */
background: #c9a84c;
```

- [ ] **Step 4: Verify dev server shows gold CTA button**

Run: `npm run dev`

Open browser at `http://localhost:5173`. The hero CTA button should now be gold/amber, not cyan.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "feat: swap primary color token from cyan to gold"
```

---

## Task 2: Rewrite Hero Section

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update imports at top of App.jsx**

Replace the existing import block with:
```jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CalculatorForm from './components/CalculatorForm'
import { AnimatedGroup } from './components/ui/animated-group'
import { TESTIMONIALS } from './data/testimonials'
```

Remove: `ShineBorder`, `WhatIsSection`, `RotatingAvatars` imports.

- [ ] **Step 2: Replace the HERO section (lines 40–107)**

Replace the entire `{/* ── HERO ──... */}` section with:
```jsx
{/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="relative flex flex-col items-center px-4 lg:px-8 pt-24 lg:pt-32 pb-0 min-h-screen" style={{ isolation: 'isolate', zIndex: 2 }}>

  {/* Background glows */}
  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#c9a84c]/[0.04] rounded-full blur-[120px] pointer-events-none" />

  {/* Text content — centered editorial */}
  <AnimatedGroup variants={transitionVariants} className="relative z-20 text-center space-y-7 max-w-4xl mx-auto w-full">

    {/* Overline */}
    <div>
      <span className="text-[11px] font-label font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
        Personal Injury Case Calculator
      </span>
    </div>

    {/* Headline */}
    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.05, color: '#e2e2e8', fontWeight: 400 }}>
      Most Injury Victims Settle for Less Than They're Owed.
    </h1>

    {/* Subhead */}
    <p className="text-base sm:text-lg text-on-surface-variant/85 max-w-xl mx-auto leading-relaxed">
      Find out what your case is actually worth — before you accept anything.
    </p>

    {/* CTA */}
    <div>
      <button
        onClick={() => navigate('/calculator')}
        className="cta-gradient cta-shimmer text-on-primary-fixed px-8 py-4 sm:py-5 rounded-[16px] font-headline font-bold text-lg inline-flex items-center gap-2 shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:shadow-[0_8px_40px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
      >
        Calculate My Case Value
        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-200" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
      </button>
    </div>
  </AnimatedGroup>

  {/* Calculator widget — anchored below the fold */}
  <motion.div
    className="relative w-full max-w-lg mx-auto mt-20 mb-0 z-20"
    initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ type: 'spring', bounce: 0.2, duration: 1.8, delay: 0.4 }}
  >
    <div className="rounded-xl border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
      <CalculatorForm />
    </div>
  </motion.div>

</section>
```

- [ ] **Step 3: Verify hero renders correctly**

Check browser at `http://localhost:5173`:
- Centered serif headline visible
- Gold CTA button
- Calculator widget below hero text, visible on all screen sizes
- No split 2-column layout

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: redesign hero to centered editorial layout with gold accent"
```

---

## Task 3: Rewrite Authority Strip

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the TRUST BAR section (lines 109–154)**

Replace the entire `{/* ── TRUST BAR ──... */}` section with:
```jsx
{/* ── AUTHORITY STRIP ────────────────────────────────────────── */}
<section
  className="px-4 lg:px-8 py-5"
  style={{ background: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}
>
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">

    {/* Left: As seen in + logos */}
    <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
      <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline whitespace-nowrap">As seen in</span>
      <div className="flex items-center gap-5 flex-wrap">
        {[
          { src: '/logos/lv-review-journal.png', alt: 'Las Vegas Review-Journal', h: '22px' },
          { src: '/logos/fox5-kvvu.png', alt: 'Fox 5 KVVU', h: '28px' },
          { src: '/logos/las-vegas-weekly.png', alt: 'Las Vegas Weekly', h: '18px' },
        ].map(({ src, alt, h }) => (
          <img
            key={alt}
            src={src}
            alt={alt}
            style={{ height: h, opacity: 0.35, filter: 'grayscale(1)' }}
            className="object-contain"
          />
        ))}
      </div>
    </div>

    {/* Right: Trust badges */}
    <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
      {[
        { icon: 'lock', text: 'SSL Secured' },
        { icon: 'money_off', text: 'Free — No Credit Card' },
        { icon: 'shield', text: 'Your Info Stays Private' },
      ].map(({ icon, text }) => (
        <div key={text} className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#c9a84c] text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>{icon}</span>
          <span className="text-[12px] text-on-surface-variant/60 font-medium">{text}</span>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify authority strip renders**

Check browser: thin gold-tinted band with logos on left, trust badges on right. On mobile, stacked.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: replace trust bar with gold authority strip"
```

---

## Task 4: Add "The Case for Knowing" + Remove WhatIsSection and Stats

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remove WhatIsSection and the old TRUSTED SOURCES section**

Delete the entire `{/* ── WHAT IS CLAIMCALCULATOR.AI ──... */}` block (one line: `<WhatIsSection />`).

Also delete the entire `{/* ── TRUSTED SOURCES ──... */}` section (the long logos marquee block, lines ~159–226).

Also delete the entire `{/* ── TRUST STATS ──... */}` section (the 4-card grid with 67%, 2400+, 4.5x, $0).

- [ ] **Step 2: Add "The Case for Knowing" section in their place**

In the spot where those three sections were, insert:
```jsx
{/* ── THE CASE FOR KNOWING ──────────────────────────────────── */}
<section className="py-24 lg:py-32 px-4 lg:px-8">
  <div className="max-w-5xl mx-auto">

    {/* Editorial statement */}
    <motion.div
      className="text-center mb-16 lg:mb-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
    >
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', lineHeight: 1.3, color: '#e2e2e8', fontWeight: 400, maxWidth: '820px', margin: '0 auto' }}>
        "The average unrepresented victim settles for a fraction of what they're owed. The gap isn't luck — it's information."
      </p>
    </motion.div>

    {/* Stat grid */}
    <AnimatedGroup
      variants={{ container: { visible: { transition: { staggerChildren: 0.12 } } }, item: transitionVariants.item }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12"
    >
      {[
        { stat: '67%', label: 'of unrepresented victims leave money on the table' },
        { stat: '4.5×', label: 'more — the average outcome when victims know their case value' },
        { stat: '$0', label: 'cost to find out what your case is worth' },
      ].map(({ stat, label }) => (
        <div key={stat} className="text-center space-y-3">
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: 1, color: '#c9a84c', fontWeight: 400 }}>
            {stat}
          </p>
          <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[200px] mx-auto">{label}</p>
        </div>
      ))}
    </AnimatedGroup>

    {/* Footer line */}
    <p className="text-center text-[12px] text-outline mt-12">Calculated alongside 2,400+ cases.</p>

  </div>
</section>
```

- [ ] **Step 3: Verify section renders**

Check browser: large serif editorial quote centered, three gold stat numerals below, no cards/borders.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add 'The Case for Knowing' section, remove WhatIs + old stats"
```

---

## Task 5: Rewrite How It Works

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the HOW IT WORKS section**

Replace the entire `{/* ── HOW IT WORKS ──... */}` section with:
```jsx
{/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
<section className="py-24 lg:py-32 px-4 lg:px-8">
  <div className="max-w-5xl mx-auto">

    {/* Section label */}
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
    >
      <span className="text-[11px] font-label font-bold uppercase tracking-[0.15em] text-[#c9a84c]">How It Works</span>
    </motion.div>

    {/* Steps */}
    <AnimatedGroup
      variants={{ container: { visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }, item: transitionVariants.item }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-0"
    >
      {[
        { num: '1', title: 'Describe your case', body: 'Answer a few questions about your injury, treatment, and circumstances. No legal expertise required.' },
        { num: '2', title: 'Get your valuation', body: 'Our model calculates a realistic case value range based on thousands of comparable outcomes.' },
        { num: '3', title: 'Negotiate with confidence', body: 'Know your number before you talk to an insurance adjuster or attorney.' },
      ].map(({ num, title, body }, i, arr) => (
        <React.Fragment key={num}>
          <div className="relative text-center sm:text-left px-0 sm:px-8 py-8 sm:py-0 space-y-4">
            {/* Gold numeral watermark */}
            <div className="relative">
              <span
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '80px',
                  lineHeight: 1,
                  color: 'rgba(201,168,76,0.12)',
                  display: 'block',
                  userSelect: 'none',
                }}
              >
                {num}
              </span>
              <div className="absolute bottom-1 left-0 right-0 sm:right-auto">
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 400, color: '#e2e2e8' }}>{title}</h4>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed">{body}</p>
          </div>
          {/* Gold rule connector between steps — desktop only */}
          {i < arr.length - 1 && (
            <div className="hidden sm:flex items-center justify-center px-2 py-0">
              <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)' }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </AnimatedGroup>

  </div>
</section>
```

- [ ] **Step 2: Verify How It Works renders**

Check browser: 3 steps with large low-opacity gold numeral watermarks, thin gold rules between steps on desktop, no card borders.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: redesign How It Works with gold numerals and editorial layout"
```

---

## Task 6: Rewrite Testimonials

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the TESTIMONIALS CAROUSEL section**

Replace the entire `{/* ── TESTIMONIALS CAROUSEL ──... */}` section with:
```jsx
{/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
<section className="py-24 lg:py-28 px-4 lg:px-8">
  <div className="max-w-3xl mx-auto">

    {/* Section label */}
    <div className="text-center mb-10">
      <span className="text-[11px] font-label font-bold uppercase tracking-[0.15em] text-[#c9a84c]">What People Are Saying</span>
    </div>

    <motion.div
      className="relative pb-12"
      style={{ borderLeft: '2px solid rgba(201,168,76,0.3)', paddingLeft: '2rem' }}
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', bounce: 0.2, duration: 1.4 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTestimonial}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Before / After numbers */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <span className="text-[10px] text-outline uppercase tracking-widest font-semibold">Offered</span>
              <span className="text-sm font-headline font-bold text-on-surface-variant line-through decoration-outline/60">
                ${TESTIMONIALS[activeTestimonial].initial?.toLocaleString()}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#c9a84c] text-base">arrow_forward</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#c9a84c]/[0.08] border border-[#c9a84c]/20">
              <span className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-semibold">Settled</span>
              <span className="text-sm font-headline font-bold text-[#c9a84c]">
                ${TESTIMONIALS[activeTestimonial].final?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quote */}
          <a
            href="/success-stories"
            target="_blank"
            rel="noopener noreferrer"
            className="block group cursor-pointer"
          >
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', lineHeight: 1.5, fontWeight: 400, fontStyle: 'italic', color: '#e2e2e8' }} className="group-hover:text-[#c9a84c] transition-colors duration-200">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </p>
          </a>

          {/* Attribution */}
          <div>
            <p className="text-sm text-on-surface-variant">
              {TESTIMONIALS[activeTestimonial].name} &middot; {TESTIMONIALS[activeTestimonial].type} &middot; {TESTIMONIALS[activeTestimonial].location}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel indicators */}
      <div className="absolute -bottom-1 left-8 flex gap-1.5">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTestimonial(i)}
            className={`h-1 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-[#c9a84c] w-5' : 'bg-outline-variant/40 hover:bg-outline-variant w-1.5'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>

  </div>
</section>
```

- [ ] **Step 2: Verify testimonials render**

Check browser: gold left-border card, before/after amounts with gold "Settled" badge, serif italic quote, no stars, dot indicators at bottom.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: redesign testimonials with gold left-border, remove star ratings"
```

---

## Task 7: Rewrite Bottom CTA

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the BOTTOM CTA BANNER section**

Replace the entire `{/* ── BOTTOM CTA BANNER ──... */}` section with:
```jsx
{/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
<section className="py-24 lg:py-32 px-4 lg:px-8">
  <motion.div
    className="max-w-xl mx-auto text-center space-y-6"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
  >
    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.1, fontWeight: 400, color: '#e2e2e8' }}>
      Know Your Case Value Today.
    </h2>
    <p className="text-on-surface-variant text-base leading-relaxed">
      Free, instant, and completely confidential.
    </p>
    <div>
      <button
        onClick={() => navigate('/calculator')}
        className="cta-gradient cta-shimmer text-on-primary-fixed w-full sm:w-auto px-10 py-5 rounded-[16px] font-headline font-bold text-lg inline-flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(201,168,76,0.2)] hover:shadow-[0_8px_50px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
      >
        Calculate My Case Value
        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
      </button>
    </div>
    <p className="text-sm text-outline">No signup required. No data sold.</p>
  </motion.div>
</section>
```

- [ ] **Step 2: Verify full page flow**

Scroll through entire homepage in browser. Confirm all 6 sections render in order:
1. Hero (centered, gold CTA, calculator below)
2. Authority strip (gold-tinted band)
3. The Case for Knowing (gold stat numerals)
4. How It Works (gold watermark numerals, vertical rule connectors)
5. Testimonials (gold left border)
6. Bottom CTA (serif headline, gold button)

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: rewrite bottom CTA with new copy and section cleanup complete"
```

---

## Task 8: Calculator — Passengers Question + Auto-Advance

**Files:**
- Modify: `src/components/CalculatorForm.jsx`

- [ ] **Step 1: Add PASSENGER_OPTIONS constant**

After the `CASE_TYPES` constant (around line 8), add:
```js
const PASSENGER_OPTIONS = [
  { value: '1', label: '1 (just me)' },
  { value: '2', label: '2' },
  { value: '3+', label: '3+' },
]
```

- [ ] **Step 2: Insert `passengers` into MOTOR_VEHICLE_STEPS**

Replace `MOTOR_VEHICLE_STEPS` with:
```js
const MOTOR_VEHICLE_STEPS = [
  'caseType',        // 1
  'passengers',      // 2 (NEW)
  'accidentType',    // 3
  'injuries',        // 4
  'fault',           // 5
  'ev',              // 6
  'commercial',      // 7
  'when',            // 8
  'myInsurer',       // 9
  'otherInsurer',    // 10
  'lawyer',          // 11
  'zip',             // 12
  'contact',         // 13
]
```

- [ ] **Step 3: Add `passengers` to initial state**

In the `useState` call for `data` (around line 496), add `passengers: ''` after `caseType: ''`:
```js
const [data, setData] = useState({
  website: '',
  caseType: '',
  passengers: '',   // ← ADD THIS
  type: '',
  // ... rest unchanged
})
```

- [ ] **Step 4: Add `passengers` to isStepValid**

In the `isStepValid` switch, add a case after `caseType`:
```js
case 'passengers': return !!data.passengers
```

- [ ] **Step 5: Add auto-advance helper**

After the `const set = ...` line (around line 530), add:
```js
const selectAndAdvance = (key, val) => {
  set(key, val)
  goTo(stepIndex + 1)
}
```

- [ ] **Step 6: Add `passengers` case to renderStep**

After the `caseType` case in `renderStep`, insert:
```jsx
// ── MOTOR VEHICLE: Passengers ──
case 'passengers':
  return (
    <>
      <StepHeading
        title={<>How many people were in <span className="text-primary italic">your vehicle?</span></>}
        sub="Include yourself and all occupants at the time of the accident."
      />
      <div className="grid gap-3">
        {PASSENGER_OPTIONS.map(o => (
          <OptionBtn
            key={o.value}
            selected={data.passengers === o.value}
            onClick={() => selectAndAdvance('passengers', o.value)}
          >
            {o.label}
          </OptionBtn>
        ))}
      </div>
      {stepIndex > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            className="w-full py-2 text-sm text-outline hover:text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
            Go Back
          </button>
        </div>
      )}
    </>
  )
```

- [ ] **Step 7: Apply auto-advance to `caseType` step**

The `caseType` step currently calls `set('caseType', value)` on click and has a Next button. Change the OptionBtn `onClick` to use `selectAndAdvance`, and replace `NavButtons` with just the terms microcopy:

Find the `caseType` case in `renderStep` and replace the OptionBtns mapping and NavButtons:
```jsx
// BEFORE (in caseType case):
{CASE_TYPES.map(({ value, label, icon }) => (
  <OptionBtn key={value} selected={data.caseType === value} onClick={() => set('caseType', value)}>
    <span className="material-symbols-outlined text-lg opacity-60 flex-shrink-0">{icon}</span>
    {label}
  </OptionBtn>
))}
<NavButtons step={0} onNext={() => goTo(1)} disabled={!data.caseType} />

// AFTER:
{CASE_TYPES.map(({ value, label, icon }) => (
  <OptionBtn key={value} selected={data.caseType === value} onClick={() => selectAndAdvance('caseType', value)}>
    <span className="material-symbols-outlined text-lg opacity-60 flex-shrink-0">{icon}</span>
    {label}
  </OptionBtn>
))}
<p className="text-[10px] text-center text-outline leading-tight pt-4">
  By continuing you agree to our Terms &amp; Privacy Policy. SSL encrypted.
</p>
```

- [ ] **Step 8: Apply auto-advance to `accidentType` step**

Replace the `accidentType` OptionBtns onClick and NavButtons:
```jsx
// In accidentType case, change OptionBtn onClick:
onClick={() => selectAndAdvance('type', label)}

// Replace NavButtons with just a Back button:
<div className="mt-5">
  <button type="button" onClick={() => goTo(stepIndex - 1)}
    className="w-full py-2 text-sm text-outline hover:text-on-surface transition-colors flex items-center justify-center gap-1">
    <span className="material-symbols-outlined text-lg">chevron_left</span>
    Go Back
  </button>
</div>
```

- [ ] **Step 9: Apply auto-advance to `fault`, `ev`, `commercial`, `when`, `myInsurer`, `otherInsurer`, `adjuster` steps**

For each of these steps, make the same two changes:
1. Change `onClick={() => set('KEY', value)}` to `onClick={() => selectAndAdvance('KEY', value)}`
2. Replace `<NavButtons onNext={...} onBack={...} disabled={...} />` with a standalone Back button:

```jsx
<div className="mt-5">
  <button type="button" onClick={() => goTo(stepIndex - 1)}
    className="w-full py-2 text-sm text-outline hover:text-on-surface transition-colors flex items-center justify-center gap-1">
    <span className="material-symbols-outlined text-lg">chevron_left</span>
    Go Back
  </button>
</div>
```

The key-to-state mapping for each step:
- `fault` → `data.fault` — `set('fault', o.value)` → `selectAndAdvance('fault', o.value)`
- `ev` → `data.evInvolved` — `set('evInvolved', o.value)` → `selectAndAdvance('evInvolved', o.value)`
- `commercial` → `data.commercialVehicle` — `set('commercialVehicle', o.value)` → `selectAndAdvance('commercialVehicle', o.value)`
- `when` → `data.when` — `set('when', o.value)` → `selectAndAdvance('when', o.value)`
- `myInsurer` → `data.myInsurer` — `set('myInsurer', label)` → `selectAndAdvance('myInsurer', label)`
- `otherInsurer` → `data.otherInsurer` — `set('otherInsurer', label)` → `selectAndAdvance('otherInsurer', label)` (note: the low-offer insurer info callout — shown for GEICO/Allstate/Progressive — will be bypassed by auto-advance since the step advances immediately on selection. This is by spec design; the callout can be removed from this step or deferred to the results screen in a future cycle.)
- `adjuster` → `data.adjuster` — `set('adjuster', o.value)` → `selectAndAdvance('adjuster', o.value)`

- [ ] **Step 10: Verify calculator flow**

Open browser at `http://localhost:5173`, click the calculator CTA. Go through the flow:
1. Select a case type — should immediately advance without clicking Next
2. Should see the new passengers question second
3. Select passengers count — should immediately advance
4. Select accident type — should immediately advance
5. Injuries screen should show a Next button (it's multi-select)
6. Continue through — fault, ev, commercial, when, myInsurer, otherInsurer all auto-advance
7. `lawyer` step and `zip` step still have Next buttons

- [ ] **Step 11: Update progress bar gradient in CalculatorForm.jsx**

Find the progress bar motion.div (around line 1042):
```jsx
// Before:
className="bg-gradient-to-r from-primary to-[#00d1ff] h-full rounded-full"

// After:
className="bg-gradient-to-r from-[#c9a84c] to-[#d4a853] h-full rounded-full"
```

- [ ] **Step 12: Commit**

```bash
git add src/components/CalculatorForm.jsx
git commit -m "feat: add passengers question + auto-advance for single-choice steps"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run full dev server check**

Run: `npm run dev`

Walk through the complete homepage:
- [ ] Hero: centered headline, gold CTA, calculator widget below
- [ ] Authority strip: gold-tinted band, logos left, trust badges right
- [ ] Case for Knowing: serif editorial quote, three gold stat numerals
- [ ] How It Works: gold numeral watermarks, vertical gold rule connectors
- [ ] Testimonials: gold left border, serif quote, no stars
- [ ] Bottom CTA: serif headline, gold button, fine print
- [ ] Calculator: passengers question at step 2, auto-advance on single-choice steps
- [ ] No "claim" in user-facing copy (product name "ClaimCalculator" in system/badge text is fine)
- [ ] No rainbow `gradient-border` on any homepage section
- [ ] No `ShineBorder` in hero

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Fix any lint errors before committing.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final homepage redesign — lint clean"
```
