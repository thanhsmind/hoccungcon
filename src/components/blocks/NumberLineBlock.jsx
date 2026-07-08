import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { gcd, decToFrac } from "../../lib/num.js";
import { btnPrimary, btnGhost } from "../../lib/styles.js";
import { Frac } from "../Frac.jsx";
import { RichText } from "../RichText.jsx";
import { NumberLine } from "../NumberLine.jsx";
import { Card } from "../ui/Card.jsx";
import { Pill } from "../ui/Pill.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Check, X, ArrowRight, Lightbulb } from "lucide-react";

export function NumberLineBlock({ s, award }) {
  // mirror
  if (s.mode === "mirror") {
    const [v, setV] = useState(s.start ?? 1.5);
    const [touched, setTouched] = useState(false);
    const [n, d] = decToFrac(Math.round(v * s.denom) / s.denom);
    return (
      <Card>
        <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>
        <div><HowTo icon="drag">Dùng chuột (hoặc ngón tay) kéo chấm tròn màu cam dọc theo trục số.</HowTo></div>
        <NumberLine min={s.min} max={s.max} denom={s.denom} value={v} mirror onChange={(x) => { setV(x); if (!touched && Math.abs(x) > 0.01) { setTouched(true); award(); } }} />
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
          <Pill bg={C.coral}>a = <Frac n={n} d={d} size={15} color="#fff" /></Pill>
          <Pill bg={C.violet}>−a = <Frac n={-n} d={d} size={15} color="#fff" /></Pill>
        </div>
      </Card>
    );
  }
  // place
  if (s.mode === "place") {
    const [qi, setQi] = useState(0); const t = s.targets[qi]; const target = t.n / t.d;
    const [v, setV] = useState(0); const [res, setRes] = useState(null);
    const check = () => { const ok = Math.abs(v - target) < 1e-6; setRes(ok); if (ok) award(); };
    return (
      <Card>
        <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}>Chia mỗi đoạn đơn vị thành <b>{t.d}</b> phần bằng nhau rồi đếm. Kéo chấm cam đến đúng vị trí của:</p>
        <div style={{ textAlign: "center", marginBottom: 6 }}><Pill bg={C.coral}>Mục tiêu: <Frac n={t.n} d={t.d} size={18} color="#fff" /></Pill></div>
        <div><HowTo icon="drag">Kéo chấm tròn màu cam đến đúng vị trí, rồi bấm “Kiểm tra”. Bấm “Câu khác” để đổi đề.</HowTo></div>
        <NumberLine min={s.min} max={s.max} denom={t.d} value={v} onChange={(x) => { setV(x); setRes(null); }} />
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
          {res === null && <button style={btnPrimary} onClick={check}>Kiểm tra <Check size={18} /></button>}
          {res === true && <Pill bg={C.teal}><Check size={16} /> Chính xác!</Pill>}
          {res === false && <Pill bg={C.coral}><X size={16} /> Đếm lại số phần nhé.</Pill>}
          <button style={btnGhost} onClick={() => { setQi((qi + 1) % s.targets.length); setV(0); setRes(null); }}>Câu khác <ArrowRight size={16} /></button>
        </div>
      </Card>
    );
  }
  // compare
  const [pi, setPi] = useState(0); const p = s.pairs[pi];
  const lcd = (p.a[1] * p.b[1]) / gcd(p.a[1], p.b[1]);
  const av = p.a[0] / p.a[1], bv = p.b[0] / p.b[1];
  const an = p.a[0] * (lcd / p.a[1]), bn = p.b[0] * (lcd / p.b[1]);
  const [pick, setPick] = useState(null);
  const correct = av < bv ? "lt" : av > bv ? "gt" : "eq";
  const sameDenom = p.a[1] === p.b[1];
  return (
    <Card>
      <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}>Hai số <b>cùng mẫu</b> thì chỉ cần <b>so tử</b>. Nếu <b>khác mẫu</b>, hãy <b>quy đồng về cùng mẫu dương</b> rồi mới so tử. Trên trục số, số <b>nhỏ hơn</b> nằm <b>bên trái</b>.</p>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <Pill bg={sameDenom ? C.teal : C.amber}>{sameDenom ? "Cùng mẫu rồi — chỉ cần so tử" : "Khác mẫu — quy đồng về mẫu chung " + lcd}</Pill>
      </div>
      <div style={{ background: C.paper, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 12, border: "2px dashed " + C.ink }}>
        {sameDenom ? (<>
          <Frac n={p.a[0]} d={p.a[1]} size={22} color={C.coral} />
          <span style={{ margin: "0 10px", fontWeight: 800, color: C.violet, fontSize: 22 }}>?</span>
          <Frac n={p.b[0]} d={p.b[1]} size={22} color={C.violet} />
        </>) : (<>
          <Frac n={p.a[0]} d={p.a[1]} size={22} color={C.coral} /><span style={{ fontWeight: 800 }}>=</span><Frac n={an} d={lcd} size={20} color={C.coral} />
          <span style={{ margin: "0 10px", fontWeight: 800, color: C.violet, fontSize: 22 }}>?</span>
          <Frac n={bn} d={lcd} size={20} color={C.violet} /><span style={{ fontWeight: 800 }}>=</span><Frac n={p.b[0]} d={p.b[1]} size={22} color={C.violet} />
        </>)}
      </div>
      <NumberLine min={s.min} max={s.max} denom={lcd > 8 ? 4 : lcd} value={av} secondary={bv} interactive={false} snap={false} height={158} />
      <div style={{ textAlign: "center", marginTop: 8 }}><HowTo>Nhìn trục số rồi bấm chọn một trong ba nút so sánh bên dưới.</HowTo></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
        {[["lt", "Cam < Tím"], ["eq", "Bằng nhau"], ["gt", "Cam > Tím"]].map(([k, lb]) => (
          <button key={k} onClick={() => { setPick(k); if (k === correct) award(); }} disabled={pick !== null}
            style={{ ...btnGhost, background: pick === k ? (k === correct ? C.teal : C.coral) : "#fff", color: pick === k ? "#fff" : C.ink, borderColor: pick && k === correct ? C.teal : C.ink }}>{lb}</button>
        ))}
      </div>
      {pick && <div style={{ textAlign: "center", marginTop: 12 }}>
        <Pill bg={pick === correct ? C.teal : C.coral}>{pick === correct ? <Check size={16} /> : <X size={16} />}{correct === "lt" ? " Số cam nhỏ hơn" : correct === "gt" ? " Số cam lớn hơn" : " Bằng nhau"}</Pill>
        <div style={{ marginTop: 10 }}><button style={btnPrimary} onClick={() => { setPi((pi + 1) % s.pairs.length); setPick(null); }}>Cặp khác <ArrowRight size={16} /></button></div>
      </div>}
      {s.note && <div style={{ marginTop: 14, padding: 12, background: C.violet + "14", borderRadius: 12, fontSize: 14, color: C.ink, display: "flex", gap: 8 }}><Lightbulb size={18} color={C.violet} style={{ flexShrink: 0 }} /><span><RichText content={s.note} /></span></div>}
    </Card>
  );
}
