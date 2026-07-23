import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quy chế đăng tin",
  description:
    "Quy chế đăng tin tại Nguồn Nhà Phố HCM: các hạng tin, thời gian hiển thị, nguyên tắc nội dung và các trường hợp khóa tài khoản.",
};

export default function QuyCheDangTinPage() {
  const capNhat = "23/07/2026";
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-gray-800">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Quy chế đăng tin tại Nguồn Nhà Phố HCM
      </h1>
      <p className="mb-8 text-sm text-gray-500">Cập nhật lần cuối: {capNhat}</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <p>
            <strong>Nguồn Nhà Phố HCM</strong> là kho nhà đất được kiểm duyệt thủ
            công nhằm giữ chất lượng tin thật. Quy chế dưới đây giúp người đăng và
            người tìm nhà cùng có trải nghiệm minh bạch, đáng tin cậy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            A. Thời gian hiển thị & các hạng tin
          </h2>
          <p className="mb-3">
            Nguồn Nhà Phố HCM áp dụng cơ chế mua theo tin hoặc gói combo tháng,
            thanh toán bằng chuyển khoản QR và được quản trị viên duyệt thủ công.
          </p>
          <h3 className="mb-1 font-semibold text-gray-900">Mua lẻ theo tin</h3>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>
              <strong>Tin Thường</strong> — hiển thị 15 ngày, xuất hiện trong danh
              sách tìm kiếm, kèm 3 lần sửa tin miễn phí.
            </li>
            <li>
              <strong>VIP Vàng</strong> — hiển thị 7 ngày, gắn nhãn VIP Vàng nổi
              bật, ưu tiên xếp trên tin thường, kèm 5 lần sửa tin.
            </li>
            <li>
              <strong>VIP Kim Cương</strong> — hiển thị 7 ngày, nằm ở vị trí đầu
              trang tìm kiếm và mục VIP trang chủ, được hỗ trợ viết lại tiêu đề hút
              khách.
            </li>
          </ul>
          <h3 className="mb-1 font-semibold text-gray-900">
            Đẩy tin (làm mới lên đầu danh sách)
          </h3>
          <p className="mb-3">
            Mua theo lượt (1 / 3 / 6 lượt); mỗi lượt đưa tin nhảy lên đầu danh
            sách, gói nhiều lượt tự đẩy mỗi 24 giờ.
          </p>
          <h3 className="mb-1 font-semibold text-gray-900">
            Gói combo tháng (dành cho nhà môi giới)
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Gói Cơ Bản</strong> — 15 tin Thường (15 ngày/tin) + 5 lượt
              đẩy tin, duyệt ưu tiên trong 4 giờ làm việc.
            </li>
            <li>
              <strong>Gói Chuyên Nghiệp</strong> — 30 tin Thường + 5 tin VIP Vàng
              (15 ngày/tin) + 15 lượt đẩy tin, có huy hiệu tin từ đối tác xác thực.
            </li>
            <li>
              <strong>Gói VIP Toàn Diện</strong> — 50 tin Thường + 10 tin VIP Vàng
              + 5 tin VIP Kim Cương (15 ngày/tin) + 30 lượt đẩy tin, kèm hỗ trợ viết
              nội dung chuẩn SEO.
            </li>
          </ul>
          <p className="mt-3">
            Mọi tin (kể cả tin VIP) đều được kiểm duyệt thủ công trước khi lên
            trang. Tin để quá hạn mà không được duyệt do sai quy định sẽ được thông
            báo để chỉnh sửa; tin hết hạn được lưu tạm một thời gian trước khi ẩn.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            B. Nguyên tắc về nội dung tin đăng
          </h2>
          <p>
            Tin sẽ không được duyệt hoặc bị gỡ nếu rơi vào các trường hợp: nội dung
            không dấu, mô tả sơ sài hoặc nhồi từ khóa; chèn đường dẫn/quảng cáo sang
            website khác; địa chỉ không rõ ràng (tối thiểu phải có tên đường/tổ/ấp);
            giá không đúng thực tế; hình ảnh không phải của tài sản thật; chọn sai
            loại bất động sản; tên hoặc số điện thoại liên hệ mâu thuẫn giữa nội
            dung và ô liên hệ; giả danh chính chủ; đăng lại tin cũ hoặc gộp nhiều
            tài sản trong một tin.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            C. Các trường hợp dẫn đến khóa tài khoản
          </h2>
          <p className="mb-2">
            Chúng tôi xử lý theo mức độ để bảo vệ người dùng thật:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Đăng tin sai sự thật</strong> (báo đã giao dịch rồi kéo khách
              sang tài sản khác, sai giá/ảnh/địa chỉ): vi phạm cố ý sẽ bị khóa vĩnh
              viễn.
            </li>
            <li>
              <strong>Đăng trùng, sao chép nội dung, tạo nhiều tài khoản để đăng
              lại tài sản cũ, dùng phần mềm đẩy tin tự động gây quá tải hệ thống</strong>,
              hoặc <strong>không liên lạc được với người đăng</strong>: áp dụng khóa
              theo cấp độ (lần 1 mở khóa khi liên hệ ban quản trị; lần 2 khóa kèm
              không duyệt tin; tái phạm khóa vĩnh viễn).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            D. Lời nhắn từ Nguồn Nhà Phố HCM
          </h2>
          <p>
            Mọi quy định đều hướng đến một kho tin thật, sạch và dễ tìm — điều đó
            tốt cho cả người mua lẫn người bán. Rất mong Quý thành viên đăng tin có
            trách nhiệm, xây dựng, để Nguồn Nhà Phố HCM ngày càng là địa chỉ tin cậy
            của thị trường nhà đất TP.HCM. Xin cảm ơn sự đồng hành của Quý thành
            viên.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Liên hệ</h2>
          <ul className="list-none space-y-1">
            <li>Website: nguonnhaphohcm.vn</li>
            <li>Email: hotro@nguonnhaphohcm.vn</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

