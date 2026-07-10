-- ============================================================
-- PAYMENTS SETUP - Bảng đơn thanh toán & nâng cấp gói
-- Chạy trong Supabase SQL Editor (một lần).
-- ============================================================

-- 1) Thêm cột cho profiles nếu chưa có
alter table public.profiles
  add column if not exists membership_tier text default 'FREE',
  add column if not exists membership_expires_at timestamptz;

-- 2) Bảng payments: mỗi đơn nâng cấp gói
create table if not exists public.payments (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  plan_code text not null,
  amount integer not null,
  transfer_content text not null,
  status text not null default 'pending',   -- pending | paid | failed
  sepay_ref text,                            -- mã giao dịch từ SePay
  created_at timestamptz default now(),
  paid_at timestamptz
);

create index if not exists payments_user_idx on public.payments(user_id);
create index if not exists payments_content_idx on public.payments(transfer_content);

-- 3) Bật RLS
alter table public.payments enable row level security;

-- Người dùng chỉ xem đơn của chính mình
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
  on public.payments for select
  to authenticated
  using ( user_id = auth.uid() );

-- Người dùng tạo đơn cho chính mình
drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
  on public.payments for insert
  to authenticated
  with check ( user_id = auth.uid() );

-- LƯU Ý: webhook dùng service_role key nên bỏ qua RLS,
-- không cần policy update cho client.

-- ============================================================
-- 4) Hàm nâng cấp gói (được webhook gọi qua service role)
-- ============================================================
create or replace function public.apply_membership(
  p_user_id uuid,
  p_plan_code text,
  p_days integer
) returns void
language plpgsql security definer as $$
begin
  update public.profiles
  set membership_tier = p_plan_code,
      membership_expires_at = greatest(
        coalesce(membership_expires_at, now()), now()
      ) + (p_days || ' days')::interval
  where id = p_user_id;
end;
$$;
