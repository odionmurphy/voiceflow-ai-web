"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBusiness } from "@/lib/business-context";
import { listAppointments, listCalls, getAnalytics } from "@/lib/records-api";
import { Appointment, CallRecord, Analytics } from "@/lib/types";
import StatCard from "@/components/StatCard";
import TrendsSection from "@/components/TrendsSection";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import CallsListModal from "@/components/CallsListModal";
import RevenueListModal from "@/components/RevenueListModal";
import CreateBusinessModal from "@/components/CreateBusinessModal";

function formatChange(current: number, previous: number, asPercent = false) {
  const difference = current - previous;
  if (asPercent && previous > 0) {
    const percentage = Math.round((difference / previous) * 100);
    return `${percentage > 0 ? "+" : ""}${percentage}%`;
  }
  return `${difference > 0 ? "+" : ""}${difference}`;
}

export default function OverviewPage() {
  const { user } = useAuth();
  const { activeBusiness, loading: bizLoading, refresh } = useBusiness();
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [callsModal, setCallsModal] = useState<{
    title: string;
    calls: CallRecord[];
  } | null>(null);
  const [showRevenueList, setShowRevenueList] = useState(false);
  const scheduleRef = useRef<HTMLHeadingElement>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  function load() {
    if (!activeBusiness) return;
    setLoading(true);
    Promise.all([
      listAppointments(activeBusiness.id),
      listCalls(activeBusiness.id),
      getAnalytics(activeBusiness.id, 30),
    ])
      .then(([appts, callList, analyticsData]) => {
        setAppointments(appts);
        setCalls(callList);
        setAnalytics(analyticsData);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  if (bizLoading) return null;

  if (!activeBusiness) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-panel p-10 text-center">
        <h2 className="font-display text-lg font-semibold text-ink">
          No business yet
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Create your first business to get started.
        </p>
        <button
          onClick={() => setShowCreateBusiness(true)}
          className="mt-4 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Create a business
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

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (a) => new Date(a.start_time).toDateString() === today,
  );
  const todaysCalls = calls.filter(
    (c) => new Date(c.created_at).toDateString() === today,
  );
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toDateString();
  const yesterdaysAppointments = appointments.filter(
    (a) => new Date(a.start_time).toDateString() === yesterday,
  );
  const yesterdaysCalls = calls.filter(
    (c) => new Date(c.created_at).toDateString() === yesterday,
  );
  const answeredCalls = todaysCalls.filter((c) => c.status === "completed");
  const missedCalls = todaysCalls.filter((c) => c.status === "missed");
  const yesterdaysAnswered = yesterdaysCalls.filter(
    (c) => c.status === "completed",
  ).length;
  const yesterdaysMissed = yesterdaysCalls.filter(
    (c) => c.status === "missed",
  ).length;
  const answeredToday = answeredCalls.length;
  const missedToday = missedCalls.length;
  const revenueAppointments = todaysAppointments.filter(
    (a) =>
      (a.status === "confirmed" || a.status === "completed") && a.price != null,
  );
  const revenueToday = revenueAppointments.reduce((sum, a) => {
    const price = Number(a.price ?? 0);
    return sum + (Number.isNaN(price) ? 0 : price);
  }, 0);
  const yesterdayRevenue = yesterdaysAppointments
    .filter(
      (a) =>
        (a.status === "confirmed" || a.status === "completed") &&
        a.price != null,
    )
    .reduce((sum, a) => {
      const price = Number(a.price ?? 0);
      return sum + (Number.isNaN(price) ? 0 : price);
    }, 0);
  const currency = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const givenName = user?.full_name?.trim().split(/\s+/)[0];
  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-[1008px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
        <div>
          <p className="text-[11px] text-ink-soft">{dateLabel}</p>
          <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
            {greeting}
            {givenName ? `, ${givenName}` : ""}
          </h1>
        </div>
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-2 rounded-full bg-[#171d24] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2b323a]"
        >
          <span className="text-base leading-none">+</span> New appointment
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        <StatCard
          label="Appointments today"
          value={String(todaysAppointments.length)}
          icon="calendar"
          tone="navy"
          trend={analytics?.daily.map((d) => d.appointments_booked) ?? null}
          trendLabel={formatChange(todaysAppointments.length, yesterdaysAppointments.length)}
          trendPositive={todaysAppointments.length >= yesterdaysAppointments.length}
          onClick={() =>
            scheduleRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        />
        <StatCard
          label="Calls answered"
          value={String(answeredToday)}
          icon="phone"
          tone="teal"
          trend={analytics?.daily.map((d) => d.calls_answered) ?? null}
          trendLabel={formatChange(answeredToday, yesterdaysAnswered, true)}
          trendPositive={answeredToday >= yesterdaysAnswered}
          onClick={() =>
            setCallsModal({
              title: "Calls answered today",
              calls: answeredCalls,
            })
          }
        />
        <StatCard
          label="Missed calls"
          value={String(missedToday)}
          icon="missed"
          tone={missedToday > 0 ? "red" : "navy"}
          trend={analytics?.daily.map((d) => d.calls_missed) ?? null}
          trendLabel={formatChange(missedToday, yesterdaysMissed, true)}
          trendPositive={missedToday <= yesterdaysMissed}
          onClick={() =>
            setCallsModal({ title: "Missed calls today", calls: missedCalls })
          }
        />
        <StatCard
          label="Revenue"
          value={currency.format(revenueToday)}
          note="Today, confirmed + completed"
          icon="euro"
          tone="amber"
          trend={null}
          trendLabel={formatChange(revenueToday, yesterdayRevenue, true)}
          trendPositive={revenueToday >= yesterdayRevenue}
          onClick={() => setShowRevenueList(true)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.45fr_0.95fr] lg:gap-5">
        <TrendsSection businessId={activeBusiness.id} />

        <section
          className="dashboard-card min-w-0 rounded-[20px] p-5 sm:p-6"
          aria-labelledby="schedule-heading"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              ref={scheduleRef}
              id="schedule-heading"
              className="scroll-mt-24 font-display text-base font-bold tracking-tight text-ink sm:text-lg"
            >
              Today&apos;s schedule
            </h2>
            <Link
              href="/dashboard/appointments"
              className="text-[11px] font-medium text-[#eb623f] hover:text-[#c94a2e]"
            >
              View all
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <div
                className="animate-pulse rounded-2xl bg-[#faf9f7] p-5"
                role="status"
                aria-label="Loading today's schedule"
              >
                <div className="h-4 w-40 rounded bg-border" />
              </div>
            ) : todaysAppointments.length === 0 ? (
              <div className="flex min-h-[210px] flex-col items-center justify-center rounded-2xl bg-[#faf9f7] px-5 py-7 text-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffebe3] text-lg text-[#ee6946]"
                  aria-hidden="true"
                >
                  ▣
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">
                  No appointments yet
                </p>
                <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-ink-soft">
                  Appointments booked by your team and AI receptionist appear
                  here.
                </p>
                <Link
                  href="/dashboard/appointments"
                  className="mt-4 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-ink shadow-sm ring-1 ring-border transition hover:bg-paper"
                >
                  Open calendar <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-0.5">
                {todaysAppointments
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .slice(0, 4)
                  .map((a, i) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelectedAppointment(a)}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-[#faf8f5]"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className="w-10 shrink-0 text-[11px] font-bold tabular-nums text-ink">
                        {new Date(a.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-semibold text-ink">
                          {a.customer_name ?? "New patient"}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-ink-soft">
                          {a.service_name ?? "Appointment"}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-medium capitalize ${a.status === "pending" ? "bg-[#fff0d8] text-[#c58a23]" : a.status === "cancelled" || a.status === "no_show" ? "bg-red-soft text-red" : "bg-[#dcf6ed] text-[#239b7b]"}`}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          {todaysAppointments.length > 0 && !loading && (
            <div className="mt-3 rounded-full bg-[#f3f0ec] px-3 py-2 text-[10px] text-ink-soft">
              ◷ &nbsp;{todaysAppointments.length} appointment
              {todaysAppointments.length === 1 ? "" : "s"} scheduled today
            </div>
          )}
        </section>
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
