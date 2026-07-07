import { C } from "../../lib/colors.js";

/* ───────── khối khung dùng chung ───────── */
export const Card = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 20, padding: 22, border: "2.5px solid " + C.ink, boxShadow: "6px 6px 0 rgba(22,36,63,0.12)", ...style }}>{children}</div>
);
