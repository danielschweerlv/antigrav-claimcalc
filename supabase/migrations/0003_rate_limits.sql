create table if not exists public.rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_ip_hash_created_at_idx
  on public.rate_limits (ip_hash, created_at desc);

alter table public.rate_limits enable row level security;

-- No policies: only the service role writes/reads this table.
