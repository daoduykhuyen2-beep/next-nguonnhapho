-- ============================================================
-- STORAGE SETUP cho tính năng tải ảnh tin đăng
-- Chạy trong Supabase SQL Editor (một lần).
-- ============================================================

-- 1) Tạo bucket công khai tên "post-images"
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- 2) Cho phép mọi người XEM ảnh (bucket công khai)
drop policy if exists "post_images_public_read" on storage.objects;
create policy "post_images_public_read"
  on storage.objects for select
  using ( bucket_id = 'post-images' );

-- 3) Cho phép người dùng đã đăng nhập TẢI LÊN ảnh
drop policy if exists "post_images_auth_insert" on storage.objects;
create policy "post_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'post-images' );

-- 4) Cho phép chủ sở hữu XOÁ / CẬP NHẬT ảnh của mình
drop policy if exists "post_images_owner_update" on storage.objects;
create policy "post_images_owner_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'post-images' and owner = auth.uid() );

drop policy if exists "post_images_owner_delete" on storage.objects;
create policy "post_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'post-images' and owner = auth.uid() );
