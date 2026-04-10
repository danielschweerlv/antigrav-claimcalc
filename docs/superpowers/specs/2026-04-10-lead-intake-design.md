# Lead Intake — Design Spec

**Date:** 2026-04-10
**Status:** Approved for planning
**Scope:** Sub-project #1 of the ClaimCalculator.ai backend. Other sub-projects (admin dashboard, attorney routing, notifications, payouts, analytics) are tracked separately and out of scope here.

## 1. Goal

Wire the public calculator form at `/calculator` to the existing Supabase project (`claimcalculator.ai`, ref `uawtkzzyeydfgnpiaqfb`) so that every completed submission becomes an authoritative `leads` row with a server-computed valuation, spam-protected, under RLS, and reproducible via committed migrations.

Success = a real user can fill out the form on the live site, see their estimate, and an admin can later see that lead in Postgres with accurate values, UTM attribution, and an activity log entry.

## 2. Architecture

```
┌──────────────────┐     POST /functions/v1/submit-lead     ┌───────────────────┐
│  CalculatorForm  │  ─────────────────────────────────►    │  submit-lead      │
│  (React client)  │   { case details, contact, utm,        │  (Deno edge fn)   │
│                  │     honeypot }                          │                   │
│  - live preview  │  ◄─────────────────────────────────     │  1. honeypot      │
│    via shared    │     { leadId, estimate }                │  2. rate limit    │
│    calc fn       │                                         │  3. zod validate  │
└──────────────────┘                                         │  4. calc (shared) │
         │                                                   │  5. insert lead   │
         │ imports                                           │  6. insert        │
         ▼                                                   │     activity      │
┌──────────────────────────┐                                 │  7. return        │
│ supabase/functions/      │                                 └───────┬───────────┘
│ _shared/calc-settlement  │◄───── imports (Deno)                    │
│ .ts  (pure, typed)       │                                         ▼
└──────────────────────────┘                               ┌───────────────────┐
                                                           │  Postgres (RLS)   │
                                                           │  - leads          │
                                                           │  - lead_activity  │
                                                           │  - rate_limits    │
                                                           └───────────────────┘
```

### Key properties

- **One edge function.** `submit-lead` is the only write path. No direct anon inserts on `leads`.
- **Authoritative server-side valuation.** The client still shows a live preview during the form flow (same shared function), but the values displayed on the results screen and stored in the DB come from the server response.
- **Single source of truth for the calc.** The valuation logic lives in `supabase/functions/_shared/calc-settlement.ts` as a pure, typed function. The React client re-exports it from `src/lib/calc-settlement.js`; Vite transpiles the `.ts` through esbuild.
- **Migrations introduced here.** Everything from now on goes through `supabase/migrations/`. A baseline migration captures the existing schema so the repo matches reality.
- **IP privacy.** Rate limiting stores SHA-256 hashes of the IP + a server-side pepper, never raw addresses.

## 3. Data contract

### Request (POST /functions/v1/submit-lead)

```ts
{
  // Case details (all fields from CalculatorForm data state)
  caseType: "Motor Vehicle Accident" | "Premises Liability" | "Work Injury" | "Product Liability" | "Other",
  accidentType?: string,
  injuries: string[],                    // ≥1 item unless "I was not injured"
  fault?: "Not my fault" | "Mostly other driver" | "Shared / unclear" | "Mostly me",
  evInvolved?: "Yes" | "No",
  commercialVehicle?: "Yes" | "No",
  rideshareInvolved?: "Yes" | "No",
  when?: "Less than 30 days ago" | "1–6 months ago" | "6–12 months ago" | "Over a year ago",
  reportedTo?: string[],
  cameras?: "Yes" | "No",
  witnesses?: "Yes" | "No",
  surface?: string,
  lighting?: string,
  hasOwnInsurance?: "Yes" | "No",
  myInsurer?: string,
  otherInsurer?: string,
  adjusterContacted?: "Yes" | "No",
  hasLawyer?: "Yes" | "No",
  caseDescription?: string,              // max 2000 chars
  zipCode?: string,                      // 5 digits; non-NV accepted with flag

  // Contact (required)
  firstName: string,                     // 1–60 chars
  lastName:  string,                     // 1–60 chars
  email:     string,                     // RFC email
  phone:     string,                     // ≥7 digits after strip

  // Attribution (auto-captured client-side)
  utm: { source?: string, medium?: string, campaign?: string },
  referrer?: string,

  // Anti-abuse
  website?: string                       // HONEYPOT — must be empty
}
```

Validation via zod in `_shared/schema.ts`. Unknown fields are stripped.

### Response — success (200)

```ts
{
  leadId: string,                        // uuid
  estimate: {
    withLow: number, withHigh: number,
    withoutLow: number, withoutHigh: number
  }
}
```

### Response — failure

