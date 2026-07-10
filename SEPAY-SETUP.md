# Hướng dẫn cài đặt Thanh toán SePay & Gói thành viên

Website đã có sẵn code cho hệ thống nâng cấp gói thành viên qua chuyển
khoản ngân hàng, tự động xác nhận bằng webhook SePay. Bạn cần làm 4 bước
sau (phần này chỉ bạn mới làm được vì liên quan key và tài khoản riêng).

## Bước 1 — Chạy SQL trong Supabase

Vào Supabase Dashboard > SQL Editor, chạy lần lượt nội dung của:

- `database/PAYMENTS-SETUP.sql` (tạo bảng payments, cột gói, hàm nâng cấp)
- `database/STORAGE-SETUP.sql` (nếu chưa chạy, cho tính năng tải ảnh)

## Bước 2 — Thêm biến môi trường trên Vercel

Vào Vercel > Project > Settings > Environment Variables, thêm:

| Biến | Lấy ở đâu |
|------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role |
| `SEPAY_WEBHOOK_API_KEY` | Bạn tự đặt (dùng ở bước 3) |
| `NEXT_PUBLIC_SEPAY_BANK` | Mã ngân hàng (VD: VCB, ACB, MB) |
| `NEXT_PUBLIC_SEPAY_ACCOUNT` | Số tài khoản nhận tiền |
| `NEXT_PUBLIC_SEPAY_ACCOUNT_NAME` | Tên chủ tài khoản |

Sau khi thêm, bấm Redeploy để áp dụng.

## Bước 3 — Cấu hình Webhook trên SePay

Vào https://my.sepay.vn > Webhooks > Thêm webhook:

- **URL nhận**: `https://<domain-của-bạn>/api/sepay/webhook`
  (VD: `https://nguonnhaphohcm.vn/api/sepay/webhook`)
- **Kiểu xác thực**: API Key (Authorization: Apikey ...)
- **API Key**: dán đúng giá trị bạn đặt cho `SEPAY_WEBHOOK_API_KEY`
- Liên kết tài khoản ngân hàng nhận tiền trong SePay.

## Bước 4 — Kiểm tra

1. Đăng nhập website > vào **Gói thành viên** > chọn 1 gói trả phí.
2. Trang thanh toán hiện mã QR + nội dung chuyển khoản (dạng `NNP <GÓI> <MÃ>`).
3. Chuyển khoản đúng số tiền + đúng nội dung.
4. SePay gọi webhook > hệ thống tự đánh dấu "đã thanh toán" và nâng cấp gói.
5. Trang thanh toán tự cập nhật và chuyển về Tài khoản.

## Ghi chú kỹ thuật

- Nội dung chuyển khoản dùng 8 ký tự đầu user id để định danh đơn.
- Webhook so khớp nội dung không phân biệt hoa/thường và bỏ khoảng trắng.
- Nếu số tiền nhỏ hơn giá gói, đơn KHÔNG được kích hoạt.
- Hàm `apply_membership` cộng dồn thời hạn nếu gia hạn khi còn hạn.
- Đơn không khớp vẫn trả 200 cho SePay và ghi log để đối soát thủ công.
