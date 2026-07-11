"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { formatGia } from "@/components/PostCard";
import { renewPost, unlistPost } from "@/app/actions/my-posts";
import { deletePost } from "@/app/actions/posts";

type Props = { post: Post & { ngay_het_han?: string | null; luot_xem?: number | null } };

function fmtDate(v?: string | null) {
  if (!v) return "--";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function computeState(p: Props["post"]): { key: string; label: string; cls: string } {
  if (p.trang_thai === "da_ha") return { key: "da_ha", label: "Đã hạ", cls: "bg-gray-100 text-gray-600" };
  if (p.trang_thai === "cho_duyet") return { key: "cho_duyet", label: "Chờ duyệt", cls: "bg-amber-100 text-amber-700" };
  const exp = p.ngay_het_han ? new Date(p.ngay_het_han).getTime() : 0;
  const now = Date.now();
  if (exp && exp < now) return { key: "het_han", label: "Hết hạn", cls: "bg-red-100 text-red-600" };
  const soon = exp && exp - now < 3 * 24 * 60 * 60 * 1000;
  if (soon) return { key: "sap_het_han", label: "Sắp hết hạn", cls: "bg-orange-100 text-orange-600" };
  return { key: "hien_thi", label: "Đang hiển thị", cls: "bg-green-100 text-green-700" };
}

const tierLabel: Record<string, { label: string; cls: string }> = {
  kim_cuong: { label: "Kim cương", cls: "bg-cyan-100 text-cyan-700" },
  vang: { label: "Vàng", cls: "bg-yellow-100 text-yellow-700" },
  thuong: { label: "Thường", cls: "bg-gray-100 text-gray-500" },
};

export default function MyPostCard({ post }: Props) {
  const [pending, start] = useTransition();
  const [confirmDel, setConfirmDel] = useState(false);
  const st = computeState(post);
  const tier = tierLabel[post.status ?? "thuong"] ?? tierLabel.thuong;
  const cover = post.anh_bia || (Array.isArray(post.anh?.imgs) ? post.anh?.imgs?.[0] : undefined) || "";
  const loaiLabel = post.loai === "ban" ? "Bán" : post.loai === "cho-thue" ? "Cho thuê" : (post.loai ?? "");
  const diaChi = [post.duong, post.phuong, post.quan].filter(Boolean).join(", ");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
      <Link href={`/tin-dang/${post.id}`} className="relative block h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-48">
        {cover ? (
          <Image src={cover} alt={post.title ?? ""} fill sizes="192px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🏠</div>
        )}
        <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/tin-dang/${post.id}`} className="line-clamp-2 text-base font-bold leading-snug hover:text-brand">
            {post.title || "(Không có tiêu đề)"}
          </Link>
          <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${tier.cls}`}>{tier.label}</span>
        </div>

        <div className="mt-1 text-sm text-gray-500">
          {loaiLabel}{diaChi ? ` • ${diaChi}` : ""}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-semibold text-brand">{formatGia(post.gia)}</span>
          {post.dien_tich ? <span className="text-gray-600">{post.dien_tich}</span> : null}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>Mã tin: <b className="text-gray-700">{post.id}</b></span>
          <span>Ngày đăng: <b className="text-gray-700">{fmtDate(post.created_at)}</b></span>
          <span>Hết hạn: <b className="text-gray-700">{fmtDate(post.ngay_het_han)}</b></span>
          <span>Lượt xem: <b className="text-gray-700">{post.luot_xem ?? 0}</b></span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/dang-tin?id=${post.id}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Sửa</Link>
          <button disabled={pending} onClick={() => start(() => renewPost(post.id))} className="rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-red-50 disabled:opacity-50">Đăng lại</button>
          {st.key !== "da_ha" && (
            <button disabled={pending} onClick={() => start(() => unlistPost(post.id))} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Hạ tin</button>
          )}
          {confirmDel ? (
            <>
              <button disabled={pending} onClick={() => start(() => deletePost(post.id))} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50">Xác nhận xóa</button>
              <button onClick={() => setConfirmDel(false)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">Xóa</button>
          )}
        </div>
      </div>
    </div>
  );
}
