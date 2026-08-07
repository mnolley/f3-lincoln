-- F3 Lincoln backblast archive
-- Run once in Supabase SQL Editor (Dashboard → SQL → New query → Run)

create table if not exists f3_backblasts (
  id text primary key,
  ts text not null,
  title text not null,
  date timestamptz not null,
  ao text not null default '',
  qic text not null default '',
  pax_roster text[] not null default '{}',
  pax_count integer not null default 0,
  fng_count integer not null default 0,
  fngs text not null default '',
  warm_a_rama text not null default '',
  the_thang text not null default '',
  cot text not null default '',
  body text not null default '',
  raw_text text not null default '',
  username text,
  source text not null default 'slack',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists f3_backblasts_date_idx
  on f3_backblasts (date desc);

alter table f3_backblasts enable row level security;

-- Public read (site already shows backblasts)
drop policy if exists "f3_backblasts_select" on f3_backblasts;
create policy "f3_backblasts_select"
  on f3_backblasts for select
  to anon, authenticated
  using (true);

-- Allow upserts from the Next.js server (anon key)
drop policy if exists "f3_backblasts_insert" on f3_backblasts;
create policy "f3_backblasts_insert"
  on f3_backblasts for insert
  to anon, authenticated
  with check (true);

drop policy if exists "f3_backblasts_update" on f3_backblasts;
create policy "f3_backblasts_update"
  on f3_backblasts for update
  to anon, authenticated
  using (true)
  with check (true);
