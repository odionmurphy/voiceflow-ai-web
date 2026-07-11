const DAYS: { key: string; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

interface Props {
  value: Record<string, [string, string]>;
  onChange: (value: Record<string, [string, string]>) => void;
  disabled?: boolean;
}

export default function BusinessHoursEditor({ value, onChange, disabled }: Props) {
  function toggleDay(day: string, open: boolean) {
    const next = { ...value };
    if (open) next[day] = ["09:00", "18:00"];
    else delete next[day];
    onChange(next);
  }

  function setTime(day: string, index: 0 | 1, time: string) {
    const current = value[day] ?? ["09:00", "18:00"];
    const next = { ...value };
    next[day] = index === 0 ? [time, current[1]] : [current[0], time];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const hours = value[key];
        const open = !!hours;
        return (
          <div key={key} className="flex items-center gap-3 text-sm">
            <label className="flex w-32 shrink-0 items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={open}
                disabled={disabled}
                onChange={(e) => toggleDay(key, e.target.checked)}
              />
              {label}
            </label>
            {open ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={hours[0]}
                  disabled={disabled}
                  onChange={(e) => setTime(key, 0, e.target.value)}
                  className="rounded-lg border border-border px-2 py-1 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:opacity-60"
                />
                <span className="text-ink-soft">to</span>
                <input
                  type="time"
                  value={hours[1]}
                  disabled={disabled}
                  onChange={(e) => setTime(key, 1, e.target.value)}
                  className="rounded-lg border border-border px-2 py-1 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:opacity-60"
                />
              </div>
            ) : (
              <span className="text-ink-soft">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
