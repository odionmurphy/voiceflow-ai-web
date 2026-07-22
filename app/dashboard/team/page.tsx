"use client";

import { Fragment, useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { listMembers, addMember, removeMember, setStaffWorkingHours } from "@/lib/business-api";
import { BusinessMember } from "@/lib/types";
import { ApiError } from "@/lib/api";
import BusinessHoursEditor from "@/components/BusinessHoursEditor";

export default function TeamPage() {
  const { activeBusiness } = useBusiness();
  const isOwner = activeBusiness?.role === "owner";
  const [members, setMembers] = useState<BusinessMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [draftHours, setDraftHours] = useState<Record<string, [string, string]>>({});
  const [savingHours, setSavingHours] = useState(false);

  function load() {
    if (!activeBusiness) return;
    setLoading(true);
    listMembers(activeBusiness.id)
      .then(setMembers)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!activeBusiness) return;
    setError(null);
    setSubmitting(true);
    try {
      await addMember(activeBusiness.id, email);
      setEmail("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add team member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(userId: string) {
    if (!activeBusiness) return;
    if (!confirm("Remove this person from the business?")) return;
    await removeMember(activeBusiness.id, userId);
    load();
  }

  function toggleHours(member: BusinessMember) {
    if (expandedUserId === member.user_id) {
      setExpandedUserId(null);
      return;
    }
    setDraftHours(member.working_hours ?? {});
    setExpandedUserId(member.user_id);
  }

  async function handleSaveHours(userId: string) {
    if (!activeBusiness) return;
    setSavingHours(true);
    try {
      await setStaffWorkingHours(activeBusiness.id, userId, draftHours);
      setExpandedUserId(null);
      load();
    } finally {
      setSavingHours(false);
    }
  }

  if (!activeBusiness) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Team</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Owners have full control. Staff can manage day-to-day work — customers, appointments,
        calls — but can&apos;t delete the business, touch billing, or permanently delete records.
      </p>

      {isOwner && (
        <form
          onSubmit={handleAdd}
          className="mt-5 flex items-end gap-3 rounded-xl border border-border bg-panel p-5"
        >
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Add team member by email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
            <p className="mt-1 text-xs text-ink-soft">
              They must already have a Praxisline AI account — ask them to sign up first.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add as staff"}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-sm text-red">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-panel">
        {loading ? (
          <p className="p-5 text-sm text-ink-soft">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const hasCustomHours = m.working_hours && Object.keys(m.working_hours).length > 0;
                const isExpanded = expandedUserId === m.user_id;
                return (
                  <Fragment key={m.user_id}>
                    <tr className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">{m.full_name}</td>
                      <td className="px-5 py-3 text-ink-soft">{m.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            m.role === "owner" ? "bg-navy-soft text-white" : "bg-paper text-ink-soft"
                          }`}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isOwner && (
                            <button
                              onClick={() => toggleHours(m)}
                              className="text-xs font-medium text-navy hover:underline"
                            >
                              {hasCustomHours ? "Edit hours" : "Set hours"}
                            </button>
                          )}
                          {isOwner && m.role !== "owner" && (
                            <button
                              onClick={() => handleRemove(m.user_id)}
                              className="text-xs font-medium text-red hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-border bg-paper/60 last:border-0">
                        <td colSpan={4} className="px-5 py-4">
                          <p className="mb-3 text-xs text-ink-soft">
                            Custom working hours for {m.full_name}. Leave every day off to fall
                            back to the business&apos;s own hours.
                          </p>
                          <BusinessHoursEditor value={draftHours} onChange={setDraftHours} />
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() => handleSaveHours(m.user_id)}
                              disabled={savingHours}
                              className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
                            >
                              {savingHours ? "Saving..." : "Save hours"}
                            </button>
                            <button
                              onClick={() => setExpandedUserId(null)}
                              className="text-xs font-medium text-ink-soft hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
