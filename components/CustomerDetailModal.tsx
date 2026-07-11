"use client";

import { useEffect, useState } from "react";
import { Customer } from "@/lib/types";
import { updateCustomer, deleteCustomer } from "@/lib/records-api";
import { ApiError } from "@/lib/api";
import { useBusiness } from "@/lib/business-context";

interface Props {
  customer: Customer;
  onClose: () => void;
  onChanged: () => void;
}

export default function CustomerDetailModal({ customer, onClose, onChanged }: Props) {
  const { activeBusiness } = useBusiness();
  const isOwner = activeBusiness?.role === "owner";
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(customer.full_name);
  const [phoneNumber, setPhoneNumber] = useState(customer.phone_number);
  const [email, setEmail] = useState(customer.email ?? "");
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateCustomer(customer.id, {
        fullName,
        phoneNumber,
        email: email || undefined,
        notes: notes || undefined,
      });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${customer.full_name}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
      onChanged();
    } finally {
      setDeleting(false);
    }
  }

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
          <h2 className="truncate font-display text-lg font-semibold text-ink">
            {editing ? "Edit customer" : customer.full_name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-3 text-sm">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">Full name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">Phone number</label>
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
            </div>
            {error && <p className="text-sm text-red">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-semibold text-ink hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-amber py-2 text-sm font-semibold text-navy-deep hover:bg-amber-deep disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-ink-soft">Phone</span>
                <span className="font-medium text-ink">{customer.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Email</span>
                <span className="font-medium text-ink">{customer.email ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Last visit</span>
                <span className="font-medium text-ink">
                  {customer.last_visit_at
                    ? new Date(customer.last_visit_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              {customer.notes && (
                <div className="border-t border-border pt-3">
                  <span className="text-ink-soft">Notes</span>
                  <p className="mt-1 text-ink">{customer.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-semibold text-ink hover:bg-paper"
              >
                Edit
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-red/30 py-2 text-sm font-semibold text-red transition hover:bg-red-soft disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
