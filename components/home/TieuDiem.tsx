import Icon from "./Icon";
import { TIEU_DIEM } from "./data";

export default function TieuDiem() {
  return (
    <section aria-labelledby="tieu-diem-heading" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h2 id="tieu-diem-heading" className="text-xl font-bold text-brand sm:text-2xl">
          Tiêu điểm Nguồn Nhà Phố
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Những giá trị cốt lõi giúp bạn an tâm khi mua bán, cho thuê nhà phố tại trung tâm Sài Gòn.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIEU_DIEM.map((item) => (
          <li key={item.tieuDe} className="np-card rounded-2xl bg-white p-5">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--np-do-nhat)] text-[var(--np-do)]">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="text-base font-bold text-[var(--np-muc)]">{item.tieuDe}</h3>
            <p className="mt-1.5 text-sm text-gray-500">{item.moTa}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
