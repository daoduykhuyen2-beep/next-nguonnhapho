-- ============================================================
-- QUOTA SETUP - Kho tin (post credits) theo goi + logic uu tien
-- Chay trong Supabase SQL Editor (mot lan), sau PAYMENTS-SETUP.sql.
--
-- LUONG UU TIEN khi ap dung goi cho 1 tin:
--   1) Con luot trong kho tin dung loai  -> tru 1 luot kho tin (mien phi)
--   2) Het kho tin loai do               -> tru so du vi (profiles.so_du)
--   3) Het ca so du                      -> tra ve 'nofunds' de bao nap them
--
-- GHI CHU: neu ten cot so du vi that khac 'so_du', sua lai o ham
-- dung_quyen_loi_tin ben duoi truoc khi chay.
-- ============================================================

-- 1) Cot so du vi tren profiles (VND). Sua ten neu database ban dung ten khac.
alter table public.profiles
add column if not exists so_du bigint not null default 0;

-- 2) Bang kho tin: moi dong = 1 loai tin con luot cho 1 user.
--    loai: 'thuong' | 'vang' | 'kim_cuong'
--    so_luot: so luot con lai; so_ngay: so ngay hieu luc moi luot khi ap dung.
--    het_han: han su dung kho tin (theo thang). Qua han thi khong dung duoc.
create table if not exists public.post_credits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  loai text not null check (loai in ('thuong','vang','kim_cuong')),
  so_luot integer not null default 0 check (so_luot >= 0),
  so_ngay integer not null default 15,
  het_han timestamptz,
  created_at timestamptz default now(),
  unique (user_id, loai, so_ngay, het_han)
  );

create index if not exists post_credits_user_idx on public.post_credits(user_id);

-- 3) Cot luot day tin (push) tren profiles.
alter table public.profiles
add column if not exists push_credits integer not null default 0;

-- 4) Bat RLS cho post_credits: user chi xem kho tin cua chinh minh.
alter table public.post_credits enable row level security;

drop policy if exists post_credits_select_own on public.post_credits;
create policy post_credits_select_own on public.post_credits
for select to authenticated using (user_id = auth.uid());

-- Client khong tu them/sua kho tin; chi ham security definer (service role) ghi.

-- ============================================================
-- 5) Ham cong 1 loai kho tin cho user (gom theo user+loai+so_ngay+han).
-- ============================================================
drop function if exists public.them_kho_tin(uuid, text, integer, integer, timestamptz);
create or replace function public.them_kho_tin(
  p_user_id uuid,
  p_loai text,
  p_so_luot integer,
  p_so_ngay integer,
  p_het_han timestamptz
  ) returns void
language plpgsql security definer as $$
begin
if p_so_luot is null or p_so_luot <= 0 then
return;
end if;
insert into public.post_credits (user_id, loai, so_luot, so_ngay, het_han)
values (p_user_id, p_loai, p_so_luot, p_so_ngay, p_het_han)
on conflict (user_id, loai, so_ngay, het_han)
do update set so_luot = public.post_credits.so_luot + excluded.so_luot;
end;
$$;

-- ============================================================
-- 6) apply_membership: khi don duoc xac nhan (webhook / admin duyet),
--    cong luot vao kho tin theo goi. Kho tin het han sau p_days ngay.
--    Thay the ban cu (chi set tier) o PAYMENTS-SETUP.sql.
-- ============================================================
drop function if exists public.apply_membership(uuid, text, integer);
create or replace function public.apply_membership(
  p_user_id uuid,
  p_plan_code text,
  p_days integer
  ) returns void
language plpgsql security definer as $$
declare
v_han timestamptz := now() + (coalesce(p_days, 30) || ' days')::interval;
begin
-- Cap nhat hang thanh vien + gia han (giu tuong thich ban cu).
update public.profiles
set membership_tier = p_plan_code,
membership_expires_at = greatest(coalesce(membership_expires_at, now()), now()) + (coalesce(p_days, 30) || ' days')::interval
where id = p_user_id;

