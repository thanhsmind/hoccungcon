import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity, Check, X, ArrowRight, Star, Sparkles, Target, Scale, Hash,
  MoveHorizontal, Trophy, Lightbulb, ChevronDown, RefreshCw, BookOpen, Plus
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   HƯỚNG DẪN SOẠN BÀI (AUTHORING GUIDE)
   ─────────────────────────────────────────────────────────────────
   Mỗi BÀI HỌC là 1 object: { meta, stations }.
   - meta: { chapter, lesson, title, highlight, intro }
   - stations: mảng các "trạm". Mỗi trạm: { id, num, title, icon, type, ...props }

   CÁC LOẠI TRẠM (type) DÙNG LẠI ĐƯỢC:
   1) "text"        → callout giải thích/định nghĩa (không tính sao)
                      props: variant ("definition"|"note"|"default"), title?, body
   2) "calculator"  → máy tính công thức + xếp loại theo "bands" (vd: WHtR, %)
                      props: prompt, inputs:[{key,label,default}], formula:"a/b",
                              decimals?, presets?:[{label,values}], bands?:[{max,name,color}],
                              fracView?:[keyA,keyB], onResultNote?
   3) "reveal"      → các thẻ bấm để "lật" ra lời giải/biến hình
                      props: prompt, cards:[{label, detail}]
   4) "numberline"  → trục số tương tác, 3 chế độ:
                      mode:"mirror"  (kéo → thấy số đối)         props: min,max,denom,prompt
                      mode:"place"   (kéo đặt đúng vị trí)        + targets:[{n,d}]
                      mode:"compare" (chọn dấu so sánh)          + pairs:[{a:[n,d],b:[n,d]}]
   5) "fillin"      → điền đáp số (nhận "3/4", "0,75", "-1,2"…)
                      props: prompt, questions:[{ask, answer:number, display?, hint?}]
   6) "quiz"        → trắc nghiệm 3 bước: chọn → trình bày cách làm → chấm & lời giải (+ nhận xét AI)
                      props: questions:[{ q, opts:[...], correct:index, solution|exp }]
   7) "decimal"     → máy dò số thập phân: học sinh đoán hữu hạn/vô hạn rồi máy khai triển & chỉ chu kì
                      props: prompt?, items:[{n,d}]
   8) "geometry"    → hình học tương tác, kéo đổi góc. mode "crossing" (kề bù & đối đỉnh) |
                      "bisector" (tia phân giác) | "transversal" (so le trong & đồng vị, có nút chuyển) |
                      "triangle" (hai góc kéo được, góc thứ ba tự tính — tổng 180°)
                      props: prompt?, start?, start2?, sliderLabel?

   NỘI DUNG (body/detail/q…) có thể là chuỗi, HOẶC mảng "token" để chèn toán:
     "Bình thường" | {b:"in đậm"} | {hl:"tô màu"} | {frac:[3,2]} | {sup:"2"}
   ════════════════════════════════════════════════════════════════ */

const C = {
  ink: "#16243F", paper: "#FBF6EC", coral: "#FF6A5C", teal: "#1FAE97",
  amber: "#FFB22E", violet: "#7C83FF",
};

/* ───────── tiện ích số ───────── */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function simplify(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
function decToFrac(x) {
  const neg = x < 0; const s = Math.abs(x).toString();
  if (!s.includes(".")) return simplify(neg ? -Math.abs(x) : Math.abs(x), 1);
  const dec = s.split(".")[1].length, den = Math.pow(10, dec);
  const num = Math.round(Math.abs(x) * den);
  return simplify(neg ? -num : num, den);
}
function parseNum(str) {
  if (str == null) return NaN;
  let s = String(str).trim().replace(/\s/g, "").replace(",", ".");
  if (s.includes("/")) { const [a, b] = s.split("/"); return parseFloat(a) / parseFloat(b); }
  return parseFloat(s);
}
/* chia dài để phát hiện: hữu hạn hay vô hạn tuần hoàn + chu kì */
function decimalInfo(n, d) {
  const sign = (n < 0) !== (d < 0) ? "−" : "";
  n = Math.abs(n); d = Math.abs(d);
  const intPart = Math.floor(n / d);
  let rem = n % d;
  const digits = [], seen = new Map();
  let periodStart = -1;
  while (rem !== 0) {
    if (seen.has(rem)) { periodStart = seen.get(rem); break; }
    seen.set(rem, digits.length);
    rem *= 10; digits.push(Math.floor(rem / d)); rem %= d;
  }
  if (rem === 0) return { sign, intPart, nonRepeat: digits.join(""), period: "" };
  return { sign, intPart, nonRepeat: digits.slice(0, periodStart).join(""), period: digits.slice(periodStart).join("") };
}
/* SVG: điểm cực + cung tròn (góc tính bằng độ, trục y hướng xuống nên dùng −sin) */
const RAD = Math.PI / 180;
function P(cx, cy, r, deg) { return { x: cx + r * Math.cos(deg * RAD), y: cy - r * Math.sin(deg * RAD) }; }
function arc(cx, cy, r, a0, a1) {
  let span = (((a1 - a0) % 360) + 360) % 360;
  const large = span > 180 ? 1 : 0;
  const p0 = P(cx, cy, r, a0), p1 = P(cx, cy, r, a1);
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/* ───────── hiển thị phân số ───────── */
function Frac({ n, d, size = 22, color = "currentColor" }) {
  if (d === 1 || d === undefined) return <span style={{ fontWeight: 800 }}>{n}</span>;
  const numeric = typeof n === "number";
  const neg = numeric && n < 0;
  const absN = numeric ? Math.abs(n) : n;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, verticalAlign: "middle" }}>
      {neg && <span style={{ fontWeight: 800, fontSize: size }}>−</span>}
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{ fontWeight: 800, fontSize: size * 0.78, padding: "0 4px" }}>{absN}</span>
        <span style={{ height: 2, width: "100%", background: color, borderRadius: 2, margin: "2px 0" }} />
        <span style={{ fontWeight: 800, fontSize: size * 0.78, padding: "0 4px" }}>{d}</span>
      </span>
    </span>
  );
}

/* ───────── rich text từ token ───────── */
function RichText({ content }) {
  if (content == null) return null;
  const arr = Array.isArray(content) ? content : [content];
  return (
    <>
      {arr.map((t, i) => {
        if (typeof t === "string") return <span key={i}>{t}</span>;
        if (t.frac) return <span key={i} style={{ display: "inline-flex", verticalAlign: "middle", margin: "0 3px" }}><Frac n={t.frac[0]} d={t.frac[1]} size={t.size || 18} color={t.color || "currentColor"} /></span>;
        if (t.b) return <b key={i}>{t.b}</b>;
        if (t.hl) return <b key={i} style={{ color: t.color || C.coral }}>{t.hl}</b>;
        if (t.sup) return <sup key={i} style={{ fontWeight: 800 }}>{t.sup}</sup>;
        return null;
      })}
    </>
  );
}
/* đổi nội dung token -> chuỗi thuần (để gửi cho trợ lý AI) */
function richToText(content) {
  if (content == null) return "";
  const arr = Array.isArray(content) ? content : [content];
  return arr.map((t) => {
    if (typeof t === "string") return t;
    if (t.frac) return ` ${t.frac[0]}/${t.frac[1]} `;
    if (t.b) return t.b;
    if (t.hl) return t.hl;
    if (t.sup) return "^" + t.sup;
    return "";
  }).join("");
}

/* ════════════════════════════════════════════════════════════════
   TRỤC SỐ TƯƠNG TÁC (signature)
   ════════════════════════════════════════════════════════════════ */
function NumberLine({ min = -2, max = 2, denom = 1, value, onChange, mirror = false, secondary = null, height = 130, interactive = true, snap = true }) {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  const pad = 40;
  useEffect(() => {
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const innerW = w - pad * 2;
  const toX = (v) => pad + ((v - min) / (max - min)) * innerW;
  const fromX = (x) => { let v = min + ((x - pad) / innerW) * (max - min); if (snap) { const step = 1 / denom; v = Math.round(v / step) * step; } return Math.max(min, Math.min(max, v)); };
  const y = height / 2 + 8;
  const drag = useCallback((cx) => { if (!interactive || !ref.current) return; const r = ref.current.getBoundingClientRect(); onChange && onChange(fromX(cx - r.left)); }, [interactive, onChange, min, max, denom]);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) return;
    const m = (e) => drag(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("mousemove", m); window.addEventListener("touchmove", m, { passive: false });
    window.addEventListener("mouseup", up); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", m); window.removeEventListener("touchmove", m); window.removeEventListener("mouseup", up); window.removeEventListener("touchend", up); };
  }, [dragging, drag]);

  const ticks = [];
  for (let i = min * denom; i <= max * denom; i++) ticks.push({ v: i / denom, isInt: Number.isInteger(i / denom) });

  const Dot = ({ v, fill, big }) => {
    const [n, d] = decToFrac(Math.round(v * denom) / denom);
    return (
      <g>
        <line x1={toX(v)} y1={y} x2={toX(v)} y2={y - 34} stroke={fill} strokeWidth={2.5} strokeDasharray="3 3" opacity={0.5} />
        <circle cx={toX(v)} cy={y} r={big ? 11 : 8} fill={fill} stroke="#fff" strokeWidth={3} />
        <foreignObject x={toX(v) - 45} y={y - 70} width={90} height={36}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: fill, color: "#fff", padding: "3px 9px", borderRadius: 10, fontWeight: 800, fontSize: 13, display: "inline-flex", alignItems: "center", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
              <Frac n={n} d={d} size={15} color="#fff" />
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div ref={ref} style={{ width: "100%", userSelect: "none", touchAction: "none" }}>
      <svg width={w} height={height} style={{ display: "block" }}>
        <line x1={pad - 14} y1={y} x2={w - pad + 22} y2={y} stroke={C.ink} strokeWidth={3} />
        <polygon points={`${w - pad + 22},${y} ${w - pad + 12},${y - 6} ${w - pad + 12},${y + 6}`} fill={C.ink} />
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={toX(t.v)} y1={y - (t.isInt ? 9 : 5)} x2={toX(t.v)} y2={y + (t.isInt ? 9 : 5)} stroke={C.ink} strokeWidth={t.isInt ? 2.5 : 1.5} opacity={t.isInt ? 1 : 0.45} />
            {t.isInt && <text x={toX(t.v)} y={y + 28} textAnchor="middle" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 700, fill: C.ink, fontSize: 14 }}>{t.v}</text>}
          </g>
        ))}
        <text x={toX(0)} y={y + 28} textAnchor="middle" style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 800, fill: C.coral, fontSize: 15 }}>O</text>
        {mirror && value != null && Math.abs(value) > 1e-9 && (<>
          <line x1={toX(value)} y1={y + 22} x2={toX(-value)} y2={y + 22} stroke={C.violet} strokeWidth={2} strokeDasharray="4 4" opacity={0.6} />
          <Dot v={-value} fill={C.violet} />
        </>)}
        {secondary != null && <Dot v={secondary} fill={C.violet} />}
        {value != null && (
          <g onMouseDown={() => interactive && setDragging(true)} onTouchStart={() => interactive && setDragging(true)} style={{ cursor: interactive ? "grab" : "default" }}>
            <circle cx={toX(value)} cy={y} r={20} fill="transparent" />
            <Dot v={value} fill={C.coral} big />
          </g>
        )}
      </svg>
    </div>
  );
}

