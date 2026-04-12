# Sub-project #6: Analytics — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a comprehensive analytics suite with interactive visualizations, an attorney scorecard, GA4 integration, and a case monitoring agent.

**Architecture:** New `/admin/analytics` page with four major sections (funnel, time-series, attorney scorecard, breakdowns), enhanced Dashboard stat cards with animated counters, plus a scheduled cron agent for case monitoring. All data from Supabase queries against existing tables. GA4 data fetched server-side via Pipedream connector and displayed in a traffic section.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Recharts (new), Framer Motion (existing), Supabase, date-fns (existing), lucide-react (existing)

**Visual Inspiration (21st.dev):**
- Funnel Chart by bklitai — animated pipeline stages with drop-off percentages
- Glowing Bar Chart by SVG UI — teal + orange glow bars, period selector
- Donut Chart by Ravi Katiyar — animated center label on hover, Framer Motion
- Glowing Line Chart by SVG UI — teal/gold glow effect, trend badges
- Area Chart Curve by bklitai — smooth gradient fills with visx
- Activity Chart Card by Ravi Katiyar — self-contained widget with animated bars

**Approach:** We'll use Recharts (smaller footprint, already shadcn-compatible) styled to match the glow/neon aesthetic from these references, plus Framer Motion for entrance animations, animated counters, and expandable rows. This avoids adding visx/reaviz/react-aria as extra deps while achieving the same visual impact.

**Design System:** Neon Nocturne — bg `#111318`, cards `#1e2024`, borders `#333539`, accent `#a4e6ff`, success `#4ADE80`, error `#ffb4ab`; fonts Space Grotesk / Manrope / Inter

**GA4 Property ID:** `properties/532555035`

---

## File Map

### New Files
| File | Responsibility |
|---|---|
| `src/components/admin/Analytics.jsx` | Main analytics page — orchestrates all sections |
| `src/components/admin/analytics/ConversionFunnel.jsx` | Animated horizontal funnel visualization |
| `src/components/admin/analytics/TimeSeriesCharts.jsx` | Leads over time, revenue trend, conversion rate charts |
| `src/components/admin/analytics/AttorneyScorecard.jsx` | Interactive attorney performance table with grades + expandable detail |
| `src/components/admin/analytics/CaseTypeBreakdown.jsx` | Donut chart for case type distribution |
| `src/components/admin/analytics/TrafficOverview.jsx` | GA4 traffic data display (sessions, users, page views) |
| `src/components/admin/analytics/AnimatedCounter.jsx` | Reusable animated number ticker with Framer Motion |
| `src/components/admin/analytics/ChartCard.jsx` | Reusable card wrapper for chart sections |
| `src/lib/analytics-helpers.js` | Shared data fetching + aggregation utilities |

### Modified Files
| File | Change |
|---|---|
| `src/components/admin/Dashboard.jsx` | Replace static stat values with AnimatedCounter, add mini sparklines |
| `src/components/admin/AdminLayout.jsx` | Add Analytics nav item (BarChart3 icon) |
| `src/main.jsx` | Wire `/admin/analytics` route |
| `package.json` | Add recharts dependency |

---

## Tasks

### Task 1: Install Recharts + Create Shared Utilities + Chart Theme

- [ ] `npm install recharts`
- [ ] Create `src/lib/analytics-helpers.js` with these exports:
  - `fetchFunnelData()` — queries `leads` table, groups by status, returns counts for each stage: `new → contacted → qualified → sent_to_attorney → converted` (also `rejected`, `disqualified` as drop-offs)
  - `fetchTimeSeriesData(range)` — queries `leads` table grouped by day/week/month depending on range (7d/30d/90d/all), returns `[{ date, count }]`
  - `fetchRevenueTimeSeries(range)` — queries `lead_assignments` where `payout_status='paid'`, grouped by `payout_date`, returns `[{ date, amount }]`
  - `fetchConversionTimeSeries(range)` — queries leads grouped by week, calculates qualified→converted ratio per period
  - `fetchAttorneyMetrics()` — queries `lead_assignments` joined with `attorney_partners`, returns per-attorney: totalAssigned, accepted, rejected, converted, totalRevenue (paid payout_amount sum), avgResponseTime (assigned_at → outcome_updated_at diff), avgPayout
  - `fetchCaseTypeDistribution()` — queries `leads` grouped by `case_type`, returns `[{ name, value }]`
  - `calculateGrade(conversionRate, avgResponseHours)` — returns A/B/C/D/F based on: A = conv > 60% AND response < 24h, B = conv > 40% OR response < 48h, C = conv > 20%, D = conv > 10%, F = rest
  - `formatCurrency(cents)` — reusable cents→dollar formatter
  - `formatPercent(ratio)` — ratio→percentage string

