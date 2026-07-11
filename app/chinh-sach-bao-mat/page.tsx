import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật của ứng dụng Nguồn Nhà Phố HCM - cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.",
};

export default function ChinhSachBaoMatPage() {
  const capNhat = "12/07/2026";
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-gray-800">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Chính sách bảo mật
      </h1>
      <p className="mb-8 text-sm text-gray-500">Cập nhật lần cuối: {capNhat}</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <p>
            Ứng dụng <strong>Nguồn Nhà Phố HCM</strong> (“chúng tôi”) tôn trọng
            quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân mà bạn cung
            cấp khi sử dụng nền tảng. Chính sách này giải thích chúng tôi thu thập
            dữ liệu gì, sử dụng ra sao và các quyền của bạn.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            1. Thông tin chúng tôi thu thập
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Thông tin tài khoản: họ tên, email, số điện thoại khi bạn đăng ký
              hoặc đăng nhập.
            </li>
            <li>
              Nội dung bạn đăng: tin rao bán, cho thuê bất động sản, hình ảnh và
              mô tả đi kèm.
            </li>
            <li>
              Dữ liệu sử dụng: các thao tác trên ứng dụng nhằm cải thiện trải
              nghiệm và bảo mật.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            2. Mục đích sử dụng thông tin
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Cung cấp và vận hành các tính năng của ứng dụng.</li>
            <li>Kết nối người mua, người bán và người thuê bất động sản.</li>
            <li>Gửi thông báo liên quan đến tài khoản và tin đăng của bạn.</li>
            <li>Bảo đảm an toàn, phát hiện và ngăn chặn gian lận.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            3. Chia sẻ thông tin
          </h2>
          <p>
            Chúng tôi không bán thông tin cá nhân của bạn. Thông tin chỉ được chia
            sẻ khi cần thiết để cung cấp dịch vụ (ví dụ hiển thị thông tin liên hệ
            trên tin đăng do chính bạn công khai) hoặc khi pháp luật yêu cầu.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            4. Bảo mật dữ liệu
          </h2>
          <p>
            Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để bảo vệ dữ
            liệu khỏi truy cập, thay đổi hoặc tiết lộ trái phép. Tuy nhiên, không có
            phương thức truyền tải nào qua Internet an toàn tuyệt đối.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            5. Quyền của bạn
          </h2>
          <p>
            Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của
            mình. Để thực hiện, vui lòng liên hệ với chúng tôi qua thông tin bên
            dưới.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            6. Xóa tài khoản và dữ liệu
          </h2>
          <p>
            Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan bất cứ lúc
            nào bằng cách gửi yêu cầu tới email hỗ trợ. Chúng tôi sẽ xử lý trong
            thời gian hợp lý theo quy định.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            7. Liên hệ
          </h2>
          <p>
            Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
          </p>
          <ul className="mt-2 list-none space-y-1">
            <li>Website: nguonnhaphohcm.vn</li>
            <li>Email: hotro@nguonnhaphohcm.vn</li>
          </ul>
        </section>

        <p className="pt-4 text-gray-500">
          Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ
          được đăng tải trên trang này.
        </p>
      </div>
    </main>
  );
}
