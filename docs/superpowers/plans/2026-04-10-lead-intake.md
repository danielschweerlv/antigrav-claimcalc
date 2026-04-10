# Lead Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the public calculator form to the existing Supabase project so every submission becomes an authoritative `leads` row with a server-computed valuation, honeypot + IP rate limiting, RLS hardening, and reproducible migrations.

**Architecture:** Browser POSTs raw form data to a single `submit-lead` Deno edge function. The edge function validates (zod), runs honeypot and IP rate-limit checks, computes the authoritative estimate from shared calc logic, inserts `leads` + `lead_activity` via service role (RLS bypass), and returns `{ leadId, estimate }`. The React client keeps its live preview using the same shared calc module, but renders the results screen from the server response.

**Tech Stack:** Supabase (Postgres + Edge Functions / Deno), TypeScript, zod, React 19, Vite 8, @supabase/supabase-js.

**Spec:** `docs/superpowers/specs/2026-04-10-lead-intake-design.md`

**Project root for all paths below:** `/Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc/`

---

## Prerequisites

- [ ] **Install Supabase CLI if missing**

```bash
which supabase || brew install supabase/tap/supabase
supabase --version
```

Expected: prints a version number ≥ 1.180.0.

- [ ] **Install Deno if missing** (needed for running edge function tests)

```bash
which deno || brew install deno
deno --version
```

Expected: prints a version number ≥ 1.40.

- [ ] **Confirm working directory and clean git state**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
git status
```

Expected: `main` branch, no uncommitted changes (the spec commit should already be in place).

---

## Phase A — Repo scaffolding & migrations

### Task 1: Initialize Supabase project structure

**Files:**
- Create: `supabase/config.toml` (generated)
- Create: `.gitignore` additions

- [ ] **Step 1: Run supabase init**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
supabase init
```

Expected output: `Finished supabase init.` Creates `supabase/config.toml` and `supabase/.gitignore`.

- [ ] **Step 2: Link to the remote project**

```bash
supabase link --project-ref uawtkzzyeydfgnpiaqfb
```

You'll be prompted for the database password. Get it from the Supabase dashboard → Project Settings → Database if you don't have it. Expected: `Finished supabase link.`

- [ ] **Step 3: Verify remote connection**

```bash
supabase migration list
```

Expected: a table showing `LOCAL | REMOTE | TIME` columns. Remote is empty (migrations list returned [] earlier). No error.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "chore: initialize supabase project and link to remote"
```

---

### Task 2: Baseline migration capturing the live schema

**Files:**
- Create: `supabase/migrations/0001_baseline.sql`

- [ ] **Step 1: Write the baseline migration**

Create `supabase/migrations/0001_baseline.sql`:

```sql
-- Baseline migration: reflects the live schema as of 2026-04-10.
-- This migration is idempotent and guarded by IF NOT EXISTS so it can
-- safely be marked as already-applied against the live database.

-- ── Extensions ─────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp" with schema extensions;

