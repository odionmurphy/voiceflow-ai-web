"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { getAISettings, updateAISettings } from "@/lib/business-api";
import { AIService, AIFaqItem } from "@/lib/types";

type ServiceRow = { name: string; durationMinutes: string; price: string };
type FaqRow = { question: string; answer: string };

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "de-DE", label: "German" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese" },
  { code: "nl-NL", label: "Dutch" },
];

function SectionCard({
  icon,
  title,
  description,
  children,
  headerRight,
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-soft text-base">
            {icon}
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-ink-soft">{description}</p>}
          </div>
        </div>
        {headerRight}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AISettingsPage() {
  const { activeBusiness } = useBusiness();
  const isOwner = activeBusiness?.role === "owner";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [greeting, setGreeting] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [faq, setFaq] = useState<FaqRow[]>([]);
  const [minNoticeHours, setMinNoticeHours] = useState("");
  const [bufferMinutes, setBufferMinutes] = useState("");
  const [maxPerDay, setMaxPerDay] = useState("");
  const [forwardingNumber, setForwardingNumber] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");

  useEffect(() => {
    if (!activeBusiness) return;
    setLoading(true);
    getAISettings(activeBusiness.id)
      .then((data) => {
        setGreeting(data.greeting ?? "");
        setAssistantName(data.booking_rules?.assistantName ?? "");
        setLanguage(data.booking_rules?.language ?? "en-US");
        setServices(
          (data.services ?? []).map((s: AIService) => ({
            name: s.name,
            durationMinutes: String(s.durationMinutes),
            price: String(s.price),
          }))
        );
        setFaq(
          (data.faq ?? []).map((f: AIFaqItem) => ({ question: f.question, answer: f.answer }))
        );
        setMinNoticeHours(
          data.booking_rules?.minNoticeHours != null
            ? String(data.booking_rules.minNoticeHours)
            : ""
        );
        setBufferMinutes(
          data.booking_rules?.bufferMinutes != null
            ? String(data.booking_rules.bufferMinutes)
            : ""
        );
        setMaxPerDay(
          data.booking_rules?.maxPerDay != null ? String(data.booking_rules.maxPerDay) : ""
        );
        setForwardingNumber(data.booking_rules?.forwardingNumber ?? "");
        setNotifyEmail(data.booking_rules?.notifyEmail ?? "");
        setPrivacyPolicyUrl(data.booking_rules?.privacyPolicyUrl ?? "");
      })
      .finally(() => setLoading(false));
  }, [activeBusiness]);

  function addService() {
    setServices((prev) => [...prev, { name: "", durationMinutes: "30", price: "0" }]);
  }
  function removeService(i: number) {
    setServices((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateService(i: number, field: keyof ServiceRow, value: string) {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function addFaq() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }
  function removeFaq(i: number) {
    setFaq((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateFaq(i: number, field: keyof FaqRow, value: string) {
    setFaq((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  }

  async function handleSave() {
    if (!activeBusiness) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateAISettings(activeBusiness.id, {
        greeting,
        services: services.map((s) => ({
          name: s.name,
          durationMinutes: Number(s.durationMinutes),
          price: Number(s.price),
        })),
        faq,
        bookingRules: {
          minNoticeHours: minNoticeHours ? Number(minNoticeHours) : undefined,
          bufferMinutes: bufferMinutes ? Number(bufferMinutes) : undefined,
          maxPerDay: maxPerDay ? Number(maxPerDay) : undefined,
          assistantName: assistantName || undefined,
          forwardingNumber: forwardingNumber || undefined,
          notifyEmail: notifyEmail || undefined,
          privacyPolicyUrl: privacyPolicyUrl || undefined,
          language,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (!activeBusiness) return null;
  if (loading) return <p className="text-sm text-ink-soft">Loading...</p>;

  // Deliberately no width utility here - callers that need full width add "w-full"
  // themselves. The Services row needs "flex-1"/"w-20" instead, which would otherwise
  // conflict with a baked-in "w-full" on the same element (that bug made the service
  // name input collapse to ~26px while the duration/price inputs inherited w-full).
  const inputClass =
    "rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:opacity-60";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2.5">
        <span className="pulse-dot h-2 w-2 rounded-full bg-signal text-signal" />
        <h1 className="font-display text-2xl font-semibold text-ink">AI Settings</h1>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Configure how your AI receptionist greets callers and handles bookings.
      </p>
      {!isOwner && (
        <p className="mt-3 rounded-lg bg-amber-soft px-3 py-2 text-xs font-medium text-amber-deep">
          Only the business owner can edit AI settings. You&apos;re viewing this as staff.
        </p>
      )}

      <fieldset disabled={!isOwner} className="m-0 mt-6 space-y-6 border-0 p-0">
        <SectionCard icon="🤖" title="Assistant" description="Name and greeting callers hear first">
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Assistant name</label>
                <input
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className={`${inputClass} w-full`}
                  placeholder="e.g. Klara"
                />
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`${inputClass} w-full`}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-ink-soft">
                  What your AI receptionist speaks and understands on calls.
                </p>
              </div>
              <div>
                <label className={labelClass}>Greeting</label>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={4}
                  className={`${inputClass} w-full`}
                  placeholder="Hello! Thank you for calling..."
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Preview</label>
              <div className="flex h-[calc(100%-22px)] min-h-[132px] flex-col justify-between rounded-lg border border-border bg-navy p-4">
                <div className="flex items-center gap-2">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal text-signal" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    Incoming call
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white">
                  {greeting || "Hello! Thank you for calling..."}
                </p>
                <p className="mt-3 text-xs font-medium text-amber">
                  — {assistantName || "Your AI receptionist"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon="💼"
          title="Services"
          description="What callers can book, with duration and price"
          headerRight={
            <button onClick={addService} className="text-sm font-medium text-navy hover:underline">
              + Add service
            </button>
          }
        >
          <div className="space-y-2">
            {services.length === 0 && (
              <p className="text-sm text-ink-soft">No services yet.</p>
            )}
            {services.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border bg-paper/60 p-2.5"
              >
                <input
                  value={s.name}
                  onChange={(e) => updateService(i, "name", e.target.value)}
                  placeholder="Service name"
                  className={`${inputClass} flex-1 bg-panel`}
                />
                <input
                  value={s.durationMinutes}
                  onChange={(e) => updateService(i, "durationMinutes", e.target.value)}
                  placeholder="Min"
                  className={`${inputClass} w-20 bg-panel`}
                />
                <input
                  value={s.price}
                  onChange={(e) => updateService(i, "price", e.target.value)}
                  placeholder="€"
                  className={`${inputClass} w-20 bg-panel`}
                />
                <button
                  onClick={() => removeService(i)}
                  className="px-2 text-sm font-medium text-red hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon="❓"
          title="FAQ"
          description="Answers your AI can give without escalating"
          headerRight={
            <button onClick={addFaq} className="text-sm font-medium text-navy hover:underline">
              + Add FAQ
            </button>
          }
        >
          <div className="space-y-3">
            {faq.length === 0 && <p className="text-sm text-ink-soft">No FAQ entries yet.</p>}
            {faq.map((f, i) => (
              <div key={i} className="rounded-lg border border-border bg-paper/60 p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-soft text-[10px] font-bold text-teal">
                    Q
                  </span>
                  <input
                    value={f.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    placeholder="Question"
                    className={`${inputClass} w-full bg-panel`}
                  />
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-soft text-[10px] font-bold text-amber-deep">
                    A
                  </span>
                  <input
                    value={f.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    placeholder="Answer"
                    className={`${inputClass} w-full bg-panel`}
                  />
                </div>
                <button
                  onClick={() => removeFaq(i)}
                  className="mt-2 ml-7 text-xs font-medium text-red hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon="📋" title="Booking rules" description="Guardrails your AI follows when booking">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Min notice (hrs)</label>
              <input
                value={minNoticeHours}
                onChange={(e) => setMinNoticeHours(e.target.value)}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className={labelClass}>Buffer (min)</label>
              <input
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(e.target.value)}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className={labelClass}>Max/day</label>
              <input
                value={maxPerDay}
                onChange={(e) => setMaxPerDay(e.target.value)}
                className={`${inputClass} w-full`}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon="🚨"
          title="Escalation & notifications"
          description="Where things go when your AI can't handle it alone"
        >
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Forwarding number (emergencies)</label>
              <input
                value={forwardingNumber}
                onChange={(e) => setForwardingNumber(e.target.value)}
                className={`${inputClass} w-full`}
                placeholder="+49 170 1234567"
              />
            </div>
            <div>
              <label className={labelClass}>Notify email (call summaries)</label>
              <input
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className={`${inputClass} w-full`}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={labelClass}>Privacy policy URL</label>
              <input
                value={privacyPolicyUrl}
                onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                className={`${inputClass} w-full`}
                placeholder="https://yourbusiness.de/datenschutz"
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save AI settings"}
          </button>
          {saved && <span className="text-sm font-medium text-teal">Saved</span>}
        </div>
      </fieldset>
    </div>
  );
}
