-- ============================================================
-- Solimouv' — Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- Enum role
create type user_role as enum ('user', 'admin');

-- -------------------------------------------------------
-- USERS
-- -------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text not null default '',
  role        user_role not null default 'user',
  is_in_newsletter boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Auto-insert user on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------
-- EVENTS
-- -------------------------------------------------------
create table if not exists public.events (
  id         uuid primary key default uuid_generate_v4(),
  year       integer not null unique,
  date       date not null,
  location   text not null,
  is_active  boolean not null default false,
  created_at timestamptz not null default now()
);

-- Only one active event at a time
create unique index if not exists events_single_active
  on public.events (is_active)
  where is_active = true;

-- -------------------------------------------------------
-- REGISTRATIONS
-- -------------------------------------------------------
create table if not exists public.registrations (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  event_id     uuid not null references public.events(id) on delete cascade,
  guests_count integer not null default 0 check (guests_count >= 0),
  created_at   timestamptz not null default now(),
  unique (user_id, event_id)
);

-- -------------------------------------------------------
-- EXHIBITORS
-- -------------------------------------------------------
create table if not exists public.exhibitors (
  id               uuid primary key default uuid_generate_v4(),
  event_id         uuid not null references public.events(id) on delete cascade,
  name             text not null,
  description      text not null default '',
  category         text not null default 'Sport',
  picture_url      text default '',
  association_name text default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger exhibitors_updated_at
  before update on public.exhibitors
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------
-- FAVORITES
-- -------------------------------------------------------
create table if not exists public.favorites (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  exhibitor_id uuid not null references public.exhibitors(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (user_id, exhibitor_id)
);

-- -------------------------------------------------------
-- STAMP CARDS
-- -------------------------------------------------------
create table if not exists public.stamp_cards (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- -------------------------------------------------------
-- STAMP ENTRIES
-- -------------------------------------------------------
create table if not exists public.stamp_entries (
  id           uuid primary key default uuid_generate_v4(),
  card_id      uuid not null references public.stamp_cards(id) on delete cascade,
  exhibitor_id uuid not null references public.exhibitors(id) on delete cascade,
  stamped_at   timestamptz not null default now(),
  unique (card_id, exhibitor_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.exhibitors enable row level security;
alter table public.favorites enable row level security;
alter table public.stamp_cards enable row level security;
alter table public.stamp_entries enable row level security;

-- Users: read own, update own, insert own, admin reads all
create policy "users: read own" on public.users for select using (auth.uid() = id);
create policy "users: update own" on public.users for update using (auth.uid() = id);
create policy "users: insert own" on public.users for insert with check (auth.uid() = id);
create policy "users: admin read all" on public.users for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Events: public read
create policy "events: public read" on public.events for select using (true);
create policy "events: admin write" on public.events for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Exhibitors: public read
create policy "exhibitors: public read" on public.exhibitors for select using (true);
create policy "exhibitors: admin write" on public.exhibitors for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Registrations
create policy "registrations: own" on public.registrations for all using (auth.uid() = user_id);
create policy "registrations: admin read" on public.registrations for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Favorites
create policy "favorites: own" on public.favorites for all using (auth.uid() = user_id);

-- Stamp cards
create policy "stamp_cards: own" on public.stamp_cards for all using (auth.uid() = user_id);

-- Stamp entries (via card ownership)
create policy "stamp_entries: own" on public.stamp_entries for all using (
  exists (select 1 from public.stamp_cards sc where sc.id = card_id and sc.user_id = auth.uid())
);
create policy "stamp_entries: admin write" on public.stamp_entries for insert using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ============================================================
-- SEED DATA (optionnel — décommenter pour test)
-- ============================================================

-- insert into public.events (year, date, location, is_active) values
--   (2026, '2026-06-21', 'Parc de la Villette, Paris', true);
