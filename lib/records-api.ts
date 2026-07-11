import { apiFetch } from "./api";
import { Customer, Appointment, CallRecord, Message, Analytics } from "./types";

export async function listCustomers(businessId: string) {
  const data = await apiFetch<{ customers: Customer[] }>(
    `/customers?businessId=${businessId}`
  );
  return data.customers;
}

export async function createCustomer(payload: {
  businessId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
}) {
  const data = await apiFetch<{ customer: Customer }>("/customers", {
    method: "POST",
    body: payload,
  });
  return data.customer;
}

export async function updateCustomer(
  id: string,
  payload: Partial<{ fullName: string; phoneNumber: string; email: string; notes: string }>
) {
  const data = await apiFetch<{ customer: Customer }>(`/customers/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return data.customer;
}

export async function deleteCustomer(id: string) {
  await apiFetch(`/customers/${id}`, { method: "DELETE" });
}

export async function listAppointments(
  businessId: string,
  from?: string,
  to?: string
) {
  const params = new URLSearchParams({ businessId });
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const data = await apiFetch<{ appointments: Appointment[] }>(
    `/appointments?${params}`
  );
  return data.appointments;
}

export async function getAvailability(
  businessId: string,
  date: string,
  durationMinutes: number,
  staffId?: string
) {
  const params = new URLSearchParams({
    businessId,
    date,
    durationMinutes: String(durationMinutes),
  });
  if (staffId) params.set("staffId", staffId);
  const data = await apiFetch<{ slots: string[] }>(
    `/appointments/availability?${params}`
  );
  return data.slots;
}

export async function createAppointment(payload: {
  businessId: string;
  customerId: string;
  serviceName?: string;
  startTime: string;
  endTime: string;
  source?: "ai_call" | "manual" | "web";
  staffId?: string;
}) {
  const data = await apiFetch<{ appointment: Appointment }>("/appointments", {
    method: "POST",
    body: payload,
  });
  return data.appointment;
}

export async function updateAppointment(
  id: string,
  payload: Partial<{ status: string; startTime: string; endTime: string }>
) {
  const data = await apiFetch<{ appointment: Appointment }>(
    `/appointments/${id}`,
    { method: "PATCH", body: payload }
  );
  return data.appointment;
}

export async function cancelAppointment(id: string) {
  await apiFetch(`/appointments/${id}`, { method: "DELETE" });
}

export async function deleteAppointmentPermanently(id: string) {
  await apiFetch(`/appointments/${id}/permanent`, { method: "DELETE" });
}

export async function listCalls(businessId: string) {
  const data = await apiFetch<{ calls: CallRecord[] }>(
    `/calls?businessId=${businessId}`
  );
  return data.calls;
}

export async function listMessages(businessId: string) {
  const data = await apiFetch<{ messages: Message[] }>(
    `/messages?businessId=${businessId}`
  );
  return data.messages;
}

export async function getAnalytics(businessId: string, days: number) {
  return apiFetch<Analytics>(`/analytics/${businessId}?days=${days}`);
}
