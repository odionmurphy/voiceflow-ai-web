"use client";

import { useEffect, useState } from "react";
import { createBusiness } from "@/lib/business-api";
import { ApiError } from "@/lib/api";
import BusinessHoursEditor from "./BusinessHoursEditor";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const DEFAULT_HOURS: Record<string, [string, string]> = {
  mon: ["09:00", "18:00"],
  tue: ["09:00", "18:00"],
  wed: ["09:00", "18:00"],
  thu: ["09:00", "18:00"],
  fri: ["09:00", "18:00"],
};

export default function CreateBusinessModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState<Record<string, [string, string]>>(DEFAULT_HOURS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createBusiness({
        name,
        industry: industry || undefined,
        phoneNumber: phoneNumber || undefined,
        address: address || undefined,
        businessHours: hours,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create business.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="modal-in max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-ink">Create a business</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
          <div>
            <label className={labelClass}>Business name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Bright Smile Dental"
            />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={inputClass}
              placeholder="dental, salon, barber, medical..."
            />
          </div>
          <div>
            <label className={labelClass}>Phone number</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Business hours</label>
            <BusinessHoursEditor value={hours} onChange={setHours} />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create business"}
          </button>
        </form>
      </div>
    </div>
  );
}
