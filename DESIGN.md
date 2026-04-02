# DESIGN.md — ClaimCalculator.ai Design System

This document defines the complete design system for ClaimCalculator.ai. Any AI model or developer contributing to this project must follow these rules exactly. Do not introduce new colors, fonts, or component patterns unless they are consistent with the system described here.

---

## 1. Philosophy

**"Neon Nocturne / Digital Concierge"** — a dark, cinematic, data-confident UI. The aesthetic communicates technical precision and legal authority without feeling sterile. Think: the quiet sophistication of the Nevada desert at night, paired with the glow of a high-tech dashboard.

### Core Rules
- **No harsh 1px borders for layout sectioning.** Use background color shifts to create boundaries.
- **No pure `#000000` backgrounds.** Use `#111318` (surface) to allow shadow depth.
- **No generic color fills.** Always use a named token from the palette below.
- **No flat designs.** Every card or surface should imply elevation through color layering.
- **Glassmorphism is the primary floating-element treatment.** Not drop shadows.

---

## 2. Color Palette

All colors are defined in `tailwind.config.js`. Reference them via Tailwind token names.

### Primary & Brand
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#a4e6ff` | Accent text, active states, headlines, progress |
| `primary-container` | `#00d1ff` | CTA gradient end, active fills |
| `primary-fixed-dim` | `#4cd6ff` | CTA gradient start |
| `on-primary-fixed` | `#001f28` | Text on light CTA buttons |
| `on-primary-container` | `#00566a` | Text on primary container fills |

### CTA Gradient (the "action color")
```css
background: linear-gradient(135deg, #a4e6ff 0%, #00d1ff 100%);
```
Applied via `.cta-gradient` utility class. Used on primary buttons and key CTAs only.

### Surface Hierarchy (dark layers, lightest = highest)
| Token | Hex | Layer |
|---|---|---|
| `surface-container-lowest` | `#0c0e12` | Deepest background (footer, progress track) |
| `surface` / `surface-dim` | `#111318` | Base page background |
| `surface-container-low` | `#1a1c20` | Section backgrounds |
| `surface-container` | `#1e2024` | Card backgrounds |
| `surface-container-high` | `#282a2e` | Elevated cards, nav pills |
| `surface-container-highest` | `#333539` | Input fields, option buttons |
| `surface-bright` | `#37393e` | Hover states on dark cards |
| `surface-variant` | `#333539` | Equivalent to highest — data table backgrounds |

### Text
| Token | Hex | Usage |
|---|---|---|
| `on-background` | `#e2e2e8` | Primary headlines, key body text |
| `on-surface` | `#e2e2e8` | Body text on surface |
| `on-surface-variant` | `#bbc9cf` | Secondary body text, descriptions |
| `outline` | `#859399` | Muted labels, step counters, fine print |
| `outline-variant` | `#3c494e` | Subtle dividers, ghost borders |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `error` | `#ffb4ab` | "Without attorney" result, validation errors |
| `error-container` | `#93000a` | Error fill backgrounds |
| `secondary` | `#ffb59e` | Warm accent (bolt icon, secondary highlights) |
| `tertiary` | `#d8d9ff` | Cool accent (verified icon, trust indicators) |

### Special Result Colors (hardcoded, not in palette)
| Value | Usage |
|---|---|
| `#4ADE80` | "With attorney" result — best outcome green |
| `rgba(74,222,128,*)` | Green glow / fill variants in result screen |

---

## 3. Typography

