"use client";

import { useState, useTransition } from "react";
import { toggleLeadRead, deleteLead } from "@/app/actions/leads";
import { showToast } from "@/components/Toast";

type Lead = {
  id: number;
  post_id: number | null;
  name: string | null;
  phone: string;
  note: string | null;
  is_read: boolean;
  created_at: string;
};

export default function LeadRow({
  lead,
  postTitle,
}: {
  lead: Lead;
  postTitle: string | null;
}) {
  const [read, setRead] = useState(lead.is_read);
  const [removed, setRemoved] = useState(false);
  const [pending, startTransition] = useTransition();

  if (removed) return null;

  const date = new Date(lead.created_at).toLocaleString("vi-VN");

  function onToggle() {
    const next = !read;
    setRead(next);
    startTransition(async () => {
      await toggleLeadRead(lead.id, next);
    });
  }

  function onDelete() {
    if (!confirm("Xoa khach hang nay khoi danh sach?")) return;
    setRemoved(true);
    startTransition(async () => {
      await deleteLead(lead.id);
      showToast("Đã xoá khách hàng khỏi danh sách", "success");
    });
  }

  return (
    <div
      className={
        "rounded-xl border p-4 " +
        (read ? "border-gray-200 bg-white" : "border-brand/40 bg-brand/5")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {lead.name || "Khach hang"}
            </span>
            {!read && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                Moi
              </span>
            )}
          </div>
          <a
            href={`tel:${lead.phone}`}
            className="mt-1 block text-lg font-bold text-brand"
          >
            {lead.phone}
          </a>
          {lead.note && (
            <p className="mt-1 text-sm text-gray-600">{lead.note}</p>
          )}
          {postTitle && (
            <p className="mt-1 line-clamp-1 text-xs text-gray-400">
              Tin: {postTitle}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">{date}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="rounded-lg bg-brand px-3 py-1.5 text-center text-xs font-semibold text-white"
          >
            Goi
          </a>
          <button
            onClick={onToggle}
            disabled={pending}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50"
          >
            {read ? "Danh dau chua doc" : "Danh dau da doc"}
          </button>
          <button
            onClick={onDelete}
            disabled={pending}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
          >
            Xoa
          </button>
        </div>
      </div>
    </div>
  );
}
