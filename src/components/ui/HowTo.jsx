import { Hand, Keyboard, MousePointerClick } from "lucide-react";
import { C } from "../../lib/colors.js";

/* hướng dẫn thao tác cho các trạm tương tác — icon: "drag" | "click" | "type" */
export function HowTo({ children, icon = "click" }) {
  const Ico = icon === "drag" ? Hand : icon === "type" ? Keyboard : MousePointerClick;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.amber + "26", border: "1.5px dashed " + C.amber, borderRadius: 999, padding: "6px 13px", fontSize: 13.5, fontWeight: 700, color: "#8A5A00", marginBottom: 14, lineHeight: 1.3 }}>
      <Ico size={16} style={{ flexShrink: 0 }} /> <span>{children}</span>
    </div>
  );
}