Three typefaces with distinct roles. Import from Google Fonts — all three are already linked in `index.html`.

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
```

### Font Families
| Token | Font | Role |
|---|---|---|
| `font-headline` | Space Grotesk | All headlines, step numbers, section titles, CTA button text |
| `font-body` | Manrope | Default body copy, paragraphs, descriptions |
| `font-label` | Inter | Labels, form field names, step counters, badges, fine print |

### Type Scale
| Role | Classes | Notes |
|---|---|---|
| Page hero | `text-5xl md:text-7xl font-headline font-bold leading-[0.95] tracking-tight` | Italic `<span>` for primary accent word |
| Section headline | `text-4xl md:text-6xl font-headline font-bold leading-none` | |
| Card title | `text-2xl font-headline font-bold` | |
| Step question | `text-xl md:text-2xl font-headline font-bold leading-snug` | |
| Step number (bg) | `text-6xl font-headline font-black text-outline/20` | Decorative background counter |
| Body large | `text-lg md:text-xl text-on-surface-variant leading-relaxed` | |
| Body default | `text-sm text-on-surface-variant leading-relaxed` | |
| Label / badge | `text-xs font-label font-semibold uppercase tracking-widest` | |
| Fine print | `text-[10px] font-label text-outline leading-tight` | Disclaimers, legal text |

### Rules
- Headlines always use **Space Grotesk**.
- Accent words in headlines use `text-primary italic` inside a `<span>`.
- Labels are always **uppercase + tracked** (`uppercase tracking-widest`).
- Numbers and data use **Space Grotesk** (`font-headline font-black`) for visual weight.

---

## 4. Spacing & Layout

### Container
```
max-w-7xl mx-auto px-6
```
Primary content container — used across all sections.

### Section Padding
| Section type | Padding |
|---|---|
| Hero | `pt-24` (accounts for fixed header), `min-h-[795px]` |
| Full section | `py-24 px-6` or `py-32 px-6` |
| Card body | `p-8 md:p-10` |
| Card inner | `p-4` or `p-5` |

### Grid System
- **Hero layout:** `grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`
- **Bento grid:** `grid grid-cols-1 md:grid-cols-3 gap-6`
- **Step grid (2-col options):** `grid grid-cols-2 gap-2.5`
- **Form row (2-col):** `grid grid-cols-2 gap-3`

---

## 5. Component Styles

### Navigation / Header
```
fixed top-0 z-50
bg-[#111318]/80 backdrop-blur-xl
shadow-[0_20px_40px_rgba(0,0,0,0.4)]
px-6 py-4 max-w-7xl mx-auto
```
- Logo: `font-headline font-black tracking-tighter text-primary`
- Nav links: `font-headline hover:text-[#00d1ff] transition-colors duration-300`
- Active nav link: `text-primary font-bold`
- Inactive nav link: `text-on-surface-variant`

### Buttons

**Primary CTA (`.cta-gradient`)**
```
w-full cta-gradient text-on-primary-fixed
py-4 md:py-5 rounded-xl
font-headline font-bold text-base md:text-lg
flex items-center justify-center gap-2
shadow-[0_0_20px_rgba(164,230,255,0.12)]
group transition-all
```
- Arrow icon animates on hover: `group-hover:translate-x-1 transition-transform`

**Nav CTA (pill)**
```
cta-gradient text-on-primary-fixed
px-6 py-2.5 rounded-full
font-bold text-sm tracking-tight
active:scale-95 duration-200
shadow-[0_0_20px_rgba(164,230,255,0.2)]
```

**Ghost / Back button**
```
w-full py-2 text-sm text-outline
hover:text-on-surface transition-colors
flex items-center justify-center gap-1
```

**Option selection button (single-select)**
```
flex items-center gap-3 w-full p-4 rounded-xl border text-left
font-medium text-sm transition-all
```
- Default: `border-outline-variant/20 bg-surface-container-highest text-on-surface-variant`
- Selected: `border-primary bg-primary/10 text-primary`
- Radio dot: `w-4 h-4 rounded-full border-2`, inner fill `w-2 h-2 rounded-full bg-primary`

### Glass Card (Calculator Form Container)
```css
.glass-card {
  background: rgba(51, 53, 57, 0.4);
  backdrop-filter: blur(12px);
}
```
Combined with: `rounded-2xl border border-outline-variant/10 shadow-2xl`

Ambient glow behind card:
```
absolute inset-0 bg-primary/5 rounded-2xl blur-2xl transform rotate-3
```

### Progress Bar
```
Track: w-full bg-surface-container-lowest h-1 rounded-full overflow-hidden
Fill:  bg-primary h-full rounded-full transition-all duration-500 ease-out
```
- Label: `text-xs font-label text-outline uppercase tracking-widest`
- Percentage: `text-xs font-label text-primary font-semibold`

### Form Input Fields
```
w-full bg-surface-container-highest text-on-surface
placeholder-outline/50
rounded-xl px-4 py-3 text-sm
outline-none border border-outline-variant/20
focus:border-primary/60 transition-colors
```
- Label pattern: `text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1 block`
- No underlines. No full borders at rest. Ghost border appears on focus.
- Zip code input uses: `text-2xl font-headline font-black tracking-widest`

### Checkbox Items
```
flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
```
- Default: `border-outline-variant/20 bg-surface-container-highest`
- Selected: `border-primary bg-primary/10`
- Checkbox box: `w-4 h-4 rounded border-2`; selected: `bg-primary border-primary`

### Bento Cards
```
p-10 rounded-2xl border border-outline-variant/5
```
- Wide card: `md:col-span-2 min-h-[300px] bg-surface-container-low flex flex-col justify-between`
- Narrow card: `bg-surface-container-high flex flex-col justify-between`
- Highlight card: `bg-primary/5 border-primary/20`

### Badge / Pill
```
inline-flex items-center gap-2 px-3 py-1 rounded-full
bg-surface-container-high border border-outline-variant/20
text-xs font-label font-semibold text-primary uppercase tracking-widest
```
- Pulsing dot: `w-2 h-2 rounded-full bg-primary animate-pulse`

### Result Cards (Settlement Compare)
**With Attorney (Green)**
```
rounded-xl overflow-hidden border-2 border-[#4ADE80]/30
shadow-[0_0_20px_rgba(74,222,128,0.08)]
```
- Header bg: `bg-[#4ADE80]/15`
- Value: `text-3xl font-headline font-black text-[#4ADE80]`

**Without Attorney (Red / Dimmed)**
```
rounded-xl overflow-hidden border border-outline-variant/10 opacity-80
```
- Header bg: `bg-error/10`
- Value: `text-3xl font-headline font-black text-error`

### Section Backgrounds
| Section | Background class |
|---|---|
| Hero | Base `surface` (#111318) |
| Trust Bento | `bg-surface-container-lowest` |
| How It Works | Base `surface` |
| Testimonial | `bg-surface-container-low/50` |
| Footer | `bg-[#0c0e12]` |

---

## 6. Icons

Using **Material Symbols Outlined** from Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

For filled icons (e.g. security, bolt): `style={{ fontVariationSettings: "'FILL' 1" }}`

---

## 7. Elevation & Depth Rules

Effects are achieved through **tonal color layering**, not box shadows.

1. **Base floor** → `surface` (#111318)
2. **Section layer** → `surface-container-low` (#1a1c20)
3. **Card layer** → `surface-container` (#1e2024)
4. **Input/option layer** → `surface-container-highest` (#333539)
5. **Glass float** → `.glass-card` (rgba overlay + `backdrop-filter: blur(12px)`)

**Ambient glow pattern** (used behind the calculator form):
```
absolute inset-0 bg-primary/5 blur-2xl rounded-2xl rotate-3
```

**Hero background glow** (decorative):
```
absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]
```

---

## 8. Do's and Don'ts

### ✅ Do
- Use `font-headline` (Space Grotesk) for every heading, number, and button label.
- Use `text-primary italic` inside headline `<span>` tags for the accent word.
- Use the surface hierarchy to imply depth — not drop shadows.
- Animate CTAs arrows with `group-hover:translate-x-1 transition-transform`.
- Use `uppercase tracking-widest` for all form labels and badge text.
- Add `transition-all` or `transition-colors` to every interactive element.
- Use `rounded-xl` (0.5rem) for cards, inputs, buttons, option buttons.
- Use `rounded-full` (0.75rem) for pills, avatar rings, and nav CTA.

### ❌ Don't
- Don't use pure `#000` — use `#111318` or `#0c0e12`.
- Don't use 100% opaque borders for sectioning — shift background color instead.
- Don't use `box-shadow` for card elevation — use color layering.
- Don't mix fonts arbitrarily — each of the three fonts has an assigned role.
- Don't add new colors outside the palette — there are enough semantic tokens.
- Don't use `rounded-2xl` or larger on inputs — stick to `rounded-xl`.
- Don't show the "Without Attorney" card as visually equal to the "With Attorney" card on the result screen. The "With Attorney" card must always appear visually dominant (brighter border, green glow, full opacity).

---

## 9. Border Radius Reference

| Token | Value | Used for |
|---|---|---|
| `rounded` (DEFAULT) | 0.125rem | Almost never — too sharp |
| `rounded-lg` | 0.25rem | Minor rounding |
| `rounded-xl` | 0.5rem | Cards, inputs, buttons, option buttons |
| `rounded-2xl` | 1rem (Tailwind default) | Section containers, glass card wrapper |
| `rounded-3xl` | 1.5rem | Testimonial glassmorphism card |
| `rounded-full` | 0.75rem (overridden) | Pills, avatar rings, nav CTA button |

---

## 10. Responsive Breakpoints

Standard Tailwind breakpoints apply:
- `md:` — 768px (tablet/medium — triggers bento grid, form row grids)
- `lg:` — 1024px (desktop — triggers hero 2-column layout, sidebar nav)

Mobile-first. All layouts stack to `grid-cols-1` at base.
