import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description:
    "Gia nhập đội ngũ Nguồn Nhà Phố HCM — kho hơn 1.680 căn nhà phố thật, hoa hồng 1,5%–3%, đào tạo bài bản.",
};

type Job = {
  id: number;
  vi_tri: string | null;
  dia_diem: string | null;
  loai_hinh: string | null;
  mo_ta: string | null;
  quyen_loi: string | null;
  hoa_hong: string | null;
};

async function layViTri(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Job[]) ?? [];
}

const VI_SAO = [
  { icon: "🏠", t: "Có sẵn kho hàng thật", d: "Hơn 1.680 căn nhà phố khắp TP.HCM đã kiểm tra pháp lý — bạn không phải tự đi săn hàng." },
  { icon: "💰", t: "Hoa hồng hấp dẫn", d: "1,5% – 3% giá trị giao dịch, thanh toán rõ ràng, minh bạch." },
  { icon: "🎓", t: "Đào tạo bài bản", d: "Được huấn luyện quy trình, pháp lý, kỹ năng chốt giao dịch." },
  { icon: "📈", t: "Lộ trình thăng tiến", d: "Từ CTV → chuyên viên → trưởng nhóm, thu nhập tăng theo năng lực." },
];

const HOA_HONG = [
  { muc: "1,5%", dk: "Giao dịch giá trị lớn > 30 tỷ", note: "Nhà phố mặt tiền, shophouse cao cấp" },
  { muc: "2%", dk: "Giao dịch 10 – 30 tỷ", note: "Phân khúc phổ biến nhất" },
  { muc: "3%", dk: "Giao dịch < 10 tỷ", note: "Nhà hẻm, căn hộ, đất nền" },
];

const QUYEN_LOI = [
  "Kho hàng thật, cập nhật liên tục — không lo thiếu nguồn.",
  "Hỗ trợ marketing, hình ảnh, tin đăng VIP miễn phí.",
  "Đồng nghiệp máu lửa, môi trường chuyên nghiệp.",
  "Thưởng nóng theo tháng/quý cho top chốt deal.",
];

export default async function TuyenDungPage() {
  const viTri = await layViTri();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            Cơ hội nghề nghiệp
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Gia nhập đội ngũ Nguồn Nhà Phố HCM
          </h1>
          <p className="mt-4 max-w-2xl text-sm opacity-90 sm:text-base">
            Chúng tôi đang tìm những chuyên viên môi giới & cộng tác viên máu lửa,
            muốn làm nghề bài bản và thu nhập xứng đáng. Bạn không phải vất vả tự
            đi tìm hàng — Nguồn Nhà Phố đã có sẵn kho hơn 1.680 căn nhà phố thật,
            đã kiểm tra pháp lý.
          </p>
          <a
            href="#vi-tri"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100"
          >
            Xem vị trí đang tuyển →
          </a>
        </div>
      </section>

      {/* Vì sao chọn */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-brand">Vì sao chọn Nguồn Nhà Phố?</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VI_SAO.map((v) => (
            <div key={v.t} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-3 font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-gray-600">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cơ chế hoa hồng */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-brand">Cơ chế hoa hồng</h2>
          <p className="mt-1 text-gray-500">
            Rõ ràng như thị trường, không mập mờ — 1,5% đến 3% giá trị giao dịch.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {HOA_HONG.map((h) => (
              <div key={h.muc} className="rounded-2xl border p-6 text-center shadow-sm">
                <div className="text-4xl font-extrabold text-brand">{h.muc}</div>
                <div className="mt-2 font-semibold">{h.dk}</div>
                <p className="mt-1 text-sm text-gray-500">{h.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quyền lợi */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-brand">Quyền lợi khi gia nhập</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {QUYEN_LOI.map((q) => (
            <li key={q} className="flex gap-3 rounded-xl border bg-white p-4 shadow-sm">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">{q}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Các vị trí đang tuyển */}
      <section id="vi-tri" className="bg-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-brand">Các vị trí đang tuyển</h2>
          {viTri.length ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {viTri.map((job) => (
                <div key={job.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold">{job.vi_tri}</h3>
                    {job.loai_hinh ? (
                      <span className="whitespace-nowrap rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                        {job.loai_hinh}
                      </span>
                    ) : null}
                  </div>
                  {job.dia_diem ? (
                    <p className="mt-1 text-sm text-gray-500">📍 {job.dia_diem}</p>
                  ) : null}
                  {job.mo_ta ? (
                    <p className="mt-3 text-sm text-gray-700">{job.mo_ta}</p>
                  ) : null}
                  {job.quyen_loi ? (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Quyền lợi: </span>
                      {job.quyen_loi}
                    </p>
                  ) : null}
                  {job.hoa_hong ? (
                    <p className="mt-2 text-sm text-brand">
                      <span className="font-semibold">Hoa hồng: </span>
                      {job.hoa_hong}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg border bg-white p-6 text-gray-500">
              Hiện chưa có vị trí nào. Vui lòng quay lại sau.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Sẵn sàng gia nhập?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm opacity-90">
            Gửi thông tin cho chúng tôi — đội ngũ tuyển dụng sẽ liên hệ trong 24h.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/tai-khoan" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100">
              Ứng tuyển ngay
            </Link>
            <Link href="/gioi-thieu" className="rounded-lg border border-white px-5 py-2.5 font-semibold text-white hover:bg-white hover:text-brand">
              Tìm hiểu về công ty
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
