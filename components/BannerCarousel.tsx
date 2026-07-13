"use client";

import { useEffect, useState } from "react";

type Banner = {
  id: number;
  title: string | null;
  image_url: string;
  link_url: string | null;
};

export default function BannerCarousel({
  banners,
  interval = 4000,
  heightClass = "h-40 sm:h-56 md:h-64",
  chromeless = false,
}: {
  banners: Banner[];
  interval?: number;
  heightClass?: string;
  chromeless?: boolean;
}) {
  // Chỉ lấy tối đa 5 ảnh
  const items = (banners || []).slice(0, 5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  if (items.length === 0) return null;

  const go = (i: number) => setIndex(((i % items.length) + items.length) % items.length);

  return (
    <div
      className={
        chromeless
          ? "relative h-full w-full overflow-hidden"
          : "relative mb-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
      }
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((b) => {
          const img = (
            <img
              src={b.image_url}
              alt={b.title || "Banner quảng cáo"}
              className={`w-full flex-shrink-0 object-cover ${heightClass}`}
              style={{ minWidth: "100%" }}
            />
          );
          return b.link_url ? (
            <a
              key={b.id}
              href={b.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full flex-shrink-0"
              style={{ minWidth: "100%" }}
            >
              {img}
            </a>
          ) : (
            <div key={b.id} className="h-full w-full flex-shrink-0" style={{ minWidth: "100%" }}>
              {img}
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white transition hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white transition hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Chuyển tới ảnh ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
