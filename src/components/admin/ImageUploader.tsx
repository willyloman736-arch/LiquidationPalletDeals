"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/admin/actions";

export function ImageUploader({ name = "images", initial = [] }: { name?: string; initial?: string[] }) {
  const [images, setImages] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError(null);
    setBusy(true);
    for (const file of files) {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadImage(fd);
      if (res.error) {
        setError(res.error);
        break;
      }
      if (res.url) setImages((p) => [...p, res.url as string]);
    }
    setBusy(false);
  }

  const remove = (u: string) => setImages((p) => p.filter((x) => x !== u));
  const makeMain = (u: string) => setImages((p) => [u, ...p.filter((x) => x !== u)]);

  return (
    <div>
      {images.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((u, i) => (
            <div key={u} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-100 ring-1 ring-ink-200">
              <Image src={u} alt="" fill sizes="120px" className="object-cover" />
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-brand-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Main
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeMain(u)}
                  className="absolute left-1 top-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  Set main
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(u)}
                aria-label="Remove image"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink-900/70 text-white opacity-0 transition group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-ink-200">
        <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" disabled={busy} />
        {busy ? "Uploading…" : images.length ? "Add more photos" : "Upload photos"}
      </label>

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <p className="mt-1 text-xs text-ink-500">The first image is the main photo. JPEG/PNG/WebP, up to 8 MB each.</p>
    </div>
  );
}
