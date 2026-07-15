"use client";

// Trích ID video từ nhiều dạng link TikTok:
// https://www.tiktok.com/@user/video/1234567890123456789
// https://www.tiktok.com/t/xxxx / https://vt.tiktok.com/xxxx (link rút gọn - dùng blockquote)
function layVideoId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/);
  if (m) return m[1];
  const m2 = url.match(/(\d{15,25})/);
  return m2 ? m2[1] : null;
}

export default function TiktokEmbed({ url, title }: { url: string; title?: string | null }) {
  const id = layVideoId(url);
  return (
    <div className="overflow-hidden rounded-xl border bg-black">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {id ? (
          <iframe
            src={`https://www.tiktok.com/player/v1/${id}?music_info=1&description=1`}
            title={title || "TikTok video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
            Link video không hợp lệ
          </div>
        )}
      </div>
      {title ? (
        <div className="bg-white p-3">
          <h3 className="line-clamp-2 font-semibold text-gray-900">{title}</h3>
        </div>
      ) : null}
    </div>
  );
}
