"use client";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveHomeVideo, type HomeVideoState } from "@/app/actions/home-video";
import { uploadHomeVideo } from "@/lib/upload";

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Dang luu..." : label}
    </button>
  );
}

export default function HomeVideoForm() {
  const [state, formAction] = useActionState<HomeVideoState, FormData>(saveHomeVideo, {});
  const [mode, setMode] = useState<"link" | "upload">("link");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadErr(null);
    setUploading(true);
    setVideoUrl("");
    try {
      const url = await uploadHomeVideo(f);
      setVideoUrl(url);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Tai video that bai.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-white p-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold ${mode === "link" ? "border-brand bg-brand text-white" : "hover:border-brand"}`}
        >
          Dan link TikTok
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold ${mode === "upload" ? "border-brand bg-brand text-white" : "hover:border-brand"}`}
        >
          Tai video len
        </button>
      </div>

      {mode === "link" ? (
        <div>
          <label className="mb-1 block text-sm font-medium">Link video TikTok</label>
          <input
            name="tiktok_url"
            placeholder="https://www.tiktok.com/@user/video/1234567890"
            className="w-full rounded-lg border px-4 py-3"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mo video tren TikTok, bam Chia se, Sao chep lien ket roi dan vao day.
          </p>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium">Tep video (mp4, webm, mov - toi da 50MB)</label>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFile}
            className="w-full rounded-lg border px-4 py-3"
          />
          {/* URL video sau khi upload duoc gui qua truong an nay */}
          <input type="hidden" name="tiktok_url" value={videoUrl} />
          {uploading ? <p className="mt-1 text-xs text-brand">Dang tai video len...</p> : null}
          {videoUrl ? <p className="mt-1 text-xs text-green-600">Da tai video len. Bam Them video de luu.</p> : null}
          {uploadErr ? <p className="mt-1 text-xs text-red-600">{uploadErr}</p> : null}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Tieu de (khong bat buoc)</label>
        <input name="title" className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Thu tu hien thi</label>
        <input name="sort_order" type="number" defaultValue={0} className="w-full rounded-lg border px-4 py-3" />
        <p className="mt-1 text-xs text-gray-500">So nho hon se hien thi truoc.</p>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Da them video.</p> : null}
      <Save label={mode === "upload" && uploading ? "Dang tai..." : "Them video"} />
    </form>
  );
}
