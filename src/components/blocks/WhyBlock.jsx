import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { btnPrimary } from "../../lib/styles.js";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { HelpCircle, Lightbulb } from "lucide-react";

export function WhyBlock({ s, award }) {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ background: C.amber + "16", borderColor: C.amber }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, letterSpacing: 1, fontWeight: 800, color: "#B8860B", textTransform: "uppercase", marginBottom: 10 }}>
        <HelpCircle size={16} /> Dừng lại một chút — Tại sao?
      </div>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 800, fontFamily: "'Baloo 2'", color: C.ink, lineHeight: 1.3 }}>
        <RichText content={s.question} />
      </p>
      {s.hint && <p style={{ margin: "8px 0 0", color: C.ink, opacity: 0.7, fontStyle: "italic", lineHeight: 1.5 }}><RichText content={s.hint} /></p>}
      {!open ? (
        <button onClick={() => { setOpen(true); award(); }} style={{ ...btnPrimary, marginTop: 16, background: C.amber, color: C.ink }}>
          Thử nghĩ rồi xem vì sao <Lightbulb size={18} />
        </button>
      ) : (
        <div style={{ marginTop: 16, padding: 18, borderRadius: 16, background: "#fff", border: "2px solid " + C.amber }}>
          <div style={{ fontSize: 12, letterSpacing: 1, fontWeight: 800, color: "#B8860B", marginBottom: 8 }}>VÌ SAO?</div>
          <p style={{ margin: 0, color: C.ink, lineHeight: 1.65, fontSize: 16 }}><RichText content={s.answer} /></p>
          {s.takeaway && <p style={{ margin: "14px 0 0", padding: "12px 14px", borderRadius: 12, background: C.teal + "18", border: "2px dashed " + C.teal, color: C.ink, fontWeight: 700, lineHeight: 1.55 }}>
            <RichText content={s.takeaway} />
          </p>}
        </div>
      )}
    </Card>
  );
}
