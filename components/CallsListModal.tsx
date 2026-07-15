"use client";

import { useEffect, useState } from "react";
import { CallRecord } from "@/lib/types";

interface Props {
  title: string;
  calls: CallRecord[];
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-teal-soft text-teal",
  missed: "bg-red-soft text-red",
  failed: "bg-amber-soft text-amber-deep",
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Transcript is stored as "role: text" lines (see voice-service's logCall) - split each
// line into its speaker so the full transcript can render as a conversation instead of
// a single wall of text.
function parseTranscript(transcript: string) {
  return transcript.split("\n").map((line, i) => {
    const idx = line.indexOf(": ");
    if (idx === -1) return { role: "assistant" as const, text: line, key: i };
    const role = line.slice(0, idx).trim();
    return { role: role === "caller" ? ("caller" as const) : ("assistant" as const), text: line.slice(idx + 2), key: i };
  });
}

export default function CallsListModal({ title, calls, onClose }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sorted = [...calls].sort((a, b) => b.created_at.localeCompare(a.created_at));

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
          <p className="mt-5 text-sm text-ink-soft">No calls yet today.</p>
        ) : (
          <div className="mt-5 space-y-2 overflow-y-auto">
            {sorted.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium text-ink">
                    {c.caller_number ?? "Unknown number"}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      STATUS_STYLES[c.status]
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-ink-soft">
                  <span>
                    {new Date(c.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>·</span>
                  <span>{formatDuration(c.duration_seconds)}</span>
                  {c.intent && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{c.intent}</span>
                    </>
                  )}
                </div>
                {c.summary && (
                  <p className="mt-2 text-xs font-medium text-ink">{c.summary}</p>
                )}
                {c.transcript && (
                  <>
                    {expandedId === c.id ? (
                      <div className="mt-2 space-y-1.5">
                        {parseTranscript(c.transcript).map((turn) => (
                          <div
                            key={turn.key}
                            className={`rounded-lg px-2.5 py-1.5 text-xs ${
                              turn.role === "caller"
                                ? "bg-teal-soft text-ink"
                                : "bg-paper text-ink"
                            }`}
                          >
                            <span className="font-semibold capitalize">
                              {turn.role === "caller" ? "Caller" : "AI"}:
                            </span>{" "}
                            {turn.text}
                          </div>
                        ))}
                        <button
                          onClick={() => setExpandedId(null)}
                          className="mt-1 text-xs font-medium text-navy hover:underline"
                        >
                          Hide transcript
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-xs text-ink-soft">{c.transcript}</p>
                        <button
                          onClick={() => setExpandedId(c.id)}
                          className="shrink-0 text-xs font-medium text-navy hover:underline"
                        >
                          View full
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
