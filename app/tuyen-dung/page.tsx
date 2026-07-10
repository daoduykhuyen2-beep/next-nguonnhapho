import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tuyển dụng — Nguồn Nhà Phố HCM",
  description:
    "Tuyển chuyên viên môi giới, cộng tác viên, marketing, pháp lý BĐS tại Nguồn Nhà Phố HCM. Kho hơn 1.680 căn nhà phố thật, hoa hồng 1,5–3%, đào tạo bài bản.",
};

const lyDoChon = [
  { so: "1,5–3%", mo: "Hoa hồng trên giá trị giao dịch — theo mặt bằng thị trường." },
  { so: "1.680+", mo: "Căn nhà phố có sẵn trong kho — không phải tự đi kiếm hàng." },
  { so: "Nhanh", mo: "Chi trả hoa hồng gọn gàng, rõ ràng ngay sau khi giao dịch hoàn tất." },
  { so: "0đ", mo: "Không thu phí đầu vào — hỗ trợ marketing & đào tạo miễn phí." },
];

const quyenLoi = [
  { ten: "Kho hàng sẵn 1.680+ căn", mo: "Không phải tốn tiền chạy quảng cáo tìm hàng — nguồn nhà thật, pháp lý rõ, sẵn sàng dẫn khách." },
  { ten: "Hỗ trợ marketing & data khách", mo: "Được cung cấp công cụ đăng tin đa kênh, hỗ trợ chạy quảng cáo và chia sẻ nguồn khách quan tâm." },
  { ten: "Đào tạo bài bản, đặc biệt pháp lý", mo: "Học cách kiểm tra sổ, quy hoạch, tranh chấp — kỹ năng giúp bạn tư vấn uy tín và chốt deal an toàn." },
  { ten: "Lộ trình thăng tiến rõ ràng", mo: "Từ cộng tác viên → chuyên viên → trưởng nhóm. Năng lực tới đâu, vị trí & thu nhập tới đó." },
  { ten: "Chi trả hoa hồng nhanh, minh bạch", mo: "Có bảng tính trước mỗi thương vụ, thanh toán gọn gàng sau khi giao dịch hoàn tất." },
  { ten: "Môi trường làm nghề tử tế", mo: "Làm thật, nói thật, không tin ảo giá ảo — xây sự nghiệp lâu dài bằng uy tín." },
];

const viTri = [
  { icon: "🏠", ten: "Chuyên viên môi giới nhà phố", loai: "Toàn thời gian", mo: "Tư vấn, dẫn khách, chốt giao dịch trên kho hàng có sẵn. Hoa hồng 1,5–3%, thu nhập không giới hạn. Ưu tiên có kinh nghiệm BĐS." },
  { icon: "🤝", ten: "Cộng tác viên môi giới", loai: "Bán thời gian", mo: "Bán thời gian, chủ động giờ giấc. Hợp người đang đi làm hoặc sinh viên muốn thêm thu nhập từ hoa hồng." },
  { icon: "⭐", ten: "Trưởng nhóm kinh doanh", loai: "Toàn thời gian", mo: "Dẫn dắt đội sale, chia sẻ nguồn hàng và kinh nghiệm. Yêu cầu có kinh nghiệm BĐS và kỹ năng quản lý đội." },
  { icon: "📞", ten: "Nhân viên Telesales / CSKH", loai: "Toàn thời gian", mo: "Gọi điện, chăm sóc data khách quan tâm, đặt lịch xem nhà cho đội môi giới. Có lương cứng cộng thưởng." },
  { icon: "📣", ten: "Nhân viên Marketing", loai: "Toàn thời gian", mo: "Sản xuất nội dung, chạy quảng cáo Facebook/TikTok, quản lý fanpage. Hợp người sáng tạo, mê digital." },
  { icon: "📄", ten: "Nhân viên pháp lý / hồ sơ", loai: "Toàn thời gian", mo: "Kiểm tra sổ, soạn hợp đồng, hỗ trợ công chứng sang tên. Ưu tiên người học luật hoặc từng làm hồ sơ nhà đất." },
  { icon: "🎬", ten: "Nhân viên dựng video / thiết kế", loai: "Toàn thời gian", mo: "Quay dựng clip nhà phố, cắt reels, thiết kế ấn phẩm. Hợp bạn trẻ mê CapCut, Canva, Premiere." },
  { icon: "🌱", ten: "Thực tập sinh kinh doanh", loai: "Thực tập", mo: "Chưa kinh nghiệm vẫn nhận — được đào tạo từ đầu về sản phẩm, pháp lý và kỹ năng sale, có hỗ trợ." },
  { icon: "📈", ten: "Chuyên viên tư vấn đầu tư BĐS", loai: "Toàn thời gian", mo: "Tư vấn khách hàng có dòng tiền lớn về cơ hội đầu tư nhà phố, dòng tiền cho thuê, tiềm năng tăng giá theo khu vực." },
  { icon: "🏘️", ten: "Nhân viên phát triển nguồn hàng (ký gửi)", loai: "Toàn thời gian", mo: "Tìm kiếm, kết nối và chăm sóc chủ nhà để mở rộng kho hàng độc quyền cho công ty. Hợp người quan hệ rộng, chăm chỉ." },
  { icon: "🗂️", ten: "Nhân viên vận hành / hành chính", loai: "Toàn thời gian", mo: "Hỗ trợ điều phối lịch xem nhà, quản lý dữ liệu kho hàng, giấy tờ nội bộ. Cẩn thận, ngăn nắp, thạo vi tính văn phòng." },
  { icon: "🏆", ten: "Quản lý sàn / Giám đốc kinh doanh", loai: "Toàn thời gian", mo: "Xây dựng và điều hành đội ngũ, đặt mục tiêu doanh số, phát triển thị trường khu vực. Dành cho người có kinh nghiệm quản lý BĐS." },
];

