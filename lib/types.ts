export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "owner" | "staff" | "admin";
}

export type BusinessMemberRole = "owner" | "staff";

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  industry: string | null;
  phone_number: string | null;
  timezone: string;
  address: string | null;
  business_hours: Record<string, [string, string]>;
  subscription_plan: "starter" | "professional" | "business";
  role: BusinessMemberRole;
}

export interface BusinessMember {
  user_id: string;
  email: string;
  full_name: string;
  role: BusinessMemberRole;
  working_hours: Record<string, [string, string]>;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  notes: string | null;
  last_visit_at: string | null;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  service_name: string | null;
  price: number | null;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  source: "ai_call" | "manual" | "web";
}

export interface CallRecord {
  id: string;
  business_id: string;
  caller_number: string | null;
  status: "completed" | "missed" | "failed";
  duration_seconds: number;
  intent: string | null;
  transcript: string | null;
  summary: string | null;
  created_at: string;
}

export interface AnalyticsDay {
  day: string; // YYYY-MM-DD
  calls_answered: number;
  calls_missed: number;
  appointments_booked: number;
}

export interface Analytics {
  range: { from: string; to: string; days: number };
  totals: {
    calls_total: number;
    calls_answered: number;
    calls_missed: number;
    appointments_total: number;
    appointments_completed: number;
    appointments_cancelled: number;
    appointments_no_show: number;
    revenue: number;
    answerRate: number | null;
    noShowRate: number | null;
  };
  daily: AnalyticsDay[];
}

export interface Message {
  id: string;
  business_id: string;
  customer_id: string | null;
  customer_name: string | null;
  appointment_id: string | null;
  channel: "sms" | "email" | "push";
  template: "confirmation" | "cancellation" | "reminder" | null;
  body: string | null;
  status: "sent" | "failed" | "delivered";
  created_at: string;
}

export interface AIService {
  name: string;
  durationMinutes: number;
  price: number;
}

export interface AIFaqItem {
  question: string;
  answer: string;
}

export interface AIBookingRules {
  minNoticeHours?: number;
  bufferMinutes?: number;
  maxPerDay?: number;
  assistantName?: string;
  forwardingNumber?: string;
  notifyEmail?: string;
  privacyPolicyUrl?: string;
  language?: string;
}

export interface AISettings {
  business_id: string;
  greeting: string;
  voice_id: string;
  services: AIService[];
  faq: AIFaqItem[];
  booking_rules: AIBookingRules;
}