| Code | Cause | Client behavior |
|---|---|---|
| 400 | zod failure OR honeypot tripped | Generic "check your info and try again" — no field-level echo (bot defense) |
| 429 | Rate limit hit | "Too many attempts — please try again later or call us" |
| 500 | DB insert failed | "Something went wrong — please try again or call us" |

### Row mapping (`leads`)

| DB column | Source |
|---|---|
| `case_type` | `caseType` display string → enum via `mappers.ts` |
| `accident_type` | `accidentType` |
| `injury_types` | `injuries` as JSON array |
| `fault_status` | `fault` → enum (`"Not my fault"` → `not_at_fault`, etc.) |
| `ev_involved` | `evInvolved === "Yes"` |
| `commercial_vehicle` | `commercialVehicle === "Yes"` |
| `rideshare_involved` | `rideshareInvolved === "Yes"` |
| `accident_timeframe` | `when` |
| `report_filed` | `reportedTo` as JSON array |
| `cameras_witnesses` | `cameras === "Yes" \|\| witnesses === "Yes"` |
| `surface_conditions` | `surface` |
| `lighting_conditions` | `lighting` |
| `has_own_insurance` | `hasOwnInsurance === "Yes"` |
| `own_insurance_company` | `myInsurer` |
| `other_party_insurance` | `otherInsurer` |
| `adjuster_contacted` | `adjusterContacted === "Yes"` |
| `has_lawyer` | `hasLawyer === "Yes"` |
| `case_description` | `caseDescription` |
| `zip_code` | `zipCode` |
| `contact_name` | `firstName + " " + lastName` |
| `contact_email` | `email` |
| `contact_phone` | `phone` |
| `estimated_value_low` | **`withoutAvg`** — midpoint of without-attorney range |
| `estimated_value_high` | **`withAvg`** — midpoint of with-attorney range |
| `utm_source`, `utm_medium`, `utm_campaign` | from `utm` object |
| `referrer` | `referrer` |
| `notes` | `"non-NV zip"` when zip present and not in NV prefixes (889, 890, 891, 893, 894, 895, 897, 898); otherwise null |
| `priority` | 0 (default; to be computed by future lead-scoring work) |
| `status` | `new` (default) |

### `lead_activity` row (inserted same request)

```ts
{
  lead_id: <new lead id>,
  action: "created",
  details: { utm, referrer, ip_hash }
}
```

## 4. Valuation rules

The calc function lives in `supabase/functions/_shared/calc-settlement.ts` and is imported by both the edge function and the React client.

**Hard constraint:** for every valid input, `withAvg >= 4.5 * withoutAvg` where `withAvg = (withLow + withHigh) / 2` and `withoutAvg = (withoutLow + withoutHigh) / 2`.

**Approach:** structural retune of the existing `calcSettlement` multipliers so the ratio lands naturally in the 4.5×–6× range for every reasonable case. No post-hoc clamp — the math itself produces the ratio.

**Verification:** `_shared/calc-settlement.test.ts` exercises the function against a synthetic grid of ~200 payloads (cartesian of caseType × injuries × fault × when × EV × commercial × rideshare × cameras × witnesses × surface × lighting × otherInsurer × onJob) and asserts `withAvg >= 4.5 * withoutAvg` on every one. Run via `deno test`.

## 5. RLS and migrations

### Migrations (introduced here)

**`0001_baseline.sql`** — reverse-engineered snapshot of the current live schema:
- Enums: `lead_status`, `case_type`, `fault_status`, `activity_type`, `assignment_outcome`, `payout_status`
- Tables: `leads`, `lead_activity`, `attorney_partners`, `lead_assignments`, `admin_profiles`
- Foreign keys: `lead_activity.lead_id → leads.id`, `lead_assignments.lead_id → leads.id`, `lead_assignments.attorney_id → attorney_partners.id`, `admin_profiles.id → auth.users.id`
- `alter table ... enable row level security` on all five tables (already enabled live — this makes the migration idempotent)

Applied as already-run against the live project (`supabase migration repair --status applied 0001`) so we don't attempt to re-create existing objects.

**`0002_rls_policies.sql`** — explicit policies replacing whatever exists today:

```sql
-- leads: no anon access at all. Authenticated admins get full read/update.
create policy leads_admin_select on public.leads
  for select to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy leads_admin_update on public.leads
  for update to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy leads_super_admin_delete on public.leads
  for delete to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid() and role = 'super_admin'));

-- Mirror policies for lead_activity, attorney_partners, lead_assignments.
-- admin_profiles: a user can select their own row; admins can select all.
```

The edge function uses the service role key and bypasses RLS entirely — that's how inserts to `leads` happen.

**`0003_rate_limits.sql`** — new table:

```sql
create table public.rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index rate_limits_ip_hash_created_at_idx
  on public.rate_limits (ip_hash, created_at desc);

alter table public.rate_limits enable row level security;
-- No policies: only the service role touches this table.
```

