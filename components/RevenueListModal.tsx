"use client";

import { useEffect } from "react";
import { Appointment } from "@/lib/types";

interface Props {
  title: string;
  appointments: Appointment[];
  onClose: () => void;
}

export default function RevenueListModal({ title, appointments, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sorted = [...appointments].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const total = sorted.reduce((sum, a) => sum + (a.price ?? 0), 0);

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
      onClick={onClose}
    >
      <div
        className="modal-in flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="mt-5 text-sm text-ink-soft">No priced appointments yet.</p>
        ) : (
          <>
            <div className="mt-5 space-y-2 overflow-y-auto">
              {sorted.map((a) => (
                <div key={a.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium text-ink">
                      {a.customer_name ?? "Unknown customer"}
                    </span>
                    <span className="shrink-0 font-display font-semibold text-amber-deep">
                      ${(a.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-ink-soft">
                    <span>
                      {new Date(a.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {a.service_name && (
                      <>
                        <span>·</span>
                        <span>{a.service_name}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-ink-soft">Total</span>
              <span className="font-display text-lg font-semibold text-ink">
                ${total.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
