import { KHACH_HANG, MOI_GIOI } from "./data";

function ChuCaiDau(ten: string) {
  return ten.trim().charAt(0).toUpperCase();
}

export default function CamNhan() {
  return (
    <section aria-labelledby="cam-nhan-heading" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h2 id="cam-nhan-heading" className="text-xl font-bold text-brand sm:text-2xl">Khách hàng & môi giới nói gì về Nguồn Nhà Phố</h2>
        <p className="mt-1 text-sm text-gray-500">Những chia sẻ thật lòng từ người đã mua bán, cho thuê và từ người trực tiếp làm nghề cùng chúng tôi.</p>
      </div>
      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Khách hàng chia sẻ</div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KHACH_HANG.map((kh) => (
          <li key={kh.ten} className="np-card flex h-full flex-col rounded-2xl bg-white p-5">
            <p className="flex-1 text-sm leading-relaxed text-gray-700">&ldquo;{kh.noiDung}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">{ChuCaiDau(kh.ten)}</span>
              <div>
                <div className="text-sm font-bold text-[var(--np-muc)]">{kh.ten}</div>
                <div className="text-xs text-gray-500">{kh.vaiTro}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">Sale làm việc tại Nguồn Nhà Phố</div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {MOI_GIOI.map((mg) => (
          <li key={mg.ten} className="np-card flex h-full flex-col rounded-2xl border border-green-100 bg-green-50/40 p-5">
            <p className="flex-1 text-sm leading-relaxed text-gray-700">&ldquo;{mg.noiDung}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/10 text-sm font-bold text-green-700">{ChuCaiDau(mg.ten)}</span>
              <div>
                <div className="text-sm font-bold text-[var(--np-muc)]">{mg.ten}</div>
                <div className="text-xs text-gray-500">{mg.vaiTro}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
