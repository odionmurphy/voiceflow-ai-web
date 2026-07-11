"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { listMessages } from "@/lib/records-api";
import { Message } from "@/lib/types";

const CHANNEL_ICON: Record<Message["channel"], string> = {
  sms: "💬",
  email: "✉️",
  push: "🔔",
};

const STATUS_STYLE: Record<Message["status"], string> = {
  sent: "bg-teal-soft text-teal",
  delivered: "bg-teal-soft text-teal",
  failed: "bg-red-soft text-red",
};

const TEMPLATE_LABEL: Record<string, string> = {
  confirmation: "Booking confirmation",
  cancellation: "Cancellation",
  reminder: "Reminder",
};

export default function MessagesPage() {
  const { activeBusiness } = useBusiness();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeBusiness) return;
    setLoading(true);
    listMessages(activeBusiness.id)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [activeBusiness]);

  if (!activeBusiness) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Messages</h1>
      <p className="mt-1 text-sm text-ink-soft">
        SMS and email confirmations sent to your customers.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            Loading...
          </p>
        ) : messages.length === 0 ? (
          <p className="rounded-xl border border-border bg-panel p-5 text-sm text-ink-soft">
            No messages sent yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-panel">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-paper/60 text-xs font-medium uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Channel</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Sent</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">
                      {m.customer_name ?? "Unknown customer"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {TEMPLATE_LABEL[m.template ?? ""] ?? m.template ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {CHANNEL_ICON[m.channel]} {m.channel.toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[m.status]}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {new Date(m.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