/* ───────── khối khung dùng chung ───────── */
const Card = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 20, padding: 22, border: "2.5px solid " + C.ink, boxShadow: "6px 6px 0 rgba(22,36,63,0.12)", ...style }}>{children}</div>
);
const Pill = ({ children, bg = C.violet }) => (
  <span style={{ background: bg, color: "#fff", padding: "4px 12px", borderRadius: 20, fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>{children}</span>
);
const inputBox = { display: "block", width: "100%", marginTop: 6, padding: "10px 12px", border: "2.5px solid " + C.ink, borderRadius: 12, fontSize: 18, fontWeight: 700, fontFamily: "'Be Vietnam Pro'", color: C.ink, boxSizing: "border-box" };
const btnPrimary = { background: C.coral, color: "#fff", border: "2.5px solid " + C.ink, borderRadius: 14, padding: "11px 20px", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Be Vietnam Pro'", boxShadow: "3px 3px 0 " + C.ink };
const btnGhost = { background: "#fff", color: C.ink, border: "2.5px solid " + C.ink, borderRadius: 14, padding: "10px 16px", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Be Vietnam Pro'" };
const ICON = { activity: Activity, hash: Hash, mirror: RefreshCw, move: MoveHorizontal, scale: Scale, trophy: Trophy, plus: Plus, book: BookOpen };

function StationShell({ s, children }) {
  const Icon = ICON[s.icon] || Sparkles;
  return (
    <section id={s.id} style={{ scrollMarginTop: 86, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: C.ink, color: C.paper, display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "4px 4px 0 " + C.coral, fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 22 }}>{s.num}</div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.coral, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><Icon size={13} /> Trạm {s.num}</div>
          <h2 style={{ margin: 0, fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 27, color: C.ink, lineHeight: 1.1 }}>{s.title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   CÁC KHỐI (BLOCK RENDERERS) — chạy theo data
   ════════════════════════════════════════════════════════════════ */

function TextBlock({ s }) {
  const dark = s.variant === "definition";
  const note = s.variant === "note";
  return (
    <Card style={dark ? { background: C.ink, color: C.paper } : note ? { background: C.violet + "14", borderStyle: "dashed" } : {}}>
      {s.title2 && <div style={{ fontSize: 13, letterSpacing: 1, opacity: dark ? 0.7 : 1, fontWeight: 700, color: dark ? C.paper : C.coral }}>{s.title2}</div>}
      <p style={{ margin: s.title2 ? "8px 0 0" : 0, fontSize: dark ? 19 : 17, lineHeight: 1.55, fontFamily: dark ? "'Baloo 2'" : "inherit", fontWeight: dark ? 600 : 400 }}>
        <RichText content={s.body} />
      </p>
      {s.figure && <Figure spec={s.figure} />}
    </Card>
  );
}

function CalculatorBlock({ s, award }) {
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

function RevealBlock({ s, award }) {
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

function NumberLineBlock({ s, award }) {
  // mirror
  if (s.mode === "mirror") {
    const [v, setV] = useState(s.start ?? 1.5);
    const [touched, setTouched] = useState(false);
    const [n, d] = decToFrac(Math.round(v * s.denom) / s.denom);
    return (
      <Card>
        <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>
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
  return (
    <Card>
      <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}>Quy về <b>cùng mẫu dương</b> rồi so tử. Trên trục số, số <b>nhỏ hơn</b> nằm <b>bên trái</b>.</p>
      <div style={{ background: C.paper, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 12, border: "2px dashed " + C.ink }}>
        <Frac n={p.a[0]} d={p.a[1]} size={22} color={C.coral} /><span style={{ fontWeight: 800 }}>=</span><Frac n={an} d={lcd} size={20} color={C.coral} />
        <span style={{ margin: "0 10px", fontWeight: 800, color: C.violet, fontSize: 22 }}>?</span>
        <Frac n={bn} d={lcd} size={20} color={C.violet} /><span style={{ fontWeight: 800 }}>=</span><Frac n={p.b[0]} d={p.b[1]} size={22} color={C.violet} />
      </div>
      <NumberLine min={s.min} max={s.max} denom={lcd > 8 ? 4 : lcd} value={av} secondary={bv} interactive={false} snap={false} />
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

function FillInBlock({ s, award }) {
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

function QuizBlock({ s, award }) {
  const N = s.questions.length;
  const [chosen, setChosen] = useState(Array(N).fill(null));
  const [method, setMethod] = useState(Array(N).fill(""));
  const [submitted, setSubmitted] = useState(Array(N).fill(false));
  const [ai, setAi] = useState(Array(N).fill(null)); // {state, text}

  const setAt = (arr, set, i, v) => { const n = [...arr]; n[i] = v; set(n); };

  const submit = (qi) => {
    if (chosen[qi] === null || !method[qi].trim()) return;
    const nextSubmitted = [...submitted]; nextSubmitted[qi] = true; setSubmitted(nextSubmitted);
    const correct = s.questions.filter((q, i) => nextSubmitted[i] && chosen[i] === q.correct).length;
    if (correct >= Math.ceil(N / 2)) award();
  };

  const askAI = async (qi) => {
    const q = s.questions[qi];
    setAt(ai, setAi, qi, { state: "loading" });
    const optsTxt = q.opts.map((o, i) => `${String.fromCharCode(65 + i)}) ${richToText(o)}`).join("  ");
    const prompt =
`Bạn là giáo viên Toán lớp 7 thân thiện ở Việt Nam. Một học sinh 12 tuổi vừa làm bài.

Đề bài: ${richToText(q.q)}
Các lựa chọn: ${optsTxt}
Đáp án đúng: ${String.fromCharCode(65 + q.correct)}) ${richToText(q.opts[q.correct])}
Lời giải mẫu: ${richToText(q.solution || q.exp)}
Học sinh đã chọn: ${String.fromCharCode(65 + chosen[qi])}) ${richToText(q.opts[chosen[qi]])} (${chosen[qi] === q.correct ? "ĐÚNG" : "SAI"})
Cách làm học sinh tự trình bày: "${method[qi]}"

Hãy nhận xét NGẮN GỌN (3-4 câu) bằng tiếng Việt, giọng ấm áp khích lệ:
- Khen điểm hợp lý trong cách làm của em.
- Chỉ ra chỗ sai hoặc thiếu (nếu có) và gợi ý sửa, ngắn gọn dễ hiểu.
Chỉ viết văn xuôi, không dùng markdown, không gạch đầu dòng.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setAt(ai, setAi, qi, { state: text ? "done" : "error", text });
    } catch {
      setAt(ai, setAi, qi, { state: "error", text: "" });
    }
  };

  const score = s.questions.filter((q, i) => submitted[i] && chosen[i] === q.correct).length;
  const doneCount = submitted.filter(Boolean).length;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <Pill bg={C.ink}>Đã nộp {doneCount}/{N}</Pill>
        <Pill bg={C.teal}><Star size={15} fill="#fff" /> Đúng {score}/{N}</Pill>
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {s.questions.map((item, qi) => {
          const isDone = submitted[qi];
          const right = chosen[qi] === item.correct;
          const canSubmit = chosen[qi] !== null && method[qi].trim().length > 0;
          const a = ai[qi];
          return (
            <Card key={qi}>
              <div style={{ fontWeight: 700, color: C.ink, fontSize: 16, marginBottom: 14 }}>
                <span style={{ color: C.coral }}>Câu {qi + 1}. </span><RichText content={item.q} />
              </div>
              {item.figure && <div style={{ marginBottom: 14, marginTop: -2 }}><Figure spec={item.figure} state={isDone ? "answered" : "idle"} /></div>}

              {/* ① chọn đáp án */}
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.violet, marginBottom: 8 }}>① CHỌN ĐÁP ÁN</div>
              <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                {item.opts.map((o, oi) => {
                  const picked = chosen[qi] === oi;
                  let bg = picked ? C.violet + "1A" : "#fff", bd = picked ? C.violet : C.ink + "55";
                  if (isDone && oi === item.correct) { bg = C.teal + "22"; bd = C.teal; }
                  if (isDone && picked && !right) { bg = C.coral + "22"; bd = C.coral; }
                  return (
                    <button key={oi} onClick={() => !isDone && setAt(chosen, setChosen, qi, oi)} disabled={isDone}
                      style={{ textAlign: "left", background: bg, border: "2px solid " + bd, color: C.ink, borderRadius: 12, padding: "11px 14px", fontWeight: 600, fontSize: 15, cursor: isDone ? "default" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <span><b style={{ color: picked || (isDone && oi === item.correct) ? C.ink : C.ink + "99" }}>{String.fromCharCode(65 + oi)}.</b> <RichText content={o} /></span>
                      {isDone && oi === item.correct && <Check size={18} color={C.teal} />}
                      {isDone && picked && !right && <X size={18} color={C.coral} />}
                    </button>
                  );
                })}
              </div>

              {/* ② trình bày cách làm */}
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.violet, marginBottom: 8 }}>② TRÌNH BÀY CÁCH LÀM CỦA EM</div>
              {!isDone ? (
                <textarea value={method[qi]} onChange={(e) => setAt(method, setMethod, qi, e.target.value)}
                  placeholder="Viết các bước em đã làm: quy đồng, so sánh, tính toán… (bắt buộc trước khi nộp)"
                  rows={3} style={{ width: "100%", boxSizing: "border-box", border: "2.5px solid " + C.ink, borderRadius: 12, padding: "10px 12px", fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: C.ink, resize: "vertical" }} />
              ) : (
                <div style={{ background: C.paper, border: "2px dashed " + C.ink, borderRadius: 12, padding: "10px 12px", whiteSpace: "pre-wrap", color: C.ink, fontSize: 15 }}>{method[qi]}</div>
              )}

              {/* nộp / kết quả */}
              {!isDone ? (
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={() => submit(qi)} disabled={!canSubmit}
                    style={{ ...btnPrimary, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? "pointer" : "not-allowed", boxShadow: canSubmit ? "3px 3px 0 " + C.ink : "none" }}>
                    Nộp bài & xem đáp án <ArrowRight size={18} />
                  </button>
                  {!canSubmit && <span style={{ fontSize: 13, color: C.ink + "99" }}>Hãy chọn đáp án và viết cách làm trước nhé.</span>}
                </div>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "inline-flex" }}>
                    <Pill bg={right ? C.teal : C.coral}>{right ? <Check size={16} /> : <X size={16} />}{right ? " Em chọn đúng!" : " Đáp án em chọn chưa đúng"}</Pill>
                  </div>
                  {/* ③ lời giải mẫu */}
                  <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.teal }}>③ ĐÁP ÁN & LỜI GIẢI</div>
                  <div style={{ marginTop: 6, background: C.teal + "12", border: "2px solid " + C.teal, borderRadius: 12, padding: "12px 14px", color: C.ink, fontSize: 15, lineHeight: 1.55 }}>
                    <div style={{ marginBottom: 6 }}><b>Đáp án đúng:</b> {String.fromCharCode(65 + item.correct)}. <RichText content={item.opts[item.correct]} /></div>
                    <RichText content={item.solution || item.exp} />
                  </div>
                  {/* nhận xét AI */}
                  <div style={{ marginTop: 12 }}>
                    {(!a || a.state === "error") && (
                      <button onClick={() => askAI(qi)} style={{ ...btnGhost, borderColor: C.violet, color: C.violet }}>
                        <Sparkles size={15} /> {a && a.state === "error" ? "Thử lại nhận xét" : "Nhờ trợ lý nhận xét cách làm của em"}
                      </button>
                    )}
                    {a && a.state === "loading" && <Pill bg={C.violet}><Sparkles size={14} /> Trợ lý đang đọc bài của em…</Pill>}
                    {a && a.state === "error" && <span style={{ marginLeft: 10, fontSize: 13, color: C.ink + "99" }}>Chưa kết nối được trợ lý. Em có thể tự đối chiếu với lời giải mẫu ở trên.</span>}
                    {a && a.state === "done" && (
                      <div style={{ background: C.violet + "12", border: "2px solid " + C.violet, borderRadius: 12, padding: "12px 14px", color: C.ink, fontSize: 15, lineHeight: 1.55, display: "flex", gap: 10 }}>
                        <Sparkles size={18} color={C.violet} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ whiteSpace: "pre-wrap" }}>{a.text}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* máy dò số thập phân: học sinh đoán hữu hạn/vô hạn trước, rồi mới khai triển */
function DecimalBlock({ s, award }) {
  const [picks, setPicks] = useState(Array(s.items.length).fill(null));
  const pick = (i, v) => {
    if (picks[i]) return;
    const n = [...picks]; n[i] = v; setPicks(n);
    if (n.filter(Boolean).length === s.items.length) award();
  };
  return (
    <Card>
      {s.prompt && <p style={{ marginTop: 0, color: C.ink, lineHeight: 1.6 }}><RichText content={s.prompt} /></p>}
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

/* hình học tương tác: kéo để đổi góc; chế độ crossing / bisector / transversal */
function AnglesBlock({ s, award }) {
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
function Figure({ spec, state }) {
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

function renderBlock(s, award) {
  switch (s.type) {
    case "text": return <TextBlock s={s} />;
    case "calculator": return <CalculatorBlock s={s} award={award} />;
    case "reveal": return <RevealBlock s={s} award={award} />;
    case "numberline": return <NumberLineBlock s={s} award={award} />;
    case "fillin": return <FillInBlock s={s} award={award} />;
    case "decimal": return <DecimalBlock s={s} award={award} />;
    case "geometry": return <AnglesBlock s={s} award={award} />;
    case "quiz": return <QuizBlock s={s} award={award} />;
    default: return null;
  }
}

/* ════════════════════════════════════════════════════════════════
   DỮ LIỆU BÀI HỌC  (đây là phần giáo viên soạn)
   ════════════════════════════════════════════════════════════════ */
const BAI_1 = {
  meta: { chapter: "Chương I", lesson: "Bài 1", title: "Tập hợp các", highlight: "số hữu tỉ",
    intro: "Đừng chỉ đọc — hãy kéo, thả, thử và sai. Vượt qua các trạm, gom đủ sao để chinh phục bài học." },
  stations: [
    { id: "hook", num: 0, title: "Vì sao phân số lại quan trọng?", icon: "activity", type: "calculator",
      prompt: "Bác sĩ dùng chỉ số WHtR (vòng bụng ÷ chiều cao) để đoán nguy cơ béo phì. Thử với Ông An (180cm, bụng 108cm) và Ông Chung (160cm, bụng 70cm). Ai khỏe hơn?",
      inputs: [{ key: "waist", label: "Vòng bụng (cm)", default: 108 }, { key: "height", label: "Chiều cao (cm)", default: 180 }],
      formula: "waist/height", fracView: ["waist", "height"], decimals: 3, cta: "Xếp loại sức khỏe", resultLabel: "Xếp loại",
      presets: [{ label: "Ông An: 108/180", values: { waist: 108, height: 180 } }, { label: "Ông Chung: 70/160", values: { waist: 70, height: 160 } }],
      bands: [{ max: 0.42, name: "Gầy", color: "#6B8FE8" }, { max: 0.52, name: "Tốt", color: C.teal }, { max: 0.57, name: "Hơi béo", color: C.amber }, { max: 0.63, name: "Thừa cân", color: "#FF914D" }, { max: 99, name: "Béo phì", color: C.coral }],
      onResultNote: ["Chỉ số là một ", { b: "tỉ số" }, " = một ", { b: "phân số" }, ". Số nguyên, số thập phân hay phân số đều quy về cùng một loại số: ", { hl: "số hữu tỉ" }, " — nhân vật chính của bài!"] },
    { id: "def", num: 1, title: "Số hữu tỉ là gì?", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Số hữu tỉ là số viết được dưới dạng phân số ", { frac: [" a", " b"], color: C.amber, size: 22 }, " với ", { hl: "a, b ∈ ℤ", color: C.amber }, " và ", { hl: "b ≠ 0", color: C.amber }, ". Tập hợp số hữu tỉ kí hiệu là ℚ."] },
    { id: "reveal", num: 2, title: "Mọi số đều \"biến hình\" thành phân số", icon: "hash", type: "reveal",
      prompt: "Bấm từng số để xem nó viết lại thành phân số:",
      cards: [
        { label: "−7", detail: ["−7 = ", { frac: [-7, 1], color: C.teal }, " — số nguyên cũng là số hữu tỉ"] },
        { label: "0,6", detail: ["0,6 = ", { frac: [6, 10], color: C.teal }, " = ", { frac: [3, 5], color: C.teal }] },
        { label: "2⅗", detail: ["2⅗ = ", { frac: [13, 5], color: C.teal }, " — hỗn số cũng là số hữu tỉ"] },
        { label: "−1,2", detail: ["−1,2 = ", { frac: [-12, 10], color: C.teal }, " = ", { frac: [-6, 5], color: C.teal }] },
        { label: "0", detail: ["0 = ", { frac: [0, 1], color: C.teal }, " — số 0 vẫn là số hữu tỉ"] },
      ] },
    { id: "opp", num: 3, title: "Số đối — phép soi gương qua O", icon: "mirror", type: "numberline", mode: "mirror", min: -2, max: 2, denom: 4, start: 1.5,
      prompt: ["Mỗi số a có một số đối −a. Kéo chấm ", { hl: "cam", color: C.coral }, " — chấm ", { hl: "tím", color: C.violet }, " luôn cách O đúng bằng khoảng đó nhưng ở phía ngược lại."] },
    { id: "place", num: 4, title: "Đặt số hữu tỉ lên trục số", icon: "move", type: "numberline", mode: "place", min: -2, max: 2,
      targets: [{ n: 3, d: 2 }, { n: -3, d: 2 }, { n: 5, d: 4 }, { n: -5, d: 4 }] },
    { id: "cmp", num: 5, title: "So sánh hai số hữu tỉ", icon: "scale", type: "numberline", mode: "compare", min: -3, max: 3,
      pairs: [{ a: [3, 5], b: [4, 5] }, { a: [7, 10], b: [6, 5] }, { a: [-5, 2], b: [-17, 8] }, { a: [-3, 2], b: [-1, 1] }],
      note: ["Tính chất bắc cầu: nếu a < b và b < c thì a < c. Ví dụ 0,7 < 1 < ", { frac: [6, 5] }, " nên 0,7 < ", { frac: [6, 5] }, "."] },
    { id: "quiz", num: 6, title: "Luyện tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Khẳng định nào đúng?", opts: ["−235 ∉ ℚ", "−6/7 ∈ ℚ", "ℚ chỉ gồm số dương"], correct: 1,
          exp: "Mọi phân số mẫu khác 0 đều thuộc ℚ.",
          solution: ["Số hữu tỉ là số viết được dạng ", { frac: ["a", "b"] }, " với b ≠ 0. ", { frac: [-6, 7] }, " đã là phân số nên ∈ ℚ → chọn B. Ngoài ra −235 = ", { frac: [-235, 1] }, " cũng ∈ ℚ, và ℚ gồm cả số âm, dương lẫn số 0."] },
        { q: "Số đối của −0,75 là?", opts: ["−0,75", "0,75", "0"], correct: 1,
          exp: "Số đối của a là −a.",
          solution: ["Số đối của a là −a (đổi dấu). Đối của −0,75 là +0,75. Viết dạng phân số: −0,75 = ", { frac: [-3, 4] }, " nên số đối là ", { frac: [3, 4] }, " = 0,75."] },
        { q: "Sắp xếp nhỏ→lớn: 5¼ ; −2 ; 3,125 ; −3/2", opts: ["−2 ; −3/2 ; 3,125 ; 5¼", "−3/2 ; −2 ; 3,125 ; 5¼", "5¼ ; 3,125 ; −3/2 ; −2"], correct: 0,
          exp: "Đổi về thập phân rồi so sánh.",
          solution: ["Đổi về số thập phân: 5¼ = 5,25 ; −2 ; 3,125 ; ", { frac: [-3, 2] }, " = −1,5. Hai số âm: −2 < −1,5. Sau đó đến các số dương 3,125 < 5,25. Vậy thứ tự: −2 ; −1,5 ; 3,125 ; 5,25 → chọn A."] },
        { q: "So sánh −2,5 và −2,125", opts: ["−2,5 > −2,125", "−2,5 < −2,125", "Bằng nhau"], correct: 1,
          exp: "Với số âm: trị tuyệt đối lớn hơn thì nhỏ hơn.",
          solution: ["Hai số đều âm. Vì 2,5 > 2,125 (trị tuyệt đối lớn hơn) nên khi mang dấu âm thì −2,5 < −2,125. Trên trục số, −2,5 nằm bên trái −2,125."] },
        { q: "Trên trục số, số 0 là số hữu tỉ…", opts: ["dương", "âm", "không âm cũng không dương"], correct: 2,
          exp: "Số 0 không dương cũng không âm.",
          solution: ["Số hữu tỉ dương nằm bên phải O, số hữu tỉ âm nằm bên trái O. Điểm 0 chính là gốc O nên không thuộc cả hai loại → số 0 không là số hữu tỉ dương cũng không âm."] },
      ] },
  ],
};

const BAI_2 = {
  meta: { chapter: "Chương I", lesson: "Bài 2", title: "Cộng, trừ, nhân, chia", highlight: "số hữu tỉ",
    intro: "Mọi phép tính trong ℚ đều quy về phân số hoặc số thập phân. Học cách tính đúng — và tính nhanh một cách hợp lí." },
  stations: [
    { id: "hook", num: 0, title: "Khinh khí cầu cách mặt đất bao xa?", icon: "activity", type: "calculator",
      prompt: ["Một khinh khí cầu bay lên từ mặt đất với vận tốc 0,8 m/s trong 50 giây, rồi hạ độ cao với vận tốc ", { frac: [5, 9] }, " m/s. Sau 27 giây kể từ khi hạ, nó còn cách mặt đất bao nhiêu mét?"],
      inputs: [{ key: "vUp", label: "Vận tốc lên (m/s)", default: 0.8 }, { key: "tUp", label: "Thời gian lên (s)", default: 50 }, { key: "tDown", label: "Thời gian hạ (s)", default: 27 }],
      formula: "vUp*tUp - (5/9)*tDown", decimals: 0, cta: "Tính độ cao",
      onResultNote: ["Bay lên: 0,8 × 50 = 40 m. Hạ xuống: ", { frac: [5, 9] }, " × 27 = 15 m. Vậy còn cách mặt đất 40 − 15 = ", { hl: "25 m" }, ". Đó chính là một phép ", { b: "trừ số hữu tỉ" }, " — nội dung của bài này!"] },

    { id: "addrule", num: 1, title: "Cộng, trừ hai số hữu tỉ", icon: "plus", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Viết các số về phân số ", { hl: "cùng mẫu dương", color: C.amber }, " rồi cộng (trừ) các tử, giữ nguyên mẫu. Phép cộng trong ℚ có tính ", { hl: "giao hoán, kết hợp", color: C.amber }, " và ", { hl: "a + (−a) = 0", color: C.amber }, "."] },

    { id: "addsteps", num: 2, title: "Tính hợp lí một tổng", icon: "book", type: "reveal",
      prompt: ["Tính ", { frac: [2, -3] }, " + 2,5 + ", { frac: [1, 3] }, " + 1½ một cách hợp lí. Bấm từng bước:"],
      cards: [
        { label: "B1", detail: ["Viết về phân số cùng mẫu dương: ", { frac: [-2, 3] }, " + ", { frac: [5, 2] }, " + ", { frac: [1, 3] }, " + ", { frac: [3, 2] }] },
        { label: "B2", detail: ["Nhóm các phân số cùng mẫu (giao hoán & kết hợp): ( ", { frac: [-2, 3] }, " + ", { frac: [1, 3] }, " ) + ( ", { frac: [5, 2] }, " + ", { frac: [3, 2] }, " )"] },
        { label: "B3", detail: ["= ", { frac: [-1, 3] }, " + 4 = ", { frac: [11, 3], color: C.teal }, ". Mẹo: gom các phân số cùng mẫu lại trước cho dễ tính!"] },
      ] },

    { id: "bracket", num: 3, title: "Quy tắc dấu ngoặc", icon: "book", type: "text", variant: "note", title2: "GHI NHỚ",
      body: ["Trong ℚ, quy tắc dấu ngoặc giống hệt trong ℤ: bỏ ngoặc có dấu “−” đằng trước thì ", { hl: "đổi dấu mọi số hạng", color: C.violet }, " bên trong; có dấu “+” đằng trước thì giữ nguyên. Ta cũng được đổi chỗ và đặt ngoặc để nhóm các số hạng tuỳ ý."] },

    { id: "addpractice", num: 4, title: "Luyện cộng, trừ", icon: "hash", type: "fillin",
      questions: [
        { ask: ["Bỏ ngoặc rồi tính ", { frac: [9, 10] }, " − ( ", { frac: [6, 5] }, " − ", { frac: [7, 4] }, " )"], answer: 1.45,
          hint: ["Quy đồng mẫu 20. Trong ngoặc: ", { frac: [24, 20] }, " − ", { frac: [35, 20] }, " = ", { frac: [-11, 20] }, ". Vậy ", { frac: [18, 20] }, " − ( ", { frac: [-11, 20] }, " ) = ", { frac: [29, 20] }, " = 1,45."] },
        { ask: "Tính −21,25 + 13,3", answer: -7.95, hint: "Hai số thập phân khác dấu: −(21,25 − 13,3) = −7,95." },
        { ask: "Trong 100 g khoai tây khô có 11 g nước, 6,6 g protein, 0,3 g chất béo, 75,1 g glucid. Khối lượng các chất khác (g) là?", answer: 7,
          hint: "100 − (11 + 6,6 + 0,3 + 75,1) = 100 − 93 = 7 (g)." },
      ] },

    { id: "mulrule", num: 5, title: "Nhân, chia hai số hữu tỉ", icon: "scale", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Viết các số về phân số rồi áp dụng quy tắc ", { hl: "nhân, chia phân số", color: C.amber }, " (chia là nhân với nghịch đảo). Phép nhân có tính giao hoán, kết hợp và ", { hl: "phân phối với phép cộng", color: C.amber }, ": a·c + b·c = (a + b)·c."] },

    { id: "distribute", num: 6, title: "Dùng tính chất phân phối để tính nhanh", icon: "book", type: "reveal",
      prompt: ["Tính nhanh ", { frac: [7, 6] }, " · 3¼ + ", { frac: [7, 6] }, " · (−0,25). Bấm từng bước:"],
      cards: [
        { label: "B1", detail: ["Phát hiện thừa số chung ", { frac: [7, 6] }, ": ", { frac: [7, 6] }, " · ( 3¼ + (−0,25) )"] },
        { label: "B2", detail: ["Tính trong ngoặc: 3,25 + (−0,25) = 3"] },
        { label: "B3", detail: ["= ", { frac: [7, 6] }, " · 3 = ", { frac: [21, 6] }, " = ", { frac: [7, 2], color: C.teal }, " = 3,5. Đặt thừa số chung giúp tính nhanh hơn nhiều!"] },
      ] },

    { id: "mulpractice", num: 7, title: "Luyện nhân, chia", icon: "hash", type: "fillin",
      questions: [
        { ask: ["Tính ", { frac: [-9, 13] }, " · ", { frac: [-4, 5] }], answer: 36 / 65, tol: 1e-3,
          hint: ["Nhân hai số âm ra số dương: ", { frac: [9, 13] }, " · ", { frac: [4, 5] }, " = ", { frac: [36, 65] }, ". (Nhập 36/65)"] },
        { ask: ["Tính −2,4 : ", { frac: [6, 5] }], answer: -2,
          hint: ["−2,4 = ", { frac: [-24, 10] }, ". Chia là nhân nghịch đảo: ", { frac: [-24, 10] }, " · ", { frac: [5, 6] }, " = ", { frac: [-120, 60] }, " = −2."] },
        { ask: "Tính 1,25 · (−4,6)", answer: -5.75, hint: "Hai số thập phân khác dấu: 1,25 · 4,6 = 5,75 → kết quả −5,75." },
      ] },

    { id: "exercises", num: 8, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Nhiệt độ tại Sa Pa là −0,7°C, tại Lào Cai là 9,6°C. Lào Cai cao hơn Sa Pa bao nhiêu °C?",
          opts: ["8,9°C", "10,3°C", "9,6°C"], correct: 1,
          solution: "Lấy nhiệt độ cao trừ nhiệt độ thấp: 9,6 − (−0,7) = 9,6 + 0,7 = 10,3°C." },
        { q: "Ngăn sách dài 120 cm, mỗi cuốn dày khoảng 2,4 cm. Xếp được nhiều nhất bao nhiêu cuốn?",
          opts: ["48 cuốn", "50 cuốn", "52 cuốn"], correct: 1,
          solution: "Số cuốn = 120 : 2,4 = 50. Vậy nhiều nhất 50 cuốn." },
        { q: ["So sánh ", { frac: [123, 7] }, " và 17,75"],
          opts: [[{ frac: [123, 7] }, " > 17,75"], [{ frac: [123, 7] }, " < 17,75"], "Bằng nhau"], correct: 1,
          solution: [{ frac: [123, 7] }, " ≈ 17,57. Vì 17,57 < 17,75 nên ", { frac: [123, 7] }, " < 17,75."] },
        { q: "Tính (−9,15) + 8,09",
          opts: ["−1,06", "1,06", "−17,24"], correct: 0,
          solution: "Hai số khác dấu: lấy 9,15 − 8,09 = 1,06, rồi giữ dấu của số có trị tuyệt đối lớn hơn (−9,15) → kết quả −1,06." },
        { q: ["Tính nhanh ", { frac: [3, 2] }, " · ( ", { frac: [-37, 10] }, " ) + ", { frac: [17, 2] }, " · ( ", { frac: [-37, 10] }, " )"],
          opts: ["−37", "37", "−10"], correct: 0,
          solution: ["Đặt thừa số chung ( ", { frac: [-37, 10] }, " ): ( ", { frac: [3, 2] }, " + ", { frac: [17, 2] }, " ) · ( ", { frac: [-37, 10] }, " ) = 10 · ( ", { frac: [-37, 10] }, " ) = −37."] },
      ] },
  ],
};

const BAI_3 = {
  meta: { chapter: "Chương I", lesson: "Bài 3", title: "Luỹ thừa của", highlight: "số hữu tỉ",
    intro: "Khi một số nhân với chính nó nhiều lần, luỹ thừa giúp viết gọn lại. Học cách nhân, chia và nâng luỹ thừa." },
  stations: [
    { id: "hook", num: 0, title: "Bể nước khổng lồ của Trái Đất", icon: "activity", type: "calculator",
      prompt: "Gom hết nước trên Trái Đất vào một bể hình lập phương thì cạnh bể tới khoảng 1111,34 km. Thể tích nước (km³) = cạnh × cạnh × cạnh. Hãy tính.",
      inputs: [{ key: "edge", label: "Cạnh bể (km)", default: 1111.34 }],
      formula: "edge*edge*edge", decimals: 0, cta: "Tính thể tích",
      onResultNote: ["Một con số khổng lồ! Thay vì viết 1111,34 × 1111,34 × 1111,34, ta viết gọn thành ", { b: "1111,34³" }, " — đó là ", { hl: "luỹ thừa" }, ", nội dung bài này."] },

    { id: "def", num: 1, title: "Luỹ thừa bậc n là gì?", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Luỹ thừa bậc n của số hữu tỉ x là tích của n thừa số x: ", { b: "xⁿ = x · x · … · x" }, " (n thừa số), với x ∈ ℚ, n ∈ ℕ, n > 1. ", { hl: "x là cơ số", color: C.amber }, ", ", { hl: "n là số mũ", color: C.amber }, ". Quy ước: x⁰ = 1 (x ≠ 0); x¹ = x."] },

    { id: "expand", num: 2, title: "Khai triển luỹ thừa", icon: "book", type: "reveal",
      prompt: "Bấm để xem mỗi luỹ thừa là tích của bao nhiêu thừa số:",
      cards: [
        { label: "(−3)³", detail: ["(−3)³ = (−3)·(−3)·(−3) = ", { hl: "−27", color: C.teal }] },
        { label: [{ frac: [1, 3] }, { sup: "4" }], detail: [{ frac: [1, 3] }, { sup: "4" }, " = ", { frac: [1, 3] }, "·", { frac: [1, 3] }, "·", { frac: [1, 3] }, "·", { frac: [1, 3] }, " = ", { frac: [1, 81], color: C.teal }] },
        { label: "(0,7)³", detail: ["(0,7)³ = 0,7·0,7·0,7 = ", { hl: "0,343", color: C.teal }] },
      ] },

    { id: "rules", num: 3, title: "Ba nhóm công thức luỹ thừa", icon: "book", type: "reveal",
      prompt: "Bấm từng nhóm để xem công thức cần nhớ:",
      cards: [
        { label: "Tích & thương", detail: ["Luỹ thừa của một tích: (x·y)ⁿ = xⁿ·yⁿ. Luỹ thừa của một thương: (x:y)ⁿ = xⁿ:yⁿ (y ≠ 0)."] },
        { label: "Cùng cơ số", detail: ["Nhân: xᵐ·xⁿ = x", { sup: "m+n" }, " (giữ cơ số, cộng số mũ). Chia: xᵐ:xⁿ = x", { sup: "m−n" }, " (giữ cơ số, trừ số mũ; x ≠ 0, m ≥ n)."] },
        { label: "Luỹ thừa của luỹ thừa", detail: ["(xᵐ)ⁿ = x", { sup: "m·n" }, " (giữ cơ số, nhân hai số mũ)."] },
      ] },

    { id: "practice", num: 4, title: "Luyện tính số mũ", icon: "hash", type: "fillin",
      questions: [
        { ask: "(−2)³ · (−2)⁴ = (−2)ⁿ. Nhập n.", answer: 7, hint: "Nhân cùng cơ số: cộng số mũ 3 + 4 = 7." },
        { ask: "(0,25)⁷ : (0,25)³ = (0,25)ⁿ. Nhập n.", answer: 4, hint: "Chia cùng cơ số: trừ số mũ 7 − 3 = 4." },
        { ask: "[(−5)³]⁷ = (−5)ⁿ. Nhập n.", answer: 21, hint: "Luỹ thừa của luỹ thừa: nhân số mũ 3 · 7 = 21." },
        { ask: "(−5)⁵ : (−5)⁵ = ? Nhập giá trị.", answer: 1, hint: "Số mũ 5 − 5 = 0, mà x⁰ = 1 với x ≠ 0." },
      ] },

    { id: "ex", num: 5, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Viết 125 dưới dạng luỹ thừa của 5.", opts: [["5", { sup: "2" }], ["5", { sup: "3" }], ["5", { sup: "4" }]], correct: 1,
          solution: "5 · 5 · 5 = 125 nên 125 = 5³." },
        { q: "Biết (−3)⁷ = −2187, hãy tính (−3)⁸.", opts: ["−6561", "6561", "2187"], correct: 1,
          solution: "(−3)⁸ = (−3)⁷ · (−3) = (−2187) · (−3) = 6561 (tích hai số âm là số dương)." },
        { q: ["Viết ", { frac: [1, 9] }, { sup: "5" }, " dưới dạng luỹ thừa cơ số ", { frac: [1, 3] }, "."],
          opts: [[{ frac: [1, 3] }, { sup: "7" }], [{ frac: [1, 3] }, { sup: "10" }], [{ frac: [1, 3] }, { sup: "5" }]], correct: 1,
          solution: [{ frac: [1, 9] }, " = ", { frac: [1, 3] }, { sup: "2" }, " nên ", { frac: [1, 9] }, { sup: "5" }, " = (", { frac: [1, 3] }, { sup: "2" }, ")", { sup: "5" }, " = ", { frac: [1, 3] }, { sup: "10" }, "."] },
        { q: "Khoảng cách Mộc tinh–Mặt Trời (7,78·10⁸ km) gấp khoảng mấy lần khoảng cách Trái Đất–Mặt Trời (1,5·10⁸ km)?",
          opts: ["≈ 3,2 lần", "≈ 5,2 lần", "≈ 7,8 lần"], correct: 1,
          solution: "7,78·10⁸ : (1,5·10⁸) = 7,78 : 1,5 ≈ 5,19 ≈ 5,2 lần." },
        { q: ["Kết quả của ", { frac: [2, 3] }, { sup: "5" }, " · ", { frac: [2, 3] }, { sup: "3" }, " là?"],
          opts: [[{ frac: [2, 3] }, { sup: "8" }], [{ frac: [2, 3] }, { sup: "15" }], [{ frac: [4, 9] }, { sup: "8" }]], correct: 0,
          solution: ["Nhân hai luỹ thừa cùng cơ số: giữ cơ số, cộng số mũ 5 + 3 = 8 → ", { frac: [2, 3] }, { sup: "8" }, "."] },
      ] },
  ],
};

const BAI_4 = {
  meta: { chapter: "Chương I", lesson: "Bài 4", title: "Thứ tự phép tính &", highlight: "quy tắc chuyển vế",
    intro: "Tính đúng thứ tự các phép tính, rồi dùng quy tắc chuyển vế để tìm số chưa biết x." },
  stations: [
    { id: "hook", num: 0, title: "Cân thăng bằng — quả bưởi nặng bao nhiêu?", icon: "scale", type: "calculator",
      prompt: "Một đĩa cân có vật 5,1 kg và quả bưởi x kg; đĩa kia có vật 7 kg. Cân thăng bằng nên 5,1 + x = 7. Quả bưởi nặng bao nhiêu kg?",
      inputs: [{ key: "known", label: "Vật đã biết (kg)", default: 5.1 }, { key: "total", label: "Tổng hai đĩa (kg)", default: 7 }],
      formula: "total - known", decimals: 1, cta: "Tìm khối lượng bưởi",
      onResultNote: ["Vì 5,1 + x = 7, ta chuyển 5,1 sang vế phải và đổi dấu: x = 7 − 5,1 = ", { hl: "1,9 kg" }, ". Đó chính là ", { b: "quy tắc chuyển vế" }, " — nội dung bài này."] },

    { id: "order", num: 1, title: "Thứ tự thực hiện phép tính", icon: "book", type: "text", variant: "note", title2: "GHI NHỚ",
      body: ["Biểu thức không có ngoặc: thực hiện theo thứ tự ", { hl: "Luỹ thừa → Nhân, chia → Cộng, trừ", color: C.violet }, ". Biểu thức có ngoặc: làm trong ngoặc trước, theo thứ tự ( ) → [ ] → { }."] },

    { id: "ordersteps", num: 2, title: "Tính theo đúng thứ tự", icon: "book", type: "reveal",
      prompt: "Tính 1,2 − 3² + 7,5 : 3. Bấm từng bước:",
      cards: [
        { label: "B1", detail: ["Làm luỹ thừa và phép chia trước: 3² = 9 và 7,5 : 3 = 2,5"] },
        { label: "B2", detail: ["Thay vào: 1,2 − 9 + 2,5"] },
        { label: "B3", detail: ["Cộng trừ từ trái sang phải: = −7,8 + 2,5 = ", { hl: "−5,3", color: C.teal }] },
      ] },

    { id: "orderpractice", num: 3, title: "Luyện thứ tự phép tính", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính 9,8 + 1,5 · 6 + (6,8 − 2) : 3", answer: 20.4, hint: "Ngoặc trước: 6,8 − 2 = 4,8. Rồi 1,5·6 = 9 và 4,8:3 = 1,6. Vậy 9,8 + 9 + 1,6 = 20,4." },
        { ask: "Tính 1,2 − 3² + 7,5 : 3", answer: -5.3, hint: "3² = 9; 7,5:3 = 2,5 → 1,2 − 9 + 2,5 = −5,3." },
        { ask: "Tính 12,4 · 6,25 + (−12,4) · (−2,5)²", answer: 0, hint: "(−2,5)² = 6,25 → (12,4 + (−12,4)) · 6,25 = 0 · 6,25 = 0." },
      ] },

    { id: "moverule", num: 4, title: "Quy tắc chuyển vế", icon: "move", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải ", { hl: "đổi dấu", color: C.amber }, " số hạng đó: “+” thành “−” và “−” thành “+”. Nếu a + b = c thì a = c − b; nếu a − b = c thì a = c + b."] },

    { id: "movesteps", num: 5, title: "Tìm x bằng chuyển vế", icon: "book", type: "reveal",
      prompt: ["Tìm x biết x + ", { frac: [1, 2] }, " = ", { frac: [-6, 7] }, ". Bấm từng bước:"],
      cards: [
        { label: "B1", detail: ["Chuyển ", { frac: [1, 2] }, " sang vế phải, đổi dấu: x = ", { frac: [-6, 7] }, " − ", { frac: [1, 2] }] },
        { label: "B2", detail: ["Quy đồng mẫu 14: = ", { frac: [-12, 14] }, " − ", { frac: [7, 14] }] },
        { label: "B3", detail: ["= ", { frac: [-19, 14], color: C.teal }] },
      ] },

    { id: "movepractice", num: 6, title: "Luyện tìm x", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tìm x biết x + 7,25 = 15,75", answer: 8.5, hint: "Chuyển vế: x = 15,75 − 7,25 = 8,5." },
        { ask: ["Tìm x biết x − ", { frac: [3, 4] }, " = ", { frac: [9, 8] }], answer: 1.875,
          hint: ["x = ", { frac: [9, 8] }, " + ", { frac: [3, 4] }, " = ", { frac: [9, 8] }, " + ", { frac: [6, 8] }, " = ", { frac: [15, 8] }, " = 1,875. (Nhập 15/8 hoặc 1,875)"] },
        { ask: "Bánh chưng nặng 0,8 kg gồm 0,5 kg gạo, 0,125 kg đậu xanh, 0,04 kg lá dong, còn lại là thịt. Khối lượng thịt (kg)?", answer: 0.135,
          hint: "Thịt = 0,8 − (0,5 + 0,125 + 0,04) = 0,8 − 0,665 = 0,135 kg." },
      ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cân thăng bằng: 5,1 + x = 7. Quả bưởi (x) nặng bao nhiêu?",
          opts: ["1,9 kg", "2,9 kg", "12,1 kg"], correct: 0,
          solution: "Chuyển vế: x = 7 − 5,1 = 1,9 kg." },
        { q: "Tính 1,2 − 3² + 7,5 : 3",
          opts: ["−5,3", "5,3", "−0,5"], correct: 0,
          solution: "Làm luỹ thừa & chia trước: 3² = 9, 7,5:3 = 2,5 → 1,2 − 9 + 2,5 = −5,3." },
        { q: ["Tìm x biết 2x + ", { frac: [1, 2] }, " = ", { frac: [7, 9] }],
          opts: [[{ frac: [5, 36] }], [{ frac: [5, 18] }], [{ frac: [5, 9] }]], correct: 0,
          solution: ["2x = ", { frac: [7, 9] }, " − ", { frac: [1, 2] }, " = ", { frac: [14, 18] }, " − ", { frac: [9, 18] }, " = ", { frac: [5, 18] }, " → x = ", { frac: [5, 36] }, "."] },
        { q: ["Tìm x biết x − ", { frac: [5, 7] }, " = ", { frac: [9, 14] }],
          opts: [[{ frac: [19, 14] }], [{ frac: [-1, 14] }], [{ frac: [1, 2] }]], correct: 0,
          solution: ["x = ", { frac: [9, 14] }, " + ", { frac: [5, 7] }, " = ", { frac: [9, 14] }, " + ", { frac: [10, 14] }, " = ", { frac: [19, 14] }, "."] },
        { q: "Làm một cái bánh cần 2¾ cốc bột. Lan đã có 1½ cốc. Lan cần thêm bao nhiêu cốc bột?",
          opts: ["1¼ cốc", "1½ cốc", "4¼ cốc"], correct: 0,
          solution: "Cần thêm = 2¾ − 1½ = 2,75 − 1,5 = 1,25 = 1¼ cốc." },
      ] },
  ],
};

const BAI_5 = {
  meta: { chapter: "Chương II", lesson: "Bài 5", title: "Số thập phân", highlight: "vô hạn tuần hoàn",
    intro: "Có những phép chia không bao giờ dừng. Nhận biết số thập phân hữu hạn, vô hạn tuần hoàn và cách làm tròn theo độ chính xác." },
  stations: [
    { id: "hook", num: 0, title: "Phép chia nào dừng, phép chia nào không?", icon: "activity", type: "decimal",
      prompt: ["Bạn Tròn chia ", { frac: [4, 5] }, " được 0,8 rồi dừng. Bạn Vuông chia ", { frac: [5, 18] }, " mãi không ra. Em đoán thử mỗi số là loại nào, rồi để máy khai triển:"],
      items: [{ n: 4, d: 5 }, { n: 5, d: 18 }] },

    { id: "def", num: 1, title: "Số thập phân vô hạn tuần hoàn & chu kì", icon: "hash", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Khi chia mãi không dừng và một nhóm chữ số lặp lại vô hạn, ta được ", { hl: "số thập phân vô hạn tuần hoàn", color: C.amber }, ". Nhóm chữ số lặp gọi là ", { hl: "chu kì", color: C.amber }, ", viết gọn trong ngoặc: 0,2777… = 0,2(7); −1,545454… = −1,(54). Các số như 0,8; 1,25 là ", { hl: "số thập phân hữu hạn", color: C.amber }, "."] },

    { id: "classify", num: 2, title: "Tự phân loại nhiều phân số", icon: "hash", type: "decimal",
      prompt: "Đoán hữu hạn hay vô hạn tuần hoàn, rồi kiểm chứng và xem chu kì:",
      items: [{ n: 1, d: 4 }, { n: 2, d: 11 }, { n: 7, d: 22 }, { n: 1, d: 9 }] },

    { id: "note", num: 3, title: "Một điều luôn đúng", icon: "book", type: "text", variant: "note", title2: "CHÚ Ý",
      body: ["Mọi số hữu tỉ đều viết được dưới dạng số thập phân ", { hl: "hữu hạn", color: C.violet }, " hoặc ", { hl: "vô hạn tuần hoàn", color: C.violet }, ". Không có số hữu tỉ nào cho thập phân vô hạn mà KHÔNG tuần hoàn."] },

    { id: "roundrule", num: 4, title: "Làm tròn theo độ chính xác", icon: "book", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Khi làm tròn một số đến một hàng nào đó, kết quả có ", { hl: "độ chính xác bằng một nửa đơn vị của hàng đó", color: C.amber }, ". Cách làm: nhìn chữ số ngay sau hàng làm tròn — nếu ≥ 5 thì tăng thêm 1, nếu < 5 thì giữ nguyên."] },

    { id: "table", num: 5, title: "Bảng độ chính xác", icon: "book", type: "reveal",
      prompt: "Bấm từng hàng để xem độ chính xác tương ứng:",
      cards: [
        { label: "Hàng trăm", detail: ["Làm tròn đến hàng trăm → độ chính xác ", { hl: "50", color: C.teal }] },
        { label: "Hàng chục", detail: ["Độ chính xác ", { hl: "5", color: C.teal }] },
        { label: "Hàng đơn vị", detail: ["Độ chính xác ", { hl: "0,5", color: C.teal }] },
        { label: "Hàng phần mười", detail: ["Độ chính xác ", { hl: "0,05", color: C.teal }] },
        { label: "Hàng phần trăm", detail: ["Độ chính xác ", { hl: "0,005", color: C.teal }] },
      ] },

    { id: "roundpractice", num: 6, title: "Luyện làm tròn", icon: "hash", type: "fillin",
      questions: [
        { ask: "Làm tròn a = 46,333… đến hàng đơn vị.", answer: 46, hint: "Chữ số sau hàng đơn vị là 3 < 5 → giữ nguyên: ≈ 46." },
        { ask: "Làm tròn b = −1,27(534) đến hàng phần trăm.", answer: -1.28, hint: "−1,27534… chữ số sau hàng phần trăm là 5 → làm tròn lên: ≈ −1,28." },
        { ask: "Làm tròn π = 3,14159… đến hàng phần trăm.", answer: 3.14, hint: "Chữ số sau hàng phần trăm là 1 < 5 → ≈ 3,14." },
      ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: ["Kết quả phép chia 1 cho 9, tức ", { frac: [1, 9] }, ", là số thập phân loại nào?"],
          opts: ["Hữu hạn", "Vô hạn tuần hoàn, chu kì 1", "Vô hạn nhưng không tuần hoàn"], correct: 1,
          solution: [{ frac: [1, 9] }, " = 0,111… , chữ số 1 lặp vô hạn nên là số thập phân vô hạn tuần hoàn chu kì 1, viết gọn 0,(1)."] },
        { q: "Viết gọn số thập phân 0,2777… là?",
          opts: ["0,2(7)", "0,(27)", "0,27(7)"], correct: 0,
          solution: "Chỉ chữ số 7 lặp lại, phần 0,2 đứng trước không lặp → viết gọn 0,2(7)." },
        { q: ["", { frac: [1, 4] }, " viết dưới dạng số thập phân là?"],
          opts: ["0,25 (hữu hạn)", "0,2(5)", "0,(25)"], correct: 0,
          solution: [{ frac: [1, 4] }, " = 0,25, phép chia dừng lại nên đây là số thập phân hữu hạn."] },
        { q: "Làm tròn một số với độ chính xác 0,005 nghĩa là làm tròn đến hàng nào?",
          opts: ["Hàng phần mười", "Hàng phần trăm", "Hàng phần nghìn"], correct: 1,
          solution: "0,005 là một nửa của 0,01 (đơn vị hàng phần trăm) → làm tròn đến hàng phần trăm." },
        { q: "Làm tròn a = 46,333… đến hàng đơn vị được kết quả nào?",
          opts: ["46", "47", "46,3"], correct: 0,
          solution: "Chữ số ngay sau hàng đơn vị là 3 < 5 nên giữ nguyên phần đơn vị → 46." },
      ] },
  ],
};

const BAI_6 = {
  meta: { chapter: "Chương II", lesson: "Bài 6", title: "Số vô tỉ &", highlight: "căn bậc hai",
    intro: "Có những độ dài không thể viết bằng phân số. Làm quen số vô tỉ và căn bậc hai số học." },
  stations: [
    { id: "hook", num: 0, title: "Cạnh hình vuông diện tích 2 dm²", icon: "activity", type: "calculator",
      prompt: "Ghép được một hình vuông có diện tích đúng 2 dm². Độ dài cạnh x của nó thoả mãn x² = 2. Hãy tính x.",
      inputs: [{ key: "area", label: "Diện tích hình vuông (dm²)", default: 2 }],
      formula: "Math.sqrt(area)", decimals: 9, hideFrac: true, cta: "Tính độ dài cạnh",
      onResultNote: ["Con số 1,414213562… này ", { hl: "không bao giờ dừng và cũng không lặp lại theo chu kì" }, ". Nó không phải số hữu tỉ! Những số như thế gọi là ", { hl: "số vô tỉ" }, " — và x chính là ", { b: "√2" }, "."] },

    { id: "irr", num: 1, title: "Số vô tỉ là gì?", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Số vô tỉ là số viết được dưới dạng số thập phân ", { hl: "vô hạn KHÔNG tuần hoàn", color: C.amber }, ". Tập hợp các số vô tỉ kí hiệu là 𝕀. Ví dụ: √2 = 1,4142135… ; π = 3,1415926… đều là số vô tỉ."] },

    { id: "sqrtdef", num: 2, title: "Căn bậc hai số học", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Căn bậc hai số học của số a ≥ 0, kí hiệu ", { hl: "√a", color: C.amber }, ", là số x ≥ 0 sao cho x² = a. Vì cạnh hình vuông luôn dương, độ dài cạnh hình vuông diện tích 2 dm² là √2 dm."] },

    { id: "exact", num: 3, title: "Tính căn cho kết quả đúng", icon: "book", type: "reveal",
      prompt: "Bấm để xem vì sao mỗi căn dưới đây ra số chính xác:",
      cards: [
        { label: "√100", detail: ["10² = 100 và 10 > 0 nên √100 = ", { hl: "10", color: C.teal }] },
        { label: "√(191²)", detail: ["191 > 0 nên √(191²) = ", { hl: "191", color: C.teal }] },
        { label: "√(21,5²)", detail: ["21,5 > 0 nên √(21,5²) = ", { hl: "21,5", color: C.teal }] },
      ] },

    { id: "practice", num: 4, title: "Luyện căn của số chính phương", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính √16", answer: 4, hint: "4² = 16 và 4 > 0 → √16 = 4." },
        { ask: "Tính √81", answer: 9, hint: "9² = 81 → √81 = 9." },
        { ask: "Sàn thi đấu cử tạ hình vuông có diện tích 144 m². Cạnh sàn dài bao nhiêu mét?", answer: 12, hint: "Cạnh = √144 = 12 m (vì 12² = 144)." },
      ] },

    { id: "calc", num: 5, title: "Máy tính căn bậc hai", icon: "scale", type: "calculator",
      prompt: "Với số không chính phương, ta dùng máy tính (kết quả là số gần đúng đã được làm tròn). Thử bấm:",
      inputs: [{ key: "a", label: "Tính căn của số", default: 91 }],
      formula: "Math.sqrt(a)", decimals: 4, hideFrac: true, cta: "Bấm căn",
      presets: [{ label: "√91", values: { a: 91 } }, { label: "√15", values: { a: 15 } }, { label: "√52198,16 (đáy kim tự tháp)", values: { a: 52198.16 } }],
      onResultNote: ["Máy chỉ hiện một số chữ số nên kết quả đã được làm tròn. Ví dụ √91 ≈ 9,5394 (đến chữ số thập phân thứ tư) hoặc ≈ 9,5 (độ chính xác 0,05)."] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cho biết 153² = 23409. Tính √23409.", opts: ["153", "151", "1530"], correct: 0,
          solution: "√23409 = √(153²) = 153 (vì 153 > 0)." },
        { q: "Căn bậc hai số học của 81 là?", opts: ["9", "−9", "9 và −9"], correct: 0,
          solution: "Căn bậc hai số học phải là số KHÔNG âm, nên √81 = 9 (không lấy −9)." },
        { q: "Tính √129600, biết 360² = 129600.", opts: ["360", "3600", "1296"], correct: 0,
          solution: "√129600 = √(360²) = 360." },
        { q: "Hình chữ nhật dài 8 dm, rộng 5 dm. Đường chéo dài khoảng bao nhiêu dm? (đường chéo² = dài² + rộng²)",
          opts: ["≈ 9,4 dm", "≈ 13 dm", "≈ 6,4 dm"], correct: 0,
          solution: "Đường chéo = √(8² + 5²) = √89 ≈ 9,4 dm." },
        { q: "Số nào dưới đây là số vô tỉ?", opts: ["√2", "√16", "0,(3)"], correct: 0,
          solution: "√16 = 4 và 0,(3) = 1/3 đều là số hữu tỉ. Chỉ √2 = 1,4142… vô hạn không tuần hoàn → số vô tỉ." },
      ] },
  ],
};

const BAI_7 = {
  meta: { chapter: "Chương II", lesson: "Bài 7", title: "Tập hợp các", highlight: "số thực",
    intro: "Gộp số hữu tỉ và số vô tỉ lại, ta được số thực ℝ. Học số đối, so sánh và giá trị tuyệt đối." },
  stations: [
    { id: "hook", num: 0, title: "Tất cả đều là số thực", icon: "activity", type: "reveal",
      prompt: "“Lại thêm số thực nữa?” — Đừng lo, toàn số đã biết! Bấm để thấy mỗi số đều là một số thực:",
      cards: [
        { label: [{ frac: [3, 4] }], detail: [{ frac: [3, 4] }, " = 0,75 (hữu tỉ) ∈ ℝ"] },
        { label: [{ frac: [1, 9] }], detail: [{ frac: [1, 9] }, " = 0,(1) (hữu tỉ) ∈ ℝ"] },
        { label: "√2", detail: ["√2 = 1,4142… (vô tỉ) ∈ ℝ"] },
        { label: "π", detail: ["π = 3,14159… (vô tỉ) ∈ ℝ"] },
      ] },

    { id: "def", num: 1, title: "Số thực là gì?", icon: "hash", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Số hữu tỉ và số vô tỉ được gọi chung là ", { hl: "số thực", color: C.amber }, ". Tập hợp các số thực kí hiệu là ℝ. Như vậy mọi số em từng học (tự nhiên, nguyên, hữu tỉ, vô tỉ) đều là số thực."] },

    { id: "opp", num: 2, title: "Số đối & trục số thực", icon: "book", type: "reveal",
      prompt: "Bấm để xem số đối và ý nghĩa trục số thực:",
      cards: [
        { label: "Số đối của 5,08(299)", detail: ["Đổi dấu: ", { hl: "−5,08(299)", color: C.teal }] },
        { label: "Số đối của −√5", detail: ["Đổi dấu: ", { hl: "√5", color: C.teal }] },
        { label: "Trục số thực", detail: ["Mỗi số thực ứng với đúng một điểm trên trục, và ngược lại mỗi điểm ứng với một số thực — nên gọi là trục số thực."] },
      ] },

    { id: "cmp", num: 3, title: "So sánh hai số thực", icon: "book", type: "reveal",
      prompt: "Viết về dạng thập phân rồi so sánh như số hữu tỉ. Bấm xem ví dụ:",
      cards: [
        { label: "0,24(7) và 0,2382", detail: ["0,24(7) = 0,2477… > 0,2382 nên ", { hl: "0,24(7) > 0,2382", color: C.teal }] },
        { label: "√5 và 2,36", detail: ["√5 = 2,236… < 2,36 nên ", { hl: "√5 < 2,36", color: C.teal }] },
        { label: "−√2 và −1,41", detail: ["√2 = 1,414… > 1,41 nên ", { hl: "−√2 < −1,41", color: C.teal }, " (với số âm thì ngược lại)."] },
      ] },

    { id: "abs", num: 4, title: "Giá trị tuyệt đối", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Giá trị tuyệt đối của số thực a, kí hiệu ", { hl: "|a|", color: C.amber }, ", là khoảng cách từ điểm a đến gốc O trên trục số. Vì thế: |a| = a nếu a > 0; |a| = −a nếu a < 0; |0| = 0. Giá trị tuyệt đối luôn ≥ 0."] },

    { id: "abspractice", num: 5, title: "Luyện giá trị tuyệt đối", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính |−2,3|", answer: 2.3, hint: "−2,3 < 0 nên |−2,3| = −(−2,3) = 2,3." },
        { ask: "Tính |−11|", answer: 11, hint: "Số âm: lấy số đối → 11." },
        { ask: "Tính |0|", answer: 0, hint: "|0| = 0." },
        { ask: "Tìm giá trị dương của x biết |x| = 2,5", answer: 2.5, hint: "|x| = 2,5 → x = 2,5 hoặc x = −2,5; giá trị dương là 2,5." },
      ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cách viết nào sau đây đúng?", opts: ["√2 ∈ ℚ", "π ∈ 𝕀", "15 ∉ ℝ"], correct: 1,
          solution: "√2 là số vô tỉ nên √2 ∉ ℚ; 15 là số thực nên 15 ∈ ℝ. Chỉ có π ∈ 𝕀 (π là số vô tỉ) là đúng." },
        { q: "Số đối của −√5 là?", opts: ["√5", "−√5", "5"], correct: 0,
          solution: "Số đối của a là −a; số đối của −√5 là √5." },
        { q: "−√81 là số gì?", opts: ["Số vô tỉ", "Số hữu tỉ (= −9)", "Không xác định"], correct: 1,
          solution: "√81 = 9 nên −√81 = −9, là một số nguyên ⊂ số hữu tỉ." },
        { q: "So sánh √5 và 2,36.", opts: ["√5 > 2,36", "√5 < 2,36", "Bằng nhau"], correct: 1,
          solution: "√5 ≈ 2,236 < 2,36 nên √5 < 2,36." },
        { q: "Phương trình |x| = 2,5 có bao nhiêu giá trị x?", opts: ["1", "2 (x = 2,5 và x = −2,5)", "Vô số"], correct: 1,
          solution: "Có hai số cách O đúng 2,5 đơn vị là 2,5 và −2,5 → 2 giá trị." },
      ] },
  ],
};

const BAI_8 = {
  meta: { chapter: "Chương III", lesson: "Bài 8", title: "Góc đặc biệt &", highlight: "tia phân giác",
    intro: "Khi hai đường thẳng cắt nhau, chúng tạo ra những cặp góc đặc biệt. Kéo hình để khám phá quan hệ giữa chúng." },
  stations: [
    { id: "cross", num: 0, title: "Hai đường thẳng cắt nhau", icon: "activity", type: "geometry", mode: "crossing", start: 55,
      sliderLabel: "Kéo đổi góc",
      prompt: "Hai đường thẳng cắt nhau tại O tạo 4 góc. Kéo thanh trượt và quan sát: cặp nào luôn bằng nhau, cặp nào có tổng 180°?" },

    { id: "kebu", num: 1, title: "Hai góc kề bù", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Hai góc ", { hl: "kề bù", color: C.amber }, " là hai góc có một cạnh chung, hai cạnh còn lại là hai tia đối nhau. Tính chất: hai góc kề bù có ", { hl: "tổng số đo bằng 180°", color: C.amber }, "."],
      figure: { kind: "kebu", a: 65, caption: "Hai góc kề bù: 65° + 115° = 180°" } },

    { id: "doidinh", num: 2, title: "Hai góc đối đỉnh", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Hai góc ", { hl: "đối đỉnh", color: C.amber }, " là hai góc mà mỗi cạnh của góc này là tia đối của một cạnh của góc kia. Tính chất: hai góc đối đỉnh thì ", { hl: "bằng nhau", color: C.amber }, "."],
      figure: { kind: "crossing", a: 58, caption: "Hai góc đối đỉnh (cùng màu) bằng nhau" } },

    { id: "bisector", num: 3, title: "Tia phân giác của một góc", icon: "activity", type: "geometry", mode: "bisector", start: 70,
      sliderLabel: "Kéo đổi góc xOy",
      prompt: "Tia Oz chia góc xOy thành hai phần bằng nhau. Kéo để đổi góc xOy và quan sát hai góc nhỏ luôn bằng nhau và bằng một nửa." },

    { id: "tpgdef", num: 4, title: "Định nghĩa tia phân giác", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Tia phân giác của một góc là tia nằm giữa hai cạnh của góc và tạo với hai cạnh ấy hai góc bằng nhau. Khi Oz là phân giác của xOy thì ", { hl: "xOz = zOy = ½ · xOy", color: C.amber }, "."],
      figure: { kind: "bisector", a: 70, caption: "Oz là phân giác: xOz = zOy = 35°" } },

    { id: "practice", num: 5, title: "Luyện tính số đo góc", icon: "hash", type: "fillin", placeholder: "vd: 60",
      questions: [
        { ask: "Hai góc kề bù, một góc bằng 60°. Góc còn lại bằng bao nhiêu độ?", answer: 120, hint: "Tổng hai góc kề bù = 180° → góc kia = 180° − 60° = 120°.",
          figure: { kind: "kebu", a: 60, lb: "60°", la: "?", ans: "120°", caption: "60° + ? = 180°" } },
        { ask: "xOy và x'Oy' là hai góc đối đỉnh, xOy = 70°. Số đo x'Oy' (độ)?", answer: 70, hint: "Hai góc đối đỉnh bằng nhau → 70°.",
          figure: { kind: "crossing", a: 70, l1: "70°", l3: "?", l2: "", l4: "", ans: "70°", caption: "Hai góc đối đỉnh bằng nhau" } },
        { ask: "Oz là tia phân giác của xOy = 68°. Số đo xOz (độ)?", answer: 34, hint: "xOz = ½ · 68° = 34°.",
          figure: { kind: "bisector", a: 68, hide: true, caption: "Oz chia đôi góc xOy = 68°" } },
        { ask: "Ot là tia phân giác của mOn = 70°. Số đo tOn (độ)?", answer: 35, hint: "tOn = ½ · 70° = 35°.",
          figure: { kind: "bisector", a: 70, hide: true, caption: "Ot chia đôi góc mOn = 70°" } },
      ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Hai góc kề bù có tổng số đo bằng bao nhiêu?", opts: ["90°", "180°", "360°"], correct: 1,
          figure: { kind: "kebu", a: 115, caption: "Hai góc kề bù" },
          solution: "Theo tính chất, hai góc kề bù có tổng số đo bằng 180°." },
        { q: "Hai góc đối đỉnh thì như thế nào?", opts: ["Bằng nhau", "Bù nhau", "Phụ nhau"], correct: 0,
          figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh (cùng màu)" },
          solution: "Hai góc đối đỉnh thì bằng nhau." },
        { q: "xx' và yy' cắt nhau tại O, góc xOy = 60°. Số đo góc x'Oy (kề bù với xOy)?",
          figure: { kind: "crossing", a: 60, l1: "60°", l2: "?", l3: "", l4: "", ans: "120°", caption: "x'Oy kề bù với xOy" },
          opts: ["120°", "60°", "30°"], correct: 0,
          solution: "x'Oy kề bù với xOy → x'Oy = 180° − 60° = 120°." },
        { q: "Cũng hình trên, số đo góc x'Oy' (đối đỉnh với xOy = 60°)?",
          figure: { kind: "crossing", a: 60, l1: "60°", l3: "?", l2: "", l4: "", ans: "60°", caption: "x'Oy' đối đỉnh với xOy" },
          opts: ["60°", "120°", "30°"], correct: 0,
          solution: "x'Oy' đối đỉnh với xOy nên x'Oy' = 60°." },
        { q: "Oz là tia phân giác của xOy = 68°. Số đo góc xOz?",
          figure: { kind: "bisector", a: 68, hide: true, caption: "Oz chia đôi góc xOy = 68°" },
          opts: ["34°", "68°", "136°"], correct: 0,
          solution: "xOz = ½ · xOy = ½ · 68° = 34°." },
      ] },
  ],
};

const BAI_9 = {
  meta: { chapter: "Chương III", lesson: "Bài 9", title: "Hai đường thẳng", highlight: "song song",
    intro: "Khi một đường thẳng cắt hai đường thẳng, nó tạo ra các cặp góc đặc biệt — và chúng cho ta dấu hiệu nhận biết song song." },
  stations: [
    { id: "trans", num: 0, title: "Đường thẳng cắt hai đường thẳng", icon: "activity", type: "geometry", mode: "transversal", start: 55,
      sliderLabel: "Kéo đổi đường cắt",
      prompt: "Đường thẳng c cắt hai đường thẳng a, b. Bấm nút để xem cặp góc so le trong / đồng vị, và kéo thanh trượt để thấy chúng luôn bằng nhau khi a song song b." },

    { id: "viTri", num: 1, title: "Góc so le trong, góc đồng vị", icon: "book", type: "reveal",
      prompt: "Bấm để xem vị trí của từng loại cặp góc:",
      cards: [
        { label: "So le trong", detail: ["Là cặp góc nằm ở ", { hl: "phần trong (giữa a và b)", color: C.teal }, " và ở hai phía khác nhau của đường cắt c."] },
        { label: "Đồng vị", detail: ["Là cặp góc ở ", { hl: "cùng một vị trí", color: C.teal }, " tại hai giao điểm (ví dụ: cùng phía trên–bên phải)."] },
        { label: "Trong cùng phía", detail: ["Là cặp góc nằm trong và cùng một phía của c; tổng của chúng bằng 180° khi a // b."] },
      ] },

    { id: "dauhieu", num: 2, title: "Dấu hiệu nhận biết", icon: "book", type: "text", variant: "definition", title2: "DẤU HIỆU",
      body: ["Nếu đường thẳng c cắt hai đường thẳng a, b và trong các góc tạo thành có ", { hl: "một cặp góc so le trong bằng nhau", color: C.amber }, " (hoặc ", { hl: "một cặp góc đồng vị bằng nhau", color: C.amber }, ") thì a song song với b."],
      figure: { kind: "parallel", a: 50, mark: "soletrong", caption: "Một cặp so le trong bằng nhau ⟹ a // b" } },

    { id: "practice", num: 3, title: "Luyện nhận biết", icon: "hash", type: "fillin", placeholder: "vd: 40",
      questions: [
        { ask: "Một cặp góc so le trong, một góc bằng 40°. Để a // b thì góc kia phải bằng bao nhiêu độ?", answer: 40, hint: "Để song song, hai góc so le trong phải bằng nhau → 40°.",
          figure: { kind: "parallel", a: 40, mark: "soletrong", la: "40°", lb: "?", ans: "40°", caption: "Hai góc so le trong" } },
        { ask: "a // b. Một góc đồng vị bằng 60°. Góc đồng vị tương ứng bằng bao nhiêu độ?", answer: 60, hint: "Khi a // b, hai góc đồng vị bằng nhau → 60°.",
          figure: { kind: "parallel", a: 60, mark: "dongvi", la: "60°", lb: "?", ans: "60°", caption: "a // b: hai góc đồng vị" } },
        { ask: "Hai góc so le trong đều bằng 50°. Khi đó góc trong cùng phía (kề một trong hai góc) bằng bao nhiêu độ?", answer: 130, hint: "Góc trong cùng phía kề bù với góc so le trong: 180° − 50° = 130°.",
          figure: { kind: "parallel", a: 50, mark: "trongcungphia", la: "?", lb: "50°", ans: "130°", caption: "Hai góc trong cùng phía bù nhau" } },
      ] },

    { id: "ex", num: 4, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Để hai đường thẳng a, b song song, một cặp góc so le trong phải như thế nào?",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "50°", caption: "Cặp góc so le trong" },
          opts: ["Bằng nhau", "Bù nhau", "Phụ nhau"], correct: 0,
          solution: "Dấu hiệu: một cặp góc so le trong bằng nhau thì a // b." },
        { q: "Đường c cắt a, b tạo một cặp góc đồng vị 40° và 40°. Hai đường a, b thế nào?",
          figure: { kind: "parallel", a: 40, mark: "dongvi", la: "40°", lb: "40°", caption: "Cặp góc đồng vị bằng nhau" },
          opts: ["Song song", "Cắt nhau", "Vuông góc"], correct: 0,
          solution: "Cặp góc đồng vị bằng nhau (40° = 40°) → a // b." },
        { q: "Hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì?",
          figure: { kind: "parallel", a: 90, mark: "dongvi", la: "90°", lb: "90°", caption: "Cùng vuông góc với c" },
          opts: ["Song song với nhau", "Cắt nhau", "Trùng nhau"], correct: 0,
          solution: "Cả hai cùng tạo góc 90° (đồng vị bằng nhau) với đường thứ ba nên chúng song song." },
        { q: "Biết góc MEF = 40° và EMN = 40° là hai góc so le trong. Khi đó?",
          figure: { kind: "parallel", a: 40, mark: "soletrong", la: "40°", lb: "40°", caption: "Hai góc so le trong bằng nhau" },
          opts: ["EF // NM", "EF cắt NM", "Không kết luận được"], correct: 0,
          solution: "Hai góc so le trong bằng nhau (40° = 40°) → EF // NM." },
        { q: "a // b, một góc so le trong bằng 65°. Góc trong cùng phía với nó bằng?",
          figure: { kind: "parallel", a: 65, mark: "trongcungphia", la: "?", lb: "65°", ans: "115°", caption: "Hai góc trong cùng phía bù nhau" },
          opts: ["115°", "65°", "25°"], correct: 0,
          solution: "Góc trong cùng phía kề bù với góc so le trong: 180° − 65° = 115°." },
      ] },
  ],
};

const BAI_10 = {
  meta: { chapter: "Chương III", lesson: "Bài 10", title: "Tiên đề Euclid &", highlight: "đường thẳng song song",
    intro: "Qua một điểm ngoài đường thẳng chỉ có duy nhất một đường song song — và từ đó suy ra các tính chất về góc." },
  stations: [
    { id: "trans", num: 0, title: "Khi a // b thì các góc bằng nhau", icon: "activity", type: "geometry", mode: "transversal", start: 50,
      sliderLabel: "Kéo đổi đường cắt",
      prompt: "Hai đường a, b song song bị đường c cắt. Bấm nút và kéo thanh trượt để xác nhận: các góc so le trong bằng nhau, các góc đồng vị cũng bằng nhau." },

    { id: "axiom", num: 1, title: "Tiên đề Euclid", icon: "book", type: "text", variant: "definition", title2: "TIÊN ĐỀ",
      body: ["Qua một điểm ở ngoài một đường thẳng, ", { hl: "chỉ có một đường thẳng song song", color: C.amber }, " với đường thẳng đó. (Đường thẳng song song đi qua điểm đó là duy nhất.)"],
      figure: { kind: "euclid", caption: "Qua M chỉ kẻ được một đường thẳng song song với a" } },

    { id: "property", num: 2, title: "Tính chất hai đường thẳng song song", icon: "book", type: "text", variant: "definition", title2: "TÍNH CHẤT",
      body: ["Nếu một đường thẳng cắt hai đường thẳng ", { hl: "song song", color: C.amber }, " thì: hai góc so le trong bằng nhau; hai góc đồng vị bằng nhau (và hai góc trong cùng phía bù nhau)."],
      figure: { kind: "parallel", a: 55, mark: "soletrong", caption: "a // b: hai góc so le trong bằng nhau" } },

    { id: "hequa", num: 3, title: "Vài hệ quả thường dùng", icon: "book", type: "reveal",
      prompt: "Bấm để xem các hệ quả suy ra từ tiên đề Euclid:",
      cards: [
        { label: "Cắt một thì cắt cả hai", detail: ["Một đường thẳng cắt một trong hai đường thẳng song song thì ", { hl: "cũng cắt đường thẳng còn lại", color: C.teal }, "."] },
        { label: "Vuông góc theo", detail: ["Một đường thẳng vuông góc với một trong hai đường thẳng song song thì ", { hl: "cũng vuông góc với đường kia", color: C.teal }, "."] },
        { label: "Cùng song song", detail: ["Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì ", { hl: "song song với nhau", color: C.teal }, "."] },
      ] },

    { id: "practice", num: 4, title: "Luyện tính góc khi a // b", icon: "hash", type: "fillin", placeholder: "vd: 50",
      questions: [
        { ask: "a // b, một góc so le trong bằng 50°. Góc so le trong kia bằng bao nhiêu độ?", answer: 50, hint: "a // b nên hai góc so le trong bằng nhau → 50°.",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "?", ans: "50°", caption: "a // b: hai góc so le trong bằng nhau" } },
        { ask: "xy // x'y', một góc đồng vị bằng 50°. Góc đồng vị tương ứng bằng bao nhiêu độ?", answer: 50, hint: "Hai góc đồng vị bằng nhau khi hai đường song song → 50°.",
          figure: { kind: "parallel", a: 50, mark: "dongvi", la: "50°", lb: "?", ans: "50°", caption: "xy // x'y': hai góc đồng vị bằng nhau" } },
        { ask: "a // b, một góc trong cùng phía bằng 70°. Góc trong cùng phía còn lại bằng bao nhiêu độ?", answer: 110, hint: "Hai góc trong cùng phía bù nhau: 180° − 70° = 110°.",
          figure: { kind: "parallel", a: 70, mark: "trongcungphia", la: "?", lb: "70°", ans: "110°", caption: "Hai góc trong cùng phía bù nhau (= 180°)" } },
      ] },

    { id: "ex", num: 5, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Qua một điểm ngoài một đường thẳng, có bao nhiêu đường thẳng song song với nó?",
          figure: { kind: "euclid", caption: "Tiên đề Euclid" },
          opts: ["Đúng một đường", "Hai đường", "Vô số đường"], correct: 0,
          solution: "Theo tiên đề Euclid: chỉ có duy nhất một đường thẳng song song." },
        { q: "a // b. Một đường thẳng c cắt a. Khi đó c và b thế nào?",
          figure: { kind: "parallel", a: 55, mark: "dongvi", la: "", lb: "", caption: "c cắt a, với a // b" },
          opts: ["c cũng cắt b", "c song song b", "Không xác định"], correct: 0,
          solution: "Hệ quả của tiên đề Euclid: cắt một trong hai đường song song thì cũng cắt đường kia." },
        { q: "a // b, một góc so le trong bằng 50°. Góc so le trong kia bằng?",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "?", ans: "50°", caption: "a // b" },
          opts: ["50°", "130°", "40°"], correct: 0,
          solution: "Một đường cắt hai đường song song → hai góc so le trong bằng nhau = 50°." },
        { q: "a // b, một góc đồng vị bằng 60°. Góc đồng vị tương ứng bằng?",
          figure: { kind: "parallel", a: 60, mark: "dongvi", la: "60°", lb: "?", ans: "60°", caption: "a // b" },
          opts: ["60°", "120°", "30°"], correct: 0,
          solution: "Hai góc đồng vị bằng nhau khi a // b → 60°." },
        { q: "Một đường thẳng vuông góc với một trong hai đường thẳng song song thì với đường còn lại?",
          figure: { kind: "parallel", a: 90, mark: "dongvi", la: "90°", lb: "?", ans: "90°", caption: "Vuông góc với a, mà a // b" },
          opts: ["Cũng vuông góc", "Song song", "Tạo góc 45°"], correct: 0,
          solution: "Hệ quả: vuông góc với một đường thì cũng vuông góc với đường song song kia." },
      ] },
  ],
};

const BAI_11 = {
  meta: { chapter: "Chương III", lesson: "Bài 11", title: "Định lí &", highlight: "chứng minh",
    intro: "Đo đạc chỉ cho kết quả gần đúng trong vài trường hợp. Muốn chắc chắn đúng cho MỌI trường hợp, ta cần định lí và chứng minh." },
  stations: [
    { id: "why", num: 0, title: "Vì sao cần chứng minh?", icon: "book", type: "text", variant: "note", title2: "ĐẶT VẤN ĐỀ",
      body: ["Ở Bài 10 ta đo đạc để kiểm nghiệm tính chất “một đường thẳng cắt hai đường thẳng song song thì hai góc đồng vị bằng nhau”. Nhưng ", { hl: "đo đạc chỉ gần đúng và chỉ thử được vài trường hợp", color: C.violet }, ". Cần một cách lập luận để khẳng định nó đúng với mọi trường hợp — đó là chứng minh định lí."] },

    { id: "defn", num: 1, title: "Định lí, giả thiết và kết luận", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Định lí là một khẳng định được suy ra từ những khẳng định đúng đã biết, thường phát biểu dạng “Nếu … thì …”. Phần giữa “nếu” và “thì” là ", { hl: "giả thiết (GT)", color: C.amber }, "; phần sau “thì” là ", { hl: "kết luận (KL)", color: C.amber }, "."] },

    { id: "split", num: 2, title: "Tách giả thiết — kết luận", icon: "book", type: "reveal",
      prompt: "Bấm từng định lí để thấy đâu là giả thiết (GT), đâu là kết luận (KL):",
      figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh (cùng màu) bằng nhau" },
      cards: [
        { label: "Hai góc đối đỉnh", detail: ["“Nếu hai góc đối đỉnh thì chúng bằng nhau.” → GT: ", { hl: "hai góc đối đỉnh", color: C.teal }, " ; KL: ", { hl: "hai góc đó bằng nhau", color: C.teal }] },
        { label: "Vuông góc theo", detail: ["“Nếu d ⊥ d′ và d′ // d″ thì d ⊥ d″.” → GT: ", { hl: "d ⊥ d′, d′ // d″", color: C.teal }, " ; KL: ", { hl: "d ⊥ d″", color: C.teal }] },
        { label: "Cắt một thì cắt hai", detail: ["“Nếu a // b và c cắt a thì c cắt b.” → GT: ", { hl: "a // b, c cắt a", color: C.teal }, " ; KL: ", { hl: "c cắt b", color: C.teal }] },
      ] },

    { id: "what", num: 3, title: "Chứng minh định lí là gì?", icon: "book", type: "text", variant: "definition", title2: "GHI NHỚ",
      body: ["Chứng minh một định lí là ", { hl: "dùng lập luận", color: C.amber }, " để từ giả thiết và những khẳng định đúng đã biết, suy ra được kết luận."] },

    { id: "proof", num: 4, title: "Một chứng minh mẫu", icon: "book", type: "reveal",
      prompt: "Chứng minh “Hai góc đối đỉnh thì bằng nhau” (gọi các góc Ô₁, Ô₂, Ô₃). Bấm từng bước:",
      figure: { kind: "crossing", a: 50, caption: "Ô₁ đối đỉnh Ô₂; mỗi góc kề bù với Ô₃" },
      cards: [
        { label: "B1", detail: ["Ô₁ và Ô₃ kề bù nên Ô₁ + Ô₃ = 180°."] },
        { label: "B2", detail: ["Ô₂ và Ô₃ kề bù nên Ô₂ + Ô₃ = 180°."] },
        { label: "B3", detail: ["Từ đó Ô₁ + Ô₃ = Ô₂ + Ô₃, suy ra ", { hl: "Ô₁ = Ô₂", color: C.teal }, " (hai góc đối đỉnh bằng nhau)."] },
      ] },

    { id: "ex", num: 5, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Trong định lí “Nếu hai góc đối đỉnh thì hai góc đó bằng nhau”, đâu là giả thiết?",
          figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh" },
          opts: ["hai góc đối đỉnh", "hai góc bằng nhau", "cả hai vế"], correct: 0,
          solution: "Phần giữa “nếu” và “thì” là giả thiết → “hai góc đối đỉnh”. Phần sau “thì” (“hai góc bằng nhau”) là kết luận." },
        { q: "Định lí là gì?", opts: ["Khẳng định suy ra từ các khẳng định đúng đã biết", "Một phép đo chính xác", "Một ví dụ minh hoạ"], correct: 0,
          solution: "Định lí là khẳng định được suy ra (chứng minh) từ những khẳng định đúng đã biết." },
        { q: "“Hai góc đối đỉnh thì bằng nhau” là đúng. Vậy “hai góc bằng nhau thì đối đỉnh” có đúng không?",
          figure: { kind: "crossing", a: 55, caption: "Đối đỉnh thì bằng nhau — nhưng điều ngược lại?" },
          opts: ["Không — có phản ví dụ", "Có, luôn đúng", "Chỉ đúng với góc nhọn"], correct: 0,
          solution: "Sai. Hai góc có thể bằng nhau mà không đối đỉnh (ví dụ hai góc của một tam giác đều). Mệnh đề đảo không đương nhiên đúng." },
        { q: "Cho góc xOy không bẹt. Khẳng định nào ĐÚNG?",
          opts: ["Nếu Ot là phân giác của xOy thì xOt = tOy", "Nếu xOt = tOy thì Ot chắc chắn là phân giác của xOy", "Cả hai đều đúng"], correct: 0,
          solution: "Chiều thuận đúng. Chiều đảo sai vì Ot có thể là tia đối của tia phân giác, khi đó vẫn có xOt = tOy nhưng Ot không nằm giữa hai cạnh." },
        { q: "Để chứng minh một định lí, ta dùng?", opts: ["Lập luận từ GT và điều đã biết", "Đo đạc nhiều lần", "Vẽ thật chính xác"], correct: 0,
          solution: "Chứng minh là dùng lập luận suy ra kết luận từ giả thiết và những điều đúng đã biết." },
      ] },
  ],
};

const BAI_12 = {
  meta: { chapter: "Chương IV", lesson: "Bài 12", title: "Tổng các góc", highlight: "trong một tam giác",
    intro: "Dù tam giác hình dạng nào, tổng ba góc trong của nó luôn bằng 180°. Kéo hình để tự kiểm chứng." },
  stations: [
    { id: "tri", num: 0, title: "Tổng ba góc luôn bằng 180°", icon: "activity", type: "geometry", mode: "triangle", start: 55, start2: 60,
      prompt: "Kéo hai thanh trượt để đổi góc B và góc C của tam giác. Quan sát góc A và tổng ba góc — dù tam giác thay đổi thế nào, tổng vẫn luôn là 180°." },

    { id: "thm", num: 1, title: "Định lí tổng ba góc", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH LÍ",
      body: ["Tổng ba góc trong một tam giác bằng ", { hl: "180°", color: C.amber }, ". (Chứng minh: qua đỉnh A kẻ đường thẳng song song với BC, dùng các cặp góc so le trong sẽ thấy Â + B̂ + Ĉ = 180°.)"],
      figure: { kind: "triangle", b: 55, c: 65, labelA: "Â", labelB: "B̂", labelC: "Ĉ", caption: "Â + B̂ + Ĉ = 180°" } },

    { id: "kinds", num: 2, title: "Phân loại tam giác theo góc", icon: "book", type: "reveal",
      prompt: "Bấm để xem ba loại tam giác theo góc:",
      cards: [
        { label: "Tam giác nhọn", detail: ["Cả ba góc đều nhọn (đều nhỏ hơn 90°)."] },
        { label: "Tam giác vuông", detail: ["Có một góc vuông (90°). Hai góc nhọn còn lại ", { hl: "phụ nhau (tổng 90°)", color: C.teal }, "; cạnh đối diện góc vuông là cạnh huyền."] },
        { label: "Tam giác tù", detail: ["Có một góc tù (lớn hơn 90°)."] },
      ] },

    { id: "practice", num: 3, title: "Luyện tính số đo góc", icon: "hash", type: "fillin", placeholder: "vd: 70",
      questions: [
        { ask: "Tam giác có hai góc 50° và 60°. Số đo góc thứ ba (độ)?", answer: 70, hint: "Góc thứ ba = 180° − 50° − 60° = 70°.",
          figure: { kind: "triangle", b: 50, c: 60, labelA: "?", labelB: "50°", labelC: "60°", ans: "70°" } },
        { ask: "Tam giác vuông có một góc nhọn bằng 60°. Góc nhọn còn lại (độ)?", answer: 30, hint: "Hai góc nhọn của tam giác vuông phụ nhau: 90° − 60° = 30°.",
          figure: { kind: "triangle", b: 90, c: 60, labelA: "?", labelB: "90°", labelC: "60°", ans: "30°" } },
        { ask: "Tam giác có hai góc 90° và 55°. Số đo góc còn lại (độ)?", answer: 35, hint: "180° − 90° − 55° = 35°.",
          figure: { kind: "triangle", b: 90, c: 55, labelA: "?", labelB: "90°", labelC: "55°", ans: "35°" } },
        { ask: "Tam giác có một góc ngoài bằng 110°, một góc trong không kề bằng 50°. Góc trong không kề còn lại (độ)?", answer: 60, hint: "Góc ngoài = tổng hai góc trong không kề: 110° − 50° = 60°." },
      ] },

    { id: "ex", num: 4, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Tổng ba góc trong một tam giác bằng bao nhiêu?", opts: ["90°", "180°", "360°"], correct: 1,
          figure: { kind: "triangle", b: 60, c: 60, labelA: "60°", labelB: "60°", labelC: "60°", caption: "Tổng ba góc = 180°" },
          solution: "Theo định lí, tổng ba góc trong một tam giác bằng 180°." },
        { q: "Tam giác có ba góc 120°, 35° và góc x. Số đo x?", opts: ["25°", "35°", "60°"], correct: 0,
          figure: { kind: "triangle", b: 120, c: 35, labelA: "?", labelB: "120°", labelC: "35°", ans: "25°" },
          solution: "x = 180° − 120° − 35° = 25°." },
        { q: "Một tam giác có một góc 100°. Đó là tam giác gì?", opts: ["Tam giác tù", "Tam giác vuông", "Tam giác nhọn"], correct: 0,
          figure: { kind: "triangle", b: 100, c: 45, labelA: "35°", labelB: "100°", labelC: "45°" },
          solution: "Có một góc lớn hơn 90° (góc tù) nên là tam giác tù." },
        { q: "Trong tam giác vuông, hai góc nhọn có quan hệ gì?", opts: ["Phụ nhau (tổng 90°)", "Bù nhau (tổng 180°)", "Bằng nhau"], correct: 0,
          figure: { kind: "triangle", b: 90, c: 55, labelA: "35°", labelB: "90°", labelC: "55°", caption: "Hai góc nhọn phụ nhau" },
          solution: "Vì tổng ba góc = 180° và đã có một góc 90°, hai góc nhọn còn lại có tổng 90° (phụ nhau)." },
        { q: "Góc ngoài tại một đỉnh của tam giác bằng?", opts: ["Tổng hai góc trong không kề với nó", "Góc trong kề với nó", "90°"], correct: 0,
          solution: "Mỗi góc ngoài của tam giác bằng tổng hai góc trong không kề với nó." },
      ] },
  ],
};

const BAI_13 = {
  meta: { chapter: "Chương IV", lesson: "Bài 13", title: "Hai tam giác bằng nhau", highlight: "(c.c.c)",
    intro: "Hai tam giác bằng nhau khi các cạnh và góc tương ứng bằng nhau. Chỉ cần ba cạnh bằng nhau là đủ để kết luận — trường hợp c.c.c." },
  stations: [
    { id: "corr", num: 0, title: "Yếu tố tương ứng", icon: "book", type: "reveal",
      prompt: "Khi △ABC = △A′B′C′, các đỉnh ghi theo đúng thứ tự tương ứng. Bấm để xem:",
      figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["A'", "B'", "C'"], caption: "Cạnh cùng số gạch là cạnh tương ứng bằng nhau" },
      cards: [
        { label: "Đỉnh tương ứng", detail: ["A ↔ A′, B ↔ B′, C ↔ C′ (theo đúng thứ tự viết)."] },
        { label: "Cạnh tương ứng", detail: ["AB = A′B′, BC = B′C′, CA = C′A′ (", { hl: "các cạnh tương ứng bằng nhau", color: C.teal }, ")."] },
        { label: "Góc tương ứng", detail: ["Â = Â′, B̂ = B̂′, Ĉ = Ĉ′ (", { hl: "các góc tương ứng bằng nhau", color: C.teal }, ")."] },
      ] },

    { id: "def", num: 1, title: "Hai tam giác bằng nhau", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Hai tam giác bằng nhau là hai tam giác có ", { hl: "các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau", color: C.amber }, ". Kí hiệu △ABC = △A′B′C′ (viết các đỉnh theo đúng thứ tự tương ứng)."] },

    { id: "ccc", num: 2, title: "Trường hợp c.c.c", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP BẰNG NHAU 1",
      body: ["Nếu ", { hl: "ba cạnh của tam giác này bằng ba cạnh của tam giác kia", color: C.amber }, " thì hai tam giác đó bằng nhau (cạnh – cạnh – cạnh, viết tắt c.c.c). Không cần kiểm tra các góc!"],
      figure: { kind: "two-triangles", caption: "Ba cạnh bằng nhau ⟹ hai tam giác bằng nhau (c.c.c)" } },

    { id: "build", num: 3, title: "Vì sao chỉ cần ba cạnh?", icon: "book", type: "reveal",
      prompt: "Bấm để xem cách dựng tam giác khi biết ba cạnh (bằng compa):",
      cards: [
        { label: "B1", detail: ["Vẽ một cạnh, chẳng hạn BC = 6 cm bằng thước."] },
        { label: "B2", detail: ["Vẽ cung tròn tâm B bán kính 5 cm và cung tròn tâm C bán kính 4 cm, chúng cắt nhau tại A."] },
        { label: "B3", detail: ["Nối A với B, C. Ba cạnh đã cố định nên hình tam giác là ", { hl: "duy nhất", color: C.teal }, " — vì thế ba cạnh bằng nhau là đủ để hai tam giác bằng nhau."] },
      ] },

    { id: "practice", num: 4, title: "Luyện dùng tam giác bằng nhau", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "△ABC = △DEF và BC = 4 cm. Độ dài EF (cm)?", answer: 4, hint: "BC và EF là hai cạnh tương ứng → EF = BC = 4 cm.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], caption: "△ABC = △DEF: cạnh tương ứng bằng nhau" } },
        { ask: "Tam giác ABC có góc ABC = 40°, góc ACB = 60°. Số đo góc A (độ)?", answer: 80, hint: "Â = 180° − 40° − 60° = 80°.",
          figure: { kind: "triangle", b: 40, c: 60, labelA: "?", labelB: "40°", labelC: "60°", ans: "80°" } },
        { ask: "△ABC = △DEF với góc A = 80°. Số đo góc EDF tương ứng (độ)?", answer: 80, hint: "Góc EDF tương ứng với góc A → EDF = 80°.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], caption: "Góc tương ứng bằng nhau: D ↔ A" } },
      ] },

    { id: "ex", num: 5, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Theo trường hợp c.c.c, để kết luận hai tam giác bằng nhau cần kiểm tra mấy cặp cạnh?",
          figure: { kind: "two-triangles", marks: "ccc", caption: "Trường hợp c.c.c" },
          opts: ["3 cặp cạnh", "2 cặp cạnh", "1 cặp cạnh và 1 cặp góc"], correct: 0,
          solution: "Trường hợp c.c.c: chỉ cần ba cạnh của tam giác này bằng ba cạnh tam giác kia." },
        { q: "△ACB và △BDA có AC = BD, BC = AD, AB là cạnh chung. Kết luận nào đúng?",
          figure: { kind: "two-triangles", marks: "ccc", caption: "Ba cạnh bằng nhau từng đôi" },
          opts: ["△ACB = △BDA (c.c.c)", "Hai tam giác không bằng nhau", "Chưa đủ dữ kiện"], correct: 0,
          solution: "Ba cạnh bằng nhau từng đôi (AC = BD, CB = DA, AB chung) → △ACB = △BDA theo c.c.c." },
        { q: "Nếu △ABC = △DEF thì cạnh AB tương ứng với cạnh nào của △DEF?",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], marks: "ccc", caption: "A↔D, B↔E, C↔F" },
          opts: ["DE", "EF", "DF"], correct: 0,
          solution: "Viết theo thứ tự A↔D, B↔E nên AB tương ứng với DE." },
        { q: "△ABC = △DEF, biết Â = 60° và Ê = 80°. Số đo góc B?",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], marks: "gcg", caption: "Góc tương ứng: B ↔ E" },
          opts: ["80°", "60°", "40°"], correct: 0,
          solution: "Góc B tương ứng với góc E nên B̂ = Ê = 80°." },
        { q: "Hai tam giác có ba cạnh bằng nhau từng đôi một thì?",
          figure: { kind: "two-triangles", caption: "Ba cạnh tương ứng bằng nhau" },
          opts: ["Chắc chắn bằng nhau", "Có thể khác hình dạng", "Chỉ bằng nhau nếu thêm một góc bằng nhau"], correct: 0,
          solution: "Ba cạnh xác định duy nhất một tam giác, nên hai tam giác đó chắc chắn bằng nhau (c.c.c)." },
      ] },
  ],
};

const BAI_14 = {
  meta: { chapter: "Chương IV", lesson: "Bài 14", title: "Tam giác bằng nhau", highlight: "(c.g.c & g.c.g)",
    intro: "Không phải lúc nào cũng đo được hết ba cạnh. Hai trường hợp c.g.c và g.c.g cho ta những cách kiểm tra ngắn hơn." },
  stations: [
    { id: "xengiua", num: 0, title: "Góc xen giữa hai cạnh", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Trong tam giác ABC, góc A (góc BAC) là ", { hl: "góc xen giữa hai cạnh AB và AC", color: C.amber }, ". Tương tự, các góc B và C là các góc kề cạnh BC."],
      figure: { kind: "triangle", b: 55, c: 65, caption: "Góc A xen giữa hai cạnh AB và AC" } },

    { id: "cgc", num: 1, title: "Trường hợp cạnh – góc – cạnh", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP 2 (c.g.c)",
      body: ["Nếu ", { hl: "hai cạnh và góc xen giữa", color: C.amber }, " của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia thì hai tam giác đó bằng nhau."],
      figure: { kind: "two-triangles", marks: "cgc", caption: "Hai cạnh + góc xen giữa bằng nhau ⟹ bằng nhau (c.g.c)" } },

    { id: "gcg", num: 2, title: "Trường hợp góc – cạnh – góc", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP 3 (g.c.g)",
      body: ["Nếu ", { hl: "một cạnh và hai góc kề", color: C.amber }, " của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau."],
      figure: { kind: "two-triangles", marks: "gcg", caption: "Một cạnh + hai góc kề bằng nhau ⟹ bằng nhau (g.c.g)" } },

    { id: "distinguish", num: 3, title: "Phân biệt c.g.c và g.c.g", icon: "book", type: "reveal",
      prompt: "Bấm để nhớ cách phân biệt hai trường hợp:",
      cards: [
        { label: "c.g.c", detail: ["Hai ", { hl: "CẠNH", color: C.teal }, " và ", { hl: "GÓC XEN GIỮA", color: C.teal }, " chúng bằng nhau (góc nằm giữa hai cạnh)."] },
        { label: "g.c.g", detail: ["Một ", { hl: "CẠNH", color: C.teal }, " và ", { hl: "HAI GÓC KỀ", color: C.teal }, " cạnh đó bằng nhau (cạnh nằm giữa hai góc)."] },
        { label: "Mẹo nhớ", detail: ["Đọc tên từ trái sang phải: c.g.c → cạnh-góc-cạnh (góc ở giữa); g.c.g → góc-cạnh-góc (cạnh ở giữa)."] },
      ] },

    { id: "practice", num: 4, title: "Luyện dùng c.g.c, g.c.g", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "Hai tam giác bằng nhau theo c.g.c. Một tam giác có cạnh 3 cm thì cạnh tương ứng của tam giác kia bằng bao nhiêu cm?", answer: 3, hint: "Hai tam giác bằng nhau ⟹ các cạnh tương ứng bằng nhau → 3 cm.",
          figure: { kind: "two-triangles", marks: "cgc", caption: "Cạnh tương ứng bằng nhau" } },
        { ask: "△ABC = △DEF, góc B = 80°. Số đo góc E tương ứng (độ)?", answer: 80, hint: "Góc E tương ứng với góc B → 80°.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], marks: "gcg", caption: "Góc tương ứng: E ↔ B" } },
        { ask: "Tam giác có góc B = 80°, góc C = 40°. Số đo góc A (độ)?", answer: 60, hint: "Â = 180° − 80° − 40° = 60°.",
          figure: { kind: "triangle", b: 80, c: 40, labelA: "?", labelB: "80°", labelC: "40°", ans: "60°" } },
      ] },

    { id: "ex", num: 5, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Góc xen giữa hai cạnh AB và AC của tam giác ABC là góc nào?", opts: ["Góc A", "Góc B", "Góc C"], correct: 0,
          figure: { kind: "triangle", b: 55, c: 65, caption: "Tam giác ABC" },
          solution: "Góc nằm giữa hai cạnh AB và AC chính là góc A (góc BAC)." },
        { q: "Để dùng trường hợp c.g.c, góc bằng nhau phải là góc như thế nào?", opts: ["Góc xen giữa hai cạnh đó", "Góc bất kì", "Góc kề một cạnh"], correct: 0,
          figure: { kind: "two-triangles", marks: "cgc", caption: "c.g.c" },
          solution: "Trường hợp c.g.c yêu cầu góc bằng nhau phải là góc xen giữa hai cạnh đang xét." },
        { q: "Trường hợp g.c.g cần những yếu tố nào bằng nhau?", opts: ["Một cạnh và hai góc kề", "Ba góc", "Ba cạnh"], correct: 0,
          figure: { kind: "two-triangles", marks: "gcg", caption: "g.c.g" },
          solution: "g.c.g: một cạnh và hai góc kề cạnh đó bằng nhau." },
        { q: "△ABC và △DEC có BAC = EDC, AC = DC, BCA = ECD (đối đỉnh). Kết luận đúng?", opts: ["△ABC = △DEC (g.c.g)", "Chưa đủ dữ kiện", "Chỉ bằng diện tích"], correct: 0,
          figure: { kind: "two-triangles", marks: "gcg", caption: "Một cạnh + hai góc kề (g.c.g)" },
          solution: "Có một cạnh (AC = DC) và hai góc kề bằng nhau → △ABC = △DEC theo g.c.g." },
        { q: "Hai tam giác có AB = A′B′, góc A = góc A′, AC = A′C′. Chúng bằng nhau theo trường hợp nào?", opts: ["c.g.c", "g.c.g", "c.c.c"], correct: 0,
          figure: { kind: "two-triangles", marks: "cgc", caption: "Hai cạnh + góc xen giữa" },
          solution: "Hai cạnh (AB, AC) và góc xen giữa (góc A) bằng nhau → c.g.c." },
      ] },
  ],
};

const BAI_15 = {
  meta: { chapter: "Chương IV", lesson: "Bài 15", title: "Tam giác bằng nhau", highlight: "(tam giác vuông)",
    intro: "Tam giác vuông đã có sẵn một góc 90°, nên việc kiểm tra bằng nhau gọn hơn — chỉ cần vài yếu tố." },
  stations: [
    { id: "vocab", num: 0, title: "Cạnh huyền và cạnh góc vuông", icon: "book", type: "text", variant: "definition", title2: "GHI NHỚ",
      body: ["Trong tam giác vuông, cạnh đối diện góc vuông là ", { hl: "cạnh huyền", color: C.amber }, " (cạnh dài nhất); hai cạnh kề góc vuông là ", { hl: "cạnh góc vuông", color: C.amber }, "."],
      figure: { kind: "right-triangles", marks: "none", caption: "Hai cạnh góc vuông và cạnh huyền (chéo)" } },

    { id: "three", num: 1, title: "Ba trường hợp (suy từ tam giác thường)", icon: "book", type: "reveal",
      prompt: "Tam giác vuông đã có một góc 90° bằng nhau sẵn, nên chỉ cần thêm vài yếu tố. Bấm xem ba trường hợp:",
      figure: { kind: "right-triangles", marks: "huyen-goc", caption: "Ví dụ: cạnh huyền – góc nhọn bằng nhau" },
      cards: [
        { label: "Hai cạnh góc vuông", detail: ["Hai cạnh góc vuông bằng nhau từng đôi ⟹ bằng nhau (suy từ ", { hl: "c.g.c", color: C.teal }, ")."] },
        { label: "Cạnh góc vuông – góc nhọn kề", detail: ["Một cạnh góc vuông và một góc nhọn kề bằng nhau ⟹ bằng nhau (suy từ ", { hl: "g.c.g", color: C.teal }, ")."] },
        { label: "Cạnh huyền – góc nhọn", detail: ["Cạnh huyền và một góc nhọn bằng nhau ⟹ ", { hl: "hai tam giác vuông bằng nhau", color: C.teal }, "."] },
      ] },

    { id: "special", num: 2, title: "Trường hợp đặc biệt: cạnh huyền – cạnh góc vuông", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP ĐẶC BIỆT",
      body: ["Nếu ", { hl: "cạnh huyền và một cạnh góc vuông", color: C.amber }, " của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau."],
      figure: { kind: "right-triangles", marks: "huyen-cgv", caption: "Cạnh huyền + một cạnh góc vuông bằng nhau" } },

    { id: "practice", num: 3, title: "Luyện về tam giác vuông", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "Tam giác vuông có một góc nhọn bằng 35°. Góc nhọn còn lại bằng bao nhiêu độ?", answer: 55, hint: "Hai góc nhọn phụ nhau: 90° − 35° = 55°.",
          figure: { kind: "right-triangles", marks: "gcg", caption: "Tam giác vuông" } },
        { ask: "Hai tam giác vuông bằng nhau (cạnh huyền – góc nhọn). Một góc nhọn bằng 40° thì góc nhọn tương ứng (độ)?", answer: 40, hint: "Hai tam giác bằng nhau ⟹ góc tương ứng bằng nhau → 40°.",
          figure: { kind: "right-triangles", marks: "huyen-goc", caption: "Cạnh huyền – góc nhọn" } },
        { ask: "Tam giác vuông có cạnh huyền 5, một cạnh góc vuông 3. Cạnh góc vuông còn lại bằng bao nhiêu? (gợi ý: bộ ba 3 – 4 – 5)", answer: 4, hint: "Theo bộ ba Pythagore quen thuộc 3 – 4 – 5: cạnh còn lại bằng 4.",
          figure: { kind: "right-triangles", marks: "huyen-cgv", caption: "Cạnh huyền 5, cạnh góc vuông 3" } },
      ] },

    { id: "ex", num: 4, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Hai tam giác vuông có hai cạnh góc vuông bằng nhau từng đôi thì bằng nhau (suy từ c.g.c). Đúng hay sai?",
          figure: { kind: "right-triangles", marks: "cgc", caption: "Hai cạnh góc vuông bằng nhau" },
          opts: ["Đúng", "Sai", "Chưa đủ"], correct: 0,
          solution: "Hai cạnh góc vuông là hai cạnh kề góc vuông 90° (góc xen giữa) → đúng theo c.g.c." },
        { q: "Trường hợp bằng nhau ĐẶC BIỆT của tam giác vuông dùng cặp yếu tố nào?",
          figure: { kind: "right-triangles", marks: "huyen-cgv", caption: "Cạnh huyền – cạnh góc vuông" },
          opts: ["Cạnh huyền và một cạnh góc vuông", "Ba góc bằng nhau", "Hai góc nhọn bằng nhau"], correct: 0,
          solution: "Trường hợp đặc biệt: cạnh huyền và một cạnh góc vuông bằng nhau." },
        { q: "Hai tam giác vuông có cạnh huyền và một góc nhọn bằng nhau thì?",
          figure: { kind: "right-triangles", marks: "huyen-goc", caption: "Cạnh huyền – góc nhọn" },
          opts: ["Bằng nhau", "Chưa đủ kết luận", "Chỉ bằng chu vi"], correct: 0,
          solution: "Đây chính là trường hợp cạnh huyền – góc nhọn → hai tam giác vuông bằng nhau." },
        { q: "Hai cây cột cao bằng nhau, dựng thẳng đứng; lúc chiều bóng nắng dài bằng nhau. Hai tam giác vuông (cột – bóng) bằng nhau theo trường hợp nào?",
          figure: { kind: "right-triangles", marks: "cgc", caption: "Cột và bóng là hai cạnh góc vuông" },
          opts: ["Hai cạnh góc vuông (c.g.c)", "Ba cạnh", "Hai góc nhọn"], correct: 0,
          solution: "Chiều cao cột bằng nhau và bóng bằng nhau là hai cạnh góc vuông, góc giữa chúng đều 90° → c.g.c." },
        { q: "Hình chữ nhật ABCD, M là trung điểm BC. Vì sao △ABM = △DCM?",
          figure: { kind: "right-triangles", marks: "cgc", caption: "AB = DC, BM = CM, góc B = góc C = 90°" },
          opts: ["AB = DC, góc B = góc C = 90°, BM = CM (c.g.c)", "Vì cùng diện tích", "Không bằng nhau"], correct: 0,
          solution: "AB = DC (cạnh đối hình chữ nhật), góc B = góc C = 90°, BM = CM (M trung điểm) → c.g.c." },
      ] },
  ],
};

const LESSONS = [BAI_1, BAI_2, BAI_3, BAI_4, BAI_5, BAI_6, BAI_7, BAI_8, BAI_9, BAI_10, BAI_11, BAI_12, BAI_13, BAI_14, BAI_15];

/* ════════════════════════════════════════════════════════════════
   APP — engine đọc lesson và dựng giao diện
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [starsByLesson, setStarsByLesson] = useState({});
  const lesson = LESSONS[lessonIdx];
  const stars = starsByLesson[lessonIdx] || {};
  const award = (id) => setStarsByLesson((p) => {
    const cur = p[lessonIdx] || {};
    if (cur[id]) return p;
    return { ...p, [lessonIdx]: { ...cur, [id]: true } };
  });

  const starred = lesson.stations.filter((s) => s.type !== "text");
  const earned = starred.filter((s) => stars[s.id]).length;
  const total = starred.length;

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap";
    document.head.appendChild(l);
    const st = document.createElement("style");
    st.textContent = "@keyframes figFlash{0%{opacity:0}25%{opacity:.55}50%{opacity:.18}75%{opacity:.5}100%{opacity:.3}}.figFlash{opacity:.3;animation:figFlash 1.1s ease-in-out 1 forwards}@keyframes figPulse{0%{opacity:0}50%{opacity:.32}100%{opacity:.14}}.figPulse{opacity:.14;animation:figPulse 1.2s ease-in-out 2 forwards}";
    document.head.appendChild(st);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", background: C.paper, backgroundImage: `linear-gradient(${C.ink}0E 1px, transparent 1px), linear-gradient(90deg, ${C.ink}0E 1px, transparent 1px)`, backgroundSize: "26px 26px", minHeight: "100vh", color: C.ink }}>
      <header style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <Pill bg={C.violet}><Sparkles size={14} /> TOÁN 7 · Tương tác</Pill>
          <Pill bg={C.ink}>{lesson.meta.chapter} · {lesson.meta.lesson}</Pill>
        </div>
        <h1 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: "clamp(34px,6.5vw,58px)", lineHeight: 1, margin: "6px 0 8px" }}>
          {lesson.meta.title}{" "}
          <span style={{ background: C.coral, color: "#fff", padding: "0 12px", borderRadius: 14, boxShadow: "4px 4px 0 " + C.ink, display: "inline-block", transform: "rotate(-1.5deg)" }}>{lesson.meta.highlight}</span>
        </h1>
        <p style={{ fontSize: 17, maxWidth: 620, lineHeight: 1.5, opacity: 0.85 }}>{lesson.meta.intro}</p>
        {/* chọn bài — nhóm theo chương */}
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {[...new Set(LESSONS.map((l) => l.meta.chapter))].map((chap) => (
            <div key={chap} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: C.violet, minWidth: 78 }}>{chap}</span>
              {LESSONS.map((l, i) => l.meta.chapter !== chap ? null : (
                <button key={i} onClick={() => { setLessonIdx(i); window.scrollTo({ top: 0 }); }}
                  title={`${l.meta.lesson}: ${l.meta.title} ${l.meta.highlight}`}
                  style={{ ...btnGhost, padding: "7px 13px", fontSize: 14, background: i === lessonIdx ? C.ink : "#fff", color: i === lessonIdx ? C.paper : C.ink }}>
                  <BookOpen size={14} /> {l.meta.lesson}
                </button>
              ))}
            </div>
          ))}
        </div>
      </header>

      <div style={{ position: "sticky", top: 0, zIndex: 20, background: C.paper + "EE", backdropFilter: "blur(6px)", borderBottom: "2px solid " + C.ink + "22", marginTop: 12 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
            {lesson.stations.map((s) => (
              <button key={s.id} onClick={() => go(s.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: C.ink, padding: "5px 8px", borderRadius: 8, fontFamily: "'Be Vietnam Pro'" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.ink + "12")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {s.num}. {s.title.length > 16 ? s.title.slice(0, 15) + "…" : s.title}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => <Star key={i} size={19} fill={i < earned ? C.amber : "transparent"} color={i < earned ? C.amber : C.ink + "44"} />)}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "26px 20px 60px" }}>
        {lesson.stations.map((s) => (
          <StationShell key={s.id} s={s}>{renderBlock(s, () => award(s.id))}</StationShell>
        ))}

        <div style={{ background: C.ink, color: C.paper, borderRadius: 24, padding: 30, textAlign: "center", boxShadow: "8px 8px 0 " + C.coral }}>
          {earned >= total ? (<>
            <Trophy size={46} color={C.amber} style={{ margin: "0 auto" }} />
            <h2 style={{ fontFamily: "'Baloo 2'", fontSize: 28, margin: "10px 0 6px" }}>Hoàn thành {lesson.meta.lesson}! 🎉</h2>
            <p style={{ opacity: 0.85, maxWidth: 460, margin: "0 auto" }}>Em đã thắp sáng tất cả {total} ngôi sao. Chọn bài tiếp theo ở đầu trang nhé!</p>
          </>) : (<>
            <h2 style={{ fontFamily: "'Baloo 2'", fontSize: 25, margin: "0 0 6px" }}>Còn {total - earned} ngôi sao nữa!</h2>
            <p style={{ opacity: 0.85 }}>Quay lại các trạm chưa sáng sao để hoàn thành thử thách.</p>
            <ChevronDown size={26} color={C.amber} />
          </>)}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, opacity: 0.55, marginTop: 22 }}>
          Khung bài giảng tương tác · Toán 7 — Kết nối tri thức với cuộc sống. Thêm bài mới chỉ bằng cách viết thêm 1 object dữ liệu.
        </p>
      </main>
    </div>
  );
}