### Task 2: Build AnimatedCounter + ChartCard + GlowBar Defs

- [ ] Create `src/components/admin/analytics/AnimatedCounter.jsx`:
  - Uses Framer Motion `useSpring` + `useTransform` for smooth count-up animation
  - Props: `value` (number), `prefix` (string, e.g. "$"), `suffix` (string, e.g. "%"), `duration` (ms, default 1500), `decimals` (int, default 0)
  - Triggers animation on mount and when `value` changes
  - Font: Space Grotesk, bold, inherits color from parent
  - Spring config: `stiffness: 50, damping: 20, mass: 1`
  
- [ ] Create `src/components/admin/analytics/ChartCard.jsx`:
  - Props: `title`, `subtitle`, `children`, `className`, `action` (optional top-right element like a date range selector)
  - Card styling: `bg-[#1e2024] rounded-xl border border-[#333539] p-6`
  - Title: Space Grotesk 16px semibold `#e2e2e8`
  - Subtitle: Inter 12px `#bbc9cf`
  - Framer Motion: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` with stagger based on index prop

- [ ] Create SVG glow filter defs (inspired by SVG UI glowing charts on 21st.dev):
  - Reusable `<defs>` block with `<filter id="glow">` using `feGaussianBlur` + `feComposite`
  - Gradient defs for area fills: accent-to-transparent, success-to-transparent
  - Export as `ChartGlowDefs` component to drop inside any `<svg>` / Recharts `<defs>`

### Task 3: Build ConversionFunnel (inspired by bklitai funnel-chart on 21st.dev)

- [ ] Create `src/components/admin/analytics/ConversionFunnel.jsx`:
  - **Visual:** Horizontal funnel with 5 stages as tapered bars (CSS clip-path trapezoids)
  - **Approach:** Styled divs with Framer Motion (more control than Recharts FunnelChart), inspired by bklitai's funnel-chart-labels component
  - Each stage bar width proportional to count, with clip-path creating the tapered funnel shape
  - Bars animate from 0 width to full (stagger: 150ms per stage), with a subtle glow/shadow effect matching the Neon Nocturne theme
  - Colors: gradient from `#a4e6ff` (stage 1) → `#4ADE80` (final stage), with `#ffb4ab` for rejection/disqualification
  - Each bar shows: stage label (left), count (center, AnimatedCounter), drop-off % (right, in muted text)
  - Drop-off % = `((prevCount - currentCount) / prevCount * 100).toFixed(1)%`
  - Hover state: bar brightens with `box-shadow: 0 0 20px rgba(164,230,255,0.3)` glow, shows tooltip with exact count + percentage of total
  - Connecting arrows between stages with muted chevrons
  - Stages: New Leads → Contacted → Qualified → Sent to Attorney → Converted
  - Below funnel: overall conversion rate in large text with AnimatedCounter
  - Wrapped in ChartCard with title "Conversion Funnel"

### Task 4: Build TimeSeriesCharts