Cleanup: inline in the edge function (delete rows older than 24h opportunistically on each call). pg_cron can replace this later if volume grows.

## 6. File layout

```
supabase/
├── config.toml                          (supabase init)
├── migrations/
│   ├── 0001_baseline.sql
│   ├── 0002_rls_policies.sql
│   └── 0003_rate_limits.sql
└── functions/
    ├── _shared/
    │   ├── calc-settlement.ts           (pure, retuned, typed)
    │   ├── calc-settlement.test.ts      (deno test — ratio floor grid)
    │   ├── schema.ts                    (zod validators)
    │   ├── mappers.ts                   (display-string → enum)
    │   └── rate-limit.ts                (IP hashing + window check)
    └── submit-lead/
        └── index.ts                     (handler orchestrating the above)

src/
├── lib/
│   ├── supabase.js                      (createClient, anon key from env)
│   ├── calc-settlement.js               (re-export of _shared/calc-settlement.ts)
│   └── submit-lead.js                   (fetch wrapper for the edge function)
└── components/
    └── CalculatorForm.jsx               (wired to submit-lead.js; honeypot added)

.env.example                             (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
```

## 7. Implementation phases

### Phase A — Repo & migration scaffolding

1. Run `supabase init` in project root. Commit `supabase/config.toml`.
2. Hand-write `0001_baseline.sql` matching the live schema. Link repo to remote (`supabase link --project-ref uawtkzzyeydfgnpiaqfb`). Mark baseline as applied so it won't re-run.
3. Write `0002_rls_policies.sql` and `0003_rate_limits.sql`. Apply via `supabase db push`.

### Phase B — Shared calc & validation

4. Create `supabase/functions/_shared/calc-settlement.ts` — port current `calcSettlement` to TypeScript, retune until the 4.5× ratio floor holds everywhere.
5. Create `_shared/calc-settlement.test.ts` — generate ~200-payload synthetic grid, assert ratio floor on all. Run via `deno test`.
6. Create `_shared/schema.ts` (zod validators) and `_shared/mappers.ts` (display-string → DB enum).
7. Create `src/lib/calc-settlement.js` as a thin re-export so the React client uses the same logic.

### Phase C — Edge function

8. Create `supabase/functions/submit-lead/index.ts`:
   - Parse + zod-validate request.
   - Honeypot check (`website` field empty).
   - Rate limit: hash IP with pepper, count rows in last hour and last day, insert attempt. Thresholds: **5 submissions / hour / IP**, **20 submissions / day / IP**. Return 429 if either exceeded. Opportunistic cleanup of rows older than 24h.
   - Compute authoritative estimate from shared calc.
   - Map to DB enums; insert `leads` row (service role).
   - Insert `lead_activity` row (`action = 'created'`, details = `{ utm, referrer, ip_hash }`).
   - Return `{ leadId, estimate }`.
9. Deploy: `supabase functions deploy submit-lead --no-verify-jwt` (public endpoint).
10. Set secret: `IP_HASH_PEPPER` (random 32-byte hex) via `supabase secrets set`.

### Phase D — Client wiring

11. `npm install @supabase/supabase-js` if not already present.
12. Create `src/lib/supabase.js` (anon-key client from `VITE_` env vars).
13. Create `src/lib/submit-lead.js` — fetch wrapper POSTing to `/functions/v1/submit-lead` with the anon key as bearer; reads UTM from URL and referrer from `document.referrer`.
14. In `CalculatorForm.jsx`: add hidden honeypot input; on final-step CTA click, call `submitLead(data)`, show loading state, on success set `done=true` and render results from the **server-returned** estimate; on failure show inline error with a call-us fallback.
15. Add `.env.example` and document `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` setup locally and on Vercel in `README.md`.

### Phase E — Verification

16. End-to-end smoke: submit a real-looking lead from local dev against the deployed function. Verify row lands in `leads`, activity row in `lead_activity`, values match UI.
17. Hit the endpoint 6 times from one IP → expect 429 on the 6th.
18. Submit with `website` populated → expect 400 and no DB row.
19. Submit with missing required contact fields → expect 400.
20. Submit with non-NV zip → expect 200, row stored with `notes = 'non-NV zip'`.
21. In the Supabase dashboard, confirm the anon role cannot SELECT from `leads` directly.

## 8. Out of scope

Tracked as separate specs; not implemented here:

- Admin auth + admin dashboard UI
- Attorney routing & assignment
- Email notifications (user confirmation, attorney handoff, admin alerts)
- Payout tracking / invoicing
- Analytics / funnel reporting
- Lead scoring / `priority` calculation
- Duplicate detection (same email, multiple submissions)
- Server-side pg_cron cleanup of `rate_limits`

## 9. Open questions

None remaining — all scoping decisions resolved during brainstorming.
