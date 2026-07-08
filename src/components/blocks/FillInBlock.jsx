import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { parseNum } from "../../lib/num.js";
import { inputBox, btnPrimary, btnGhost } from "../../lib/styles.js";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { Pill } from "../ui/Pill.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Figure } from "../Figure.jsx";
import { Check, X, Lightbulb } from "lucide-react";

export function FillInBlock({ s, award }) {
  const [vals, setVals] = useState(Array(s.questions.length).fill(""));
  const [res, setRes] = useState(Array(s.questions.length).fill(null));
  const [hintOn, setHintOn] = useState(Array(s.questions.length).fill(false));
  const check = (i) => {
    const ok = Math.abs(parseNum(vals[i]) - s.questions[i].answer) < (s.questions[i].tol ?? 1e-6);
    const nr = [...res]; nr[i] = ok; setRes(nr);
    if (nr.filter(Boolean).length >= Math.ceil(s.questions.length / 2)) award();
  };
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div><HowTo icon="type">Gõ đáp số vào ô rồi bấm “Kiểm tra”. Có thể nhập phân số kiểu 3/4 hoặc số thập phân 0,75. Bí thì bấm “Gợi ý”.</HowTo></div>
      {s.questions.map((q, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 700, color: C.ink, marginBottom: 10 }}><RichText content={q.ask} /></div>
          {q.figure && <Figure spec={q.figure} state={res[i] === true ? "answered" : "idle"} />}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input value={vals[i]} placeholder={s.placeholder || "vd: 3/4 hoặc 0,75"} onChange={(e) => { const v = [...vals]; v[i] = e.target.value; setVals(v); const r = [...res]; r[i] = null; setRes(r); }} style={{ ...inputBox, marginTop: 0, width: 200 }} />
            <button style={btnPrimary} onClick={() => check(i)}>Kiểm tra <Check size={16} /></button>
            {res[i] === true && <Pill bg={C.teal}><Check size={15} /> Đúng</Pill>}
            {res[i] === false && <Pill bg={C.coral}><X size={15} /> Chưa đúng</Pill>}
            {q.hint && <button style={{ ...btnGhost, padding: "8px 12px" }} onClick={() => { const h = [...hintOn]; h[i] = !h[i]; setHintOn(h); }}><Lightbulb size={15} color={C.amber} /> Gợi ý</button>}
          </div>
          {hintOn[i] && q.hint && <div style={{ marginTop: 10, fontSize: 14, color: C.ink, background: C.paper, padding: "10px 12px", borderRadius: 10 }}><RichText content={q.hint} /></div>}
        </Card>
      ))}
    </div>
  );
}
