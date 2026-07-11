"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export type Banner = {
  id: number;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  link: string | null;
};

const GRADIENTS = [
  "linear-gradient(120deg,#0f2b1e,#1c6b45)",
  "linear-gradient(120deg,#1a1a1a,#3a3a3a)",
  "linear-gradient(120deg,#2e1414,#7a2b2b)",
  "linear-gradient(120deg,#12233a,#274b73)",
];

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const items = banners && banners.length > 0 ? banners : [];
  const [idx, setIdx] = useState(0);
  const n = items.length;

  const go = useCallback(
    (d: number) => setIdx((i) => (n === 0 ? 0 : (i + d + n) % n)),
    [n]
  );

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  const b = items[idx];
  const bg = b.image_url
    ? { backgroundImage: `url(${b.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: GRADIENTS[idx % GRADIENTS.length] };

  const Inner = (
    <div
      className="relative flex h-full w-full items-end overflow-hidden rounded-2xl"
      style={bg as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="relative z-10 max-w-2xl p-5 sm:p-8 text-white">
        {b.title ? (
          <h2 className="text-xl font-extrabold leading-tight drop-shadow sm:text-3xl">
            {b.title}
          </h2>
        ) : null}
        {b.subtitle ? (
          <p className="mt-2 text-sm text-white/90 drop-shadow sm:text-base">{b.subtitle}</p>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="relative h-[220px] w-full sm:h-[320px] md:h-[380px]">
        {b.link ? (
          <Link href={b.link} className="block h-full w-full">
            {Inner}
          </Link>
        ) : (
          Inner
        )}

        {n > 1 ? (
          <>
            <button
              type="button"
              aria-label="Trước"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-bold text-gray-800 shadow hover:bg-white"
            >
              &#8249;
            </button>
            <button
              type="button"
              aria-label="Sau"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-bold text-gray-800 shadow hover:bg-white"
            >
              &#8250;
            </button>
          </>
        ) : null}
      </div>

      {n > 1 ? (
        <div className="mt-3 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ảnh ${i + 1}`}
              onClick={() => setIdx(i)}
              className={
                "h-2.5 rounded-full transition-all " +
                (i === idx ? "w-6 bg-brand" : "w-2.5 bg-gray-300 hover:bg-gray-400")
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
