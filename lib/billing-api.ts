import { apiFetch } from "./api";

export interface Subscription {
  plan: "starter" | "professional" | "business";
  status: "trialing" | "active" | "past_due" | "cancelled";
  calls_included: number;
  calls_used_this_period: number;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

// A subscription can only be changed in place (vs. started fresh via Checkout) once it
// has a live Stripe subscription behind it.
export function hasLiveSubscription(sub: Subscription | null): boolean {
  return !!sub?.stripe_subscription_id && sub.status !== "cancelled";
}

export async function getSubscription(businessId: string) {
  const data = await apiFetch<{ subscription: Subscription }>(
    `/payments/${businessId}/subscription`
  );
  return data.subscription;
}

export async function getCheckoutUrl(businessId: string, plan: string) {
  const data = await apiFetch<{ url: string }>(
    `/payments/${businessId}/checkout-session`,
    { method: "POST", body: { plan } }
  );
  return data.url;
}

export async function changePlan(businessId: string, plan: string) {
  const data = await apiFetch<{ subscription: Subscription }>(
    `/payments/${businessId}/change-plan`,
    { method: "POST", body: { plan } }
  );
  return data.subscription;
}

export async function getBillingPortalUrl(businessId: string) {
  const data = await apiFetch<{ url: string }>(
    `/payments/${businessId}/billing-portal`,
    { method: "POST" }
  );
  return data.url;
}
