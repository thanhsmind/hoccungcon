import { Sparkles } from "lucide-react";
import { C } from "../../lib/colors.js";
import { ICON } from "../../lib/icons.js";

export function StationShell({ s, children }) {
  const Icon = ICON[s.icon] || Sparkles;
  return (
    <section id={s.id} style={{ scrollMarginTop: 86, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: C.ink, color: C.paper, display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "4px 4px 0 " + C.coral, fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 22 }}>{s.num}</div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.coral, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><Icon size={13} /> Trạm {s.num}</div>
          <h2 style={{ margin: 0, fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 27, color: C.ink, lineHeight: 1.1 }}>{s.title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
