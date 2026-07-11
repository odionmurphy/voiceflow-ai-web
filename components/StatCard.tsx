interface StatCardProps {
  label: string;
  value: string;
  note?: string;
  icon?: string;
  tone?: "navy" | "teal" | "red" | "amber";
  onClick?: () => void;
}

const TONE_BG: Record<NonNullable<StatCardProps["tone"]>, string> = {
  navy: "bg-navy",
  teal: "bg-teal",
  red: "bg-red",
  amber: "bg-amber-deep",
};

export default function StatCard({
  label,
  value,
  note,
  icon,
  tone = "navy",
  onClick,
}: StatCardProps) {
  const Tag = onClick ? "button" : "div";
  const highlighted = tone === "red";

  return (
    <Tag
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-200 ${
        highlighted ? "border-red/30 bg-red-soft" : "border-border bg-panel"
      } ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""}`}
    >
      <div className={`h-1 w-full ${TONE_BG[tone]}`} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          {icon ? (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${TONE_BG[tone]}`}
            >
              {icon}
            </span>
          ) : (
            <span />
          )}
          {onClick && (
            <span className="text-ink-soft/40 transition-transform group-hover:translate-x-0.5">
              ›
            </span>
          )}
        </div>
        <p
          className={`mt-2.5 font-display text-3xl font-semibold tracking-tight ${
            highlighted ? "text-red" : "text-ink"
          }`}
        >
          {value}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          {label}
        </p>
        {note && <p className="mt-2 text-xs text-ink-soft/70">{note}</p>}
      </div>
    </Tag>
  );
}
