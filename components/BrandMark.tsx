export default function BrandMark({
  size = "compact",
}: {
  size?: "compact" | "regular";
}) {
  return (
    <span
      aria-hidden="true"
      className={`ws-brand-mark ${size === "regular" ? "ws-brand-mark-regular" : "ws-brand-mark-compact"}`}
    >
      WS
    </span>
  );
}
