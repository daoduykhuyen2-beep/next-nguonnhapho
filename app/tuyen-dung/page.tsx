import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Job = {
  id: number;
  vi_tri: string;
  dia_diem: string | null;
  loai_hinh: string | null;
  mo_ta: string | null;
  quyen_loi: string | null;
  hoa_hong: string | null;
};

const QUYEN_LOI = [
  {
    icon: "\u{1F4B0}",
    title: "Thu nhap khong gioi han",
    desc: "Luong cung cao cong hoa hong hap dan theo tung giao dich thanh cong.",
  },
  {
    icon: "\u{1F393}",
    title: "Dao tao bai ban",
    desc: "Duoc dao tao kien thuc bat dong san, ky nang ban hang tu chuyen gia.",
  },
  {
    icon: "\u{1F680}",
    title: "Co hoi thang tien",
    desc: "Lo trinh phat trien ro rang tu nhan vien len truong nhom, truong phong.",
  },
  {
    icon: "\u{1F91D}",
    title: "Moi truong nang dong",
    desc: "Doi ngu tre trung, chuyen nghiep, ho tro nhau cung phat trien.",
  },
];

const HOA_HONG = [
  { muc: "Chuyen vien moi", ti_le: "1.5% - 2%", note: "Ap dung cho 3 thang dau" },
  { muc: "Chuyen vien chinh thuc", ti_le: "2% - 2.5%", note: "Sau khi dat chi tieu" },
  { muc: "Chuyen vien xuat sac", ti_le: "Len den 3%", note: "Top sale hang thang" },
];

export default async function TuyenDungPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  const jobs = (data ?? []) as Job[];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-brand px-6 py-12 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Gia nhap doi ngu NguonNhaPho</h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/90">
          Cung chung toi kien tao su nghiep trong linh vuc bat dong san nha pho.
          Moi truong chuyen nghiep, thu nhap hap dan, co hoi phat trien khong gioi han.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Quyen loi khi lam viec</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {QUYEN_LOI.map((q) => (
            <div key={q.title} className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <div className="text-4xl">{q.icon}</div>
              <h3 className="mt-3 font-semibold text-gray-900">{q.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Co che hoa hong</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HOA_HONG.map((h) => (
            <div key={h.muc} className="rounded-xl border-2 border-brand/20 bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-500">{h.muc}</p>
              <p className="mt-2 text-3xl font-bold text-brand">{h.ti_le}</p>
              <p className="mt-2 text-sm text-gray-600">{h.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Cac vi tri dang tuyen</h2>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.vi_tri}</h3>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                      {job.dia_diem ? <span>{job.dia_diem}</span> : null}
                      {job.loai_hinh ? <span>&bull; {job.loai_hinh}</span> : null}
                    </div>
                  </div>
                  {job.hoa_hong ? (
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                      {job.hoa_hong}
                    </span>
                  ) : null}
                </div>
                {job.mo_ta ? <p className="mt-3 text-sm text-gray-700">{job.mo_ta}</p> : null}
                {job.quyen_loi ? (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Quyen loi: </span>
                    {job.quyen_loi}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Hien chua co vi tri tuyen dung.</p>
        )}
      </section>

      <section className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ung tuyen ngay hom nay</h2>
        <p className="mx-auto mt-2 max-w-xl text-gray-600">
          Gui thong tin ung tuyen ve email tuyendung@nguonnhaphohcm.vn hoac lien he
          hotline de duoc tu van.
        </p>
      </section>
    </div>
  );
}
