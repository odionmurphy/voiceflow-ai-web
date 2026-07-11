"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  message: string;
  onClose: () => void;
}

export default function InfoModal({ title, message, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
      onClick={onClose}
    >
      <div
        className="modal-in w-full max-w-sm rounded-2xl border border-border bg-panel p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm text-ink-soft">{message}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
