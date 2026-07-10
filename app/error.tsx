"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
      <p className="mt-2 text-gray-500">
        Xin lỗi vì sự bất tiện. Vui lòng thử lại.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-block rounded-lg bg-brand px-6 py-2 font-semibold text-white"
      >
        Thử lại
      </button>
    </div>
  );
}
