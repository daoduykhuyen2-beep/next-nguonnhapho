import type { Metadata } from "next";
import Link from "next/link";
import { getTongSoCan, formatSoCan } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Nguồn Nhà Phố HCM — làm việc chuyên nghiệp, minh bạch từng bước. Tầm nhìn, quy trình, giá trị cốt lõi và cam kết với khách hàng.",
};

const QUY_TRINH = [
  {
    b: "01",
    t: "Đội tìm nguồn",
    d: "Đội khảo sát đi thực tế từng căn, làm việc trực tiếp với chủ nhà để lấy nguồn tận gốc — không mua tin trung gian. Mỗi căn đều được chụp ảnh thật, ghi nhận hiện trạng, diện tích, số tầng và tình trạng sử dụng trước khi nhận đăng.",
  },
  {
    b: "02",
    t: "Đội thẩm định pháp lý",
    d: "Kiểm tra sổ hồng, quy hoạch, lộ giới, tranh chấp và tình trạng thế chấp tại phường/quận. Căn nào vướng pháp lý, giá ảo hoặc tin trùng đều bị loại ngay — chỉ giữ lại tin sạch, có hồ sơ rõ ràng để đăng lên hệ thống.",
  },
  {
    b: "03",
    t: "Đội định giá thị trường",
    d: "So sánh với giao dịch thật cùng tuyến đường, cùng khu vực trong 3–6 tháng gần nhất để đưa ra khoảng giá hợp lý. Chủ nhà được tư vấn mức giá bán nhanh và mức giá kỳ vọng, tránh treo giá quá cao gây mất thời gian đôi bên.",
  },
  {
    b: "04",
    t: "Đội tư vấn khách hàng",
    d: "Lắng nghe kỹ nhu cầu, ngân sách và mục đích mua (ở, đầu tư, cho thuê) rồi chọn lọc 3–5 căn phù hợp nhất. Dẫn khách đi xem thực tế đúng như tin đăng, phân tích ưu — nhược điểm từng căn một cách khách quan.",
  },
  {
    b: "05",
    t: "Đội đàm phán & chốt giá",
    d: "Đại diện thương lượng giữa bên mua và bên bán để đạt mức giá tốt nhất, giữ cọc an toàn và làm rõ mọi điều khoản trước khi ký. Khách được giải thích minh bạch từng khoản chi phí — không phí ẩn, không ép cọc.",
  },
  {
    b: "06",
    t: "Đội hỗ trợ giao dịch",
    d: "Đồng hành công chứng, sang tên, nộp thuế và kết nối ngân hàng hỗ trợ vay khi cần. Theo sát đến lúc bàn giao nhà và hoàn tất thủ tục, đảm bảo khách nhận sổ, nhận nhà đúng cam kết ban đầu.",
  },
];

const GIA_TRI = [
  { icon: "🛡️", t: "Minh bạch", d: "Thông tin thật, giá thị trường, không tin ảo — không giá ảo." },
  { icon: "⚖️", t: "Pháp lý an toàn", d: "Mọi căn đều được kiểm tra sổ và quy hoạch trước khi giao dịch." },
  { icon: "🤝", t: "Tận tâm", d: "Đặt lợi ích khách hàng làm trung tâm trong từng quyết định." },
  { icon: "⭐", t: "Chuyên nghiệp", d: "Quy trình khép kín 4 bước, đội ngũ đào tạo bài bản." },
];

const SO_LIEU = [
  { n: "1.700+", l: "Căn nhà phố trong kho" },
  { n: "4", l: "Đội chuyên trách" },
  { n: "100%", l: "Tin kiểm tra pháp lý" },
  { n: "10+", l: "Ngân hàng đối tác" },
];

const RUI_RO = [
  "Mua nhầm nhà dính quy hoạch, giải tỏa — mất trắng phần lớn giá trị.",
  "Nhà đang thế chấp / tranh chấp thừa kế — không thể sang tên.",
  "Đặt cọc theo giá ảo, tin ảo rồi bị 'lùa' sang căn khác.",
  "Giấy tờ giả, vi bằng không có giá trị pháp lý khi ra tòa.",
];

