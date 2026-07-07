export function Frac({ n, d, size = 22, color = "currentColor" }) {
  if (d === 1 || d === undefined) return <span style={{ fontWeight: 800 }}>{n}</span>;
  const numeric = typeof n === "number";
  const neg = numeric && n < 0;
  const absN = numeric ? Math.abs(n) : n;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, verticalAlign: "middle" }}>
      {neg && <span style={{ fontWeight: 800, fontSize: size }}>−</span>}
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{ fontWeight: 800, fontSize: size * 0.78, padding: "0 4px" }}>{absN}</span>
        <span style={{ height: 2, width: "100%", background: color, borderRadius: 2, margin: "2px 0" }} />
        <span style={{ fontWeight: 800, fontSize: size * 0.78, padding: "0 4px" }}>{d}</span>
      </span>
    </span>
  );
}
