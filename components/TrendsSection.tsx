"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/records-api";
import { Analytics } from "@/lib/types";
import StatCard from "@/components/StatCard";
import CallsTrendChart from "@/components/CallsTrendChart";

const RANGE_OPTIONS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

function formatPercent(rate: number | null) {
  if (rate === null) return "—";
  return `${Math.round(rate * 100)}%`;
}

export default function TrendsSection({ businessId }: { businessId: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnalytics(businessId, days)
      .then(setData)
      // Refetch keeps the previous render up while loading, so don't clear `data` here.
      .finally(() => setLoading(false));
  }, [businessId, days]);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Trends</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setDays(opt.days)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                days === opt.days
                  ? "bg-navy text-white"
                  : "text-ink-soft hover:bg-paper"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <p className="mt-4 rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
          Loading...
        </p>
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Calls answered"
              value={String(data.totals.calls_answered)}
              note={`of ${data.totals.calls_total} total`}
              icon="📞"
              tone="teal"
            />
            <StatCard
              label="Answer rate"
              value={formatPercent(data.totals.answerRate)}
              icon="🎯"
              tone="navy"
            />
            <StatCard
              label="Appointments booked"
              value={String(data.totals.appointments_total)}
              icon="📅"
              tone="navy"
            />
            <StatCard
              label="No-show rate"
              value={formatPercent(data.totals.noShowRate)}
              icon="⚠️"
              tone={data.totals.noShowRate && data.totals.noShowRate > 0.1 ? "red" : "navy"}
            />
            <StatCard
              label="Revenue"
              value={`$${Number(data.totals.revenue ?? 0).toFixed(2)}`}
              note="Confirmed + completed"
              icon="💰"
              tone="amber"
            />
          </div>

          <div className="mt-4 rounded-xl border border-border bg-panel p-5">
            <CallsTrendChart daily={data.daily} />
          </div>
        </div>
      )}
    </div>
  );
}
