-- ============================================================
-- ROLES-SETUP.sql — Hệ thống phân quyền (RBAC) cho Nguồn Nhà Phố HCM
-- Chạy file này trong Supabase Dashboard > SQL Editor sau SUPABASE-SETUP.sql
-- An toàn để chạy lại nhiều lần (idempotent).
-- ============================================================

-- 1) Thêm cột "role" vào profiles
--    Giá trị hợp lệ: 'admin' | 'pho_cong_dong' | 'member'
--    Giữ nguyên cột is_admin cũ để tương thích ngược.
alter table public.profiles
  add column if not exists role text not null default 'member';

-- Ràng buộc giá trị role
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'pho_cong_dong', 'member'));
  end if;
end $$;

-- Đồng bộ dữ liệu cũ: ai đang is_admin = true thì role = 'admin'
update public.profiles set role = 'admin' where is_admin = true and role <> 'admin';

-- 2) Hàm helper kiểm tra quyền (chạy với quyền của định nghĩa để đọc profiles an toàn)
create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'member'
  );
$$;

-- Là admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'admin'
      or coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Là nhân sự có quyền quản trị nội dung (admin HOẶC phó cộng đồng)?
-- Phó cộng đồng được: sửa bài viết, duyệt tin, đăng thông báo, quản lý tin tức.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() in ('admin', 'pho_cong_dong')
      or coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- 3) Trigger bảo vệ: người dùng thường KHÔNG tự nâng quyền cho mình.
--    Chỉ admin mới được đổi cột role/is_admin của bất kỳ ai.
create or replace function public.protect_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role)
     or (new.is_admin is distinct from old.is_admin) then
    if not public.is_admin() then
      raise exception 'Chi admin moi duoc thay doi phan quyen (role/is_admin).';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role_before_update on public.profiles;
create trigger protect_role_before_update
  before update on public.profiles
  for each row execute function public.protect_role_change();

-- 4) Bảng notifications (thông báo gửi tới người dùng) — tạo nếu chưa có
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  noi_dung text not null,
  loai text not null default 'tin',        -- tin | taichinh | khuyenmai | them
  target_user uuid references auth.users(id) on delete cascade, -- null = gửi toàn hệ thống
  da_doc boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Người dùng đọc thông báo chung (target_user null) hoặc của chính mình
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select using (target_user is null or target_user = auth.uid());

-- Chỉ nhân sự (admin/phó cộng đồng) mới được tạo thông báo
drop policy if exists notifications_insert_staff on public.notifications;
create policy notifications_insert_staff on public.notifications
  for insert with check (public.is_staff());

-- Nhân sự cập nhật/xoá thông báo; người dùng chỉ được đánh dấu đã đọc thông báo của mình
drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
  for update using (public.is_staff() or target_user = auth.uid());

drop policy if exists notifications_delete_staff on public.notifications;
create policy notifications_delete_staff on public.notifications
  for delete using (public.is_staff());

-- 5) Bảng news (tin tức) — tạo nếu chưa có
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  mo_ta text,
  noi_dung text,
  anh_bia text,
  loai text default 'tin_tuc',
  created_at timestamptz not null default now()
);

alter table public.news enable row level security;

drop policy if exists news_select_all on public.news;
create policy news_select_all on public.news
  for select using (true);

drop policy if exists news_write_staff on public.news;
create policy news_write_staff on public.news
  for all using (public.is_staff()) with check (public.is_staff());

-- 6) Cho phép nhân sự thao tác trên web_posts (duyệt tin, sửa bài của mọi người)
--    Bổ sung quyền cho staff bên cạnh quyền chủ sở hữu đã có.
drop policy if exists posts_update_staff on public.web_posts;
create policy posts_update_staff on public.web_posts
  for update using (public.is_staff() or auth.uid() = owner)
  with check (public.is_staff() or auth.uid() = owner);

drop policy if exists posts_select_staff on public.web_posts;
create policy posts_select_staff on public.web_posts
  for select using (
    trang_thai = 'duyet' or auth.uid() = owner or public.is_staff()
  );

-- Xoá bài: chủ sở hữu hoặc admin (không cho phó cộng đồng xoá vĩnh viễn)
drop policy if exists posts_delete_admin on public.web_posts;
create policy posts_delete_admin on public.web_posts
  for delete using (auth.uid() = owner or public.is_admin());

-- ============================================================
-- HƯỚNG DẪN GÁN QUYỀN THỦ CÔNG (nếu cần, ngoài trang /admin/phan-quyen):
--   -- Cấp admin:
--   update public.profiles set role = 'admin'
--   where email = 'daoduykhuyen2@gmail.com';
--
--   -- Cấp phó cộng đồng:
--   update public.profiles set role = 'pho_cong_dong'
--   where email = 'nhan-su@example.com';
-- ============================================================
