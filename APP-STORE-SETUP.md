# Đưa Nguồn Nhà Phố HCM lên CH Play & App Store

Tài liệu này gồm 2 phần:
1. **Nội dung listing** (dán vào Google Play Console / App Store Connect).
2. **Hướng dẫn build & nộp app** từng bước cho Android (TWA) và iOS (Capacitor).

Website đã là PWA chuẩn (có manifest.json, service worker sw.js, icon 192/512 kèm bản maskable) nên nền tảng đóng gói app đã sẵn sàng.

---

## PHẦN 1 — NỘI DUNG LISTING (COPY–PASTE)

### Thông tin chung
- **Tên app (App name):** Nguồn Nhà Phố HCM
- **Tên ngắn (Short name, tối đa 12 ký tự):** Nhà Phố HCM
- **Website:** https://nguonnhaphohcm.vn
- **Package name (Android, application ID):** vn.nguonnhaphohcm.app
- **Bundle ID (iOS):** vn.nguonnhaphohcm.app
- **Danh mục (Category):** Bất động sản / Nhà cửa (Business · Lifestyle · Shopping)
- **Đối tượng:** Người mua, bán, thuê nhà phố – căn hộ – shophouse tại TP.HCM
- **Ngôn ngữ chính:** Tiếng Việt (vi-VN)
- **Màu chủ đạo (theme):** #c8102e (đỏ)

### Mô tả ngắn (Short description – tối đa 80 ký tự, cho CH Play)
Mua bán, cho thuê nhà phố, căn hộ, shophouse trung tâm TP.HCM – pháp lý rõ ràng.

### Mô tả dài (Full description)
Nguồn Nhà Phố HCM là kênh đăng tin mua bán và cho thuê bất động sản tập trung khu vực trung tâm Thành phố Hồ Chí Minh: nhà phố, shophouse, căn hộ, dự án, đất nền.

Tính năng nổi bật:
- Tìm kiếm nhanh theo khu vực, tên đường, khoảng giá, diện tích.
- Xem tin đăng có hình ảnh thật, thông tin pháp lý rõ ràng, cập nhật mỗi ngày.
- Đăng tin ký gửi, quản lý tin của bạn, lưu tin yêu thích.
- Nhận thông báo tin mới, khuyến mãi gói đăng tin.
- Bảng giá đăng tin minh bạch, nhiều gói phù hợp môi giới và cá nhân.

Cam kết: tin đăng là bất động sản có thật, kiểm tra pháp lý trước khi hiển thị, minh bạch – uy tín.

Tải app để tra cứu nhà phố trung tâm Sài Gòn nhanh chóng, mọi lúc mọi nơi.

### Từ khóa (Keywords – iOS, cách nhau bằng dấu phẩy, tối đa 100 ký tự)
nhà phố,bất động sản,mua bán nhà,cho thuê nhà,căn hộ,shophouse,nhà đất,HCM,Sài Gòn,ký gửi

### Thông tin bắt buộc khác
- **Chính sách bảo mật (Privacy Policy URL):** https://nguonnhaphohcm.vn/chinh-sach-bao-mat
- **Email hỗ trợ:** (điền email của bạn)
- **Số điện thoại hỗ trợ:** (điền số của bạn)
- **Phân loại nội dung (Content rating):** 3+ / Everyone (nội dung thương mại, không nhạy cảm)

### Ảnh cần chuẩn bị (bạn tự chụp/thiết kế)
- **Android – Feature graphic:** 1024 x 500 px (PNG/JPG).
- **Android – Ảnh chụp màn hình điện thoại:** tối thiểu 2 ảnh, tỉ lệ 16:9 hoặc 9:16, cạnh 320–3840 px.
- **iOS – Ảnh chụp màn hình:** 6.7" (1290 x 2796) và 6.5" (1242 x 2688) – tối thiểu 3 ảnh mỗi cỡ.
- **Icon:** đã có icon-512.png trong repo (dùng làm icon app). App Store cần icon 1024 x 1024 (không bo góc, không alpha).

---

## PHẦN 2 — HƯỚNG DẪN BUILD & NỘP

### A) ANDROID (CH Play) — dùng TWA + Bubblewrap

TWA (Trusted Web Activity) biến website PWA thành app Android chạy toàn màn hình, không hiện thanh địa chỉ.

**Yêu cầu:** máy tính có Node.js 18+, Java JDK 17+, tài khoản Google Play Console (phí 25 USD, trả 1 lần).

