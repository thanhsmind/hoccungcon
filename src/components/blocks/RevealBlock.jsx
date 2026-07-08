import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { RichText } from "../RichText.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Figure } from "../Figure.jsx";
import { Check } from "lucide-react";

export function RevealBlock({ s, award }) {
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const tap = (i) => {
    setOpen(open === i ? null : i);
    const ns = new Set(seen); ns.add(i); setSeen(ns);
    if (ns.size === s.cards.length) award();
  };
  return (
    <>
      <p style={{ fontWeight: 700, color: C.ink }}><RichText content={s.prompt} /></p>
      {s.figure && <Figure spec={s.figure} />}
      <div><HowTo>Bấm vào từng thẻ bên dưới để mở lời giải. Mở hết các thẻ để được sao.</HowTo></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {s.cards.map((c, i) => (
          <button key={i} onClick={() => tap(i)} style={{ background: open === i ? C.teal : "#fff", color: open === i ? "#fff" : C.ink, border: "2.5px solid " + C.ink, borderRadius: 14, padding: "14px 20px", fontWeight: 800, fontSize: 20, cursor: "pointer", minWidth: 84, boxShadow: open === i ? "none" : "3px 3px 0 rgba(22,36,63,0.18)", transform: open === i ? "translate(3px,3px)" : "none", transition: "all .12s" }}>
            <RichText content={c.label} />
          </button>
        ))}
      </div>
      {open !== null && (
        <div style={{ marginTop: 14, padding: 16, background: C.teal + "1A", border: "2px solid " + C.teal, borderRadius: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Check color={C.teal} style={{ flexShrink: 0 }} /><span style={{ color: C.ink, fontWeight: 600 }}><RichText content={s.cards[open].detail} /></span>
        </div>
      )}
    </>
  );
}
