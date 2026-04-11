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
