interface StatCardProps {
  label: string;
  value: string;
  note?: string;
  icon?: "calendar" | "phone" | "missed" | "euro";
  tone?: "navy" | "teal" | "red" | "amber";
  onClick?: () => void;
  trend?: number[] | null;
  trendLabel?: string;
  trendPositive?: boolean;
}

export default function StatCard({
  label,
  value,
  note,
  icon,
  tone = "navy",
  onClick,
  trendLabel,
  trendPositive = true,
}: StatCardProps) {
  const Tag = onClick ? "button" : "div";
  const toneStyles: Record<
    NonNullable<StatCardProps["tone"]>,
    { icon: string }
  > = {
    navy: { icon: "bg-navy/8 text-navy" },
    teal: { icon: "bg-teal/10 text-teal" },
    red: { icon: "bg-red/10 text-red" },
    amber: { icon: "bg-amber/10 text-amber-deep" },
  };

  return (
    <Tag
      onClick={onClick}
      type={onClick ? "button" : undefined}
      aria-label={onClick ? `${label}: ${value}` : undefined}
      className={`dashboard-card group relative flex min-h-[132px] w-full flex-col justify-between overflow-hidden rounded-[18px] p-4 text-left transition-all duration-200 sm:p-[18px] ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {icon ? (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${toneStyles[tone].icon}`}
            aria-hidden="true"
          >
            <StatIcon name={icon} />
          </span>
        ) : (
          <span />
        )}
        {trendLabel ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${trendPositive ? "bg-[#d9f6ec] text-[#259b7b]" : "bg-[#fff0e9] text-[#d95637]"}`}>
            <span aria-hidden="true">{trendLabel.startsWith("-") ? "↘" : "↗"}</span>
            {trendLabel}
          </span>
        ) : onClick ? (
          <span className="text-sm text-ink-soft/50" aria-hidden="true">↗</span>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="font-display text-[27px] font-semibold leading-none tracking-tight text-ink">
          {value}
        </p>
        <p className="mt-1.5 text-xs text-ink-soft">{label}</p>
        {note && <p className="mt-1 text-[10px] text-ink-soft">{note}</p>}
      </div>
    </Tag>
  );
}

function StatIcon({ name }: { name: NonNullable<StatCardProps["icon"]> }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...common}>
      {name === "calendar" && (
        <>
          <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
          <path d="M8 3.5v4M16 3.5v4M4 10h16M9 14l2 2 4-4" />
        </>
      )}
      {name === "phone" && (
        <path d="M7.1 3.8h2.6l1.2 4.1-1.8 1.5a15.2 15.2 0 0 0 5.5 5.5l1.5-1.8 4.1 1.2v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.1 6a2 2 0 0 1 2-2.2Z" />
      )}
      {name === "missed" && (
        <>
          <path d="M4 14.5a8 8 0 0 1 13.7-5.7M4 14.5v4h4M20 9l-6 6m0-6 6 6" />
        </>
      )}
      {name === "euro" && <path d="M18 6.5A7 7 0 0 0 7 12a7 7 0 0 0 11 5.5M5 10h9M5 14h8" />}
    </svg>
  );
}
