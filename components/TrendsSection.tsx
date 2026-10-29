"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/records-api";
import { Analytics } from "@/lib/types";
import CallsTrendChart from "@/components/CallsTrendChart";

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

export default function TrendsSection({ businessId }: { businessId: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getAnalytics(businessId, days)
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [businessId, days]);

  return (
    <section
      className="dashboard-card min-w-0 rounded-[20px] p-5 sm:p-6"
      aria-labelledby="trends-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="trends-heading"
            className="font-display text-base font-bold tracking-tight text-ink sm:text-lg"
          >
            Call &amp; booking trends
          </h2>
          <p className="mt-1 text-[11px] text-ink-soft sm:text-xs">
            {data
              ? `${Math.round((data.totals.answerRate ?? 0) * 100)}% answer rate · ${data.totals.appointments_total} bookings by AI`
              : "Track calls and appointments over time"}
          </p>
        </div>
        <div
          className="flex items-center gap-0.5 rounded-full bg-[#f2efeb] p-1"
          aria-label="Select trend period"
        >
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => setDays(option.days)}
              aria-pressed={days === option.days}
              className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition sm:px-3 ${days === option.days ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {data ? (
        <div className="mt-4 border-t border-border pt-4">
          <CallsTrendChart daily={data.daily} />
        </div>
      ) : (
        <div
          className="mt-5 flex h-[230px] items-center justify-center rounded-2xl bg-[#faf9f7] text-xs text-ink-soft"
          role={error ? "alert" : "status"}
        >
          {error
            ? "Could not load trends. Please try again."
            : "Loading trends…"}
        </div>
      )}
    </section>
  );
}
