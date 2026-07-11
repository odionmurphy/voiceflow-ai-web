import { apiFetch } from "./api";

export interface CalendarConnection {
  provider: string;
  calendar_id: string | null;
  expires_at: string | null;
}

export async function getCalendarStatus(businessId: string) {
  const data = await apiFetch<{ connections: CalendarConnection[] }>(
    `/calendar/${businessId}/status`
  );
  return data.connections;
}

export async function getGoogleConnectUrl(businessId: string) {
  const data = await apiFetch<{ authUrl: string }>(
    `/calendar/${businessId}/google/connect?client=web`
  );
  return data.authUrl;
}

export async function disconnectGoogleCalendar(businessId: string) {
  await apiFetch(`/calendar/${businessId}/google`, { method: "DELETE" });
}
