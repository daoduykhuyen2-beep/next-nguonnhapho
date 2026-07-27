import Link from "next/link";

export type PaginationProps = {
  /** Trang hiện tại (bắt đầu từ 1). */
  page: number;
  /** Tổng số trang. */
  totalPages: number;
  /** Hàm tạo href cho một trang, giữ nguyên các query khác. */
  hrefForPage: (targetPage: number) => string;
  /** Số nút trang tối đa hiển thị (mặc định 5). */
  maxButtons?: number;
  className?: string;
};

/**
 * Component phân trang dùng lại được cho các trang danh sách
 * (tin đăng, dự án, tin tức...). Hiển thị nút "Trang trước",
 * các số trang gần trang hiện tại, và nút "Trang sau".
 */
export default function Pagination({
  page,
  totalPages,
  hrefForPage,
  maxButtons = 5,
  className = "",
}: PaginationProps) {
  if (!Number.isFinite(totalPages) || totalPages <= 1) return null;

  const current = Math.min(Math.max(1, Math.floor(page || 1)), totalPages);

  // Tính khoảng số trang hiển thị quanh trang hiện tại.
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const baseBtn =
    "inline-flex min-w-[2.5rem] items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors";
  const idleBtn = baseBtn + " bg-white text-gray-700 hover:bg-gray-50";
  const activeBtn =
    baseBtn + " border-[#c8102e] bg-[#c8102e] font-semibold text-white";
  const disabledBtn =
    baseBtn + " cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400";

  return (
    <nav
      aria-label="Phân trang"
      className={"mt-8 flex flex-wrap items-center justify-center gap-2 " + className}
    >
      {current > 1 ? (
        <Link href={hrefForPage(current - 1)} className={idleBtn} rel="prev">
          ← Trang trước
        </Link>
      ) : (
        <span className={disabledBtn} aria-disabled="true">
          ← Trang trước
        </span>
      )}

      {start > 1 ? (
        <>
          <Link href={hrefForPage(1)} className={idleBtn}>
            1
          </Link>
          {start > 2 ? (
            <span className="px-1 text-sm text-gray-400">…</span>
          ) : null}
        </>
      ) : null}

      {pages.map((p) =>
        p === current ? (
          <span key={p} className={activeBtn} aria-current="page">
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefForPage(p)} className={idleBtn}>
            {p}
          </Link>
        )
      )}

      {end < totalPages ? (
        <>
          {end < totalPages - 1 ? (
            <span className="px-1 text-sm text-gray-400">…</span>
          ) : null}
          <Link href={hrefForPage(totalPages)} className={idleBtn}>
            {totalPages}
          </Link>
        </>
      ) : null}

      {current < totalPages ? (
        <Link href={hrefForPage(current + 1)} className={idleBtn} rel="next">
          Trang sau →
        </Link>
      ) : (
        <span className={disabledBtn} aria-disabled="true">
          Trang sau →
        </span>
      )}
    </nav>
  );
}
