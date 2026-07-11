"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusiness } from "@/lib/business-context";
import { updateBusiness, deleteBusiness } from "@/lib/business-api";
import {
  getCalendarStatus,
  getGoogleConnectUrl,
  disconnectGoogleCalendar,
  CalendarConnection,
} from "@/lib/calendar-api";
import {
  getSubscription,
  getCheckoutUrl,
  changePlan,
  getBillingPortalUrl,
  hasLiveSubscription,
  Subscription,
} from "@/lib/billing-api";
import { ApiError } from "@/lib/api";
import BusinessHoursEditor from "@/components/BusinessHoursEditor";

const PLANS: { id: "starter" | "professional" | "business"; label: string; blurb: string }[] = [
  { id: "starter", label: "Starter", blurb: "Up to 100 calls / month" },
  { id: "professional", label: "Professional", blurb: "Up to 500 calls / month" },
  { id: "business", label: "Business", blurb: "Unlimited calls" },
];

const STATUS_LABEL: Record<string, string> = {
  trialing: "Trial (no card on file)",
  active: "Active",
  past_due: "Payment failed",
  cancelled: "Cancelled",
};

export default function SettingsPage() {
  const { activeBusiness, refresh } = useBusiness();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState<Record<string, [string, string]>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const justConnected = searchParams.get("calendar") === "connected";

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingActionPlan, setBillingActionPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const billingStatus = searchParams.get("billing");

  const isOwner = activeBusiness?.role === "owner";
  const googleConnection = connections.find((c) => c.provider === "google");

  function loadSubscription() {
    if (!activeBusiness || !isOwner) return;
    setBillingLoading(true);
    getSubscription(activeBusiness.id)
      .then(setSubscription)
      .finally(() => setBillingLoading(false));
  }

  useEffect(() => {
    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  async function handleChoosePlan(plan: string) {
    if (!activeBusiness) return;
    setBillingError(null);
    setBillingActionPlan(plan);
    try {
      if (hasLiveSubscription(subscription)) {
        // Already have a live Stripe subscription - swap its price in place instead of
        // starting a second, parallel one via Checkout.
        const updated = await changePlan(activeBusiness.id, plan);
        setSubscription(updated);
        setBillingActionPlan(null);
      } else {
        const url = await getCheckoutUrl(activeBusiness.id, plan);
        window.location.href = url;
      }
    } catch (err) {
      setBillingError(err instanceof ApiError ? err.message : "Could not change plan.");
      setBillingActionPlan(null);
    }
  }

  async function handleManageBilling() {
    if (!activeBusiness) return;
    setBillingError(null);
    setPortalLoading(true);
    try {
      const url = await getBillingPortalUrl(activeBusiness.id);
      window.location.href = url;
    } catch (err) {
      setBillingError(err instanceof ApiError ? err.message : "Could not open billing portal.");
      setPortalLoading(false);
    }
  }

  function loadCalendarStatus() {
    if (!activeBusiness) return;
    setCalendarLoading(true);
    getCalendarStatus(activeBusiness.id)
      .then(setConnections)
      .finally(() => setCalendarLoading(false));
  }

  useEffect(() => {
    loadCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness]);

  async function handleConnectCalendar() {
    if (!activeBusiness) return;
    setCalendarError(null);
    setConnecting(true);
    try {
      const authUrl = await getGoogleConnectUrl(activeBusiness.id);
      window.location.href = authUrl;
    } catch (err) {
      setCalendarError(
        err instanceof ApiError ? err.message : "Could not start the connection."
      );
      setConnecting(false);
    }
  }

  async function handleDisconnectCalendar() {
    if (!activeBusiness) return;
    if (!confirm("Disconnect Google Calendar? Future bookings will no longer sync.")) return;
    setDisconnecting(true);
    try {
      await disconnectGoogleCalendar(activeBusiness.id);
      loadCalendarStatus();
    } finally {
      setDisconnecting(false);
    }
  }

  useEffect(() => {
    if (!activeBusiness) return;
    setName(activeBusiness.name ?? "");
    setIndustry(activeBusiness.industry ?? "");
    setPhoneNumber(activeBusiness.phone_number ?? "");
    setAddress(activeBusiness.address ?? "");
    setHours(activeBusiness.business_hours ?? {});
  }, [activeBusiness]);

  async function handleSave() {
    if (!activeBusiness) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateBusiness(activeBusiness.id, {
        name,
        industry,
        phoneNumber,
        address,
        businessHours: hours,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!activeBusiness) return;
    if (
      !confirm(
        `Permanently delete "${activeBusiness.name}"? This deletes all its customers, appointments, and call history. This can't be undone.`
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteBusiness(activeBusiness.id);
      await refresh();
      router.replace("/dashboard");
    } finally {
      setDeleting(false);
    }
  }

  if (!activeBusiness) return null;

  const inputClass =
    "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:opacity-60";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Business settings</h1>
      <p className="mt-1 text-sm text-ink-soft">
        This is what your AI receptionist and customers see.
      </p>
      {!isOwner && (
        <p className="mt-3 rounded-lg bg-amber-soft px-3 py-2 text-xs font-medium text-amber-deep">
          Only the business owner can edit these settings. You&apos;re viewing this as staff.
        </p>
      )}

      <div className="mt-6 space-y-4 rounded-xl border border-border bg-panel p-6">
        <div>
          <label className={labelClass}>Business name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwner}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Industry</label>
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={!isOwner}
            className={inputClass}
            placeholder="dental, salon, barber, medical..."
          />
        </div>
        <div>
          <label className={labelClass}>Phone number</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!isOwner}
            className={inputClass}
            placeholder="+1 234 567 8900"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Must exactly match your Twilio number for the AI voice pipeline to route calls here.
          </p>
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!isOwner}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Business hours</label>
          <BusinessHoursEditor value={hours} onChange={setHours} disabled={!isOwner} />
        </div>

        {isOwner && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span className="text-sm font-medium text-teal">Saved</span>}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-panel p-6">
        <h2 className="font-display text-base font-semibold text-ink">Calendar</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Sync bookings to a Google Calendar so appointments show up alongside your other
          events.
        </p>

        {justConnected && (
          <p className="mt-3 rounded-lg bg-teal-soft px-3 py-2 text-xs font-medium text-teal">
            Google Calendar connected.
          </p>
        )}
        {calendarError && <p className="mt-3 text-sm text-red">{calendarError}</p>}

        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-paper/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-panel">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">Google Calendar</div>
              <div className="text-xs text-ink-soft">
                {calendarLoading
                  ? "Checking status..."
                  : googleConnection
                  ? `Connected${googleConnection.calendar_id ? ` · ${googleConnection.calendar_id}` : ""}`
                  : "Not connected"}
              </div>
            </div>
          </div>

          {!calendarLoading && (
            <div className="flex items-center gap-3">
              {googleConnection ? (
                <>
                  <span className="hidden items-center gap-1.5 rounded-full bg-teal-soft px-2.5 py-0.5 text-xs font-medium text-teal sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                    Connected
                  </span>
                  {isOwner && (
                    <button
                      onClick={handleDisconnectCalendar}
                      disabled={disconnecting}
                      className="rounded-lg border border-red/30 px-4 py-2 text-sm font-semibold text-red transition hover:bg-red-soft disabled:opacity-60"
                    >
                      {disconnecting ? "Disconnecting..." : "Disconnect"}
                    </button>
                  )}
                </>
              ) : (
                isOwner && (
                  <button
                    onClick={handleConnectCalendar}
                    disabled={connecting}
                    className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
                  >
                    {connecting ? "Redirecting..." : "Connect Google Calendar"}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="mt-6 rounded-xl border border-border bg-panel p-6">
          <h2 className="font-display text-base font-semibold text-ink">Billing</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Manage your plan and payment method.
          </p>

          {billingStatus === "success" && (
            <p className="mt-3 rounded-lg bg-teal-soft px-3 py-2 text-xs font-medium text-teal">
              Subscription started. It may take a few seconds to show as active below.
            </p>
          )}
          {billingStatus === "cancelled" && (
            <p className="mt-3 rounded-lg bg-paper px-3 py-2 text-xs font-medium text-ink-soft">
              Checkout was cancelled - no changes were made.
            </p>
          )}
          {billingError && <p className="mt-3 text-sm text-red">{billingError}</p>}

          {billingLoading ? (
            <p className="mt-4 text-sm text-ink-soft">Loading billing details...</p>
          ) : (
            <>
              {subscription && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
                    {subscription.plan}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {STATUS_LABEL[subscription.status] ?? subscription.status}
                    {" - "}
                    {subscription.calls_used_this_period} /{" "}
                    {subscription.calls_included >= 1_000_000
                      ? "unlimited"
                      : subscription.calls_included}{" "}
                    calls used this period
                  </span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PLANS.map((p) => {
                  const isCurrent = subscription?.plan === p.id && subscription.status !== "cancelled";
                  return (
                    <div key={p.id} className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold text-ink">{p.label}</div>
                      <div className="mt-1 text-xs text-ink-soft">{p.blurb}</div>
                      <button
                        onClick={() => handleChoosePlan(p.id)}
                        disabled={isCurrent || billingActionPlan !== null}
                        className="mt-3 w-full rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
                      >
                        {isCurrent
                          ? "Current plan"
                          : billingActionPlan === p.id
                          ? "Redirecting..."
                          : "Choose plan"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {subscription?.stripe_customer_id && (
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper disabled:opacity-60"
                >
                  {portalLoading ? "Redirecting..." : "Manage billing"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {isOwner && (
        <div className="mt-6 rounded-xl border border-red/30 bg-red-soft/40 p-6">
          <h2 className="font-display text-base font-semibold text-ink">Danger zone</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Permanently delete this business and everything under it.
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-4 rounded-lg border border-red/30 bg-panel px-5 py-2.5 text-sm font-semibold text-red transition hover:bg-red hover:text-white disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete business"}
          </button>
        </div>
      )}
    </div>
  );
}
