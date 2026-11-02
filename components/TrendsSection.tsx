"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/records-api";
import { Analytics } from "@/lib/types";
import CallsTrendChart from "@/components/CallsTrendChart";

const RANGE_OPTIONS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function percent(value: number | null | undefined) {
  if (value == null) return "–";
  return `${Math.round(value * 100)}%`;
}

function RangeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[13px] text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-display text-[26px] font-medium leading-none tracking-tight text-ink tabular-nums">
        {value}
      </dd>
    </div>
  );
}

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
    <section aria-labelledby="trends-heading" className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-4">
        <h2
          id="trends-heading"
          className="font-display text-[22px] font-medium tracking-tight text-ink"
        >
          How the phone is doing
        </h2>
        <div
          role="group"
          aria-label="Time range"
          className="flex rounded-md border border-border bg-panel p-0.5"
        >
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => setDays(option.days)}
              aria-pressed={days === option.days}
              className={`rounded px-3 py-1.5 text-[13px] transition ${
                days === option.days
                  ? "bg-[#153B45] font-medium text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {data ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            <RangeStat
              label="Calls answered"
              value={percent(data.totals.answerRate)}
            />
            <RangeStat
              label="Appointments booked"
              value={String(data.totals.appointments_total)}
            />
            <RangeStat
              label="No-shows"
              value={percent(data.totals.noShowRate)}
            />
            <RangeStat
              label="Revenue"
              value={euro.format(data.totals.revenue ?? 0)}
            />
          </dl>

          <div className="mt-6 rounded-md border border-border bg-panel p-4">
            <div className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-0.5 w-4 rounded bg-[#1E4E59]"
                />
                Calls
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-0.5 w-4 rounded bg-[#B97A1F]"
                />
                Appointments booked
              </span>
            </div>
            <CallsTrendChart daily={data.daily} />
          </div>
        </>
      ) : (
        <div
          className="mt-5 flex h-[260px] items-center justify-center rounded-md border border-dashed border-border text-[14px] text-ink-soft"
          role={error ? "alert" : "status"}
        >
          {error
            ? "Could not load the numbers. Check your connection and try another range."
            : "Loading…"}
        </div>
      )}
    </section>
  );
}
