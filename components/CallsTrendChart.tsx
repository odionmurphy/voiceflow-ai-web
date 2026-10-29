"use client";

import { useState } from "react";
import { AnalyticsDay } from "@/lib/types";

const VIEW_W = 720;
const VIEW_H = 230;
const PAD_LEFT = 0;
const PAD_BOTTOM = 24;
const PAD_TOP = 10;
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
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function CallsTrendChart({ daily }: { daily: AnalyticsDay[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxVal = niceMax(
    Math.max(
      1,
      ...daily.map((d) =>
        Math.max(d.calls_answered + d.calls_missed, d.appointments_booked),
      ),
    ),
  );
  const plotW = VIEW_W - PAD_LEFT;
  const groupW = plotW / Math.max(daily.length, 1);
  // Keep labels comfortably spaced across the 7/30/90-day ranges.
  const labelEvery = Math.max(1, Math.ceil(daily.length / 12));
  const gridLines = [0, 0.5, 1];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="Calls and appointments booked per day"
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
            </g>
          );
        })}

        {/* Build area and lines for total calls and appointments booked. */}
        {(() => {
          const callsPoints: { x: number; y: number }[] = [];
          const bookedPoints: { x: number; y: number }[] = [];
          const baseY = PAD_TOP + CHART_H;
          daily.forEach((d, i) => {
            const gx = PAD_LEFT + i * groupW;
            const centerX = gx + groupW / 2;
            const callsH = ((d.calls_answered + d.calls_missed) / maxVal) * CHART_H;
            const bookedH = (d.appointments_booked / maxVal) * CHART_H;
            callsPoints.push({ x: centerX, y: baseY - callsH });
            bookedPoints.push({ x: centerX, y: baseY - bookedH });
          });

          function pathFromPoints(points: { x: number; y: number }[]) {
            if (points.length === 0) return "";
            if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
            let path = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i += 1) {
              const current = points[i];
              const next = points[i + 1];
              const middleX = (current.x + next.x) / 2;
              const middleY = (current.y + next.y) / 2;
              path += ` Q ${current.x} ${current.y} ${middleX} ${middleY}`;
            }
            const last = points[points.length - 1];
            return `${path} T ${last.x} ${last.y}`;
          }

          const callsPath = pathFromPoints(callsPoints);
          const bookedPath = pathFromPoints(bookedPoints);

          const callsArea = callsPoints.length
            ? `${callsPath} L ${callsPoints[callsPoints.length - 1].x} ${baseY} L ${callsPoints[0].x} ${baseY} Z`
            : "";

          const bookedArea = bookedPoints.length
            ? `${bookedPath} L ${bookedPoints[bookedPoints.length - 1].x} ${baseY} L ${bookedPoints[0].x} ${baseY} Z`
            : "";

          return (
            <g>
              <defs>
                <linearGradient id="grad-calls" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-booked" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#27b797" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#27b797" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* areas */}
              {callsArea && (
                <path d={callsArea} fill="url(#grad-calls)" stroke="none" />
              )}
              {bookedArea && (
                <path d={bookedArea} fill="url(#grad-booked)" stroke="none" />
              )}

              {/* lines */}
              {callsPath && (
                <path
                  d={callsPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                />
              )}
              {bookedPath && (
                <path
                  d={bookedPath}
                  fill="none"
                  stroke="#27b797"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                />
              )}

              {/* interactive points and labels */}
              {daily.map((d, i) => {
                const gx = PAD_LEFT + i * groupW;
                const centerX = gx + groupW / 2;
                const callsH = ((d.calls_answered + d.calls_missed) / maxVal) * CHART_H;
                const bookedH = (d.appointments_booked / maxVal) * CHART_H;
                const callsY = baseY - callsH;
                const bookedY = baseY - bookedH;
                const isHovered = hoverIndex === i;
                return (
                  <g
                    key={d.day}
                    onPointerEnter={() => setHoverIndex(i)}
                    onPointerLeave={() =>
                      setHoverIndex((v) => (v === i ? null : v))
                    }
                    onFocus={() => setHoverIndex(i)}
                    tabIndex={0}
                    style={{ cursor: "pointer", outline: "none" }}
                  >
                    <rect
                      x={gx}
                      y={PAD_TOP}
                      width={groupW}
                      height={CHART_H}
                      fill="transparent"
                    />
                    {isHovered && (
                      <>
                        <circle cx={centerX} cy={callsY} r={4} fill="#3b82f6" stroke="white" strokeWidth={2} />
                        <circle cx={centerX} cy={bookedY} r={4} fill="#27b797" stroke="white" strokeWidth={2} />
                      </>
                    )}

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

              {/* Hover guide and compact chart tooltip. */}
              {hoverIndex !== null &&
                (() => {
                  const gx = PAD_LEFT + hoverIndex * groupW;
                  const centerX = gx + groupW / 2;
                  const point = daily[hoverIndex];
                  const callsY = PAD_TOP + CHART_H - ((point.calls_answered + point.calls_missed) / maxVal) * CHART_H;
                  const tooltipX = centerX > VIEW_W * 0.72 ? centerX - 112 : centerX + 10;
                  const tooltipY = Math.max(PAD_TOP + 5, callsY - 68);
                  return (
                    <g pointerEvents="none">
                      <line
                        x1={centerX}
                        x2={centerX}
                        y1={PAD_TOP}
                        y2={PAD_TOP + CHART_H}
                        stroke="var(--color-border)"
                        strokeWidth={1}
                        strokeDasharray="3 4"
                      />
                      <g>
                        <rect x={tooltipX} y={tooltipY} width={102} height={82} rx={10} fill="white" stroke="#ebe7e2" />
                        <text x={tooltipX + 10} y={tooltipY + 18} fontSize={11} fill="#171b20">{formatDayLabel(point.day)}</text>
                        <text x={tooltipX + 10} y={tooltipY + 42} fontSize={11} fill="#3b82f6">calls : {point.calls_answered + point.calls_missed}</text>
                        <text x={tooltipX + 10} y={tooltipY + 65} fontSize={11} fill="#27b797">booked : {point.appointments_booked}</text>
                      </g>
                    </g>
                  );
                })()}
            </g>
          );
        })()}
      </svg>

    </div>
  );
}
