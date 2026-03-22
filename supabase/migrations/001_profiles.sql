-- =============================================================================
-- Migration: profiles tábla + Auth integráció
-- Közvetlenül futtatható a Supabase SQL Editorban.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. PROFILES TÁBLA
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  username    text        unique not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Felhasználói profiladatok – minden auth.users sorhoz egy profiles sor tartozik.';


-- -----------------------------------------------------------------------------
-- 2. UPDATED_AT AUTOMATIKUS FRISSÍTÉSE
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 3. ÚJ FELHASZNÁLÓ → PROFILES SOR AUTOMATIKUS LÉTREHOZÁSA
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;

create policy "Profilok publikusan olvashatók"
  on public.profiles
  for select
  using (true);

create policy "Felhasználó módosíthatja saját profilját"
  on public.profiles
  for update
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT-et a trigger végzi (security definer), közvetlen INSERT tiltott
create policy "Közvetlen INSERT tiltott – trigger hozza létre"
  on public.profiles
  for insert
  with check (false);
