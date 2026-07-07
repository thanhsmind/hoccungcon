import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { decimalInfo } from "../../lib/num.js";
import { btnGhost } from "../../lib/styles.js";
import { Frac } from "../Frac.jsx";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { Pill } from "../ui/Pill.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Check, X } from "lucide-react";

/* máy dò số thập phân: học sinh đoán hữu hạn/vô hạn trước, rồi mới khai triển */
export function DecimalBlock({ s, award }) {
  const [picks, setPicks] = useState(Array(s.items.length).fill(null));
  const pick = (i, v) => {
    if (picks[i]) return;
    const n = [...picks]; n[i] = v; setPicks(n);
    if (n.filter(Boolean).length === s.items.length) award();
  };
  return (
    <Card>
      {s.prompt && <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>}
      <div><HowTo>Với mỗi phân số, bấm đoán “Hữu hạn” hay “Vô hạn tuần hoàn”. Máy sẽ khai triển và chỉ ra chu kì cho em.</HowTo></div>
      <div style={{ display: "grid", gap: 12 }}>
        {s.items.map((it, i) => {
          const info = decimalInfo(it.n, it.d);
          const repeating = info.period !== "";
          const correct = repeating ? "vo" : "huu";
          const picked = picks[i];
          let frac = info.nonRepeat;
          if (repeating) { while (frac.length < 8) frac += info.period; frac = frac.slice(0, 8); }
          const expanded = info.sign + info.intPart + "," + frac + (repeating ? "…" : "");
          const compact = info.sign + info.intPart + "," + info.nonRepeat + (repeating ? "(" + info.period + ")" : "");
          return (
            <div key={i} style={{ border: "2px solid " + C.ink + (picked ? "" : "55"), borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Frac n={it.n} d={it.d} size={22} color={C.ink} />
              {!picked ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: C.ink + "99", alignSelf: "center", fontSize: 14 }}>là số…</span>
                  <button style={{ ...btnGhost, padding: "8px 14px" }} onClick={() => pick(i, "huu")}>Hữu hạn</button>
                  <button style={{ ...btnGhost, padding: "8px 14px" }} onClick={() => pick(i, "vo")}>Vô hạn tuần hoàn</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 18, color: C.ink }}>= {expanded}</span>
                  {repeating && <span style={{ fontWeight: 800, fontSize: 18, color: C.coral }}>= {compact}</span>}
                  <Pill bg={repeating ? C.violet : C.teal}>{repeating ? `Vô hạn tuần hoàn · chu kì ${info.period}` : "Hữu hạn"}</Pill>
                  {picked === correct ? <Check size={18} color={C.teal} /> : <X size={18} color={C.coral} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
