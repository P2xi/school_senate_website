-- Eskişehir MBA Senatosu - Initial Supabase Schema
-- Run in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.senators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('president', 'vice president', 'member')),
  photo_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  published boolean not null default true
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date timestamptz not null,
  location text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.senators enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.contact_messages enable row level security;

-- Public read for announcements (only published)
drop policy if exists "public can read published announcements" on public.announcements;
create policy "public can read published announcements"
on public.announcements
for select
to anon, authenticated
using (published = true);

-- Public read for events
drop policy if exists "public can read events" on public.events;
create policy "public can read events"
on public.events
for select
to anon, authenticated
using (true);

-- Anonymous users can submit contact messages
drop policy if exists "anon can insert contact messages" on public.contact_messages;
create policy "anon can insert contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);
