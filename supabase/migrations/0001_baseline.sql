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
