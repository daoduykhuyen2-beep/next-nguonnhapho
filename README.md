# Nguồn Nhà Phố HCM (Next.js)

Website đăng tin bất động sản, xây bằng Next.js 15 (App Router) + Supabase + TailwindCSS.

## Tính năng

- Trang chủ + danh sách tin (lọc, phân trang) + chi tiết tin (SEO Open Graph)
- Đăng ký / đăng nhập / đăng xuất bằng Supabase Auth
- Thành viên đăng tin, sửa tin, xoá tin của mình (tin hiện công khai ngay)
- Trang quản trị cho admin
- Sitemap + robots động cho SEO

## Bước 1 — Cấu hình Supabase

1. Mở Supabase Dashboard > SQL Editor.
2. Dán và chạy toàn bộ nội dung file `database/SUPABASE-SETUP.sql`.
3. Vào Authentication > Providers > Email (bật). Có thể tắt "Confirm email" để đăng nhập ngay.
4. Sau khi bạn tự đăng ký tài khoản, chạy trong SQL Editor:

```sql
update public.profiles set is_admin = true
where email = 'daoduykhuyen2@gmail.com';
```

## Bước 2 — Biến môi trường

Tạo file `.env.local` (xem mẫu ở `.env.example`) và điền 2 giá trị lấy từ
Supabase Dashboard > Project Settings > API:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Bước 3 — Chạy thử local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Bước 4 — Deploy lên Vercel

1. Vào vercel.com > Add New > Project > Import repo `next-nguonnhapho`.
2. Ở phần Environment Variables, thêm 2 biến `NEXT_PUBLIC_SUPABASE_URL` và
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (tự dán giá trị của bạn).
3. Bấm Deploy.
4. Khi ưng, trỏ tên miền nguonnhaphohcm.vn về project Vercel này.

## Ghi chú bảo mật

- Row Level Security đã được bật trong file SQL: mọi người đọc tin đã duyệt,
  chỉ chủ tin sửa/xoá tin của mình.
- Cột `is_admin` được trigger bảo vệ, người dùng không tự nâng quyền được.