-- Cong kho tin theo tung goi. Tat ca tin deu 15 ngay/tin.
if p_plan_code = 'COMBO_COBAN' then
perform public.them_kho_tin(p_user_id, 'thuong', 15, 15, v_han);
update public.profiles set push_credits = push_credits + 5 where id = p_user_id;

elsif p_plan_code = 'COMBO_CHUYENNGHIEP' then
perform public.them_kho_tin(p_user_id, 'thuong', 30, 15, v_han);
perform public.them_kho_tin(p_user_id, 'vang', 5, 15, v_han);
update public.profiles set push_credits = push_credits + 15 where id = p_user_id;

elsif p_plan_code = 'COMBO_VIP' then
perform public.them_kho_tin(p_user_id, 'thuong', 50, 15, v_han);
perform public.them_kho_tin(p_user_id, 'vang', 10, 15, v_han);
perform public.them_kho_tin(p_user_id, 'kim_cuong', 5, 15, v_han);
update public.profiles set push_credits = push_credits + 30 where id = p_user_id;

-- Mua le 1 tin: cong 1 luot dung loai.
elsif p_plan_code = 'TIN_THUONG_15' then
perform public.them_kho_tin(p_user_id, 'thuong', 1, 15, v_han);
elsif p_plan_code = 'VIP_VANG_7' then
perform public.them_kho_tin(p_user_id, 'vang', 1, 15, v_han);
elsif p_plan_code = 'VIP_KC_7' then
perform public.them_kho_tin(p_user_id, 'kim_cuong', 1, 15, v_han);

-- Day tin le.
elsif p_plan_code = 'DAY_1' then
update public.profiles set push_credits = push_credits + 1 where id = p_user_id;
elsif p_plan_code = 'DAY_3' then
update public.profiles set push_credits = push_credits + 3 where id = p_user_id;
elsif p_plan_code = 'DAY_6' then
update public.profiles set push_credits = push_credits + 6 where id = p_user_id;
end if;
end;
$$;

-- ============================================================
-- 7) dung_quyen_loi_tin: ap dung goi cho 1 tin voi thu tu uu tien:
--    (1) kho tin dung loai -> tru 1 luot (mien phi)
--    (2) het kho tin       -> tru so du vi
--    (3) het ca so du      -> tra 'nofunds'
--    Tra ve text: 'ok' | 'nofunds' | 'loi'.
-- ============================================================
drop function if exists public.dung_quyen_loi_tin(bigint, integer, text, boolean);
create or replace function public.dung_quyen_loi_tin(
  p_post_id bigint,
  p_gia integer,
  p_new_status text,
  p_is_boost boolean
  ) returns text
language plpgsql security definer as $$
declare
v_uid uuid := auth.uid();
v_owner uuid;
v_loai text;
v_credit_id bigint;
v_ngay integer;
v_so_du bigint;
begin
if v_uid is null then
return 'loi';
end if;

-- Chi chu tin moi duoc ap dung.
select owner into v_owner from public.web_posts where id = p_post_id;
if v_owner is null or v_owner <> v_uid then
return 'loi';
end if;

-- Loai kho tin can tru: day tin -> 'day'; nang hang -> theo status.
if p_is_boost then
v_loai := 'day';
else
v_loai := p_new_status; -- 'thuong' | 'vang' | 'kim_cuong'
end if;

-- (1) Uu tien kho tin (khong tinh loai 'day' o day).
if not p_is_boost then
select id, so_ngay into v_credit_id, v_ngay
from public.post_credits
where user_id = v_uid
and loai = v_loai
and so_luot > 0
and (het_han is null or het_han > now())
order by het_han asc nulls last
limit 1
for update;

if v_credit_id is not null then
update public.post_credits set so_luot = so_luot - 1 where id = v_credit_id;
update public.web_posts
set status = p_new_status,
het_han_vip = now() + (v_ngay || ' days')::interval
where id = p_post_id;
return 'ok';
end if;
end if;

