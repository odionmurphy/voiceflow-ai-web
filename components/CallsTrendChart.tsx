"use client";

import { useState } from "react";
import { AnalyticsDay } from "@/lib/types";

const VIEW_W = 720;
const VIEW_H = 200;
const PAD_LEFT = 28;
const PAD_BOTTOM = 20;
const PAD_TOP = 10;
const BAR_MAX_W = 10;
const BAR_GAP = 2; // between the answered/missed pair
const CHART_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

function niceMax(value: number) {
  if (value <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) {
    if (value <= s * pow) return s * pow;
  }
  return 10 * pow;
}

function formatDayLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function CallsTrendChart({ daily }: { daily: AnalyticsDay[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxVal = niceMax(Math.max(1, ...daily.map((d) => Math.max(d.calls_answered, d.calls_missed))));
  const plotW = VIEW_W - PAD_LEFT;
  const groupW = plotW / Math.max(daily.length, 1);
  const barW = Math.min(BAR_MAX_W, (groupW - BAR_GAP - 4) / 2);

  // Show at most ~10 x-axis labels so a 30/90-day range doesn't collide.
  const labelEvery = Math.max(1, Math.ceil(daily.length / 10));
  const gridLines = [0, 0.5, 1];

  const hovered = hoverIndex !== null ? daily[hoverIndex] : null;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-4 text-xs font-medium text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red" /> Missed
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="Calls answered vs missed per day"
      >
        {gridLines.map((t) => {
          const y = PAD_TOP + CHART_H * (1 - t);
          return (
            <g key={t}>
              <line
                x1={PAD_LEFT}
                x2={VIEW_W}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text x={0} y={y + 3} fontSize={9} fill="var(--color-ink-soft)">
                {Math.round(maxVal * t)}
              </text>
            </g>
          );
        })}

        {daily.map((d, i) => {
          const gx = PAD_LEFT + i * groupW;
          const centerX = gx + groupW / 2;
          const answeredH = (d.calls_answered / maxVal) * CHART_H;
          const missedH = (d.calls_missed / maxVal) * CHART_H;
          const baseY = PAD_TOP + CHART_H;
          const isHovered = hoverIndex === i;

          return (
            <g
              key={d.day}
              onPointerEnter={() => setHoverIndex(i)}
              onPointerLeave={() => setHoverIndex((v) => (v === i ? null : v))}
              onFocus={() => setHoverIndex(i)}
              tabIndex={0}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {/* transparent hit area, bigger than the bars themselves */}
              <rect
                x={gx}
                y={PAD_TOP}
                width={groupW}
                height={CHART_H}
                fill="transparent"
              />
              <rect
                x={centerX - barW - BAR_GAP / 2}
                y={baseY - answeredH}
                width={barW}
                height={Math.max(answeredH, 0.5)}
                rx={4}
                fill="var(--color-teal)"
                opacity={isHovered ? 1 : 0.9}
              />
              <rect
                x={centerX + BAR_GAP / 2}
                y={baseY - missedH}
                width={barW}
                height={Math.max(missedH, 0.5)}
                rx={4}
                fill="var(--color-red)"
                opacity={isHovered ? 1 : 0.9}
              />
              {i % labelEvery === 0 && (
                <text
                  x={centerX}
                  y={VIEW_H - 4}
                  fontSize={9}
                  textAnchor="middle"
                  fill="var(--color-ink-soft)"
                >
                  {formatDayLabel(d.day)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-lg border border-border bg-panel px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-ink">{formatDayLabel(hovered.day)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
            <span className="h-1.5 w-4 rounded-full bg-teal" />
            <span className="font-semibold text-ink">{hovered.calls_answered}</span> answered
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-ink-soft">
            <span className="h-1.5 w-4 rounded-full bg-red" />
            <span className="font-semibold text-ink">{hovered.calls_missed}</span> missed
          </p>
        </div>
      )}
    </div>
  );
}