-- ── Enums ──────────────────────────────────────────────────────────────
do $$ begin
  create type public.lead_status as enum ('new','contacted','qualified','sent_to_attorney','converted','rejected','lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_type as enum ('motor_vehicle','premises_liability','work_injury','product_liability','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fault_status as enum ('not_at_fault','partial_fault','at_fault','unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_type as enum ('created','viewed','status_changed','note_added','exported','sent_to_attorney','attorney_response');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assignment_outcome as enum ('pending','accepted','rejected','converted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payout_status as enum ('unpaid','invoiced','paid');
exception when duplicate_object then null; end $$;

-- ── Tables ─────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id uuid primary key default extensions.uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status public.lead_status default 'new',
  case_type public.case_type not null,
  accident_type text,
  injury_types jsonb default '[]'::jsonb,
  fault_status public.fault_status default 'unknown',
  ev_involved boolean default false,
  commercial_vehicle boolean default false,
  rideshare_involved boolean default false,
  report_filed jsonb default '[]'::jsonb,
  cameras_witnesses boolean,
  surface_conditions text,
  lighting_conditions text,
  accident_date date,
  accident_timeframe text,
  has_own_insurance boolean,
  own_insurance_company text,
  other_party_insurance text,
  adjuster_contacted boolean,
  has_lawyer boolean default false,
  case_description text,
  zip_code text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  estimated_value_low integer,
  estimated_value_high integer,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  notes text,
  priority integer default 0
);

create table if not exists public.attorney_partners (
  id uuid primary key default extensions.uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  firm_name text,
  email text not null,
  phone text,
  case_types_accepted public.case_type[] default array['motor_vehicle'::public.case_type],
  zip_codes_covered text[] default array[]::text[],
  max_leads_per_month integer,
  price_per_lead integer default 2000,
  is_active boolean default true,
  notes text
);

create table if not exists public.lead_assignments (
  id uuid primary key default extensions.uuid_generate_v4(),
  lead_id uuid references public.leads(id),
  attorney_id uuid references public.attorney_partners(id),
  assigned_at timestamptz default now(),
  outcome public.assignment_outcome default 'pending',
  outcome_updated_at timestamptz,
  payout_status public.payout_status default 'unpaid',
  payout_amount integer,
  payout_date date,
  notes text
);

create table if not exists public.lead_activity (
  id uuid primary key default extensions.uuid_generate_v4(),
  lead_id uuid references public.leads(id),
  action public.activity_type not null,
  performed_by uuid,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id),
  email text not null,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- ── RLS enabled on all tables ──────────────────────────────────────────
alter table public.leads enable row level security;
alter table public.lead_activity enable row level security;
alter table public.attorney_partners enable row level security;
alter table public.lead_assignments enable row level security;
alter table public.admin_profiles enable row level security;
```

- [ ] **Step 2: Mark the baseline as already applied on the remote**

```bash
supabase migration repair --status applied 0001
supabase migration list
```

Expected: the `0001` row now shows the same timestamp under both LOCAL and REMOTE.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0001_baseline.sql
git commit -m "feat(db): add baseline migration for existing schema"
```

---

### Task 3: RLS policies migration

**Files:**
- Create: `supabase/migrations/0002_rls_policies.sql`

- [ ] **Step 1: Write the policies migration**

Create `supabase/migrations/0002_rls_policies.sql`:

```sql
-- Drop any legacy policies first so this migration is idempotent.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('leads','lead_activity','attorney_partners','lead_assignments','admin_profiles')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

-- Helper: is the current auth user a row in admin_profiles?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid() and role = 'super_admin');
$$;

-- ── leads ──────────────────────────────────────────────────────────────
-- No anon access. No authenticated insert (edge function uses service role).
create policy leads_admin_select on public.leads
  for select to authenticated using (public.is_admin());

create policy leads_admin_update on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy leads_super_admin_delete on public.leads
  for delete to authenticated using (public.is_super_admin());

-- ── lead_activity ──────────────────────────────────────────────────────
create policy lead_activity_admin_select on public.lead_activity
  for select to authenticated using (public.is_admin());

create policy lead_activity_admin_insert on public.lead_activity
  for insert to authenticated with check (public.is_admin());

-- ── attorney_partners ──────────────────────────────────────────────────
create policy attorney_partners_admin_all on public.attorney_partners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── lead_assignments ───────────────────────────────────────────────────
create policy lead_assignments_admin_all on public.lead_assignments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── admin_profiles ─────────────────────────────────────────────────────
create policy admin_profiles_self_select on public.admin_profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

create policy admin_profiles_super_admin_all on public.admin_profiles
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
```

- [ ] **Step 2: Apply the migration to the remote**

```bash
supabase db push
```

Expected: `Applying migration 0002_rls_policies.sql...` then `Finished supabase db push.`

- [ ] **Step 3: Verify policies exist**

```bash
supabase db remote query "select tablename, policyname from pg_policies where schemaname='public' order by tablename, policyname;"
```

Expected: rows showing `leads_admin_select`, `leads_admin_update`, `leads_super_admin_delete`, `lead_activity_admin_select`, `lead_activity_admin_insert`, `attorney_partners_admin_all`, `lead_assignments_admin_all`, `admin_profiles_self_select`, `admin_profiles_super_admin_all`.

(If `supabase db remote query` is not available in your CLI version, open the Supabase Dashboard → Database → Policies and confirm the list.)

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0002_rls_policies.sql
git commit -m "feat(db): add RLS policies for all tables"
```

---

### Task 4: Rate limits table migration

**Files:**
- Create: `supabase/migrations/0003_rate_limits.sql`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0003_rate_limits.sql`:

```sql
create table if not exists public.rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_ip_hash_created_at_idx
  on public.rate_limits (ip_hash, created_at desc);

alter table public.rate_limits enable row level security;

-- No policies: only the service role writes/reads this table.
```

- [ ] **Step 2: Apply**

```bash
supabase db push
```

Expected: `Applying migration 0003_rate_limits.sql...` then success.

- [ ] **Step 3: Verify the table exists**

Open the Supabase Dashboard → Table Editor and confirm `rate_limits` appears. Alternatively:

```bash
supabase db remote query "select column_name, data_type from information_schema.columns where table_schema='public' and table_name='rate_limits';"
```

Expected: two rows — `ip_hash text`, `created_at timestamp with time zone`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0003_rate_limits.sql
git commit -m "feat(db): add rate_limits table for IP throttling"
```

---

## Phase B — Shared calc, schema, mappers

### Task 5: Port & retune calc-settlement

**Files:**
- Create: `supabase/functions/_shared/calc-settlement.ts`
- Test: `supabase/functions/_shared/calc-settlement.test.ts`

- [ ] **Step 1: Write the failing test**

Create `supabase/functions/_shared/calc-settlement.test.ts`:

```ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { calcSettlement, type CalcInput } from "./calc-settlement.ts";

// ── Ratio floor test: withAvg must be ≥ 4.5 × withoutAvg on every
// reasonable input. We exercise a cartesian grid of ~200 cases.
Deno.test("calcSettlement enforces 4.5x ratio floor across input grid", () => {
  const caseTypes: CalcInput["caseType"][] = [
    "Motor Vehicle Accident",
    "Premises Liability",
    "Work Injury",
    "Product Liability",
    "Other",
  ];
  const injurySets: string[][] = [
    ["Body aches & pain"],
    ["Broken or fractured bones"],
    ["Surgery required", "Brain injury"],
    ["Scarring", "Memory loss"],
  ];
  const faults: CalcInput["fault"][] = [
    "Not my fault",
    "Mostly other driver",
    "Shared / unclear",
  ]; // "Mostly me" is fault-barred and produces 0s — excluded from ratio check
  const whens: CalcInput["when"][] = [
    "Less than 30 days ago",
    "1\u20136 months ago",
    "6\u201312 months ago",
    "Over a year ago",
  ];
  const yesNos: ("Yes" | "No")[] = ["Yes", "No"];

  let checked = 0;
  for (const caseType of caseTypes) {
    for (const injuries of injurySets) {
      for (const fault of faults) {
        for (const when of whens) {
          for (const ev of yesNos) {
            const result = calcSettlement({
              caseType,
              injuries,
              fault,
              when,
              evInvolved: ev,
              commercialVehicle: "No",
              cameras: "No",
              witnesses: "No",
              surface: "",
              lighting: "",
              otherInsurer: "GEICO",
              onTheJob: "No",
              faultAtFault: "No",
            });
            if (result.faultBarred) continue;
            const withAvg = (result.withLow + result.withHigh) / 2;
            const withoutAvg = (result.withoutLow + result.withoutHigh) / 2;
            assert(
              withAvg >= 4.5 * withoutAvg,
              `Ratio floor violated for ${JSON.stringify({ caseType, injuries, fault, when, ev })}: ${withAvg} / ${withoutAvg} = ${(withAvg / withoutAvg).toFixed(2)}`,
            );
            checked++;
          }
        }
      }
    }
  }
  assert(checked > 100, `Expected >100 grid points; checked ${checked}`);
});

Deno.test("calcSettlement returns zeros when fault barred", () => {
  const r = calcSettlement({
    caseType: "Motor Vehicle Accident",
    injuries: ["Broken or fractured bones"],
    fault: "Mostly me",
    when: "1\u20136 months ago",
  });
  assert(r.faultBarred);
  assertEquals(r.withLow, 0);
  assertEquals(r.withHigh, 0);
  assertEquals(r.withoutLow, 0);
  assertEquals(r.withoutHigh, 0);
});

Deno.test("calcSettlement floors low values appropriately", () => {
  // Minimal-injury case — without-low should floor at 500, with-low at 5000.
  const r = calcSettlement({
    caseType: "Motor Vehicle Accident",
    injuries: ["I was not injured"],
    fault: "Not my fault",
    when: "Over a year ago",
  });
  assert(r.withLow >= 5000);
  assert(r.withoutLow >= 500);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
deno test supabase/functions/_shared/calc-settlement.test.ts --allow-all
```

Expected: FAIL with `Module not found "file:///.../calc-settlement.ts"`.

- [ ] **Step 3: Write minimal implementation**

Create `supabase/functions/_shared/calc-settlement.ts`:

```ts
// Pure valuation logic — no IO, no runtime deps. Imported by both the
// submit-lead edge function (Deno) and the React client (Vite re-export).
//
// Hard constraint: withAvg >= 4.5 * withoutAvg on every non-barred input.
// Enforced structurally by the multipliers below (not a post-hoc clamp).

export type CalcInput = {
  caseType:
    | "Motor Vehicle Accident"
    | "Premises Liability"
    | "Work Injury"
    | "Product Liability"
    | "Other";
  injuries?: string[];
  fault?: "Not my fault" | "Mostly other driver" | "Shared / unclear" | "Mostly me";
  faultAtFault?: "Yes" | "No";
  evInvolved?: "Yes" | "No";
  commercialVehicle?: "Yes" | "No";
  when?:
    | "Less than 30 days ago"
    | "1\u20136 months ago"
    | "6\u201312 months ago"
    | "Over a year ago";
  otherInsurer?: string;
  cameras?: "Yes" | "No";
  witnesses?: "Yes" | "No";
  surface?: string;
  lighting?: string;
  onTheJob?: "Yes" | "No";
};

export type CalcResult = {
  faultBarred: boolean;
  withLow: number;
  withHigh: number;
  withoutLow: number;
  withoutHigh: number;
};

export function calcSettlement(data: CalcInput): CalcResult {
  const injuries = data.injuries ?? [];
  let injScore = 0;

  injuries.forEach((inj) => {
    if (["Body aches & pain", "Cuts, scrapes & bruises"].includes(inj)) {
      injScore = Math.max(injScore, 1);
    }
    if (
      ["Broken or fractured bones", "Scarring", "Internal bleeding", "Memory loss"]
        .includes(inj)
    ) {
      injScore = Math.max(injScore, 3);
    }
    if (
      [
        "Surgery required",
        "Brain injury",
        "Loss of internal organs",
        "Coma",
        "Paralysis",
        "Amputation",
      ].includes(inj)
    ) {
      injScore = Math.max(injScore, 6);
    }
  });
  if (injuries.includes("I was not injured")) injScore = 0;
  if (injScore === 0 && injuries.length === 0) injScore = 1;

  const faultMap: Record<string, number> = {
    "Not my fault": 1.0,
    "Mostly other driver": 0.8,
    "Shared / unclear": 0.6,
    "Mostly me": 0.25,
  };

  let fM = 0.8;
  if (data.caseType === "Motor Vehicle Accident") {
    fM = faultMap[data.fault ?? ""] ?? 0.8;
  } else {
    fM = data.faultAtFault === "Yes" ? 0.4 : 1.0;
  }
  const faultBarred =
    data.caseType === "Motor Vehicle Accident" &&
    fM <= 0.25 &&
    data.fault === "Mostly me";

  const whenMap: Record<string, number> = {
    "Less than 30 days ago": 1.1,
    "1\u20136 months ago": 1.0,
    "6\u201312 months ago": 0.95,
    "Over a year ago": 0.85,
  };

  const otherInsM =
    data.otherInsurer === "They Have No Insurance / I Don't Know" ? 0.7 : 1.0;
  const evM = data.evInvolved === "Yes" ? 1.12 : 1.0;
  const commM = data.commercialVehicle === "Yes" ? 1.18 : 1.0;
  const onJobM = data.onTheJob === "Yes" ? 1.15 : 1.0;
  const cameraM = data.cameras === "Yes" ? 1.08 : 1.0;
  const witnessM = data.witnesses === "Yes" ? 1.08 : 1.0;
  const surfaceM = data.surface === "No, it was uneven or sloped" ? 1.1 : 1.0;
  const lightingM = data.lighting === "No, it was poorly lit" ? 1.1 : 1.0;

  const tM = whenMap[data.when ?? ""] ?? 1.0;
  const baseMed = injScore * 8000 + 4000;
  const pain = baseMed * (injScore || 1.5);
  const prop = Math.round(baseMed * 0.35);

  let base: number;
  if (data.caseType === "Motor Vehicle Accident") {
    base = (baseMed + pain + prop) * fM * tM * otherInsM * evM * commM;
  } else {
    base = (baseMed + pain + prop) * fM * tM * onJobM * cameraM * witnessM *
      surfaceM * lightingM;
  }

  if (faultBarred) {
    return { faultBarred, withLow: 0, withHigh: 0, withoutLow: 0, withoutHigh: 0 };
  }

  // ── Ratio enforcement ────────────────────────────────────────────────
  // Previous multipliers gave withAvg/withoutAvg ≈ 4.47 — just under 4.5.
  // Retuned: "with" range slightly widened (1.6–3.0) and "without" range
  // slightly narrowed (0.28–0.56). New midpoints: with=2.3*base, without=
  // 0.42*base → ratio ≈ 5.48. Verified by the grid test.
  const withLow = Math.max(Math.round(base * 1.6), 5000);
  const withHigh = Math.round(base * 3.0);
  const withoutLow = Math.max(Math.round(base * 0.28), 500);
  const withoutHigh = Math.round(base * 0.56);

  return { faultBarred, withLow, withHigh, withoutLow, withoutHigh };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/calc-settlement.test.ts --allow-all
```

Expected: `3 passed` — all three tests green.

If the grid test fails, inspect the failing input printed in the assertion message and adjust the `withLow` / `withHigh` / `withoutLow` / `withoutHigh` multipliers (e.g. bump `1.6` → `1.65`). Re-run.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/calc-settlement.ts supabase/functions/_shared/calc-settlement.test.ts
git commit -m "feat(calc): shared settlement calc with 4.5x ratio floor"
```

---

### Task 6: Re-export calc for the React client

**Files:**
- Create: `src/lib/calc-settlement.js`
- Modify: `src/components/CalculatorForm.jsx` (swap local `calcSettlement` for the shared import)

- [ ] **Step 1: Create the re-export shim**

Create `src/lib/calc-settlement.js`:

```js
// Re-export of the shared edge-function calc module so the browser and
// the server use a single source of truth. Vite's esbuild transpiles
// the .ts file transparently.
export {
  calcSettlement,
} from '../../supabase/functions/_shared/calc-settlement.ts'
```

- [ ] **Step 2: Remove the duplicated `calcSettlement` from `CalculatorForm.jsx`**

Open `src/components/CalculatorForm.jsx`. Delete lines 181–243 (the `// ─── CALCULATION ──` block through the closing `}` of the local `calcSettlement` function).

- [ ] **Step 3: Add the import at the top of `CalculatorForm.jsx`**

After the existing `import` statements (around line 8), add:

```jsx
import { calcSettlement } from '../lib/calc-settlement'
```

- [ ] **Step 4: Verify the dev server still builds**

```bash
npm run build
```

Expected: `✓ built in <N>s`. No errors referencing `calcSettlement`.

If Vite complains about importing from outside `src/`, add `supabase` to `vite.config.js` under `server.fs.allow` — but first try the build without touching the config; Vite usually allows this from the project root.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calc-settlement.js src/components/CalculatorForm.jsx
git commit -m "refactor(calc): client uses shared calc-settlement module"
```

---

### Task 7: Zod request schema

**Files:**
- Create: `supabase/functions/_shared/schema.ts`
- Test: `supabase/functions/_shared/schema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `supabase/functions/_shared/schema.test.ts`:

```ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { submitLeadSchema } from "./schema.ts";

const validBody = {
  caseType: "Motor Vehicle Accident",
  injuries: ["Broken or fractured bones"],
  fault: "Not my fault",
  when: "1\u20136 months ago",
  zipCode: "89101",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "7025551234",
  utm: { source: "google", medium: "cpc" },
  referrer: "https://google.com",
  website: "", // honeypot empty
};

Deno.test("schema accepts a valid payload", () => {
  const parsed = submitLeadSchema.parse(validBody);
  assertEquals(parsed.firstName, "Jane");
});

Deno.test("schema rejects missing email", () => {
  const bad = { ...validBody, email: undefined as unknown as string };
  const res = submitLeadSchema.safeParse(bad);
  assert(!res.success);
});

Deno.test("schema rejects bad email format", () => {
  const bad = { ...validBody, email: "not-an-email" };
  const res = submitLeadSchema.safeParse(bad);
  assert(!res.success);
});

Deno.test("schema rejects short phone", () => {
  const bad = { ...validBody, phone: "123" };
  const res = submitLeadSchema.safeParse(bad);
  assert(!res.success);
});

Deno.test("schema rejects populated honeypot", () => {
  const bad = { ...validBody, website: "spam.example.com" };
  const res = submitLeadSchema.safeParse(bad);
  assert(!res.success);
});

Deno.test("schema strips unknown fields", () => {
  const extra = { ...validBody, maliciousExtra: "drop table" };
  const parsed = submitLeadSchema.parse(extra);
  assert(!("maliciousExtra" in parsed));
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/schema.test.ts --allow-all
```

Expected: FAIL with `Module not found "file:///.../schema.ts"`.

- [ ] **Step 3: Write the schema**

Create `supabase/functions/_shared/schema.ts`:

```ts
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const yesNo = z.enum(["Yes", "No"]);

export const submitLeadSchema = z.object({
  // Case
  caseType: z.enum([
    "Motor Vehicle Accident",
    "Premises Liability",
    "Work Injury",
    "Product Liability",
    "Other",
  ]),
  accidentType: z.string().max(200).optional(),
  injuries: z.array(z.string().max(100)).default([]),
  fault: z
    .enum(["Not my fault", "Mostly other driver", "Shared / unclear", "Mostly me"])
    .optional(),
  faultAtFault: yesNo.optional(),
  evInvolved: yesNo.optional(),
  commercialVehicle: yesNo.optional(),
  rideshareInvolved: yesNo.optional(),
  when: z
    .enum([
      "Less than 30 days ago",
      "1\u20136 months ago",
      "6\u201312 months ago",
      "Over a year ago",
    ])
    .optional(),
  reportedTo: z.array(z.string().max(100)).optional(),
  cameras: yesNo.optional(),
  witnesses: yesNo.optional(),
  surface: z.string().max(200).optional(),
  lighting: z.string().max(200).optional(),
  hasOwnInsurance: yesNo.optional(),
  myInsurer: z.string().max(200).optional(),
  otherInsurer: z.string().max(200).optional(),
  adjusterContacted: yesNo.optional(),
  hasLawyer: yesNo.optional(),
  onTheJob: yesNo.optional(),
  caseDescription: z.string().max(2000).optional(),
  zipCode: z.string().regex(/^\d{5}$/).optional(),

  // Contact
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().email().max(200),
  phone: z
    .string()
    .max(50)
    .refine((v) => v.replace(/\D/g, "").length >= 7, {
      message: "phone must contain at least 7 digits",
    }),

  // Attribution
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
    })
    .default({}),
  referrer: z.string().max(500).optional(),

  // Honeypot: must be empty string or omitted
  website: z
    .string()
    .max(0, { message: "honeypot tripped" })
    .optional()
    .default(""),
}).strip();

export type SubmitLeadBody = z.infer<typeof submitLeadSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/schema.test.ts --allow-all
```

Expected: `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/schema.ts supabase/functions/_shared/schema.test.ts
git commit -m "feat(schema): zod validator for submit-lead payload"
```

---

### Task 8: Display-string → DB enum mappers

**Files:**
- Create: `supabase/functions/_shared/mappers.ts`
- Test: `supabase/functions/_shared/mappers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `supabase/functions/_shared/mappers.test.ts`:

```ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  mapCaseType,
  mapFault,
  isNonNvZip,
} from "./mappers.ts";

Deno.test("mapCaseType translates display strings to enum", () => {
  assertEquals(mapCaseType("Motor Vehicle Accident"), "motor_vehicle");
  assertEquals(mapCaseType("Premises Liability"), "premises_liability");
  assertEquals(mapCaseType("Work Injury"), "work_injury");
  assertEquals(mapCaseType("Product Liability"), "product_liability");
  assertEquals(mapCaseType("Other"), "other");
});

Deno.test("mapFault translates fault display strings", () => {
  assertEquals(mapFault("Not my fault"), "not_at_fault");
  assertEquals(mapFault("Mostly other driver"), "not_at_fault");
  assertEquals(mapFault("Shared / unclear"), "partial_fault");
  assertEquals(mapFault("Mostly me"), "at_fault");
  assertEquals(mapFault(undefined), "unknown");
});

Deno.test("isNonNvZip flags zips outside Nevada prefixes", () => {
  assertEquals(isNonNvZip("89101"), false); // Las Vegas
  assertEquals(isNonNvZip("89501"), false); // Reno
  assertEquals(isNonNvZip("89701"), false); // Carson City
  assertEquals(isNonNvZip("10001"), true);  // NYC
  assertEquals(isNonNvZip("90210"), true);  // Beverly Hills
  assertEquals(isNonNvZip(undefined), false); // no zip = don't flag
  assertEquals(isNonNvZip(""), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/mappers.test.ts --allow-all
```

Expected: FAIL with module not found.

- [ ] **Step 3: Write the mappers**

Create `supabase/functions/_shared/mappers.ts`:

```ts
export type DbCaseType =
  | "motor_vehicle"
  | "premises_liability"
  | "work_injury"
  | "product_liability"
  | "other";

export type DbFaultStatus =
  | "not_at_fault"
  | "partial_fault"
  | "at_fault"
  | "unknown";

export function mapCaseType(display: string): DbCaseType {
  switch (display) {
    case "Motor Vehicle Accident":
      return "motor_vehicle";
    case "Premises Liability":
      return "premises_liability";
    case "Work Injury":
      return "work_injury";
    case "Product Liability":
      return "product_liability";
    default:
      return "other";
  }
}

export function mapFault(display: string | undefined): DbFaultStatus {
  switch (display) {
    case "Not my fault":
    case "Mostly other driver":
      return "not_at_fault";
    case "Shared / unclear":
      return "partial_fault";
    case "Mostly me":
      return "at_fault";
    default:
      return "unknown";
  }
}

// Nevada ZIP prefixes per USPS: 889, 890, 891, 893, 894, 895, 897, 898.
const NV_ZIP_PREFIXES = ["889", "890", "891", "893", "894", "895", "897", "898"];

export function isNonNvZip(zip: string | undefined): boolean {
  if (!zip) return false;
  const prefix = zip.slice(0, 3);
  return !NV_ZIP_PREFIXES.includes(prefix);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/mappers.test.ts --allow-all
```

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/mappers.ts supabase/functions/_shared/mappers.test.ts
git commit -m "feat(mappers): display-string to DB enum translators"
```

---

### Task 9: Rate-limit helper

**Files:**
- Create: `supabase/functions/_shared/rate-limit.ts`
- Test: `supabase/functions/_shared/rate-limit.test.ts`

- [ ] **Step 1: Write the failing test**

Create `supabase/functions/_shared/rate-limit.test.ts`:

```ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { hashIp } from "./rate-limit.ts";

Deno.test("hashIp produces a stable 64-char hex string", async () => {
  const h1 = await hashIp("203.0.113.5", "pepper");
  const h2 = await hashIp("203.0.113.5", "pepper");
  assertEquals(h1, h2);
  assertEquals(h1.length, 64);
  assert(/^[0-9a-f]{64}$/.test(h1));
});

Deno.test("hashIp changes with different peppers", async () => {
  const h1 = await hashIp("203.0.113.5", "pepper-a");
  const h2 = await hashIp("203.0.113.5", "pepper-b");
  assert(h1 !== h2);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/rate-limit.test.ts --allow-all
```

Expected: FAIL with module not found.

- [ ] **Step 3: Write the helper**

Create `supabase/functions/_shared/rate-limit.ts`:

```ts
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 20;

export async function hashIp(ip: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(`${pepper}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type RateLimitCheck =
  | { ok: true }
  | { ok: false; reason: "hourly" | "daily" };

export async function checkAndRecord(
  supabase: SupabaseClient,
  ipHash: string,
): Promise<RateLimitCheck> {
  const now = Date.now();
  const hourAgo = new Date(now - HOUR_MS).toISOString();
  const dayAgo = new Date(now - DAY_MS).toISOString();

  // Count attempts in the last hour and last day.
  const [{ count: hourlyCount, error: hourlyErr }, { count: dailyCount, error: dailyErr }] =
    await Promise.all([
      supabase
        .from("rate_limits")
        .select("ip_hash", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", hourAgo),
      supabase
        .from("rate_limits")
        .select("ip_hash", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", dayAgo),
    ]);

  if (hourlyErr || dailyErr) {
    // Fail-open on DB errors — don't block real users because of infra hiccups.
    return { ok: true };
  }
  if ((hourlyCount ?? 0) >= HOURLY_LIMIT) return { ok: false, reason: "hourly" };
  if ((dailyCount ?? 0) >= DAILY_LIMIT) return { ok: false, reason: "daily" };

  // Record this attempt.
  await supabase.from("rate_limits").insert({ ip_hash: ipHash });

  // Opportunistic cleanup of entries older than 24h.
  await supabase.from("rate_limits").delete().lt("created_at", dayAgo);

  return { ok: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/rate-limit.test.ts --allow-all
```

Expected: `2 passed`. (Note: the `checkAndRecord` function is not unit-tested here because it requires a live Supabase client — it will be exercised by the Phase E integration tests.)

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/rate-limit.ts supabase/functions/_shared/rate-limit.test.ts
git commit -m "feat(rate-limit): IP hashing and window check helpers"
```

---

## Phase C — Edge function

### Task 10: submit-lead handler

**Files:**
- Create: `supabase/functions/submit-lead/index.ts`

- [ ] **Step 1: Write the handler**

Create `supabase/functions/submit-lead/index.ts`:

```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { submitLeadSchema } from "../_shared/schema.ts";
import { calcSettlement } from "../_shared/calc-settlement.ts";
import { mapCaseType, mapFault, isNonNvZip } from "../_shared/mappers.ts";
import { checkAndRecord, hashIp } from "../_shared/rate-limit.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  // Validate
  const parsed = submitLeadSchema.safeParse(raw);
  if (!parsed.success) {
    // Indistinguishable response for validation failure and honeypot trip.
    return json({ error: "invalid submission" }, 400);
  }
  const body = parsed.data;

  // Service-role client (bypasses RLS)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";
  const pepper = Deno.env.get("IP_HASH_PEPPER") ?? "dev-pepper";
  const ipHash = await hashIp(ip, pepper);
  const rl = await checkAndRecord(supabase, ipHash);
  if (!rl.ok) {
    return json({ error: "rate limited", reason: rl.reason }, 429);
  }

  // Authoritative estimate
  const estimate = calcSettlement({
    caseType: body.caseType,
    injuries: body.injuries,
    fault: body.fault,
    faultAtFault: body.faultAtFault,
    evInvolved: body.evInvolved,
    commercialVehicle: body.commercialVehicle,
    when: body.when,
    otherInsurer: body.otherInsurer,
    cameras: body.cameras,
    witnesses: body.witnesses,
    surface: body.surface,
    lighting: body.lighting,
    onTheJob: body.onTheJob,
  });

  const withAvg = Math.round((estimate.withLow + estimate.withHigh) / 2);
  const withoutAvg = Math.round((estimate.withoutLow + estimate.withoutHigh) / 2);

  // Build leads row
  const row = {
    case_type: mapCaseType(body.caseType),
    accident_type: body.accidentType ?? null,
    injury_types: body.injuries,
    fault_status: mapFault(body.fault),
    ev_involved: body.evInvolved === "Yes",
    commercial_vehicle: body.commercialVehicle === "Yes",
    rideshare_involved: body.rideshareInvolved === "Yes",
    accident_timeframe: body.when ?? null,
    report_filed: body.reportedTo ?? [],
    cameras_witnesses: body.cameras === "Yes" || body.witnesses === "Yes",
    surface_conditions: body.surface ?? null,
    lighting_conditions: body.lighting ?? null,
    has_own_insurance: body.hasOwnInsurance === "Yes",
    own_insurance_company: body.myInsurer ?? null,
    other_party_insurance: body.otherInsurer ?? null,
    adjuster_contacted: body.adjusterContacted === "Yes",
    has_lawyer: body.hasLawyer === "Yes",
    case_description: body.caseDescription ?? null,
    zip_code: body.zipCode ?? null,
    contact_name: `${body.firstName} ${body.lastName}`,
    contact_email: body.email,
    contact_phone: body.phone,
    estimated_value_low: withoutAvg,
    estimated_value_high: withAvg,
    utm_source: body.utm.source ?? null,
    utm_medium: body.utm.medium ?? null,
    utm_campaign: body.utm.campaign ?? null,
    referrer: body.referrer ?? null,
    notes: isNonNvZip(body.zipCode) ? "non-NV zip" : null,
  };

  // Insert lead
  const { data: leadRow, error: insertErr } = await supabase
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (insertErr || !leadRow) {
    console.error("lead insert failed", insertErr);
    return json({ error: "insert failed" }, 500);
  }

  // Activity log (best-effort)
  await supabase.from("lead_activity").insert({
    lead_id: leadRow.id,
    action: "created",
    details: { utm: body.utm, referrer: body.referrer, ip_hash: ipHash },
  });

  return json({
    leadId: leadRow.id,
    estimate: {
      withLow: estimate.withLow,
      withHigh: estimate.withHigh,
      withoutLow: estimate.withoutLow,
      withoutHigh: estimate.withoutHigh,
    },
  });
});
```

- [ ] **Step 2: Type-check the function**

```bash
deno check supabase/functions/submit-lead/index.ts
```

Expected: no errors. If you see errors about missing types, add `// deno-lint-ignore-file no-explicit-any` at the top temporarily — but fix any real type errors first.

- [ ] **Step 3: Set the IP pepper secret**

Generate a random pepper and set it on the project:

```bash
PEPPER=$(openssl rand -hex 32)
echo "IP_HASH_PEPPER=$PEPPER"   # save this somewhere safe
supabase secrets set IP_HASH_PEPPER=$PEPPER
```

Expected: `Finished supabase secrets set.`

- [ ] **Step 4: Deploy the function**

```bash
supabase functions deploy submit-lead --no-verify-jwt
```

Expected: `Deployed Function submit-lead on project uawtkzzyeydfgnpiaqfb`.

`--no-verify-jwt` is required because the calculator form is public and callers don't have an auth token. The function still requires the anon key as a bearer (set by `@supabase/supabase-js` automatically).

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/submit-lead/index.ts
git commit -m "feat(edge): submit-lead function for public lead intake"
```

---

## Phase D — Client wiring

### Task 11: Install supabase-js and create client

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `src/lib/supabase.js`
- Create: `.env.example`

- [ ] **Step 1: Install supabase-js**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
npm install @supabase/supabase-js@^2.45.4
```

Expected: `added 1 package`. `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Create the client module**

Create `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Warn loudly during dev if env vars are missing — the submit form will fail.
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — see .env.example')
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: { persistSession: false },
})
```

- [ ] **Step 3: Create `.env.example`**

Create `.env.example` at the project root:

```
# Supabase — copy to .env.local and fill in real values.
# URL: https://app.supabase.com/project/uawtkzzyeydfgnpiaqfb/settings/api
VITE_SUPABASE_URL=https://uawtkzzyeydfgnpiaqfb.supabase.co
VITE_SUPABASE_ANON_KEY=
```

- [ ] **Step 4: Make sure `.env.local` is gitignored**

```bash
grep -q '^\.env' .gitignore || echo -e '\n.env\n.env.local' >> .gitignore
```

- [ ] **Step 5: Create `.env.local` locally** (do NOT commit)

Get the anon key from the Supabase Dashboard → Project Settings → API, then:

```bash
cp .env.example .env.local
# Edit .env.local and paste the anon key
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/supabase.js .env.example .gitignore
git commit -m "feat(client): add supabase-js client and env example"
```

---

### Task 12: Submit-lead fetch wrapper

**Files:**
- Create: `src/lib/submit-lead.js`

- [ ] **Step 1: Write the wrapper**

Create `src/lib/submit-lead.js`:

```js
import { supabase } from './supabase'

// Collects UTM and referrer from the browser and POSTs a lead submission
// to the submit-lead edge function. Throws on non-2xx; caller must catch.
export async function submitLead(formData) {
  const params = new URLSearchParams(window.location.search)
  const utm = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  }

  const body = {
    caseType: formData.caseType,
    accidentType: formData.accidentType,
    injuries: formData.injuries ?? [],
    fault: formData.fault || undefined,
    faultAtFault: formData.faultAtFault || undefined,
    evInvolved: formData.evInvolved || undefined,
    commercialVehicle: formData.commercialVehicle || undefined,
    rideshareInvolved: formData.rideshareInvolved || undefined,
    when: formData.when || undefined,
    reportedTo: formData.reportedTo,
    cameras: formData.cameras || undefined,
    witnesses: formData.witnesses || undefined,
    surface: formData.surface || undefined,
    lighting: formData.lighting || undefined,
    hasOwnInsurance: formData.hasOwnInsurance || undefined,
    myInsurer: formData.myInsurer || undefined,
    otherInsurer: formData.otherInsurer || undefined,
    adjusterContacted: formData.adjusterContacted || undefined,
    hasLawyer: formData.hasLawyer || undefined,
    onTheJob: formData.onTheJob || undefined,
    caseDescription: formData.caseDescription || undefined,
    zipCode: formData.zipCode || undefined,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    utm,
    referrer: document.referrer || undefined,
    website: formData.website ?? '', // honeypot
  }

  const { data, error } = await supabase.functions.invoke('submit-lead', {
    body,
  })

  if (error) {
    const err = new Error(error.message || 'submission failed')
    err.status = error.context?.status
    throw err
  }
  return data // { leadId, estimate: { withLow, withHigh, withoutLow, withoutHigh } }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/submit-lead.js
git commit -m "feat(client): submit-lead fetch wrapper with UTM capture"
```

---

### Task 13: Wire CalculatorForm to the backend

**Files:**
- Modify: `src/components/CalculatorForm.jsx`

This task has three parts: (a) add a honeypot field to the form state, (b) call `submitLead` when the user completes the final step, (c) render the results screen from the server response.

- [ ] **Step 1: Add imports and state fields**

Open `src/components/CalculatorForm.jsx`. Near the top, add next to the other imports:

```jsx
import { submitLead } from '../lib/submit-lead'
```

Find the `useState` call for `data` (around line 553) and add two fields to the initial object:

```jsx
// Add these fields to the initial data object
website: '',        // honeypot
```

Find the other `useState` calls near line 548. Add:

```jsx
const [serverEstimate, setServerEstimate] = useState(null)
const [submitError, setSubmitError] = useState(null)
```

- [ ] **Step 2: Add the honeypot input**

Inside the JSX of the form (anywhere inside the main `<form>` / root `<div>` that wraps the steps, e.g. just before the `<AnimatePresence>`), add:

```jsx
{/* Honeypot — hidden from humans, bots fill it */}
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  value={data.website}
  onChange={(e) => set('website', e.target.value)}
  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
  aria-hidden="true"
/>
```

- [ ] **Step 3: Add the submit handler**

Find the existing `showResult` function (around line 653). Replace it with:

```jsx
const showResult = async () => {
  if (loading) return
  setSubmitError(null)
  setLoading(true)
  try {
    const result = await submitLead(data)
    setServerEstimate(result.estimate)
    setDone(true)
  } catch (err) {
    console.error('submit-lead failed', err)
    if (err.status === 429) {
      setSubmitError("Too many attempts. Please try again later or call us.")
    } else {
      setSubmitError("Something went wrong. Please try again or call us.")
    }
  } finally {
    setLoading(false)
  }
}
```

- [ ] **Step 4: Render inline error above the final step's CTA**

Find the `contact` step's render block (the final step, around line 881 where `"Last step. Your estimate is ready."` appears). Just above its `NavButtons` call, add:

```jsx
{submitError && (
  <div className="mb-3 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
    {submitError}
  </div>
)}
```

- [ ] **Step 5: Pass the server estimate to `ResultScreen`**

Find where `ResultScreen` is rendered in the `done ? ... : ...` branch (look for `<ResultScreen data={data}`). Change to:

```jsx
<ResultScreen data={data} serverEstimate={serverEstimate} />
```

Then in the `ResultScreen` function signature (around line 379), update:

```jsx
function ResultScreen({ data, serverEstimate }) {
```

And replace the line that calls `calcSettlement` (around line 383):

```jsx
const res = serverEstimate ?? calcSettlement(data)
const faultBarred = serverEstimate ? false : (res.faultBarred ?? false)
```

Then scan the rest of `ResultScreen` for uses of `res.faultBarred` and replace them with the local `faultBarred` variable (since `serverEstimate` from the API doesn't include that flag — the server returns zeros when barred, and the client can detect that).

Actually, for a simpler and correct treatment: the server-returned estimate will be all zeros if barred. Add:

```jsx
const isBarred = serverEstimate
  ? (serverEstimate.withLow === 0 && serverEstimate.withHigh === 0)
  : (res.faultBarred ?? false)
```

Then use `isBarred` wherever `res.faultBarred` was used in the rest of the component.

- [ ] **Step 6: Run the dev server and manually smoke-test**

```bash
npm run dev
```

Open `http://localhost:5173/calculator`. Fill out every step with realistic data. On the final step, click the CTA. Expected:
- Loading state shows briefly.
- Results screen appears with server-computed values.
- Open the Supabase dashboard → Table Editor → `leads` and verify the new row has your data with `estimated_value_low` (without-attorney midpoint) and `estimated_value_high` (with-attorney midpoint).
- Open `lead_activity` and verify a `created` row exists for the new lead.

If anything fails, check:
- Browser DevTools → Network tab for the failed request
- Supabase Dashboard → Edge Functions → submit-lead → Logs for server-side errors

- [ ] **Step 7: Commit**

```bash
git add src/components/CalculatorForm.jsx
git commit -m "feat(form): wire calculator to submit-lead edge function"
```

---

## Phase E — Verification

### Task 14: Automated smoke tests against the deployed function

- [ ] **Step 1: Rate-limit test**

From a terminal, send 6 identical submissions in quick succession. Replace `$ANON_KEY` with the actual value from `.env.local`:

```bash
ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env.local | cut -d= -f2)
URL="https://uawtkzzyeydfgnpiaqfb.supabase.co/functions/v1/submit-lead"
BODY='{"caseType":"Motor Vehicle Accident","injuries":["Body aches & pain"],"fault":"Not my fault","when":"1–6 months ago","firstName":"Test","lastName":"User","email":"test@example.com","phone":"7025551234","utm":{},"website":""}'

for i in $(seq 1 6); do
  echo "request $i:"
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST "$URL" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "$BODY"
done
```

Expected: five `200`s followed by a `429`.

Clean up the test leads afterward via SQL in the Supabase dashboard:
```sql
delete from public.leads where contact_email = 'test@example.com';
delete from public.rate_limits where created_at > now() - interval '1 hour';
```

- [ ] **Step 2: Honeypot test**

```bash
curl -s -w "\n%{http_code}\n" \
  -X POST "$URL" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caseType":"Motor Vehicle Accident","injuries":["Body aches & pain"],"fault":"Not my fault","when":"1–6 months ago","firstName":"Bot","lastName":"User","email":"bot@example.com","phone":"7025551234","utm":{},"website":"spam.example.com"}'
```

Expected: `{"error":"invalid submission"}` with status `400`. Verify no new row appears in `leads` for `bot@example.com`.

- [ ] **Step 3: Missing-field test**

```bash
curl -s -w "\n%{http_code}\n" \
  -X POST "$URL" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caseType":"Motor Vehicle Accident","injuries":["Body aches & pain"],"utm":{},"website":""}'
```

Expected: `400` `{"error":"invalid submission"}`.

- [ ] **Step 4: Non-NV zip test**

```bash
curl -s -w "\n%{http_code}\n" \
  -X POST "$URL" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caseType":"Motor Vehicle Accident","injuries":["Broken or fractured bones"],"fault":"Not my fault","when":"1–6 months ago","zipCode":"10001","firstName":"Out","lastName":"Of State","email":"oos@example.com","phone":"2125551234","utm":{},"website":""}'
```

Expected: `200` with `{"leadId": "...", "estimate": {...}}`. Then verify in SQL:

```sql
select zip_code, notes from public.leads where contact_email = 'oos@example.com';
```

Expected: `zip_code = '10001'`, `notes = 'non-NV zip'`. Clean up after.

- [ ] **Step 5: RLS sanity check**

Confirm the anon role cannot read `leads` directly (the edge function should be the only path):

```bash
curl -s -w "\n%{http_code}\n" \
  "https://uawtkzzyeydfgnpiaqfb.supabase.co/rest/v1/leads?select=id" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

Expected: an empty array `[]` (RLS filters everything away) OR an auth error. **Not** a list of rows.

- [ ] **Step 6: Commit a note recording the verification pass**

There's nothing to commit from this task — it's pure verification. Move on.

---

### Task 15: Wrap up

- [ ] **Step 1: Update README with backend setup notes**

Open `README.md`. Add a new section near the top:

```markdown
## Backend

The calculator form submits to a Supabase edge function. To run locally:

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key from the [project API settings](https://app.supabase.com/project/uawtkzzyeydfgnpiaqfb/settings/api).
2. `npm run dev`

### Deploying backend changes

Migrations live in `supabase/migrations/` and edge functions in `supabase/functions/`. To deploy:

```bash
supabase db push                           # apply new migrations
supabase functions deploy submit-lead      # redeploy the edge function
```

### Vercel environment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment variables for both Preview and Production environments.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add backend setup and deployment notes"
```

- [ ] **Step 3: Push to remote**

```bash
git push origin main
```

(If you want a PR flow instead of pushing directly to main, create a branch before Task 1 and open a PR here instead.)

---

## Done

At this point:
- Every submitted calculator form becomes an authoritative `leads` row with a server-computed valuation satisfying the `withAvg ≥ 4.5 × withoutAvg` floor.
- The DB schema is reproducible from migrations.
- RLS blocks all anon access to `leads`, `lead_activity`, `attorney_partners`, `lead_assignments`.
- IP rate limiting + honeypot block the easy bot traffic.
- The React client and the edge function share exactly one source of truth for the valuation logic.

Out of scope for this plan (separate specs / plans to come): admin dashboard, attorney routing, email notifications, payout tracking, analytics.
