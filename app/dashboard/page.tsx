"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBusiness } from "@/lib/business-context";
import { listAppointments, listCalls } from "@/lib/records-api";
import { Appointment, CallRecord } from "@/lib/types";
import TrendsSection from "@/components/TrendsSection";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import CallsListModal from "@/components/CallsListModal";
import RevenueListModal from "@/components/RevenueListModal";
import CreateBusinessModal from "@/components/CreateBusinessModal";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const DAY_MS = 24 * 60 * 60 * 1000;

function timeOf(iso: string | number | Date) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function whenLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now.getTime() - DAY_MS);
  if (sameDay(d, now)) return `Today, ${timeOf(d)}`;
  if (sameDay(d, yesterday)) return `Yesterday, ${timeOf(d)}`;
  return `${d.toLocaleDateString("en-GB", { weekday: "short" })}, ${timeOf(d)}`;
}

function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function compare(
  current: number,
  previous: number,
  higherIsBetter: boolean,
): { text: string; tone: "good" | "bad" | "flat" } {
  const diff = current - previous;
  if (diff === 0) return { text: "Same as yesterday", tone: "flat" };
  const more = diff > 0;
  const text = `${Math.abs(diff)} ${more ? "more" : "fewer"} than yesterday`;
  return { text, tone: more === higherIsBetter ? "good" : "bad" };
}

function isActive(a: Appointment) {
  return a.status !== "cancelled" && a.status !== "no_show";
}

function Figure({
  label,
  value,
  note,
  tone = "flat",
  onClick,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "good" | "bad" | "flat";
  onClick: () => void;
}) {
  const noteColor =
    tone === "good"
      ? "text-[#4A6B50]"
      : tone === "bad"
        ? "text-red"
        : "text-ink-soft";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full px-4 py-4 text-left transition hover:bg-ink/[0.04] first:pl-0 sm:px-6 sm:first:pl-0"
    >
      <span className="block text-[13px] text-ink-soft group-hover:text-ink">
        {label}
      </span>
      <span className="mt-1 block font-display text-[38px] font-medium leading-none tracking-tight text-ink tabular-nums">
        {value}
      </span>
      <span className={`mt-2 block text-[13px] ${noteColor}`}>{note}</span>
    </button>
  );
}

type SheetRow =
  | { kind: "appointment"; appointment: Appointment }
  | { kind: "gap"; minutes: number; from: string }
  | { kind: "now" };

function buildSheet(appointments: Appointment[]): SheetRow[] {
  const sorted = [...appointments].sort((a, b) =>
    a.start_time.localeCompare(b.start_time),
  );
  const now = Date.now();
  const rows: SheetRow[] = [];
  let nowPlaced = false;
  let prevEnd: number | null = null;

  for (const appointment of sorted) {
    const start = new Date(appointment.start_time).getTime();
    const end = new Date(appointment.end_time).getTime();
    const live = isActive(appointment);

    if (live && prevEnd !== null) {
      const gapMin = Math.round((start - prevEnd) / 60000);
      if (gapMin >= 30 && !(nowPlaced === false && now > prevEnd && now < start)) {
        rows.push({
          kind: "gap",
          minutes: gapMin,
          from: timeOf(prevEnd),
        });
      }
    }
    if (!nowPlaced && start > now) {
      rows.push({ kind: "now" });
      nowPlaced = true;
    }
    rows.push({ kind: "appointment", appointment });
    if (live) prevEnd = end;
  }
  if (!nowPlaced) rows.push({ kind: "now" });
  return rows;
}

