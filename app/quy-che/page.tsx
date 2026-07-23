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
            Nguồn Nhà Phố HCM là kho nhà đất được kiểm duyệt thủ công nhằm giữ chất
            lượng tin thật. Quy chế dưới đây giúp người đăng và người tìm nhà cùng có
            trải nghiệm minh bạch, đáng tin cậy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            A. Thời gian hiển thị &amp; các hạng tin
          </h2>
          <p className="mb-3">
            Nguồn Nhà Phố HCM áp dụng cơ chế mua theo tin hoặc gói combo tháng, thanh
            toán bằng chuyển khoản QR và được quản trị viên duyệt thủ công.
          </p>
          <p className="mb-1 font-semibold text-gray-900">Mua lẻ theo tin</p>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Tin Thường</span> — hiển thị 15 ngày, xuất
              hiện trong danh sách tìm kiếm, kèm 3 lần sửa tin miễn phí.
            </li>
            <li>
              <span className="font-medium">VIP Vàng</span> — hiển thị 7 ngày, gắn nhãn
              VIP Vàng nổi bật, ưu tiên xếp trên tin thường, kèm 5 lần sửa tin.
            </li>
            <li>
              <span className="font-medium">VIP Kim Cương</span> — hiển thị 7 ngày, nằm
              ở vị trí đầu trang tìm kiếm và mục VIP trang chủ, được hỗ trợ viết lại
              tiêu đề hút khách.
            </li>
          </ul>
          <p className="mb-1 font-semibold text-gray-900">
            Đẩy tin (làm mới lên đầu danh sách)
          </p>
          <p className="mb-3">
            Mua theo lượt (1 / 3 / 6 lượt); mỗi lượt đưa tin nhảy lên đầu danh sách, gói
            nhiều lượt tự đẩy mỗi 24 giờ.
          </p>
          <p className="mb-1 font-semibold text-gray-900">
            Gói combo tháng (dành cho nhà môi giới)
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Gói Cơ Bản</span> — 15 tin Thường (15
              ngày/tin) + 5 lượt đẩy tin, duyệt ưu tiên trong 4 giờ làm việc.
            </li>
            <li>
              <span className="font-medium">Gói Chuyên Nghiệp</span> — 30 tin Thường + 5
              tin VIP Vàng (15 ngày/tin) + 15 lượt đẩy tin, có huy hiệu tin từ đối tác
              xác thực.
            </li>
            <li>
              <span className="font-medium">Gói VIP Toàn Diện</span> — 50 tin Thường +
              10 tin VIP Vàng + 5 tin VIP Kim Cương (15 ngày/tin) + 30 lượt đẩy tin, kèm
              hỗ trợ viết nội dung chuẩn SEO.
            </li>
          </ul>
          <p>
            Mọi tin (kể cả tin VIP) đều được kiểm duyệt thủ công trước khi lên trang.
            Tin để quá hạn mà không được duyệt do sai quy định sẽ được thông báo để
            chỉnh sửa; tin hết hạn được lưu tạm một thời gian trước khi ẩn.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            B. Nguyên tắc về nội dung tin đăng
          </h2>
          <p className="mb-3">
            Để giữ kho tin thật và dễ tìm, tin sẽ không được duyệt hoặc bị gỡ nếu rơi
            vào một trong các trường hợp sau:
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-5">
            <li>Nội dung không dấu, mô tả sơ sài hoặc nhồi từ khóa.</li>
            <li>Chèn đường dẫn hoặc quảng cáo sang website, dịch vụ khác.</li>
            <li>Địa chỉ không rõ ràng (tối thiểu phải có tên đường, tổ hoặc ấp).</li>
            <li>Giá rao không đúng thực tế hoặc chỉ đăng giá trả trước.</li>
            <li>Hình ảnh không phải của tài sản thật hoặc không đúng nội dung.</li>
            <li>Chọn sai loại bất động sản hoặc sai khu vực.</li>
            <li>
              Tên và số điện thoại liên hệ trong nội dung mâu thuẫn với ô liên hệ.
            </li>
            <li>Giả danh chính chủ.</li>
            <li>Đăng lại tin cũ, đăng trùng hoặc gộp nhiều tài sản trong một tin.</li>
          </ol>
          <p>
            Nếu vô tình vi phạm, quản trị viên sẽ chủ động hỗ trợ chỉnh sửa; nếu cố tình
            vi phạm nhiều lần, tin sẽ không được duyệt hoặc tài khoản bị xử lý theo mục
            C.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            C. Các trường hợp dẫn đến khóa tài khoản
          </h2>
          <p className="mb-3">Chúng tôi xử lý theo mức độ để bảo vệ người dùng thật:</p>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Đăng tin sai sự thật</span> (báo đã giao
              dịch rồi kéo khách sang tài sản khác, sai giá, sai ảnh, sai địa chỉ): vi
              phạm cố ý sẽ bị khóa vĩnh viễn.
            </li>
            <li>
              <span className="font-medium">Đăng trùng, sao chép nội dung, tạo nhiều
              tài khoản</span> để đăng lại tài sản cũ, dùng phần mềm đẩy tin tự động gây
              quá tải hệ thống, hoặc không liên lạc được với người đăng.
            </li>
          </ul>
          <p>
            Các vi phạm nhóm sau được áp dụng khóa theo cấp độ: lần 1 mở khóa khi liên
            hệ ban quản trị; lần 2 khóa kèm không duyệt tin; tái phạm sẽ khóa vĩnh viễn.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            D. Lời nhắn từ Nguồn Nhà Phố HCM
          </h2>
          <p>
            Mọi quy định đều hướng đến một kho tin thật, sạch và dễ tìm — điều đó tốt
            cho cả người mua lẫn người bán. Rất mong Quý thành viên đăng tin có trách
            nhiệm, xây dựng, để Nguồn Nhà Phố HCM ngày càng là địa chỉ tin cậy của thị
            trường nhà đất TP.HCM. Xin cảm ơn sự đồng hành của Quý thành viên.
          </p>
        </section>

        <section className="border-t pt-4 text-gray-600">
          <p className="font-semibold text-gray-900">Liên hệ</p>
          <p>Website: nguonnhaphohcm.vn</p>
          <p>Email: hotro@nguonnhaphohcm.vn</p>
        </section>
      </div>
    </main>
  );
}