**Bước 1 — Cài Bubblewrap**
```bash
npm install -g @bubblewrap/cli
```

**Bước 2 — Khởi tạo dự án từ manifest**
```bash
bubblewrap init --manifest https://nguonnhaphohcm.vn/manifest.json
```
Trả lời các câu hỏi:
- Application ID: vn.nguonnhaphohcm.app
- Display mode: standalone
- Cho phép Bubblewrap tạo **keystore** mới (LƯU KỸ file .keystore và mật khẩu — mất là không cập nhật app được nữa).

**Bước 3 — Lấy SHA-256 fingerprint** (để điền vào assetlinks.json)
```bash
keytool -list -v -keystore android.keystore -alias android
```
Copy dòng **SHA256** (dạng AA:BB:CC:...).

**Bước 4 — Gắn assetlinks.json**
File đã được tạo sẵn tại `public/.well-known/assetlinks.json` với chỗ trống `REPLACE_WITH_SHA256_FINGERPRINT`. Thay chuỗi đó bằng SHA-256 ở Bước 3, commit lại. Sau khi deploy, kiểm tra mở được:
https://nguonnhaphohcm.vn/.well-known/assetlinks.json

**Bước 5 — Build file .aab**
```bash
bubblewrap build
```
Kết quả: file **app-release-bundle.aab**.

**Bước 6 — Nộp lên Google Play Console** (bạn tự làm)
1. Vào https://play.google.com/console → tạo App mới.
2. Tải file .aab lên (Production hoặc Internal testing trước).
3. Điền listing (dùng nội dung PHẦN 1), tải ảnh, feature graphic.
4. Khai báo Data safety, Content rating, Privacy Policy.
5. Gửi duyệt. Google thường duyệt trong vài ngày.

### B) iOS (App Store) — dùng Capacitor

**Yêu cầu:** máy **Mac** + **Xcode**, tài khoản **Apple Developer** (phí 99 USD/năm). Không có Mac thì dùng dịch vụ CI như Codemagic/Ionic Appflow để build.

**Bước 1 — Cài Capacitor vào dự án**
```bash
npm install @capacitor/core @capacitor/ios
npx cap init "Nguồn Nhà Phố HCM" vn.nguonnhaphohcm.app --web-dir=public
```

**Bước 2 — Trỏ app tới website**
Trong file capacitor.config.ts, đặt:
```ts
server: { url: "https://nguonnhaphohcm.vn", cleartext: false }
```
(Cách này tạo app "bọc" website. Nếu muốn app tải nội dung offline thì cần build tĩnh — phức tạp hơn.)

**Bước 3 — Tạo project iOS & mở Xcode**
```bash
npx cap add ios
npx cap open ios
```

**Bước 4 — Trong Xcode**
- Chọn Team (tài khoản Apple Developer), đặt Bundle ID: vn.nguonnhaphohcm.app.
- Thêm icon 1024x1024.
- Product → Archive → Distribute App → App Store Connect.

**Bước 5 — Nộp trên App Store Connect** (bạn tự làm)
1. https://appstoreconnect.apple.com → tạo App mới, Bundle ID vn.nguonnhaphohcm.app.
2. Điền listing (PHẦN 1), tải ảnh chụp màn hình đúng kích cỡ.
3. Chọn build vừa Archive, khai báo Privacy, gửi duyệt (Apple duyệt kỹ hơn, 1–3 ngày).

> Lưu ý Apple: app chỉ "bọc website" đôi khi bị từ chối vì thiếu tính năng riêng. Nên bật thông báo đẩy, đăng nhập, lưu tin yêu thích... (web đã có) và nêu rõ trong ghi chú review.

---

## CHECKLIST NHỮNG VIỆC BẠN CẦN TỰ LÀM
- [ ] Tạo tài khoản Google Play Console (25 USD) và/hoặc Apple Developer (99 USD/năm).
- [ ] Cài Node/Java (Android) hoặc chuẩn bị máy Mac + Xcode (iOS).
- [ ] Chạy Bubblewrap để tạo keystore + file .aab (LƯU KỸ keystore).
- [ ] Điền SHA-256 vào public/.well-known/assetlinks.json rồi commit.
- [ ] Chuẩn bị ảnh: feature graphic, screenshots, icon 1024.
- [ ] Nộp app lên kho và gửi duyệt.

Phần kỹ thuật trong repo (assetlinks scaffold, manifest, icon, nội dung listing) đã được chuẩn bị sẵn ở tài liệu này.
