# ClaimCalculator.ai Homepage Redesign — Design Spec

**Date:** 2026-04-16
**Scope:** `src/App.jsx` homepage only. All other pages out of scope.

---

## Visual Direction

| Token | Value |
|---|---|
| Background | `#111318` |
| Primary accent | `#c9a84c` (gold) |
| CTA gradient | `linear-gradient(135deg, #d4a853, #c9903c)` |
| Headline font | Georgia, serif |
| Body font | Existing (unchanged) |
| Background effect | `CanvasRevealEffect` — cyan `[0,209,255]` + purple `[99,102,241]` shimmer dots. Do not touch `main.jsx`. |

**Kill list:**
- `ShineBorder` component and all `gradient-border` class usage → replace with `border-color: rgba(201,168,76,0.2)`
- Identical glass card treatment on every section → differentiated per-section design (see below)
- All cyan CTA buttons → gold gradient
- All instances of the word "claim" → replace with "case"

---

## Section Order

1. Hero
2. Authority Strip
3. The Case for Knowing
4. How It Works
5. Testimonials
6. Bottom CTA

---

## Section 1: Hero

**Layout:** Full-bleed, centered editorial. `CanvasRevealEffect` shimmer active behind content.

**Content hierarchy:**
1. Overline — small-caps gold, ~12px tracking: `PERSONAL INJURY CASE CALCULATOR`
2. Headline — Georgia serif, ~64px: *"Most Injury Victims Settle for Less Than They're Owed."*
3. Subhead — light body weight: *"Find out what your case is actually worth — before you accept anything."*
4. CTA button — gold gradient, centered: `Calculate My Case Value →`

**Calculator widget** anchors ~100px below the fold so the headline lands before the tool is visible on initial load.

**No card border. No glass treatment.** Type, space, and gold only.

---

## Section 2: Authority Strip

**Layout:** Thin horizontal band. Background: `rgba(201,168,76,0.08)` — separates from hero without breaking dark palette.

**Left:** Media/publication logos, greyscale, low opacity. "As seen in" framing.
**Right:** 2–3 trust badges (e.g., "SSL Secured", "No data sold", "Free — no signup required").

Content is split left/right on desktop, stacked on mobile.

---

## Section 3: The Case for Knowing

**Purpose:** Emotional/persuasion beat. Creates urgency before the mechanics of How It Works.

**Layout — two parts, full-width, dark background:**

**Part A — Editorial statement** (Georgia serif, ~40px, centered):
> *"The average unrepresented victim settles for a fraction of what they're owed. The gap isn't luck — it's information."*

**Part B — Stat grid** (3 columns):

| Stat | Label |
|---|---|
| **67%** | of unrepresented victims leave money on the table |
| **4.5×** | more — the average outcome when victims know their case value |
| **$0** | cost to find out what your case is worth |

Stat numerals: large gold Georgia serif. Labels: small body text beneath.

The 2,400+ stat appears as a section footer line: *"Calculated alongside 2,400+ cases."*

**No card borders.** Stats float on dark background. Generous vertical padding.

---

## Section 4: How It Works

**Layout:** 3-step horizontal row (stacks vertically on mobile).

Each step:
- Large gold serif numeral (low-opacity background element)
- Short bold label
- 1–2 lines of body copy

**Steps:**
1. **Describe your case** — Answer a few questions about your injury, treatment, and circumstances. No legal expertise required.
2. **Get your valuation** — Our model calculates a realistic case value range based on thousands of comparable outcomes.
3. **Negotiate with confidence** — Know your number before you talk to an insurance adjuster or attorney.

**Step connectors:** Thin gold horizontal rule between steps (not arrows — arrows read as SaaS).

**No glass cards.** Steps sit directly on dark background.

---

## Section 5: Testimonials

**Layout:** Single card, centered, carousel navigation via dot indicators.

**Card structure:**
- Left side: "Before" quote — anxiety/uncertainty pre-tool
- Right side: "After" — outcome or confidence gained
- Attribution: First name, injury type, state (no last names)

**Visual treatment:** Gold left-border accent instead of full card border.

**No star ratings.** Ratings read as e-commerce. Editorial aesthetic — let the words carry weight.

---

## Section 6: Bottom CTA

**Layout:** Centered, minimal. No card, no border — type and button on dark background only.

- Headline — Georgia serif: *"Know Your Case Value Today."*
- Subhead: *"Free, instant, and completely confidential."*
- CTA button — gold gradient: `Calculate My Case Value →`
- Fine print beneath button: *"No signup required. No data sold."*

---

## Calculator UX Changes

### Auto-Advance Behavior
- **Single-choice questions:** Selecting an answer immediately advances to the next question. No "Next" button rendered.
- **Multiple-choice questions:** Selections accumulate; a "Next" button is required to confirm and advance.

### New Question: Passengers
- **Position:** Second question (immediately after incident/case type)
- **Prompt:** *"How many people were in your vehicle?"*
- **Options:** `1 (just me)` · `2` · `3+`
- Single-choice → auto-advances

### Terminology
- "case" used throughout all UI copy, labels, and headings
- "claim" must not appear anywhere in the interface

---

## Out of Scope

- Any page other than the homepage (`src/App.jsx`)
- `CanvasRevealEffect` configuration in `main.jsx` — do not touch
- Backend / calculation logic changes (passengers question feeds into existing scoring model)
