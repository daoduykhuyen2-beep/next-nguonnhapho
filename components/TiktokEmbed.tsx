"use client";

// Trich ID video tu nhieu dang link TikTok:
// https://www.tiktok.com/@user/video/1234567890123456789
function layVideoId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/);
  if (m) return m[1];
  const m2 = url.match(/(\d{15,25})/);
  return m2 ? m2[1] : null;
}

// Phat hien video tu file tai len (Supabase Storage) hoac duoi file video.
function laVideoTaiLen(url: string): boolean {
  if (/tiktok\.com/i.test(url)) return false;
  if (/\/storage\/v1\/object\/public\//i.test(url)) return true;
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

export default function TiktokEmbed({ url, title }: { url: string; title?: string | null }) {
  const uploaded = laVideoTaiLen(url);
  const id = uploaded ? null : layVideoId(url);
  return (
    <div className="overflow-hidden rounded-xl border bg-black">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {uploaded ? (
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-black"
          />
        ) : id ? (
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
            Link video khong hop le
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