- [ ] Create `src/components/admin/analytics/TimeSeriesCharts.jsx`:
  - **Date range selector:** pill buttons (7d / 30d / 90d / All) in top-right of card, accent border on active
  - **Chart 1: Leads Over Time** (Recharts AreaChart, inspired by bklitai area-chart-curve + SVG UI hatched-area-chart)
    - Gradient fill from `#a4e6ff` at 30% opacity to transparent, with subtle glow filter on the stroke
    - Stroke: `#a4e6ff`, 2px, `type="monotone"` for smooth curves
    - X-axis: date labels (MMM d for 7d/30d, MMM for 90d/all), tick style Inter 11px `#bbc9cf`
    - Y-axis: count, same tick style
    - Grid: dotted horizontal lines `#333539` at 30% opacity
    - Animated: `<Area isAnimationActive animationDuration={1200} animationEasing="ease-out" />`
    - Custom tooltip: dark card `bg-[#1e2024] border-[#333539]` with accent left border, shows date + count
    - Active dot: pulsing ring effect via CSS animation
  - **Chart 2: Revenue Trend** (Recharts BarChart, inspired by SVG UI glowing-bar-chart)
    - Bars: gradient fill from `#4ADE80` to `#4ADE80/60`, with top-edge glow (`filter: url(#glow)`)
    - Rounded top corners: `radius={[4, 4, 0, 0]}`
    - Same axis styling as Chart 1
    - Animated: `animationDuration={1000}`
    - Tooltip shows formatted currency with green delta badge
  - **Chart 3: Conversion Rate** (Recharts LineChart, inspired by SVG UI glowing-line-chart)
    - Line: `#a4e6ff`, 2px, with glow effect (drop shadow filter)
    - Dots at data points: `dot={{ r: 4, fill: '#a4e6ff', strokeWidth: 2, stroke: '#111318' }}`
    - Reference line at overall average (dashed, `#ffb4ab`)
    - Y-axis: percentage format
    - Animated: `animationDuration={1200}`
  - All three charts in a responsive grid: `grid-cols-1 lg:grid-cols-3 gap-6`
  - Each wrapped in ChartCard

### Task 5: Build AttorneyScorecard

