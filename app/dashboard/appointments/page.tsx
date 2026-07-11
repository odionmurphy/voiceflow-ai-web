"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import {
  listAppointments,
  listCustomers,
  getAvailability,
  createAppointment,
} from "@/lib/records-api";
import { getAISettings, listMembers } from "@/lib/business-api";
import { Appointment, Customer, AIService, BusinessMember } from "@/lib/types";
import { ApiError } from "@/lib/api";
import AppointmentCard from "@/components/AppointmentCard";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";

const DEFAULT_DURATION = 60;

function todayISODate() {
  // toISOString() converts to UTC first, which shifts the date across midnight for any
  // timezone ahead of UTC (e.g. Europe/Berlin) - use local date parts instead.
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AppointmentsPage() {
  const { activeBusiness } = useBusiness();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<AIService[]>([]);
  const [members, setMembers] = useState<BusinessMember[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(todayISODate());
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const duration =
    services.find((s) => s.name === serviceName)?.durationMinutes ?? DEFAULT_DURATION;

  async function load() {
    if (!activeBusiness) return;
    setLoading(true);
    try {
      const data = await listAppointments(activeBusiness.id);
      setAppointments(data.sort((a, b) => b.start_time.localeCompare(a.start_time)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  useEffect(() => {
    if (!activeBusiness || !showForm) return;
    listCustomers(activeBusiness.id).then(setCustomers);
    getAISettings(activeBusiness.id).then((s) => setServices(s.services ?? []));
    listMembers(activeBusiness.id).then(setMembers);
  }, [activeBusiness, showForm]);

  useEffect(() => {
    if (!activeBusiness || !showForm || !date) return;
    setSelectedSlot(null);
    setSlotsLoading(true);
    getAvailability(activeBusiness.id, date, duration, staffId || undefined)
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  }, [activeBusiness, showForm, date, duration, staffId]);

  function resetForm() {
    setCustomerId("");
    setServiceName("");
    setStaffId("");
    setDate(todayISODate());
    setSlots([]);
    setSelectedSlot(null);
    setError(null);
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!activeBusiness || !customerId || !selectedSlot) return;
    setError(null);
    setSubmitting(true);
    try {
      const start = new Date(selectedSlot);
      const end = new Date(start.getTime() + duration * 60000);
      await createAppointment({
        businessId: activeBusiness.id,
        customerId,
        serviceName: serviceName || undefined,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        source: "web",
        staffId: staffId || undefined,
      });
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book appointment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!activeBusiness) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Appointments</h1>
        <button
          onClick={() => {
            if (showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          {showForm ? "Cancel" : "Book appointment"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleBook}
          className="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-border bg-panel p-5 sm:grid-cols-3"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Customer</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            >
              <option value="" disabled>
                {customers.length === 0 ? "No customers yet" : "Select a customer"}
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.phone_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Service (optional)
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            >
              <option value="">No specific service ({DEFAULT_DURATION} min)</option>
              {services.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Staff (optional)
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            >
              <option value="">Any available</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Date</label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
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

          {error && <p className="sm:col-span-3 text-sm text-red">{error}</p>}
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={submitting || !customerId || !selectedSlot}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy-deep hover:bg-amber-deep disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book appointment"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            Loading...
          </p>
        ) : appointments.length === 0 ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            No appointments yet.
          </p>
        ) : (
          <div className="space-y-2">
            {appointments.map((a, i) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => setSelectedAppointment(a)}
              />
            ))}
          </div>
        )}
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
    </div>
  );
}
