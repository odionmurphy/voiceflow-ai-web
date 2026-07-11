import { apiFetch } from "./api";
import { Business, AISettings, BusinessMember } from "./types";

export async function listBusinesses() {
  const data = await apiFetch<{ businesses: Business[] }>("/business");
  return data.businesses;
}

export async function createBusiness(payload: {
  name: string;
  industry?: string;
  phoneNumber?: string;
  timezone?: string;
  address?: string;
  businessHours?: Record<string, [string, string]>;
}) {
  const data = await apiFetch<{ business: Business }>("/business", {
    method: "POST",
    body: payload,
  });
  return data.business;
}

export async function deleteBusiness(id: string) {
  await apiFetch(`/business/${id}`, { method: "DELETE" });
}

export async function listMembers(businessId: string) {
  const data = await apiFetch<{ members: BusinessMember[] }>(`/business/${businessId}/members`);
  return data.members;
}

export async function addMember(businessId: string, email: string) {
  const data = await apiFetch<{ member: BusinessMember }>(`/business/${businessId}/members`, {
    method: "POST",
    body: { email, role: "staff" },
  });
  return data.member;
}

export async function removeMember(businessId: string, userId: string) {
  await apiFetch(`/business/${businessId}/members/${userId}`, { method: "DELETE" });
}

export async function setStaffWorkingHours(
  businessId: string,
  userId: string,
  workingHours: Record<string, [string, string]>
) {
  const data = await apiFetch<{ member: BusinessMember }>(
    `/business/${businessId}/members/${userId}/hours`,
    { method: "PATCH", body: { workingHours } }
  );
  return data.member;
}

export async function getAISettings(businessId: string) {
  const data = await apiFetch<{ aiSettings: AISettings }>(
    `/business/${businessId}/ai-settings`
  );
  return data.aiSettings;
}

export async function updateAISettings(
  businessId: string,
  payload: Partial<{
    greeting: string;
    voiceId: string;
    services: AISettings["services"];
    faq: AISettings["faq"];
    bookingRules: AISettings["booking_rules"];
  }>
) {
  const data = await apiFetch<{ aiSettings: AISettings }>(
    `/business/${businessId}/ai-settings`,
    { method: "PATCH", body: payload }
  );
  return data.aiSettings;
}

export async function updateBusiness(
  id: string,
  payload: Partial<{
    name: string;
    industry: string;
    phoneNumber: string;
    timezone: string;
    address: string;
    businessHours: Record<string, [string, string]>;
  }>
) {
  const data = await apiFetch<{ business: Business }>(`/business/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return data.business;
}
