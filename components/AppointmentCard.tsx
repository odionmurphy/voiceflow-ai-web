import { Appointment } from "@/lib/types";

interface Props {
  appointment: Appointment;
  onClick: () => void;
  compact?: boolean;
  style?: React.CSSProperties;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-teal-soft text-teal",
  cancelled: "bg-red-soft text-red",
  pending: "bg-amber-soft text-amber-deep",
  completed: "bg-teal-soft text-teal",
  no_show: "bg-red-soft text-red",
};

const SOURCE_STYLES: Record<string, { className: string; icon: string; label: string }> = {
  ai_call: { className: "bg-purple-100 text-purple-700", icon: "🤖", label: "AI call" },
  manual: { className: "bg-slate-100 text-slate-600", icon: "✍️", label: "Manual" },
  web: { className: "bg-blue-100 text-blue-700", icon: "🌐", label: "Web" },
};

export default function AppointmentCard({ appointment, onClick, compact, style }: Props) {
  const start = new Date(appointment.start_time);

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`card-in group flex w-full items-center justify-between rounded-xl border border-border bg-panel text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md ${
        compact ? "px-4 py-3" : "p-5"
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-paper px-3 py-2 text-center">
          <span className="font-display text-sm font-semibold text-ink">
            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!compact && (
            <span className="text-[11px] uppercase tracking-wide text-ink-soft">
              {start.toLocaleDateString([], { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{appointment.customer_name ?? "Unknown"}</p>
          <p className="truncate text-xs text-ink-soft">{appointment.service_name ?? "Service TBD"}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {!compact && (
          <span
            className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${SOURCE_STYLES[appointment.source].className}`}
          >
            <span>{SOURCE_STYLES[appointment.source].icon}</span>
            {SOURCE_STYLES[appointment.source].label}
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            STATUS_STYLES[appointment.status]
          }`}
        >
          {appointment.status}
        </span>
        <span className="text-ink-soft transition-transform group-hover:translate-x-0.5">
          ›
        </span>
      </div>
    </button>
  );
}
