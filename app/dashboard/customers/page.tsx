"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { listCustomers, createCustomer } from "@/lib/records-api";
import { Customer } from "@/lib/types";
import { ApiError } from "@/lib/api";
import CustomerCard from "@/components/CustomerCard";
import CustomerDetailModal from "@/components/CustomerDetailModal";

export default function CustomersPage() {
  const { activeBusiness } = useBusiness();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    if (!activeBusiness) return;
    setLoading(true);
    try {
      const data = await listCustomers(activeBusiness.id);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeBusiness) return;
    setError(null);
    setSubmitting(true);
    try {
      await createCustomer({
        businessId: activeBusiness.id,
        fullName,
        phoneNumber,
        email: email || undefined,
      });
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add customer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!activeBusiness) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          {showForm ? "Cancel" : "Add customer"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-border bg-panel p-5 sm:grid-cols-3"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Phone number
            </label>
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              placeholder="+49 170 1234567"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              placeholder="jane@example.com"
            />
          </div>
          {error && <p className="sm:col-span-3 text-sm text-red">{error}</p>}
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy-deep hover:bg-amber-deep disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add customer"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            Loading...
          </p>
        ) : customers.length === 0 ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            No customers yet.
          </p>
        ) : (
          <div className="space-y-2">
            {customers.map((c, i) => (
              <CustomerCard
                key={c.id}
                customer={c}
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => setSelectedCustomer(c)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onChanged={() => {
            setSelectedCustomer(null);
            load();
          }}
        />
      )}
    </div>
  );
}
