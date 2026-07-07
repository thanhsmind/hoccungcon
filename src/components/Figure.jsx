import React from "react";
import { C } from "../lib/colors.js";
import { RAD, P, arc } from "../lib/geometry.js";

/* thư viện HÌNH TĨNH tham số hoá — gắn vào lý thuyết & bài tập hình học */
function triLayout(b, c, box) {
  const Bp = { x: 0, y: 0 }, Cp = { x: 1, y: 0 };
  const tt = Math.sin(c * RAD) / Math.sin((b + c) * RAD);
  const Ap = { x: tt * Math.cos(b * RAD), y: tt * Math.sin(b * RAD) };
  const xs = [Bp.x, Cp.x, Ap.x], ys = [Bp.y, Cp.y, Ap.y];
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const bw = (maxX - minX) || 1, bh = (maxY - minY) || 1, sc = Math.min(box.w / bw, box.h / bh);
  const map = (p) => ({ x: box.x + (box.w - bw * sc) / 2 + (p.x - minX) * sc, y: box.y + (box.h - bh * sc) / 2 + (maxY - p.y) * sc });
  return { B: map(Bp), C: map(Cp), A: map(Ap) };
}
export function Figure({ spec, state }) {
  if (!spec) return null;
  const flash = state === "answered";
  const ink = C.ink, coral = C.coral, violet = C.violet, teal = C.teal;
  const RL = (raw) => (flash && raw === "?") ? (spec.ans ?? "?") : raw;   // hiện đáp án khi đã trả lời
  const L = (x1, y1, x2, y2, col = ink, w = 2, dash) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />;
  const Ar = (cx, cy, r, a0, a1, col, lab, lr = 14, hl = false) => { const sp = (((a1 - a0) % 360) + 360) % 360; const lp = P(cx, cy, r + lr, a0 + sp / 2); const show = RL(lab); return <g>{hl && flash && <path d={arc(cx, cy, r, a0, a1)} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" className="figFlash" />}<path d={arc(cx, cy, r, a0, a1)} fill="none" stroke={col} strokeWidth={3} />{show != null && show !== "" && <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 800, fontSize: hl && flash ? 13.5 : 12, fill: col }}>{show}</text>}</g>; };
  const D = (x, y) => <circle cx={x} cy={y} r={3.5} fill={ink} />;
  const T = (x, y, t, col = ink, sz = 13) => <text x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 800, fontSize: sz, fill: col }}>{t}</text>;
  const tick = (x1, y1, x2, y2, n, col = ink) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, px = -dy / len, py = dx / len, out = []; for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * 4, cx = mx + dx / len * off, cy = my + dy / len * off; out.push(<line key={i} x1={cx - px * 5} y1={cy - py * 5} x2={cx + px * 5} y2={cy + py * 5} stroke={col} strokeWidth={2} />); } return <g>{out}</g>; };
  const isHL = (raw) => raw === "?";
  const k = spec.kind;
  let vb = "0 0 300 150", body = null;

  if (k === "kebu") {
    const O = { x: 150, y: 100 }, a = spec.a ?? 65, t = P(O.x, O.y, 80, a);
    const lR = spec.lb ?? `${a}°`, lL = spec.la ?? `${180 - a}°`;
    vb = "0 0 300 140";
    body = <>{L(20, 100, 280, 100)}{L(O.x, O.y, t.x, t.y)}
      {Ar(O.x, O.y, 34, 0, a, violet, lR, 14, isHL(lR))}{Ar(O.x, O.y, 26, a, 180, coral, lL, 14, isHL(lL))}
      {D(O.x, O.y)}{T(12, 100, "n")}{T(288, 100, "m")}{T(t.x, t.y - 9, "t")}{T(O.x + 4, 116, "O", coral)}</>;
  }
  if (k === "crossing") {
    const O = { x: 150, y: 85 }, a = spec.a ?? 55, e = (g) => P(O.x, O.y, 118, g), el = (g) => P(O.x, O.y, 132, g);
    const l1 = spec.l1 ?? `${a}°`, l2 = spec.l2 ?? `${180 - a}°`, l3 = spec.l3 ?? `${a}°`, l4 = spec.l4 ?? `${180 - a}°`;
    vb = "0 0 300 175";
    body = <>{L(e(0).x, e(0).y, e(180).x, e(180).y)}{L(e(a).x, e(a).y, e(a + 180).x, e(a + 180).y)}
      {Ar(O.x, O.y, 30, 0, a, coral, l1, 14, isHL(l1))}{Ar(O.x, O.y, 23, a, 180, violet, l2, 14, isHL(l2))}
      {Ar(O.x, O.y, 30, 180, 180 + a, coral, l3, 14, isHL(l3))}{Ar(O.x, O.y, 23, 180 + a, 360, violet, l4, 14, isHL(l4))}
      {D(O.x, O.y)}{T(el(0).x, el(0).y, "x")}{T(el(a).x, el(a).y, "y")}{T(el(180).x, el(180).y, "x'")}{T(el(180 + a).x, el(180 + a).y, "y'")}</>;
  }
  if (k === "bisector") {
    const O = { x: 64, y: 122 }, a = spec.a ?? 70, e = (g) => P(O.x, O.y, 168, g), el = (g) => P(O.x, O.y, 182, g), z = P(O.x, O.y, 150, a / 2);
    const lab = spec.hide && !flash ? "?" : `${a / 2}°`, hl = !!spec.hide;
    vb = "0 0 300 150";
    body = <>{L(O.x, O.y, e(0).x, e(0).y)}{L(O.x, O.y, e(a).x, e(a).y)}{L(O.x, O.y, z.x, z.y, coral, 2, "5 4")}
      {Ar(O.x, O.y, 42, 0, a / 2, teal, lab, 14, hl)}{Ar(O.x, O.y, 42, a / 2, a, teal, lab, 14, hl)}
      {D(O.x, O.y)}{T(el(0).x, el(0).y, "x")}{T(el(a).x, el(a).y, "y")}{T(z.x + 10, z.y - 4, "z", coral)}{T(O.x - 8, O.y + 6, "O", coral)}</>;
  }
  if (k === "parallel") {
    const yA = 42, yB = 118, a = spec.a ?? 50, cx = 150, kk = 38 / Math.tan(a * RAD);
    const A = { x: cx + kk, y: yA }, B = { x: cx - kk, y: yB };
    const dir = { x: A.x - B.x, y: A.y - B.y }, len = Math.hypot(dir.x, dir.y), u = { x: dir.x / len, y: dir.y / len };
    const T1 = { x: B.x - 34 * u.x, y: B.y - 34 * u.y }, T2 = { x: A.x + 34 * u.x, y: A.y + 34 * u.y };
    const mk = spec.mark || "dongvi";
    const laR = spec.la ?? (mk === "trongcungphia" ? `${180 - a}°` : `${a}°`);
    const lbR = spec.lb ?? `${a}°`;
    const col = mk === "trongcungphia" ? violet : coral;
    vb = "0 0 300 150";
    body = <>{L(14, yA, 286, yA)}{L(14, yB, 286, yB)}{L(T1.x, T1.y, T2.x, T2.y)}
      {flash && <g className="figPulse">{L(14, yA, 286, yA, teal, 7)}{L(14, yB, 286, yB, teal, 7)}</g>}
      {mk === "soletrong"
        ? <>{Ar(A.x, A.y, 20, 180, 180 + a, col, laR, 14, isHL(laR))}{Ar(B.x, B.y, 20, 0, a, col, lbR, 14, isHL(lbR))}</>
        : mk === "trongcungphia"
          ? <>{Ar(A.x, A.y, 20, 180 + a, 360, col, laR, 14, isHL(laR))}{Ar(B.x, B.y, 20, 0, a, col, lbR, 14, isHL(lbR))}</>
          : <>{Ar(A.x, A.y, 20, 0, a, col, laR, 14, isHL(laR))}{Ar(B.x, B.y, 20, 0, a, col, lbR, 14, isHL(lbR))}</>}
      {D(A.x, A.y)}{D(B.x, B.y)}{T(294, yA, "a")}{T(294, yB, "b")}{T(T2.x + 7, T2.y, "c", coral)}</>;
  }
  if (k === "triangle") {
    const b = spec.b ?? 60, c = spec.c ?? 60, V = triLayout(b, c, { x: 40, y: 28, w: 220, h: 120 });
    const G = { x: (V.A.x + V.B.x + V.C.x) / 3, y: (V.A.y + V.B.y + V.C.y) / 3 };
    const names = spec.names || ["A", "B", "C"];
    const labs = [spec.labelA, spec.labelB, spec.labelC];
    const cols = [coral, violet, teal];
    const mang = (v, q) => Math.atan2(-(q.y - v.y), q.x - v.x) * 180 / Math.PI;
    const vtx = (v, n1, n2, lab, col, name) => { let a0 = mang(v, n1), a1 = mang(v, n2); if ((((a1 - a0) % 360) + 360) % 360 > 180) { const t = a0; a0 = a1; a1 = t; } const o = { x: v.x - G.x, y: v.y - G.y }, ol = Math.hypot(o.x, o.y) || 1, lp = { x: v.x + o.x / ol * 15, y: v.y + o.y / ol * 15 }; return <g>{lab != null && Ar(v.x, v.y, 19, a0, a1, col, lab, 13, isHL(lab))}{D(v.x, v.y)}{T(lp.x, lp.y, name, col)}</g>; };
    vb = "0 0 300 165";
    body = <><polygon points={`${V.B.x},${V.B.y} ${V.C.x},${V.C.y} ${V.A.x},${V.A.y}`} fill={C.amber + "18"} stroke={ink} strokeWidth={2.4} strokeLinejoin="round" />
      {vtx(V.A, V.B, V.C, labs[0], cols[0], names[0])}{vtx(V.B, V.C, V.A, labs[1], cols[1], names[1])}{vtx(V.C, V.A, V.B, labs[2], cols[2], names[2])}</>;
  }
  if (k === "two-triangles") {
    const marks = spec.marks || "ccc";
    const n1 = spec.names1 || ["A", "B", "C"], n2 = spec.names2 || ["A'", "B'", "C'"];
    const t1 = { A: { x: 70, y: 26 }, B: { x: 22, y: 120 }, C: { x: 116, y: 116 } };
    const t2 = { A: { x: 240, y: 26 }, B: { x: 192, y: 120 }, C: { x: 286, y: 116 } };
    const mang = (v, q) => Math.atan2(-(q.y - v.y), q.x - v.x) * 180 / Math.PI;
    const vArc = (v, p1, p2, col) => { let a0 = mang(v, p1), a1 = mang(v, p2); if ((((a1 - a0) % 360) + 360) % 360 > 180) { const x = a0; a0 = a1; a1 = x; } return <path d={arc(v.x, v.y, 15, a0, a1)} fill="none" stroke={col} strokeWidth={3} />; };
    const tri = (t, nm) => {
      const els = [];
      if (marks === "ccc") els.push(tick(t.A.x, t.A.y, t.B.x, t.B.y, 1, coral), tick(t.B.x, t.B.y, t.C.x, t.C.y, 3, teal), tick(t.C.x, t.C.y, t.A.x, t.A.y, 2, violet));
      if (marks === "cgc") els.push(tick(t.A.x, t.A.y, t.B.x, t.B.y, 1, coral), tick(t.A.x, t.A.y, t.C.x, t.C.y, 2, violet), vArc(t.A, t.B, t.C, teal));
      if (marks === "gcg") els.push(tick(t.B.x, t.B.y, t.C.x, t.C.y, 1, coral), vArc(t.B, t.C, t.A, violet), vArc(t.C, t.A, t.B, teal));
      return <g>
        <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`} fill={C.amber + "18"} stroke={ink} strokeWidth={2.4} strokeLinejoin="round" />
        {flash && <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`} fill={teal} className="figPulse" />}
        {els.map((e, i) => <g key={i}>{e}</g>)}
        {T(t.A.x, t.A.y - 11, nm[0])}{T(t.B.x - 11, t.B.y + 6, nm[1])}{T(t.C.x + 12, t.C.y + 6, nm[2])}</g>;
    };
    vb = "0 0 320 150";
    body = <>{tri(t1, n1)}{tri(t2, n2)}</>;
  }
  if (k === "right-triangles") {
    const marks = spec.marks || "cgc";
    const n1 = spec.names1 || ["A", "B", "C"], n2 = spec.names2 || ["A'", "B'", "C'"];
    const t1 = { A: { x: 32, y: 32 }, C: { x: 32, y: 118 }, B: { x: 132, y: 118 } };
    const t2 = { A: { x: 202, y: 32 }, C: { x: 202, y: 118 }, B: { x: 302, y: 118 } };
    const mang = (v, q) => Math.atan2(-(q.y - v.y), q.x - v.x) * 180 / Math.PI;
    const vArc = (v, p1, p2, col) => { let a0 = mang(v, p1), a1 = mang(v, p2); if ((((a1 - a0) % 360) + 360) % 360 > 180) { const x = a0; a0 = a1; a1 = x; } return <path d={arc(v.x, v.y, 16, a0, a1)} fill="none" stroke={col} strokeWidth={3} />; };
    const sq = (t) => { const s = 11; return <path d={`M ${t.C.x + s} ${t.C.y} L ${t.C.x + s} ${t.C.y - s} L ${t.C.x} ${t.C.y - s}`} fill="none" stroke={ink} strokeWidth={1.6} />; };
    const tri = (t, nm) => {
      const els = [sq(t)];
      if (marks === "cgc") els.push(tick(t.C.x, t.C.y, t.B.x, t.B.y, 1, coral), tick(t.C.x, t.C.y, t.A.x, t.A.y, 2, violet));
      if (marks === "gcg") els.push(tick(t.C.x, t.C.y, t.B.x, t.B.y, 1, coral), vArc(t.B, t.C, t.A, teal));
      if (marks === "huyen-goc") els.push(tick(t.A.x, t.A.y, t.B.x, t.B.y, 3, teal), vArc(t.B, t.C, t.A, coral));
      if (marks === "huyen-cgv") els.push(tick(t.A.x, t.A.y, t.B.x, t.B.y, 3, teal), tick(t.C.x, t.C.y, t.B.x, t.B.y, 1, coral));
      return <g>
        <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`} fill={C.amber + "18"} stroke={ink} strokeWidth={2.4} strokeLinejoin="round" />
        {flash && <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`} fill={teal} className="figPulse" />}
        {els.map((e, i) => <g key={i}>{e}</g>)}
        {T(t.A.x - 11, t.A.y, nm[0])}{T(t.B.x + 12, t.B.y + 4, nm[1])}{T(t.C.x - 11, t.C.y + 8, nm[2])}</g>;
    };
    vb = "0 0 334 150";
    body = <>{tri(t1, n1)}{tri(t2, n2)}</>;
  }
  if (k === "euclid") {
    vb = "0 0 300 130";
    const M = { x: 165, y: 48 };
    body = <>{L(20, 104, 280, 104)}{L(40, 48, 285, 48, coral, 2.5)}{L(55, 95, 250, 18, ink, 1.5, "4 4")}
      {D(M.x, M.y)}{T(M.x, M.y - 11, "M", coral)}{T(290, 48, "b", coral)}{T(290, 104, "a")}
      <text x={150} y={124} textAnchor="middle" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 700, fontSize: 11, fill: ink, opacity: 0.7 }}>chỉ một đường thẳng b qua M song song với a</text></>;
  }

  return (
    <div style={{ background: C.paper, border: "2px solid " + C.ink, borderRadius: 14, padding: 8, marginTop: 12, marginBottom: spec.below ? 0 : 4 }}>
      <svg viewBox={vb} style={{ width: "100%", maxHeight: 210, display: "block" }}>{body}</svg>
      {spec.caption && <div style={{ textAlign: "center", fontSize: 11.5, fontStyle: "italic", color: C.ink, opacity: 0.7, marginTop: 2 }}>{spec.caption}</div>}
    </div>
  );
}