-- Day tin: neu con push_credits thi tru 1 luot, ap dung ngay.
if p_is_boost then
select push_credits into v_so_du from public.profiles where id = v_uid for update;
if coalesce(v_so_du, 0) > 0 then
update public.profiles set push_credits = push_credits - 1 where id = v_uid;
update public.web_posts set created_at = now() where id = p_post_id;
return 'ok';
end if;
end if;

-- (2) Het kho tin -> tru so du vi.
select so_du into v_so_du from public.profiles where id = v_uid for update;
if coalesce(v_so_du, 0) >= coalesce(p_gia, 0) then
update public.profiles set so_du = so_du - coalesce(p_gia, 0) where id = v_uid;
if p_is_boost then
update public.web_posts set created_at = now() where id = p_post_id;
else
update public.web_posts
set status = p_new_status,
het_han_vip = now() + '15 days'::interval
where id = p_post_id;
end if;
return 'ok';
end if;

-- (3) Het ca so du.
return 'nofunds';
end;
$$;

-- ============================================================
-- 8) Cot han VIP tren web_posts + ham ha cap tin het han ve 'thuong'.
--    (perks dat het_han_vip; trang chu goi expire_vip_posts truoc khi hien thi)
-- ============================================================
alter table public.web_posts
add column if not exists het_han_vip timestamptz;

drop function if exists public.expire_vip_posts();
create or replace function public.expire_vip_posts()
returns void
language plpgsql security definer as $$
begin
update public.web_posts
set status = 'thuong', het_han_vip = null
where status in ('vang', 'kim_cuong')
and het_han_vip is not null
and het_han_vip <= now();
end;
$$;

-- HET

-- ============================================================
-- 9) apply_topup: cong so du vi khi don NAPTIEN duoc thanh toan.
--    Goi tu webhook SePay / admin duyet (service role).
-- ============================================================
drop function if exists public.apply_topup(bigint);
create or replace function public.apply_topup(p_payment_id bigint)
returns void
language plpgsql security definer as $$
declare
  v_user uuid;
  v_amount bigint;
begin
  select user_id, amount into v_user, v_amount
  from public.payments where id = p_payment_id;

  if v_user is null then
    return;
  end if;

  update public.profiles
  set so_du = coalesce(so_du, 0) + coalesce(v_amount, 0)
  where id = v_user;
end;
$$;

-- ============================================================
-- 10) apply_post_plan: ap dung goi da mua (VIP Vang/Kim Cuong/
--     day tin) truc tiep cho 1 tin cu the sau khi don thanh toan.
--     Don da tra tien nen ap dung ngay, khong tru kho tin/vi.
--     Tat ca tin VIP deu hieu luc 15 ngay.
-- ============================================================
alter table public.payments
add column if not exists post_id bigint;

drop function if exists public.apply_post_plan(bigint);
create or replace function public.apply_post_plan(p_payment_id bigint)
returns void
language plpgsql security definer as $$
declare
  v_user uuid;
  v_plan text;
  v_post bigint;
  v_owner uuid;
begin
  select user_id, plan_code, post_id into v_user, v_plan, v_post
  from public.payments where id = p_payment_id;

  if v_user is null or v_post is null then
    return;
  end if;

  -- Chi ap dung cho tin cua chinh chu don.
  select owner into v_owner from public.web_posts where id = v_post;
  if v_owner is null or v_owner <> v_user then
    return;
  end if;

  if v_plan = 'VIP_KC_7' then
    update public.web_posts
    set status = 'kim_cuong', het_han_vip = now() + '15 days'::interval
    where id = v_post;
  elsif v_plan = 'VIP_VANG_7' then
    update public.web_posts
    set status = 'vang', het_han_vip = now() + '15 days'::interval
    where id = v_post;
  elsif v_plan = 'TIN_THUONG_15' then
    update public.web_posts
    set status = 'thuong', het_han_vip = now() + '15 days'::interval
    where id = v_post;
  elsif v_plan in ('DAY_1','DAY_3','DAY_6') then
    -- Day tin: dua tin len dau danh sach.
    update public.web_posts
    set created_at = now()
    where id = v_post;
  end if;
end;
$$;
-- HET (bo sung apply_topup & apply_post_plan)
