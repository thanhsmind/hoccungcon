import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { RAD, P, arc } from "../../lib/geometry.js";
import { btnGhost } from "../../lib/styles.js";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { HowTo } from "../ui/HowTo.jsx";

/* hình học tương tác: kéo để đổi góc; chế độ crossing / bisector / transversal */
export function AnglesBlock({ s, award }) {
  const m = s.mode;
  const ranges = { crossing: [20, 160, 55], bisector: [20, 135, 70], transversal: [35, 75, 55], triangle: [30, 80, 55] };
  const [lo, hi, def] = ranges[m] || [20, 160, 55];
  const [deg, setDeg] = useState(s.start ?? def);
  const [deg2, setDeg2] = useState(s.start2 ?? 60);
  const [hl, setHl] = useState("dongvi");
  const [touched, setTouched] = useState(false);
  const change = (v) => { setDeg(v); if (!touched) { setTouched(true); award(); } };
  const change2 = (v) => { setDeg2(v); if (!touched) { setTouched(true); award(); } };

  const ray = (x1, y1, x2, y2, color, w = 2.5, dash) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />;
  const Arc = ({ cx, cy, r, a0, a1, color, label }) => {
    const span = (((a1 - a0) % 360) + 360) % 360;
    const lp = P(cx, cy, r + 15, a0 + span / 2);
    return <g>
      <path d={arc(cx, cy, r, a0, a1)} fill="none" stroke={color} strokeWidth={3.5} />
      <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 800, fontSize: 12.5, fill: color }}>{label}</text>
    </g>;
  };
  const dot = (x, y) => <circle cx={x} cy={y} r={4} fill={C.ink} />;
  const lbl = (x, y, t, color = C.ink) => <text x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 800, fontSize: 13, fill: color }}>{t}</text>;

  let svg = null, caption = null;
  const t = deg;

  if (m === "crossing") {
    const O = { x: 180, y: 120 }, L = 128;
    const e = (a) => P(O.x, O.y, L, a), el = (a) => P(O.x, O.y, L + 14, a);
    svg = <>
      {ray(e(0).x, e(0).y, e(180).x, e(180).y, C.ink)}
      {ray(e(t).x, e(t).y, e(t + 180).x, e(t + 180).y, C.ink)}
      <Arc cx={O.x} cy={O.y} r={34} a0={0} a1={t} color={C.coral} label={`${t}°`} />
      <Arc cx={O.x} cy={O.y} r={26} a0={t} a1={180} color={C.violet} label={`${180 - t}°`} />
      <Arc cx={O.x} cy={O.y} r={34} a0={180} a1={180 + t} color={C.coral} label={`${t}°`} />
      <Arc cx={O.x} cy={O.y} r={26} a0={180 + t} a1={360} color={C.violet} label={`${180 - t}°`} />
      {dot(O.x, O.y)}
      {lbl(el(0).x, el(0).y, "x")}{lbl(el(t).x, el(t).y, "y")}{lbl(el(180).x, el(180).y, "x'")}{lbl(el(180 + t).x, el(180 + t).y, "y'")}
      {lbl(O.x - 13, O.y + 13, "O", C.coral)}
    </>;
    caption = ["Hai góc ", { hl: "đối đỉnh", color: C.coral }, " luôn bằng nhau (cùng màu cam). Hai góc ", { hl: "kề bù", color: C.violet }, " có tổng 180°: ", `${t}° + ${180 - t}° = 180°.`];
  }

  if (m === "bisector") {
    const O = { x: 120, y: 196 }, L = 150, a = deg;
    const e = (ang) => P(O.x, O.y, L, ang), el = (ang) => P(O.x, O.y, L + 14, ang);
    const z = P(O.x, O.y, L - 22, a / 2), zl = P(O.x, O.y, L - 6, a / 2);
    svg = <>
      {ray(O.x, O.y, e(0).x, e(0).y, C.ink)}
      {ray(O.x, O.y, e(a).x, e(a).y, C.ink)}
      {ray(O.x, O.y, z.x, z.y, C.coral, 2.5, "5 4")}
      <Arc cx={O.x} cy={O.y} r={46} a0={0} a1={a / 2} color={C.teal} label={`${a / 2}°`} />
      <Arc cx={O.x} cy={O.y} r={46} a0={a / 2} a1={a} color={C.teal} label={`${a / 2}°`} />
      {dot(O.x, O.y)}
      {lbl(el(0).x, el(0).y, "x")}{lbl(el(a).x, el(a).y, "y")}{lbl(zl.x + 10, zl.y, "z", C.coral)}
      {lbl(O.x - 13, O.y + 6, "O", C.coral)}
    </>;
    caption = ["Tia ", { hl: "Oz", color: C.coral }, " là tia phân giác: xOz = zOy = ", `${a / 2}°`, " = một nửa của xOy = ", `${a}°`, "."];
  }

  if (m === "transversal") {
    const yA = 80, yB = 180, cx = 180, k = 50 / Math.tan(t * RAD);
    const A = { x: cx + k, y: yA }, B = { x: cx - k, y: yB };
    const dir = { x: A.x - B.x, y: A.y - B.y }, len = Math.hypot(dir.x, dir.y), u = { x: dir.x / len, y: dir.y / len };
    const T1 = { x: B.x - 42 * u.x, y: B.y - 42 * u.y }, T2 = { x: A.x + 42 * u.x, y: A.y + 42 * u.y };
    svg = <>
      {ray(18, yA, 342, yA, C.ink)}
      {ray(18, yB, 342, yB, C.ink)}
      {ray(T1.x, T1.y, T2.x, T2.y, C.ink, 2.5)}
      {hl === "dongvi" ? <>
        <Arc cx={A.x} cy={A.y} r={24} a0={0} a1={t} color={C.coral} label={`${t}°`} />
        <Arc cx={B.x} cy={B.y} r={24} a0={0} a1={t} color={C.coral} label={`${t}°`} />
      </> : <>
        <Arc cx={A.x} cy={A.y} r={24} a0={180} a1={180 + t} color={C.coral} label={`${t}°`} />
        <Arc cx={B.x} cy={B.y} r={24} a0={0} a1={t} color={C.coral} label={`${t}°`} />
      </>}
      {dot(A.x, A.y)}{dot(B.x, B.y)}
      {lbl(350, yA, "a")}{lbl(350, yB, "b")}{lbl(T2.x + 8, T2.y, "c", C.coral)}
    </>;
    caption = hl === "dongvi"
      ? ["Hai góc ", { hl: "đồng vị", color: C.coral }, " (cùng vị trí ở hai giao điểm) bằng nhau: ", `${t}° = ${t}°.`]
      : ["Hai góc ", { hl: "so le trong", color: C.coral }, " (nằm trong, khác phía đường cắt) bằng nhau: ", `${t}° = ${t}°.`];
  }

  if (m === "triangle") {
    const b = deg, c = deg2, a = 180 - b - c;            // góc tại B, C, A
    const Bp = { x: 0, y: 0 }, Cp = { x: 1, y: 0 };       // đơn vị (y hướng lên)
    const tt = Math.sin(c * RAD) / Math.sin((b + c) * RAD);
    const Ap = { x: tt * Math.cos(b * RAD), y: tt * Math.sin(b * RAD) };
    const xs = [Bp.x, Cp.x, Ap.x], ys = [Bp.y, Cp.y, Ap.y];
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const bw = (maxX - minX) || 1, bh = (maxY - minY) || 1, sc = Math.min(260 / bw, 150 / bh);
    const map = (p) => ({ x: 50 + (260 - bw * sc) / 2 + (p.x - minX) * sc, y: 45 + (150 - bh * sc) / 2 + (maxY - p.y) * sc });
    const Bs = map(Bp), Cs = map(Cp), As = map(Ap);
    const G = { x: (Bs.x + Cs.x + As.x) / 3, y: (Bs.y + Cs.y + As.y) / 3 };
    const mang = (V, Q) => Math.atan2(-(Q.y - V.y), Q.x - V.x) * 180 / Math.PI;
    const vertex = (V, n1, n2, val, color, letter) => {
      let a0 = mang(V, n1), a1 = mang(V, n2);
      let d = (((a1 - a0) % 360) + 360) % 360;
      if (d > 180) { const tmp = a0; a0 = a1; a1 = tmp; }
      const out = { x: V.x - G.x, y: V.y - G.y }, ol = Math.hypot(out.x, out.y) || 1;
      const lp = { x: V.x + out.x / ol * 16, y: V.y + out.y / ol * 16 };
      return <g key={letter}>
        <Arc cx={V.x} cy={V.y} r={22} a0={a0} a1={a1} color={color} label={`${val}°`} />
        {dot(V.x, V.y)}
        {lbl(lp.x, lp.y, letter, color)}
      </g>;
    };
    svg = <>
      <polygon points={`${Bs.x},${Bs.y} ${Cs.x},${Cs.y} ${As.x},${As.y}`} fill={C.amber + "18"} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
      {vertex(As, Bs, Cs, a, C.coral, "A")}
      {vertex(Bs, Cs, As, b, C.violet, "B")}
      {vertex(Cs, As, Bs, c, C.teal, "C")}
    </>;
    caption = ["Tổng ba góc trong tam giác: ", { hl: `${a}° + ${b}° + ${c}° = 180°`, color: C.coral }, ". Kéo hai thanh trượt — góc thứ ba luôn tự điều chỉnh để tổng bằng 180°."];
  }

  return (
    <Card>
      {s.prompt && <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>}
      <div style={{ background: C.paper, border: "2px solid " + C.ink, borderRadius: 16, padding: 8 }}>
        <svg viewBox="0 0 360 240" style={{ width: "100%", display: "block" }}>{svg}</svg>
      </div>
      <div style={{ marginTop: 12 }}><HowTo icon="drag">{m === "triangle" ? "Kéo hai thanh trượt bên dưới để đổi góc B và góc C — hình và số đo sẽ đổi theo." : m === "transversal" ? "Bấm nút để chọn loại cặp góc, rồi kéo thanh trượt bên dưới để đổi góc." : "Kéo thanh trượt bên dưới để đổi góc — hình và số đo sẽ đổi theo ngay."}</HowTo></div>
      {m === "transversal" && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
          {[["dongvi", "Góc đồng vị"], ["soletrong", "Góc so le trong"]].map(([k, t2]) => (
            <button key={k} onClick={() => { setHl(k); if (!touched) { setTouched(true); award(); } }}
              style={{ ...btnGhost, padding: "8px 14px", background: hl === k ? C.ink : "#fff", color: hl === k ? C.paper : C.ink }}>{t2}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: C.ink, whiteSpace: "nowrap", minWidth: m === "triangle" ? 56 : "auto" }}>{m === "triangle" ? "Góc B" : (s.sliderLabel || "Kéo đổi góc")}</span>
        <input type="range" min={lo} max={hi} value={deg} onChange={(e) => change(+e.target.value)} style={{ flex: 1, accentColor: m === "triangle" ? C.violet : C.coral }} />
        <span style={{ fontWeight: 800, color: m === "triangle" ? C.violet : C.coral, minWidth: 44, textAlign: "right" }}>{deg}°</span>
      </div>
      {m === "triangle" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.ink, whiteSpace: "nowrap", minWidth: 56 }}>Góc C</span>
          <input type="range" min={lo} max={hi} value={deg2} onChange={(e) => change2(+e.target.value)} style={{ flex: 1, accentColor: C.teal }} />
          <span style={{ fontWeight: 800, color: C.teal, minWidth: 44, textAlign: "right" }}>{deg2}°</span>
        </div>
      )}
      <div style={{ marginTop: 12, padding: 12, background: C.teal + "12", border: "2px solid " + C.teal, borderRadius: 12, color: C.ink, fontSize: 14.5, lineHeight: 1.5 }}>
        <RichText content={caption} />
      </div>
    </Card>
  );
}
