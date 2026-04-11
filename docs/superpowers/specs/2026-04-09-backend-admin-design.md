# ClaimCalculator.ai Backend & Admin Dashboard — Design Spec

**Date:** 2026-04-09
**Status:** Approved

---

## 1. Overview

Build a complete backend system for ClaimCalculator.ai using Supabase Direct (no server-side API). The system captures leads from the existing calculator form, stores them in a Supabase database, and provides a protected admin dashboard for reviewing and managing leads.

### Scope

**In scope:**
- Supabase integration (database + auth)
- Lead capture from calculator form to database
- Admin dashboard with login, lead list, lead detail, status workflow
- Activity logging on lead actions

**Out of scope (deferred):**
- Attorney partner management (CRUD, assignment UI)
- Email notifications on new leads
- Settings page

### Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| File format | `.jsx` / `.js` | Match existing codebase, avoid mixed formats |
| Architecture | Supabase Direct (no API layer) | Zero backend to deploy, RLS handles auth, fastest to build |
| Admin layout | Fixed sidebar | Classic admin pattern, actions always visible |
| Lead detail layout | Two-column (info left, actions right) | Matches briefing, actions visible without scrolling |
| Email notifications | Deferred | Ship core system first, bolt on later |
| Attorney management | Deferred | Core lead pipeline first |
| Admin route strategy | Outside public Layout | No Header/Footer/particles on admin pages |

---

## 2. Database Schema

### Tables

**`leads`** — primary lead data captured from calculator
- All case info fields (case_type, accident_type, injury_types, fault_status, etc.)
- Motor vehicle specific fields (ev_involved, commercial_vehicle)
- Premises liability specific fields (report_filed, cameras_witnesses, surface_conditions, lighting_conditions)
- Timing (accident_date, accident_timeframe)
- Insurance (has_own_insurance, own_insurance_company, other_party_insurance, adjuster_contacted)
- Legal (has_lawyer, case_description)
- Contact (zip_code, contact_name, contact_email, contact_phone)
- Estimate (estimated_value_low, estimated_value_high)
- Attribution (utm_source, utm_medium, utm_campaign, referrer)
- Internal (notes, priority, status)

**`lead_activity`** — activity log per lead
- lead_id (FK to leads), action (enum), performed_by, details (JSONB), created_at

**`admin_profiles`** — admin user profile data (linked to Supabase Auth)
- id (FK to auth.users), email, full_name, role, created_at

### Deferred Tables (not created in this build)
- `attorney_partners`
- `lead_assignments`

### Enum Types

- `lead_status`: new, contacted, qualified, sent_to_attorney, converted, rejected, lost
- `case_type`: motor_vehicle, premises_liability, work_injury, product_liability, other
- `fault_status`: not_at_fault, partial_fault, at_fault, unknown
- `activity_type`: created, viewed, status_changed, note_added, exported, sent_to_attorney, attorney_response

### RLS Policies

- Authenticated users (admins) get full access to leads, lead_activity, admin_profiles
- Anonymous users can INSERT into leads (public calculator form submission)
- admin_profiles restricted to own profile

### Functions

- `log_lead_activity(p_lead_id, p_action, p_details, p_performed_by)` — SECURITY DEFINER function for logging
- `update_updated_at()` — trigger function for auto-updating updated_at timestamps

---

## 3. Data Mapping: Calculator Form to Database

| Form field | DB column | Transform |
|---|---|---|
| `caseType` | `case_type` | Map display string to enum: `'Motor Vehicle Accident'` → `'motor_vehicle'`, `'Premises Liability/Slip and Fall'` → `'premises_liability'`, `'Work-Related Injury'` → `'work_injury'`, `'Product Liability'` → `'product_liability'`, `'Other'` → `'other'` |
| `type` | `accident_type` | Direct string |
| `injuries[]` | `injury_types` | JSON array |
| `fault` | `fault_status` | Map: `'Not my fault'` → `'not_at_fault'`, `'Mostly other driver'` → `'partial_fault'`, `'Shared / unclear'` → `'partial_fault'`, `'Mostly me'` → `'at_fault'` |
| `faultAtFault` (non-MV) | `fault_status` | `'Yes'` → `'at_fault'`, `'No'` → `'not_at_fault'` |
| `evInvolved` | `ev_involved` | `'Yes'` → `true`, else `false` |
| `commercialVehicle` | `commercial_vehicle` | `'Yes'` → `true`, else `false` |
| `when` | `accident_timeframe` | Direct string |
| `myInsurer` | `own_insurance_company` | Direct string |
| `myInsurer` | `has_own_insurance` | `'I Have No Insurance'` → `false`, else `true` |
| `otherInsurer` | `other_party_insurance` | Direct string |
| `hiredLawyer` | `has_lawyer` | `'Yes'` → `true`, else `false` |
| `zip` | `zip_code` | Direct string |
| `firstName` + `lastName` | `contact_name` | Concatenate with space |
| `email` | `contact_email` | Direct |
| `phone` | `contact_phone` | Direct |
| `reportedTo[]` | `report_filed` | JSON array |
| `adjuster` | `adjuster_contacted` | `'Yes'` → `true`, else `false` |
| `cameras` + `witnesses` | `cameras_witnesses` | `'Yes'` on either → `true` |
| `surface` | `surface_conditions` | Direct string |
| `lighting` | `lighting_conditions` | Direct string |
| `calcSettlement().withLow` | `estimated_value_low` | Integer |
| `calcSettlement().withHigh` | `estimated_value_high` | Integer |
| URL params | `utm_source`, `utm_medium`, `utm_campaign` | From `URLSearchParams` |
| `document.referrer` | `referrer` | Direct string or null |

