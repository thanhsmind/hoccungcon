import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Globe, Lightbulb } from "lucide-react";

export function RealLifeBlock({ s, award }) {
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const tap = (i) => {
    setOpen(open === i ? null : i);
    const ns = new Set(seen); ns.add(i); setSeen(ns);
    if (ns.size === s.cards.length) award();
  };
  return (
    <Card style={{ background: C.teal + "12", borderColor: C.teal }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, letterSpacing: 1, fontWeight: 800, color: C.teal, textTransform: "uppercase", marginBottom: 8 }}>
        <Globe size={16} /> Ứng dụng vào đời sống
      </div>
      <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}>
        <RichText content={s.prompt || ["Những gì vừa học không chỉ nằm trên giấy. Bấm từng tình huống để xem nó xuất hiện thế nào trong cuộc sống hằng ngày:"]} />
      </p>
      <div><HowTo>Bấm vào từng tình huống để xem giải thích. Xem hết để được sao.</HowTo></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {s.cards.map((c, i) => (
          <button key={i} onClick={() => tap(i)} style={{ background: open === i ? C.teal : "#fff", color: open === i ? "#fff" : C.ink, border: "2.5px solid " + C.ink, borderRadius: 14, padding: "12px 18px", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: open === i ? "none" : "3px 3px 0 rgba(22,36,63,0.18)", transform: open === i ? "translate(3px,3px)" : "none", transition: "all .12s", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{c.emoji}</span><RichText content={c.label} />
          </button>
        ))}
      </div>
      {open !== null && (
        <div style={{ marginTop: 14, padding: 16, background: "#fff", border: "2px solid " + C.teal, borderRadius: 14, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Lightbulb color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ color: C.ink, fontWeight: 500, lineHeight: 1.55 }}><RichText content={s.cards[open].detail} /></span>
        </div>
      )}
    </Card>
  );
}
