"use client";

import type { Post } from "@/lib/types";

type MyPost = Post & { ngay_het_han?: string | null; luot_xem?: number | null };

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, `""`)}"`;
}

export default function ExportExcelButton({ posts }: { posts: MyPost[] }) {
  function handleExport() {
    const headers = ["Mã tin", "Tiêu đề", "Loại", "Quận", "Giá", "Diện tích", "Trạng thái", "Hạng tin", "Lượt xem", "Ngày đăng", "Ngày hết hạn"];
    const rows = posts.map((p) => [
      p.id,
      p.title ?? "",
      p.loai ?? "",
      p.quan ?? "",
      p.gia ?? "",
      p.dien_tich ?? "",
      p.trang_thai ?? "",
      p.status ?? "",
      p.luot_xem ?? 0,
      p.created_at ?? "",
      p.ngay_het_han ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
    // BOM để Excel đọc đúng tiếng Việt (UTF-8)
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tin-cua-toi-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
    >
      Xuất file Excel
    </button>
  );
}