const CAM_KET = [
  "Thông tin căn nhà là thật, hình ảnh đúng hiện trạng.",
  "Giá công bố là giá thị trường, không thổi giá.",
  "Kiểm tra pháp lý kỹ trước khi khách xuống tiền.",
  "Đồng hành đến khi hoàn tất sang tên, bàn giao.",
];

export default async function GioiThieuPage() {
  const soCan = await getTongSoCan();
  const soLieu =
    soCan > 0
      ? SO_LIEU.map((s) =>
          s.l.includes("trong kho") ? { ...s, n: formatSoCan(soCan) + "+" } : s
        )
      : SO_LIEU;
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white text-black">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            Về chúng tôi
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Nguồn Nhà Phố HCM — làm việc chuyên nghiệp, minh bạch từng bước
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-gray-600 sm:text-base">
            Chuyên nhà phố, shophouse trung tâm TP.HCM. Kho {soCan > 0 ? formatSoCan(soCan) + "+" : "1.700+"} căn được kiểm
            tra pháp lý trước khi đăng — mua bán và cho thuê minh bạch, an toàn.
          </p>
          <Link
            href="/tin-dang"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100"
          >
            Xem nhà đang bán →
          </Link>
        </div>
      </section>

      {/* Tầm nhìn & sứ mệnh */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-brand">Tầm nhìn & sứ mệnh</h2>
        <p className="mt-4 max-w-4xl leading-relaxed text-gray-700">
          Nguồn Nhà Phố HCM mong muốn trở thành địa chỉ đáng tin cậy hàng đầu cho
          người mua – bán nhà phố khu trung tâm Sài Gòn: nơi mọi thông tin đều
          minh bạch, mọi giao dịch đều an toàn, và khách hàng luôn được đặt ở vị
          trí trung tâm. Trong một thị trường còn nhiều tin ảo và rủi ro pháp lý,
          chúng tôi chọn con đường khó hơn nhưng bền hơn — làm thật, nói thật, và
          phục vụ khách hàng bằng cả sự chuyên nghiệp lẫn cái tâm với nghề.
        </p>
      </section>

      {/* Quy trình 6 bước */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-brand">
            Quy trình làm việc của Nguồn Nhà Phố
          </h2>
          <p className="mt-1 text-gray-500">
            Sáu đội chuyên trách — mỗi căn nhà đi qua đủ 6 bước khép kín trước khi
            đến tay khách hàng, minh bạch và có kiểm soát ở từng khâu.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {QUY_TRINH.map((s) => (
              <div key={s.b} className="rounded-2xl border p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {s.b}
                </div>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Số liệu */}
      <section className="bg-brand/5 text-black">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 lg:grid-cols-4">
          {soLieu.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-extrabold sm:text-4xl">{s.n}</div>
              <div className="mt-1 text-sm text-gray-600">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-brand">Giá trị cốt lõi</h2>
        <p className="mt-1 text-gray-500">Những điều Nguồn Nhà Phố luôn giữ vững.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GIA_TRI.map((g) => (
            <div key={g.t} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-3xl">{g.icon}</div>
              <h3 className="mt-3 font-semibold">{g.t}</h3>
              <p className="mt-2 text-sm text-gray-600">{g.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Khách hàng được gì */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-brand">
            Khách hàng được gì khi làm việc với Nguồn Nhà Phố?
          </h2>
          <p className="mt-4 leading-relaxed text-gray-700">
            Khi làm việc với chúng tôi, anh chị được phục vụ bởi một quy trình
            chuyên nghiệp khép kín: thông tin căn nhà là thật, giá là giá thị
            trường, nhà xem đúng như đăng, và pháp lý được kiểm tra kỹ trước khi
            giao dịch. Không tin ảo, không giá ảo, không bất ngờ khó chịu vào phút
            chót — đó là cách Nguồn Nhà Phố giữ uy tín.
          </p>
        </div>
      </section>

      {/* Rủi ro & Cam kết */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-brand">
              Rủi ro khi mua nhà — chuyện có thật, không dọa
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {RUI_RO.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-brand">⚠️</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border p-6">
            <h2 className="text-xl font-bold text-brand">Cam kết làm việc</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {CAM_KET.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-brand">
            Sẵn sàng tìm căn nhà phù hợp?
          </h2>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/tin-dang" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90">
              Xem nhà đang bán
            </Link>
            <Link href="/tuyen-dung" className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand hover:text-white">
              Gia nhập đội ngũ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
