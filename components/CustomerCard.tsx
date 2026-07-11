import { Customer } from "@/lib/types";

interface Props {
  customer: Customer;
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function CustomerCard({ customer, onClick, style }: Props) {
  const initial = customer.full_name.trim().charAt(0).toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className="card-in group flex w-full items-center justify-between rounded-xl border border-border bg-panel p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-soft font-display text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{customer.full_name}</p>
          <p className="truncate text-xs text-ink-soft">{customer.phone_number}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-xs text-ink-soft sm:inline">
          {customer.last_visit_at
            ? `Last visit ${new Date(customer.last_visit_at).toLocaleDateString()}`
            : "No visits yet"}
        </span>
        <span className="text-ink-soft transition-transform group-hover:translate-x-0.5">
          ›
        </span>
      </div>
    </button>
  );
}
