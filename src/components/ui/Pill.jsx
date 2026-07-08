import { C } from "../../lib/colors.js";

export const Pill = ({ children, bg = C.violet }) => (
  <span style={{ background: bg, color: "#fff", padding: "4px 12px", borderRadius: 20, fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>{children}</span>
);
