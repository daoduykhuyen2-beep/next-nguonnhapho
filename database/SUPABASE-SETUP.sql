-- ============================================================
-- SUPABASE SETUP cho next-nguonnhapho
-- Chay toan bo file nay trong Supabase Dashboard > SQL Editor
-- ============================================================

-- 1) BANG PROFILES ------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  avatar_url text,
  cover_url text,
  membership_tier text default 'free',
  membership_expires_at timestamptz,
  is_admin boolean default false,
  age int,
  gender text,
  address text,
  bio text,
  created_at timestamptz default now()
);

-- 2) BANG WEB_POSTS -----------------------------------------
create table if not exists public.web_posts (
  id bigint generated always as identity primary key,
  client_id text unique,
  owner uuid references auth.users(id) on delete cascade,
  owner_client text,
  title text,
  loai text,
  quan text,
  phuong text,
  duong text,
  gia text,
  dien_tich text,
  contact_name text,
  contact_phone text,
  mota text,
  status text default 'thuong',
  trang_thai text default 'duyet',
  created_local text,
  video text,
  anh jsonb,
  created_at timestamptz default now()
);

create index if not exists web_posts_trangthai_idx on public.web_posts (trang_thai);
create index if not exists web_posts_owner_idx on public.web_posts (owner);
create index if not exists web_posts_created_idx on public.web_posts (created_at desc);

-- 3) TRIGGER: tu tao profile khi co user moi ----------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) TRIGGER: ep owner = auth.uid() khi insert tin ----------
create or replace function public.set_post_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.owner := auth.uid();
  return new;
end;
$$;

drop trigger if exists set_owner_before_insert on public.web_posts;
create trigger set_owner_before_insert
  before insert on public.web_posts
  for each row execute function public.set_post_owner();

-- 5) BAO VE cot is_admin (user khong tu nang quyen) ---------
create or replace function public.protect_admin_flag()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() = new.id then
    new.is_admin := old.is_admin;
    new.membership_tier := old.membership_tier;
    new.membership_expires_at := old.membership_expires_at;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_admin_before_update on public.profiles;
create trigger protect_admin_before_update
  before update on public.profiles
  for each row execute function public.protect_admin_flag();

-- 6) ROW LEVEL SECURITY -------------------------------------
alter table public.profiles enable row level security;
alter table public.web_posts enable row level security;

-- PROFILES policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- WEB_POSTS policies
drop policy if exists posts_select_public on public.web_posts;
create policy posts_select_public on public.web_posts
  for select using (trang_thai = 'duyet' or auth.uid() = owner);

drop policy if exists posts_insert_auth on public.web_posts;
create policy posts_insert_auth on public.web_posts
  for insert with check (auth.uid() is not null);

drop policy if exists posts_update_own on public.web_posts;
create policy posts_update_own on public.web_posts
  for update using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists posts_delete_own on public.web_posts;
create policy posts_delete_own on public.web_posts
  for delete using (auth.uid() = owner);

-- 7) DAT ADMIN: chay sau khi ban da dang ky tai khoan -------
-- update public.profiles set is_admin = true
-- where email = 'daoduykhuyen2@gmail.com';

-- HET
