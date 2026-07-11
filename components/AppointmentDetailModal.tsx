"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/lib/types";
import { cancelAppointment, deleteAppointmentPermanently, getAvailability, updateAppointment } from "@/lib/records-api";
import { useBusiness } from "@/lib/business-context";

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onRemoved: () => void;
  onRescheduled: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-teal-soft text-teal",
  cancelled: "bg-red-soft text-red",
  pending: "bg-amber-soft text-amber-deep",
  completed: "bg-teal-soft text-teal",
  no_show: "bg-red-soft text-red",
};

const SOURCE_STYLES: Record<string, { className: string; icon: string; label: string }> = {
  ai_call: { className: "bg-purple-100 text-purple-700", icon: "🤖", label: "AI call" },
  manual: { className: "bg-slate-100 text-slate-600", icon: "✍️", label: "Manual" },
  web: { className: "bg-blue-100 text-blue-700", icon: "🌐", label: "Web" },
};

function todayISODate() {
  // toISOString() converts to UTC first, which shifts the date across midnight for any
  // timezone ahead of UTC (e.g. Europe/Berlin) - use local date parts instead.
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AppointmentDetailModal({
  appointment,
  onClose,
  onRemoved,
  onRescheduled,
}: Props) {
  const { activeBusiness } = useBusiness();
  const isOwner = activeBusiness?.role === "owner";

  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState(todayISODate());
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const durationMinutes = Math.round(
    (new Date(appointment.end_time).getTime() - new Date(appointment.start_time).getTime()) / 60000
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!rescheduling || !activeBusiness) return;
    setSelectedSlot(null);
    setSlotsLoading(true);
    getAvailability(activeBusiness.id, date, durationMinutes)
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  }, [rescheduling, activeBusiness, date, durationMinutes]);

  async function handleCancel() {
    if (!confirm("Cancel this appointment?")) return;
    setCancelling(true);
    try {
      await cancelAppointment(appointment.id);
      onRemoved();
    } finally {
      setCancelling(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this appointment? This can't be undone.")) return;
    setDeleting(true);
    try {
      await deleteAppointmentPermanently(appointment.id);
      onRemoved();
    } finally {
      setDeleting(false);
    }
  }

  async function handleConfirmReschedule() {
    if (!selectedSlot) return;
    setSaving(true);
    try {
      const start = new Date(selectedSlot);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      await updateAppointment(appointment.id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      onRescheduled();
    } finally {
      setSaving(false);
    }
  }

  const start = new Date(appointment.start_time);
  const end = new Date(appointment.end_time);

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
      onClick={onClose}
    >
      <div
        className="modal-in w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-semibold text-ink">
              {appointment.customer_name ?? "Unknown customer"}
            </h2>
            {appointment.customer_phone && (
              <p className="text-sm text-ink-soft">{appointment.customer_phone}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                STATUS_STYLES[appointment.status]
              }`}
            >
              {appointment.status}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_STYLES[appointment.source].className}`}
            >
              <span>{SOURCE_STYLES[appointment.source].icon}</span>
              {SOURCE_STYLES[appointment.source].label}
            </span>
          </div>

          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-ink-soft">Date</span>
            <span className="font-medium text-ink">
              {start.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Time</span>
            <span className="font-medium text-ink">
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Service</span>
            <span className="font-medium text-ink">
              {appointment.service_name ?? "Service TBD"}
            </span>
          </div>
        </div>

        {appointment.status !== "cancelled" && rescheduling && (
          <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">New date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                Available times
              </label>
              {slotsLoading ? (
                <p className="text-sm text-ink-soft">Loading slots...</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-ink-soft">No open slots this day.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        selectedSlot === slot
                          ? "border-navy bg-navy text-white"
                          : "border-border text-ink hover:border-navy"
                      }`}
                    >
                      {new Date(slot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRescheduling(false)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-semibold text-ink hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={!selectedSlot || saving}
                className="flex-1 rounded-lg bg-amber py-2 text-sm font-semibold text-navy-deep hover:bg-amber-deep disabled:opacity-60"
              >
                {saving ? "Saving..." : "Confirm new time"}
              </button>
            </div>
          </div>
        )}

        {appointment.status !== "cancelled" && !rescheduling && (
          <button
            onClick={() => setRescheduling(true)}
            className="mt-6 w-full rounded-lg border border-border py-2 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Reschedule
          </button>
        )}

        {!rescheduling && (
          <div className="mt-2 flex gap-2">
            {appointment.status !== "cancelled" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-lg border border-red/30 py-2 text-sm font-semibold text-red transition hover:bg-red-soft disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg border border-red/30 bg-red/5 py-2 text-sm font-semibold text-red transition hover:bg-red hover:text-white disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