---

## 4. Authentication & Routing

### Auth Flow
- Supabase Auth with email/password
- Admin user created manually in Supabase dashboard
- `ProtectedRoute` component checks session, redirects to `/admin/login` if unauthenticated
- `useAuth` hook provides current user state to any component

### Route Structure

Two layout branches in `main.jsx`:

```
Public Layout (Header + Footer + CanvasRevealEffect):
  /                    → App (homepage)
  /calculator          → CalculatorPage
  /how-it-works        → HowItWorksPage
  /insurance-tactics   → InsuranceTacticsPage
  /your-rights         → YourRightsPage
  /privacy-policy      → PrivacyPolicyPage
  /terms-of-service    → TermsOfServicePage
  /legal-notice        → LegalNoticePage
  /success-stories     → SuccessStoriesPage
  /injury-values       → InjuryValuesPage
  /case-guides         → CaseGuidesPage
  /case-guides/:slug   → CaseGuideDetailPage

Admin (no public Layout):
  /admin/login         → LoginForm (standalone, no AdminLayout)
  /admin               → ProtectedRoute → AdminLayout → Dashboard
  /admin/leads         → ProtectedRoute → AdminLayout → LeadList
  /admin/leads/:id     → ProtectedRoute → AdminLayout → LeadDetail
```

---

## 5. Admin Dashboard Components

### AdminLayout
- Fixed left sidebar (w-64) with nav links: Dashboard, Leads, Settings (placeholder)
- Sidebar: dark background (#0D0D0D), border-right, logo at top, logout at bottom
- Main content area scrolls independently
- Active nav item highlighted with bg-[#333539] and cyan text

### Dashboard
- 4 stat cards in a grid: Total Leads, New (7 days), Qualified, Revenue
- Revenue = converted leads x $2,000
- Recent leads list (5 most recent) with link to full list
- Each stat card: dark card bg, label in secondary text, value in accent color

### LeadList
- Filterable by status (dropdown: All, New, Contacted, Qualified, Sent to Attorney, Converted, Rejected)
- Table columns: Contact (name, email, phone), Case Type (+ zip), Estimate, Status (badge), Received (relative time)
- Each row links to lead detail
- Sorted by created_at descending

### LeadDetail
- Two-column layout: info (2/3) + actions sidebar (1/3)
- Header: back button, lead name, status badge, submission date
- Left column cards: Contact Information, Case Details (with injury chips), Estimate
- Right column: Actions card (contextual buttons based on current status), Activity log
- Status workflow: new → contacted → qualified → sent_to_attorney → converted
- Reject available from any non-terminal status

### LeadStatusBadge
- Color-coded pill per status
- New/Sent: cyan (#a4e6ff), Qualified/Converted: green (#4ADE80), Rejected/Lost: red (#ffb4ab), Contacted: gray (#bbc9cf)

### ActivityLog
- Chronological list of lead_activity records
- Shows action label, status change details (from → to), relative timestamp
- Limited to 20 most recent entries

---

## 6. Calculator Integration

### Modification to CalculatorForm.jsx

The `showResult` function (line 653) is modified to:

1. Validate contact fields (existing logic)
2. Call `submitLead(data, calcSettlement(data))` — async, non-blocking
3. Show loading animation and results (existing logic)

### submitLead Function

- Maps form data to DB columns using the mapping table in section 3
- Captures UTM params from URL
- Inserts into `leads` table via Supabase client
- Calls `log_lead_activity` RPC with action `'created'`
- On error: logs to console, does NOT block the user experience
- If Supabase env vars are missing: function is a no-op (graceful degradation)

---

## 7. Design System Compliance

All admin components follow the "Neon Nocturne" design system:

| Token | Hex | Use |
|---|---|---|
| Base background | #111318 | Page surface |
| Card background | #1e2024 | Card surfaces |
| Sidebar background | #0D0D0D | Admin sidebar |
| Input/button bg | #333539 | Buttons, inputs, active nav |
| Primary accent | #a4e6ff | Cyan — accent text, headlines |
| Error/warning | #ffb4ab | Negative states, reject buttons |
| Success | #4ADE80 | Positive states, qualify buttons |
| Primary text | #e2e2e8 | Headlines, body |
| Secondary text | #bbc9cf | Descriptions, labels |

Fonts: Space Grotesk (headlines), Manrope (body), Inter (labels)

---

## 8. File Structure

### New Files
```
supabase/schema.sql
.env.example
src/lib/supabase.js
src/hooks/useAuth.js
src/components/auth/LoginForm.jsx
src/components/auth/ProtectedRoute.jsx
src/components/admin/AdminLayout.jsx
src/components/admin/Dashboard.jsx
src/components/admin/LeadList.jsx
src/components/admin/LeadDetail.jsx
src/components/admin/LeadStatusBadge.jsx
src/components/admin/ActivityLog.jsx
```

### Modified Files
```
src/main.jsx                       # Add admin route branch
src/components/CalculatorForm.jsx  # Add submitLead() in showResult
.gitignore                         # Ensure .env is ignored
```

---

## 9. Dependencies

```bash
npm install @supabase/supabase-js date-fns
```

---

## 10. Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

User provides these after creating their Supabase project. Added to Vercel env vars for production.

---

## 11. Deployment Notes

- Vercel `vercel.json` needs SPA rewrite rule so `/admin/*` routes don't 404 on refresh
- User creates Supabase project manually, runs `supabase/schema.sql` in SQL Editor
- User creates admin user via Supabase Auth dashboard
- User adds env vars to Vercel project settings
- Push to main triggers Vercel auto-deploy
