import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gioi thieu",
  description:
    "NguonNhaPho - Kenh dang tin mua ban nha pho uy tin tai TP. Ho Chi Minh.",
};

const GIA_TRI = [
  {
    icon: "\u{2705}",
    title: "Minh bach",
    desc: "Thong tin nha dat that, gia that, phap ly ro rang, khong tin ao.",
  },
  {
    icon: "\u{1F91D}",
    title: "Tan tam",
    desc: "Dat quyen loi khach hang len hang dau, ho tro tan tinh moi giao dich.",
  },
  {
    icon: "\u{26A1}",
    title: "Nhanh chong",
    desc: "Ket noi nguoi mua va nguoi ban nhanh chong, tiet kiem thoi gian.",
  },
  {
    icon: "\u{1F3C6}",
    title: "Uy tin",
    desc: "Xay dung thuong hieu bang chat luong dich vu va su hai long cua khach hang.",
  },
];

const QUY_TRINH = [
  { buoc: "01", title: "Tiep nhan nhu cau", desc: "Lang nghe va tu van nhu cau mua ban cua khach hang." },
  { buoc: "02", title: "Khao sat & Tham dinh", desc: "Kiem tra phap ly, tham dinh gia tri that cua bat dong san." },
  { buoc: "03", title: "Ket noi giao dich", desc: "Ket noi nguoi mua - nguoi ban, ho tro thuong luong gia." },
  { buoc: "04", title: "Hoan tat & Ban giao", desc: "Ho tro thu tuc phap ly, cong chung va ban giao an toan." },
];

const SO_LIEU = [
  { con_so: "3.500+", nhan: "Nha pho dang ban" },
  { con_so: "10.000+", nhan: "Khach hang tin tuong" },
  { con_so: "24", nhan: "Quan/huyen phu song" },
  { con_so: "98%", nhan: "Khach hang hai long" },
];

const KHACH_HANG = [
  {
    ten: "Chi Nguyen Thi Mai",
    vai_tro: "Khach mua nha Quan 3",
    noi_dung: "Duoc tu van rat nhiet tinh, thong tin nha dung nhu mo ta. Toi rat hai long voi dich vu.",
  },
  {
    ten: "Anh Tran Van Hung",
    vai_tro: "Khach ban nha Binh Thanh",
    noi_dung: "Nha cua toi duoc rao ban va ket noi khach hang chi trong 2 tuan. Rat chuyen nghiep.",
  },
  {
    ten: "Chi Le Thanh Ha",
    vai_tro: "Nha dau tu",
    noi_dung: "Kenh thong tin dang tin uy tin nhat toi tung dung. Gia that, phap ly minh bach.",
  },
];

const NGAN_HANG = ["Vietcombank", "BIDV", "VietinBank", "Techcombank", "ACB", "Sacombank"];

export default function GioiThieuPage() {
  return (
    <div className="space-y-14">
      <section className="rounded-2xl bg-brand px-6 py-12 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Ve NguonNhaPho</h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/90">
          Kenh dang tin mua ban nha pho uy tin hang dau tai TP. Ho Chi Minh, ket noi
          hang ngan giao dich thanh cong moi nam.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-brand">Tam nhin</h2>
          <p className="mt-3 text-gray-700">
            Tro thanh nen tang giao dich bat dong san nha pho minh bach va dang tin cay
            nhat tai Viet Nam, noi moi nguoi deu co the tim thay ngoi nha mo uoc.
          </p>
        </div>
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-brand">Su menh</h2>
          <p className="mt-3 text-gray-700">
            Ket noi nguoi mua va nguoi ban bang thong tin that, dich vu tan tam, gop phan
            xay dung thi truong bat dong san lanh manh va ben vung.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Gia tri cot loi</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GIA_TRI.map((g) => (
            <div key={g.title} className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <div className="text-4xl">{g.icon}</div>
              <h3 className="mt-3 font-semibold text-gray-900">{g.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-brand px-6 py-10">
        <div className="grid grid-cols-2 gap-6 text-center text-white lg:grid-cols-4">
          {SO_LIEU.map((s) => (
            <div key={s.nhan}>
              <p className="text-3xl font-bold sm:text-4xl">{s.con_so}</p>
              <p className="mt-1 text-sm text-white/90">{s.nhan}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Quy trinh mua ban</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {QUY_TRINH.map((q) => (
            <div key={q.buoc} className="rounded-xl border bg-white p-6 shadow-sm">
              <span className="text-3xl font-bold text-brand/30">{q.buoc}</span>
              <h3 className="mt-2 font-semibold text-gray-900">{q.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Khach hang noi gi</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {KHACH_HANG.map((k) => (
            <div key={k.ten} className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="italic text-gray-700">&ldquo;{k.noi_dung}&rdquo;</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{k.ten}</p>
                <p className="text-sm text-gray-500">{k.vai_tro}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Ngan hang doi tac</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {NGAN_HANG.map((n) => (
            <span
              key={n}
              className="rounded-lg border bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm"
            >
              {n}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