export default function TuyenDungPage() {
  return (
    <div>
      <section className="border-b border-gray-200 bg-white text-black">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:py-20 md:grid-cols-[220px_1fr]">
          <div className="flex justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-white/5 text-6xl font-black tracking-tight">
              NNP
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Cơ hội nghề nghiệp
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Gia nhập đội ngũ Nguồn Nhà Phố HCM
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Chúng tôi đang tìm những chuyên viên môi giới &amp; cộng tác viên máu
              lửa, muốn làm nghề bài bản và thu nhập xứng đáng. Điểm khác biệt lớn
              nhất: bạn không phải vất vả tự đi tìm hàng — Nguồn Nhà Phố đã có sẵn
              <strong className="font-semibold text-black"> kho hơn 1.680 căn nhà phố thật</strong>{" "}
              khắp TP.HCM, đã kiểm tra pháp lý, để bạn tập trung vào việc quan trọng
              nhất là phục vụ khách và chốt giao dịch.
            </p>
            <a
              href="#vi-tri"
              className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
            >
              Xem vị trí đang tuyển →
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800">
          Vì sao chọn <span className="text-brand">Nguồn Nhà Phố</span>?
        </h2>
        <p className="mt-1 text-gray-500">Cơ chế minh bạch — quyền lợi thật</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lyDoChon.map((item) => (
            <div
              key={item.so}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-extrabold text-brand">{item.so}</div>
              <p className="mt-2 text-sm text-gray-600">{item.mo}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-light py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Cơ chế <span className="text-brand">hoa hồng</span>
          </h2>
          <p className="mt-1 text-gray-500">Rõ ràng như thị trường, không mập mờ</p>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-bold text-slate-800">
              Hoa hồng 1,5% – 3% giá trị giao dịch
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              <p>
                Mức hoa hồng dao động theo từng sản phẩm và hiệu suất: nhà phố thứ
                cấp thông thường quanh mức 1,5–2%, các thương vụ giá trị lớn hoặc do
                bạn tự phát triển nguồn khách có thể lên tới 3%.
              </p>
              <p>
                Cơ chế chia áp dụng theo chuẩn thị trường: cộng tác viên/chuyên viên
                giữ phần lớn hoa hồng, phần còn lại công ty dùng để vận hành
                marketing, chăm data, hỗ trợ pháp lý và xây dựng thương hiệu chung —
                tức là bạn được “đứng trên vai” cả một hệ thống thay vì đơn thương độc mã.
              </p>
              <p>
                Càng đóng góp nhiều — tự phát triển nguồn hàng, nguồn khách — tỷ lệ
                bạn nhận càng cao. Minh bạch, có bảng tính rõ ràng trước mỗi thương vụ.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800">
          Quyền lợi <span className="text-brand">khi gia nhập</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {quyenLoi.map((item) => (
            <div
              key={item.ten}
              className="rounded-2xl border border-brand/15 bg-brand-light p-6"
            >
              <h3 className="font-bold text-brand-dark">✓ {item.ten}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.mo}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="vi-tri" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Các vị trí <span className="text-brand">đang tuyển</span>
          </h2>
          <p className="mt-1 text-gray-500">
            Nhiều lựa chọn — toàn thời gian, bán thời gian, thực tập
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {viTri.map((v) => (
              <div
                key={v.ten}
                className="rounded-2xl border border-brand/15 bg-brand-light p-6"
              >
                <h3 className="flex flex-wrap items-center gap-2 font-bold text-brand-dark">
                  <span className="text-xl">{v.icon}</span>
                  <span>{v.ten}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                    {v.loai}
                  </span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.mo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800">
          Công việc &amp; <span className="text-brand">yêu cầu</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand/15 bg-brand-light p-6">
            <h3 className="font-bold text-brand-dark">📋 Mô tả công việc</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Tiếp nhận nguồn khách, tư vấn và dẫn khách đi xem nhà trong kho, phối
              hợp các team khảo sát – đàm phán – pháp lý để chốt giao dịch, chăm sóc
              khách sau bán.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-brand-light p-6">
            <h3 className="font-bold text-brand-dark">🎯 Yêu cầu</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Giao tiếp tốt, chăm chỉ, trung thực, có tinh thần cầu tiến. Ưu tiên
              người đã có kinh nghiệm BĐS hoặc am hiểu khu vực trung tâm TP.HCM —
              nhưng người mới nhiệt huyết vẫn được đào tạo từ đầu.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-brand-light p-6">
            <h3 className="font-bold text-brand-dark">🕐 Hình thức</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Nhận cả toàn thời gian và cộng tác viên bán thời gian. Chủ động thời
              gian, thu nhập theo năng lực.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-brand-light p-6">
            <h3 className="font-bold text-brand-dark">📍 Khu vực</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Quận 1, Quận 3, Bình Thạnh, Quận 4 và các quận trung tâm TP.HCM.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-14 text-black">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng gia nhập?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Bấm nút <strong className="font-semibold">Gọi / Zalo</strong> hoặc liên hệ
            trực tiếp <strong className="font-semibold">0987.645.314</strong> (Mr. Duy
            Khuyến) — nhắn “Ứng tuyển môi giới” để được tư vấn về cơ chế và bắt đầu ngay.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="tel:0987645314"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              ☎ Gọi 0987.645.314
            </a>
            <Link
              href="/gioi-thieu"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-black hover:bg-gray-50"
            >
              Tìm hiểu về công ty
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