export default function OverviewPage() {
  const { user } = useAuth();
  const { activeBusiness, loading: bizLoading, refresh } = useBusiness();
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [callsModal, setCallsModal] = useState<{
    title: string;
    calls: CallRecord[];
  } | null>(null);
  const [showRevenueList, setShowRevenueList] = useState(false);
  const sheetRef = useRef<HTMLHeadingElement>(null);

  function load() {
    if (!activeBusiness) return;
    setLoading(true);
    setLoadError(false);
    Promise.all([
      listAppointments(activeBusiness.id),
      listCalls(activeBusiness.id),
    ])
      .then(([appts, callList]) => {
        setAppointments(appts);
        setCalls(callList);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  if (bizLoading) return null;

  if (!activeBusiness) {
    return (
      <div className="max-w-md py-10">
        <h1 className="font-display text-[28px] font-medium tracking-tight text-ink">
          Add your practice
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Praxisline needs a practice before it can answer calls and take
          bookings. It takes about a minute.
        </p>
        <button
          type="button"
          onClick={() => setShowCreateBusiness(true)}
          className="mt-5 rounded-md bg-[#153B45] px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0F2C34]"
        >
          Add a practice
        </button>
        {showCreateBusiness && (
          <CreateBusinessModal
            onClose={() => setShowCreateBusiness(false)}
            onCreated={async () => {
              await refresh();
              setShowCreateBusiness(false);
            }}
          />
        )}
      </div>
    );
  }

  const now = new Date();
  const yesterdayDate = new Date(now.getTime() - DAY_MS);

  const onDay = (iso: string, day: Date) => sameDay(new Date(iso), day);
  const todaysAppointments = appointments.filter((a) =>
    onDay(a.start_time, now),
  );
  const yesterdaysAppointments = appointments.filter((a) =>
    onDay(a.start_time, yesterdayDate),
  );
  const todaysCalls = calls.filter((c) => onDay(c.created_at, now));
  const yesterdaysCalls = calls.filter((c) => onDay(c.created_at, yesterdayDate));

  const answeredCalls = todaysCalls.filter((c) => c.status === "completed");
  const missedCalls = todaysCalls.filter((c) => c.status === "missed");
  const yesterdaysAnswered = yesterdaysCalls.filter(
    (c) => c.status === "completed",
  ).length;
  const yesterdaysMissed = yesterdaysCalls.filter(
    (c) => c.status === "missed",
  ).length;

  const countsAsRevenue = (a: Appointment) =>
    (a.status === "confirmed" || a.status === "completed") && a.price != null;
  const sumPrices = (list: Appointment[]) =>
    list.filter(countsAsRevenue).reduce((sum, a) => {
      const price = Number(a.price ?? 0);
      return sum + (Number.isNaN(price) ? 0 : price);
    }, 0);
  const revenueAppointments = todaysAppointments.filter(countsAsRevenue);
  const revenueToday = sumPrices(todaysAppointments);
  const revenueYesterday = sumPrices(yesterdaysAppointments);

  const activeToday = todaysAppointments.filter(isActive);
  const activeYesterday = yesterdaysAppointments.filter(isActive);
  const bookedByPhoneToday = activeToday.filter(
    (a) => a.source === "ai_call",
  ).length;

  const apptNote = compare(activeToday.length, activeYesterday.length, true);
  const answeredNote = compare(answeredCalls.length, yesterdaysAnswered, true);
  const missedNote =
    missedCalls.length === 0
      ? { text: "Nothing missed", tone: "good" as const }
      : compare(missedCalls.length, yesterdaysMissed, false);
  const revenueDiff = revenueToday - revenueYesterday;
  const revenueNote =
    revenueDiff === 0
      ? { text: "Same as yesterday", tone: "flat" as const }
      : {
          text: `${euro.format(Math.abs(revenueDiff))} ${revenueDiff > 0 ? "more" : "less"} than yesterday`,
          tone: revenueDiff > 0 ? ("good" as const) : ("bad" as const),
        };

  // Missed calls from the past week are what someone still needs to ring back.
  const weekAgo = now.getTime() - 7 * DAY_MS;
  const recentMissed = calls
    .filter(
      (c) => c.status === "missed" && new Date(c.created_at).getTime() >= weekAgo,
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const givenName = user?.full_name?.trim().split(/\s+/)[0];
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const sheet = buildSheet(todaysAppointments);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14px] text-ink-soft">
            {dateLabel}, {activeBusiness.name}
          </p>
          <h1 className="mt-1 font-display text-[34px] font-medium leading-tight tracking-tight text-ink sm:text-[42px]">
            {greeting}
            {givenName ? `, ${givenName}` : ""}
          </h1>
        </div>
        <Link
          href="/dashboard/appointments?new=1"
          className="rounded-md bg-[#153B45] px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0F2C34]"
        >
          Add appointment
        </Link>
      </header>

      {loadError && (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-red/30 bg-red-soft px-4 py-3 text-[14px] text-ink"
        >
          <span>Could not load today&apos;s appointments and calls.</span>
          <button
            type="button"
            onClick={load}
            className="font-medium underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 divide-x divide-ink/15 border-y border-ink/15 lg:grid-cols-4">
        <Figure
          label="Appointments today"
          value={String(activeToday.length)}
          note={
            bookedByPhoneToday > 0
              ? `${bookedByPhoneToday} booked by phone`
              : apptNote.text
          }
          tone={bookedByPhoneToday > 0 ? "flat" : apptNote.tone}
          onClick={() =>
            sheetRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        />
        <Figure
          label="Calls answered"
          value={String(answeredCalls.length)}
          note={answeredNote.text}
          tone={answeredNote.tone}
          onClick={() =>
            setCallsModal({ title: "Calls answered today", calls: answeredCalls })
          }
        />
        <Figure
          label="Missed calls"
          value={String(missedCalls.length)}
          note={missedNote.text}
          tone={missedNote.tone}
          onClick={() =>
            setCallsModal({ title: "Missed calls today", calls: missedCalls })
          }
        />
        <Figure
          label="Revenue today"
          value={euro.format(revenueToday)}
          note={revenueNote.text}
          tone={revenueNote.tone}
          onClick={() => setShowRevenueList(true)}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
        <section aria-labelledby="sheet-heading" className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              ref={sheetRef}
              id="sheet-heading"
              className="scroll-mt-6 font-display text-[22px] font-medium tracking-tight text-ink"
            >
              Today&apos;s schedule
            </h2>
            <Link
              href="/dashboard/calendar"
              className="text-[14px] font-medium text-amber-deep underline-offset-2 hover:underline"
            >
              Open calendar
            </Link>
          </div>

          <div className="mt-4 rounded-md border border-border bg-panel">
            {loading ? (
              <div
                className="space-y-4 p-5"
                role="status"
                aria-label="Loading today's schedule"
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex animate-pulse gap-4">
                    <div className="h-4 w-12 rounded bg-border" />
                    <div className="h-4 flex-1 rounded bg-border" />
                  </div>
                ))}
              </div>
            ) : todaysAppointments.length === 0 ? (
              <div className="px-6 py-12">
                <p className="font-display text-[20px] font-medium text-ink">
                  Nothing booked for today
                </p>
                <p className="mt-1 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                  Appointments made by phone or by your team show up here as
                  they come in.
                </p>
                <Link
                  href="/dashboard/appointments"
                  className="mt-4 inline-block text-[14px] font-medium text-amber-deep underline underline-offset-2"
                >
                  Add an appointment
                </Link>
              </div>
            ) : (
              <ol className="py-2">
                {sheet.map((row, i) => {
                  if (row.kind === "now") {
                    return (
                      <li
                        key={`now-${i}`}
                        className="flex items-center gap-3 px-5 py-1.5"
                        aria-label={`Now, ${timeOf(now)}`}
                      >
                        <span className="w-12 shrink-0 text-right text-[12px] font-medium text-amber-deep tabular-nums">
                          {timeOf(now)}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full bg-amber"
                        />
                        <span
                          aria-hidden="true"
                          className="h-px flex-1 bg-amber/70"
                        />
                      </li>
                    );
                  }
                  if (row.kind === "gap") {
                    return (
                      <li
                        key={`gap-${i}`}
                        className="flex items-center gap-3 px-5 py-2.5"
                      >
                        <span className="w-12 shrink-0" />
                        <span
                          aria-hidden="true"
                          className="mx-[3px] h-5 w-0 shrink-0 border-l border-dashed border-ink/25"
                        />
                        <span className="text-[13px] text-ink-soft">
                          Free for {durationLabel(row.minutes)} from {row.from}
                        </span>
                      </li>
                    );
                  }
                  const a = row.appointment;
                  const faded = !isActive(a);
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(a)}
                        className="flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-ink/[0.04]"
                      >
                        <span
                          className={`w-12 shrink-0 pt-px text-right text-[15px] font-medium tabular-nums ${faded ? "text-ink-soft" : "text-ink"}`}
                        >
                          {timeOf(a.start_time)}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${faded ? "border border-ink/30" : "bg-[#1E4E59]"}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate text-[15px] font-medium ${faded ? "text-ink-soft line-through" : "text-ink"}`}
                          >
                            {a.customer_name ?? "New patient"}
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] text-ink-soft">
                            {a.service_name ?? "Appointment"} until{" "}
                            {timeOf(a.end_time)}
                            {a.source === "ai_call" && (
                              <span className="ml-2 rounded-sm bg-amber-soft px-1.5 py-0.5 text-[12px] text-amber-deep">
                                Booked by phone
                              </span>
                            )}
                          </span>
                        </span>
                        {a.status !== "confirmed" && (
                          <span
                            className={`shrink-0 text-[13px] capitalize ${
                              a.status === "pending"
                                ? "text-amber-deep"
                                : a.status === "completed"
                                  ? "text-[#4A6B50]"
                                  : "text-red"
                            }`}
                          >
                            {a.status.replace("_", " ")}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>

        <section aria-labelledby="callback-heading" className="min-w-0">
          <h2
            id="callback-heading"
            className="font-display text-[22px] font-medium tracking-tight text-ink"
          >
            Needs a call back
          </h2>
          <p className="mt-1 text-[14px] text-ink-soft">
            Calls nobody picked up in the last 7 days.
          </p>

          {loading ? (
            <div
              className="mt-4 space-y-3"
              role="status"
              aria-label="Loading missed calls"
            >
              {[0, 1].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-border" />
              ))}
            </div>
          ) : recentMissed.length === 0 ? (
            <p className="mt-4 border-t border-ink/15 pt-4 text-[15px] leading-relaxed text-ink-soft">
              No missed calls this week. Every caller got through.
            </p>
          ) : (
            <>
              <ul className="mt-3 border-t border-ink/15">
                {recentMissed.slice(0, 5).map((c) => (
                  <li key={c.id} className="border-b border-border py-3">
                    <p className="text-[15px] font-medium tabular-nums text-ink">
                      {c.caller_number ?? "Unknown number"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-soft">
                      {whenLabel(c.created_at)}
                      {c.intent ? `, asked about ${c.intent}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
              {recentMissed.length > 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setCallsModal({
                      title: "Missed calls this week",
                      calls: recentMissed,
                    })
                  }
                  className="mt-3 text-[14px] font-medium text-amber-deep underline-offset-2 hover:underline"
                >
                  See all {recentMissed.length}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      <div className="mt-12">
        <TrendsSection businessId={activeBusiness.id} />
      </div>

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onRemoved={() => {
            const cancelledId = selectedAppointment.id;
            setAppointments((prev) => prev.filter((a) => a.id !== cancelledId));
            setSelectedAppointment(null);
          }}
          onRescheduled={() => {
            setSelectedAppointment(null);
            load();
          }}
        />
      )}

      {callsModal && (
        <CallsListModal
          title={callsModal.title}
          calls={callsModal.calls}
          onClose={() => setCallsModal(null)}
        />
      )}

      {showRevenueList && (
        <RevenueListModal
          title="Revenue today"
          appointments={revenueAppointments}
          onClose={() => setShowRevenueList(false)}
        />
      )}
    </div>
  );
}
