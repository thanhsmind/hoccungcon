import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { decToFrac } from "../../lib/num.js";
import { inputBox, btnPrimary, btnGhost } from "../../lib/styles.js";
import { Frac } from "../Frac.jsx";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Target } from "lucide-react";

export function CalculatorBlock({ s, award }) {
  const init = {}; s.inputs.forEach((i) => (init[i.key] = i.default));
  const [vals, setVals] = useState(init);
  const [done, setDone] = useState(false);
  const compute = () => { try { const keys = s.inputs.map((i) => i.key); const fn = new Function(...keys, `return (${s.formula});`); return fn(...keys.map((k) => Number(vals[k]))); } catch { return NaN; } };
  const r = compute();
  const dec = s.decimals ?? 3;
  const band = s.bands ? (s.bands.find((b) => r <= b.max) || s.bands[s.bands.length - 1]) : null;
  const [fn, fd] = s.fracView ? [Number(vals[s.fracView[0]]), Number(vals[s.fracView[1]])] : [null, null];
  const [rn, rd] = isFinite(r) ? decToFrac(Math.round(r * 1000) / 1000) : [0, 1];
  return (
    <Card>
      <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>
      <div><HowTo icon="type">{s.presets ? "Gõ số vào các ô (hoặc bấm nút ví dụ có sẵn), rồi bấm nút tính ở dưới." : "Gõ số vào các ô bên dưới, rồi bấm nút tính để xem kết quả."}</HowTo></div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.inputs.length},1fr)`, gap: 14, marginBottom: 14 }}>
        {s.inputs.map((inp) => (
          <label key={inp.key} style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{inp.label}
            <input type="number" value={vals[inp.key]} onChange={(e) => { setVals({ ...vals, [inp.key]: e.target.value }); setDone(false); }} style={inputBox} />
          </label>
        ))}
      </div>
      {s.presets && <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        {s.presets.map((p, i) => <button key={i} style={btnGhost} onClick={() => { setVals(p.values); setDone(false); }}>{p.label}</button>)}
      </div>}
      <div style={{ background: C.paper, border: "2px dashed " + C.ink, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {s.fracView && <><Frac n={fn} d={fd} size={24} color={C.ink} /><span style={{ fontWeight: 800, fontSize: 20 }}>=</span></>}
        {!s.hideFrac && <Frac n={rn} d={rd} size={22} color={C.coral} />}
        <span style={{ fontWeight: 800, fontSize: 20, color: s.hideFrac ? C.coral : C.ink }}>{s.hideFrac ? "≈" : "≈"} {isFinite(r) ? r.toFixed(dec) : "—"}</span>
      </div>
      {!done ? (
        <button onClick={() => { setDone(true); award(); }} style={{ ...btnPrimary, marginTop: 16 }}>{s.cta || "Tính kết quả"} <Target size={18} /></button>
      ) : (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: (band ? band.color : C.teal) + "22", border: "2px solid " + (band ? band.color : C.teal) }}>
          {band && <div style={{ fontWeight: 800, fontSize: 18, color: band.color }}>→ {s.resultLabel || "Kết quả"}: {band.name}</div>}
          {s.onResultNote && <p style={{ margin: band ? "8px 0 0" : 0, color: C.ink, lineHeight: 1.5 }}><RichText content={s.onResultNote} /></p>}
        </div>
      )}
    </Card>
  );
}
