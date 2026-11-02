"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import { ApiError } from "@/lib/api";
import { listAppointments } from "@/lib/records-api";
import { Appointment } from "@/lib/types";
import { useBusiness } from "@/lib/business-context";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const NO_APPOINTMENTS: Appointment[] = [];

function dateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(value: string, amount: number) {
  const [year, month] = value.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

function calendarDateKeys(value: string) {
  const [year, month] = value.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
  const start = Date.UTC(year, month - 1, 1 - mondayOffset);

  return Array.from({ length: 42 }, (_, index) =>
    new Date(start + index * DAY_MS).toISOString().slice(0, 10),
  );
}

function monthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function dayNumber(value: string) {
  return Number(value.slice(-2));
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  confirmed: "border-teal/20 bg-teal-soft text-teal",
  pending: "border-amber/20 bg-amber-soft text-amber-deep",
  completed: "border-teal/20 bg-teal-soft text-teal",
  cancelled: "border-red/20 bg-red-soft text-red",
  no_show: "border-red/20 bg-red-soft text-red",
};

export default function CalendarPage() {
  const { activeBusiness } = useBusiness();
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadResult, setLoadResult] = useState<{
    key: string;
    appointments: Appointment[];
    error?: string;
  } | null>(null);
  const timeZone = activeBusiness?.timezone || "UTC";
  const requestKey = activeBusiness
    ? `${activeBusiness.id}:${month}:${reloadKey}`
    : "";
  const currentResult =
    loadResult?.key === requestKey ? loadResult : null;
  const appointments = currentResult?.appointments ?? NO_APPOINTMENTS;
  const loading = Boolean(activeBusiness) && !currentResult;
  const error = currentResult?.error ?? null;
  const days = useMemo(() => calendarDateKeys(month), [month]);
  const today = dateKeyInTimeZone(new Date(), timeZone);
  const appointmentsByDay = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const key = dateKeyInTimeZone(new Date(appointment.start_time), timeZone);
      const existing = grouped.get(key) ?? [];
      existing.push(appointment);
      grouped.set(key, existing);
    }
    return grouped;
  }, [appointments, timeZone]);

  useEffect(() => {
    if (!activeBusiness) return;

    let cancelled = false;
    const [year, monthNumber] = month.split("-").map(Number);
    const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1));
    const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
    const gridStart = Date.UTC(year, monthNumber - 1, 1 - mondayOffset);
    const from = new Date(gridStart - DAY_MS).toISOString();
    const to = new Date(gridStart + 43 * DAY_MS).toISOString();

    listAppointments(activeBusiness.id, from, to)
      .then((data) => {
        if (!cancelled) setLoadResult({ key: requestKey, appointments: data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadResult({
          key: requestKey,
          appointments: [],
          error:
            err instanceof ApiError
              ? err.message
              : "Could not load calendar appointments.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [activeBusiness, month, reloadKey, requestKey]);

  if (!activeBusiness) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Calendar</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Appointments shown in {activeBusiness.timezone || "your local time"}.
          </p>
        </div>
        <Link
          href="/dashboard/appointments"
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Manage appointments
        </Link>
      </div>

      <section
        aria-label={`${monthLabel(month)} appointments`}
        className="mt-6 overflow-hidden rounded-xl border border-border bg-panel"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="font-display text-lg font-semibold text-ink" aria-live="polite">
            {monthLabel(month)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonth((value) => shiftMonth(value, -1))}
              aria-label="Previous month"
              className="rounded-lg border border-border px-3 py-2 text-sm text-ink hover:bg-paper"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setMonth(today.slice(0, 7))}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-paper"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setMonth((value) => shiftMonth(value, 1))}
              aria-label="Next month"
              className="rounded-lg border border-border px-3 py-2 text-sm text-ink hover:bg-paper"
            >
              Next
            </button>
          </div>
        </div>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-red-soft/40 px-4 py-3 text-sm text-red">
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-border bg-paper/60">
              {WEEKDAYS.map((weekday) => (
                <div
                  key={weekday}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft"
                >
                  {weekday}
                </div>
              ))}
            </div>
            {loading ? (
              <div className="grid min-h-64 place-items-center text-sm text-ink-soft" role="status">
                Loading calendar…
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const inMonth = day.startsWith(`${month}-`);
                  const dayAppointments = appointmentsByDay.get(day) ?? [];
                  return (
                    <div
                      key={day}
                      className={`min-h-32 border-b border-r border-border p-2 ${
                        inMonth ? "bg-panel" : "bg-paper/40"
                      }`}
                    >
                      <time
                        dateTime={day}
                        className={`mb-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm ${
                          day === today
                            ? "bg-navy font-semibold text-white"
                            : inMonth
                              ? "text-ink"
                              : "text-ink-soft/60"
                        }`}
                      >
                        {dayNumber(day)}
                      </time>
                      <div className="max-h-28 space-y-1 overflow-y-auto">
                        {dayAppointments.map((appointment) => {
                          const time = new Intl.DateTimeFormat("en-GB", {
                            timeZone,
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(appointment.start_time));
                          const customer = appointment.customer_name ?? "Unknown customer";
                          return (
                            <button
                              key={appointment.id}
                              type="button"
                              title={`${time} · ${customer} · ${appointment.service_name ?? "Service TBD"}`}
                              aria-label={`${time}, ${customer}, ${appointment.status}`}
                              onClick={() => setSelectedAppointment(appointment)}
                              className={`block w-full truncate rounded border px-1.5 py-1 text-left text-xs ${STATUS_STYLES[appointment.status]}`}
                            >
                              <span className="font-semibold">{time}</span>{" "}
                              <span>{customer}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onRemoved={() => {
            const removedId = selectedAppointment.id;
            setLoadResult((previous) =>
              previous?.key === requestKey
                ? {
                    ...previous,
                    appointments: previous.appointments.filter(
                      (appointment) => appointment.id !== removedId,
                    ),
                  }
                : previous,
            );
            setSelectedAppointment(null);
          }}
          onRescheduled={() => {
            setSelectedAppointment(null);
            setReloadKey((value) => value + 1);
          }}
        />
      )}
    </div>
  );
}