- [ ] Create `src/components/admin/analytics/AttorneyScorecard.jsx`:
  - **This is the crown jewel — interactive, informative, your at-a-glance view of firm performance.**
  - **Summary bar:** 4 mini stat cards at top — Total Attorneys, Best Performer (name), Avg Conversion Rate, Total Revenue
  - **Sortable table** (click column headers to sort asc/desc):
    - Columns: Rank (#), Attorney (name + firm), Grade (letter badge), Leads Assigned, Accepted, Rejected, Conversion Rate, Avg Response Time, Total Revenue, Avg Payout
    - Grade badge: A = green pill `#4ADE80`, B = accent `#a4e6ff`, C = yellow `#fbbf24`, D = orange `#fb923c`, F = error `#ffb4ab`
    - Conversion rate: bar indicator behind text (colored fill proportional to %, like a progress bar in the cell)
    - Response time: color-coded — green < 24h, yellow 24-48h, red > 48h
    - Revenue: formatted currency, green text
    - Sort indicator: chevron up/down icon next to active sort column
  - **Expandable row detail** (click a row to expand):
    - Shows all assignments for that attorney in a sub-table
    - Columns: Lead Name (link), Case Type, Assigned Date, Outcome, Payout Status, Amount
    - Framer Motion `AnimatePresence` + `motion.div` for smooth expand/collapse (height auto)
    - Mini donut chart showing outcome breakdown (accepted/rejected/pending/converted) using Recharts PieChart
  - **Visual flair:**
    - Rank #1 row has a subtle gold/accent left border glow
    - Rows animate in on mount with stagger (Framer Motion `variants` + `staggerChildren: 0.05`)
    - Hover: row background lightens to `#333539/30`
  - Wrapped in ChartCard with title "Attorney Scorecard" and subtitle "Who performs best with your leads"

### Task 6: Build CaseTypeBreakdown (inspired by ravikatiyar donut-chart on 21st.dev)

- [ ] Create `src/components/admin/analytics/CaseTypeBreakdown.jsx`:
  - **Donut chart** (Recharts PieChart with `innerRadius={60} outerRadius={90}`):
    - Colors: cycle through `['#a4e6ff', '#4ADE80', '#ffb4ab', '#fbbf24', '#c084fc', '#fb923c', '#38bdf8', '#f87171']`
    - Center text: total lead count with AnimatedCounter, dynamically updates on segment hover (like ravikatiyar's donut-chart)
    - Segment hover: active segment scales up slightly (`outerRadius` +5), center label switches to that segment's label + count
    - Animated: `animationDuration={1000} animationBegin={300}`
    - Custom tooltip with dark styling
  - **Legend:** vertical list to the right of donut, each with color dot + case type name + count + percentage
    - Hovering a legend item highlights the corresponding donut segment
  - Layout: flex row, donut left, legend right
  - Wrapped in ChartCard

### Task 7: Build TrafficOverview (GA4)

- [ ] Create `src/components/admin/analytics/TrafficOverview.jsx`:
  - **Note:** GA4 data is fetched via the Pipedream connector (server-side from the agent). Since we can't call the connector from the client, this component will display placeholder/demo data structure that can be populated when we wire up a backend proxy or edge function.
  - **For now:** Build the UI shell with mock data, styled to match, ready for GA4 data injection
  - **Layout:** 3 stat cards (Sessions, Users, Page Views) + small area chart showing trend
  - Stats use AnimatedCounter
  - Chart: Recharts AreaChart with same styling as Leads Over Time
  - Subtitle text: "Data from Google Analytics" with a muted refresh icon
  - Wrapped in ChartCard with title "Site Traffic"

### Task 8: Build Analytics Page + Wire Navigation

- [ ] Create `src/components/admin/Analytics.jsx`:
  - Orchestrates all sections in order:
    1. Page header: "Analytics" (Space Grotesk h1) + "Performance metrics and insights" (Manrope subtitle)
    2. ConversionFunnel (full width)
    3. TimeSeriesCharts (full width, 3-column grid inside)
    4. AttorneyScorecard (full width)
    5. Bottom row: CaseTypeBreakdown + TrafficOverview (2-column grid)
  - Framer Motion page entrance: sections fade/slide in with stagger
  - All sections use ChartCard wrapper
  
- [ ] Update `src/components/admin/AdminLayout.jsx`:
  - Add nav item: `{ href: '/admin/analytics', label: 'Analytics', icon: BarChart3 }`
  - Import `BarChart3` from lucide-react
  - Place between Payouts and Settings

- [ ] Update `src/main.jsx`:
  - Add lazy import: `const AdminAnalytics = lazy(() => import('./components/admin/Analytics.jsx').then(m => ({ default: m.Analytics })))`
  - Add route: `<Route path="/admin/analytics" element={<AdminShell><AdminAnalytics /></AdminShell>} />`

### Task 9: Enhance Dashboard with Animated Counters + Sparklines

- [ ] Update `src/components/admin/Dashboard.jsx`:
  - Replace static stat values with `AnimatedCounter` component
  - Add mini sparkline under each stat card showing 7-day trend:
    - Tiny Recharts AreaChart (height 40px, no axes, no grid, just the line + fill)
    - Fetch last 7 days of data for each metric
    - Color matches the stat card accent
  - Stat cards animate in on mount with Framer Motion stagger

### Task 10: Deploy Case Monitoring Agent (Cron)

- [ ] Set up a scheduled cron job (daily at 9am PDT / 4pm UTC):
  - Queries Supabase for:
    1. Assignments with `outcome = 'pending'` older than 3 days
    2. Assignments with `payout_status = 'unpaid'` older than 30 days
    3. Assignments with `payout_status = 'invoiced'` older than 14 days (invoiced but not paid)
  - If any flagged cases found, sends a notification with:
    - Count of stale pending assignments by attorney
    - Count of overdue unpaid/invoiced payouts
    - Oldest case age for each category
  - If no issues found, does nothing (no noise)

### Task 11: Build Verification + PR

- [ ] Run `npx vite build` — verify exit 0
- [ ] Verify all imports resolve (no missing modules)
- [ ] `git add -A && git commit`
- [ ] `git push origin feat/analytics`
- [ ] `gh pr create` with detailed description

---

## Recharts Theme Config

All charts should use these shared settings:

```js
// Shared Recharts theme tokens
const CHART_THEME = {
  bg: '#1e2024',
  grid: '#333539',
  gridOpacity: 0.3,
  axis: '#bbc9cf',
  axisFont: { fontSize: 11, fontFamily: 'Inter, sans-serif' },
  tooltip: {
    bg: '#1e2024',
    border: '#333539',
    text: '#e2e2e8',
    label: '#bbc9cf',
  },
  colors: {
    accent: '#a4e6ff',
    success: '#4ADE80',
    error: '#ffb4ab',
    warning: '#fbbf24',
    purple: '#c084fc',
    orange: '#fb923c',
  },
}
```

---

## Attorney Grade Criteria

| Grade | Conversion Rate | Avg Response Time | Visual |
|---|---|---|---|
| A | > 60% AND | < 24 hours | Green pill `#4ADE80` |
| B | > 40% OR | < 48 hours | Accent pill `#a4e6ff` |
| C | > 20% | any | Yellow pill `#fbbf24` |
| D | > 10% | any | Orange pill `#fb923c` |
| F | ≤ 10% | any | Red pill `#ffb4ab` |

Conversion rate = (accepted + converted) / total assigned
Response time = average of (outcome_updated_at - assigned_at) for non-pending assignments
