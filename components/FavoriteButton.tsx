"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/favorites";
import { showToast } from "@/components/Toast";

export default function FavoriteButton({
  postId,
  initialSaved = false,
  className = "",
}: {
  postId: number;
  initialSaved?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    startTransition(async () => {
      const res = await toggleFavorite(postId);
      if (res.error) {
        if (res.error === "Ban can dang nhap.") {
          router.push("/dang-nhap");
          return;
        }
        showToast(res.error, "error");
        return;
      }
      setSaved(Boolean(res.saved));
      showToast(
        res.saved ? "Đã thêm vào danh sách quan tâm" : "Đã bỏ khỏi danh sách quan tâm",
        "success"
      );
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      aria-label={saved ? "Bo luu tin" : "Luu tin"}
      title={saved ? "Bo luu tin" : "Luu tin"}
      className={`inline-flex items-center justify-center rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-50 ${className}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={saved ? "#e11d48" : "none"}
        stroke={saved ? "#e11d48" : "#6b7280"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
