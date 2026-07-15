"use client";

import { useEffect, useRef, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { listAppointments, listCalls } from "@/lib/records-api";
import { Appointment, CallRecord } from "@/lib/types";
import StatCard from "@/components/StatCard";
import AppointmentCard from "@/components/AppointmentCard";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import CallsListModal from "@/components/CallsListModal";
import CreateBusinessModal from "@/components/CreateBusinessModal";
import TrendsSection from "@/components/TrendsSection";

export default function OverviewPage() {
  const { activeBusiness, loading: bizLoading, refresh } = useBusiness();
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [callsModal, setCallsModal] = useState<{ title: string; calls: CallRecord[] } | null>(
    null
  );
  const scheduleRef = useRef<HTMLHeadingElement>(null);

  function load() {
    if (!activeBusiness) return;
    setLoading(true);
    Promise.all([listAppointments(activeBusiness.id), listCalls(activeBusiness.id)])
      .then(([appts, callList]) => {
        setAppointments(appts);
        setCalls(callList);
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
        <h2 className="font-display text-lg font-semibold text-ink">No business yet</h2>
        <p className="mt-1 text-sm text-ink-soft">Create your first business to get started.</p>
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
    (a) => new Date(a.start_time).toDateString() === today
  );
  const todaysCalls = calls.filter((c) => new Date(c.created_at).toDateString() === today);
  const answeredCalls = todaysCalls.filter((c) => c.status === "completed");
  const missedCalls = todaysCalls.filter((c) => c.status === "missed");
  const answeredToday = answeredCalls.length;
  const missedToday = missedCalls.length;
  const revenueToday = todaysAppointments
    .filter((a) => a.status === "confirmed" || a.status === "completed")
    .reduce((sum, a) => sum + (a.price ?? 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{activeBusiness.name}</h1>
      <p className="mt-1 text-sm text-ink-soft">Here&apos;s what&apos;s happening today.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Appointments today"
          value={String(todaysAppointments.length)}
          icon="📅"
          tone="navy"
          onClick={() => scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
        <StatCard
          label="Calls answered"
          value={String(answeredToday)}
          icon="📞"
          tone="teal"
          onClick={() => setCallsModal({ title: "Calls answered today", calls: answeredCalls })}
        />
        <StatCard
          label="Missed calls"
          value={String(missedToday)}
          icon="⚠️"
          tone={missedToday > 0 ? "red" : "navy"}
          onClick={() => setCallsModal({ title: "Missed calls today", calls: missedCalls })}
        />
        <StatCard
          label="Revenue"
          value={`$${revenueToday.toFixed(2)}`}
          note="Today, confirmed + completed"
          icon="💰"
          tone="amber"
        />
      </div>

      <h2 ref={scheduleRef} className="mt-10 scroll-mt-8 font-display text-lg font-semibold text-ink">
        Today&apos;s schedule
      </h2>
      <div className="mt-4">
        {loading ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            Loading...
          </p>
        ) : todaysAppointments.length === 0 ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            No appointments today.
          </p>
        ) : (
          <div className="space-y-2">
            {todaysAppointments
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((a, i) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  compact
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setSelectedAppointment(a)}
                />
              ))}
          </div>
        )}
      </div>

      <TrendsSection businessId={activeBusiness.id} />

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

    </div>
  );
}
