"use client";

import { useState } from "react";

export default function MapView({
  query,
  linkSrc,
  mapsKey,
}: {
  query: string;
  linkSrc: string;
  mapsKey: string;
}) {
  const [satellite, setSatellite] = useState(false);
  const base = `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${query}&zoom=16&language=vi&region=VN`;
  const src = satellite ? `${base}&maptype=satellite` : base;
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-gray-50 px-3 py-2">
        <div className="inline-flex overflow-hidden rounded-lg border text-xs">
          <button
            type="button"
            onClick={() => setSatellite(false)}
            className={`px-3 py-1 font-medium ${!satellite ? "bg-brand text-white" : "bg-white text-gray-600"}`}
          >
            Bản đồ
          </button>
          <button
            type="button"
            onClick={() => setSatellite(true)}
            className={`px-3 py-1 font-medium ${satellite ? "bg-brand text-white" : "bg-white text-gray-600"}`}
          >
            Vệ tinh
          </button>
        </div>
        <a
          href={linkSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-brand underline"
        >
          Chỉ đường →
        </a>
      </div>
      <iframe
        title="Bản đồ vị trí"
        className="w-full"
        height="400"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />
    </div>
  );
}
