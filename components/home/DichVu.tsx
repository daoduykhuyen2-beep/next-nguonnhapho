import Link from "next/link";
import Icon from "./Icon";
import { DICH_VU } from "./data";

export default function DichVu() {
  return (
    <section aria-labelledby="dich-vu-heading" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h2 id="dich-vu-heading" className="text-xl font-bold text-brand sm:text-2xl">Nguồn Nhà Phố giúp bạn việc gì?</h2>
        <p className="mt-1 text-sm text-gray-500">Chọn đúng việc bạn đang cần, chúng tôi dẫn bạn đến kho tin và công cụ phù hợp nhất.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DICH_VU.map((dv) => (
          <li key={dv.tieuDe} className="np-card flex h-full flex-col rounded-2xl bg-white p-5">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon name={dv.icon} className="h-6 w-6" /></span>
            <h3 className="text-base font-bold text-[var(--np-muc)]">{dv.tieuDe}</h3>
            <p className="mt-1.5 flex-1 text-sm text-gray-500">{dv.moTa}</p>
            <Link href={dv.href} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">Xem chi tiết &rarr;</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
