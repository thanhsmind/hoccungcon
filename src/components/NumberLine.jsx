import { useState, useRef, useEffect, useCallback } from "react";
import { C } from "../lib/colors.js";
import { nearestFrac } from "../lib/num.js";
import { Frac } from "./Frac.jsx";

/* ════════════════════════════════════════════════════════════════
   TRỤC SỐ TƯƠNG TÁC (signature)
   ════════════════════════════════════════════════════════════════ */
export function NumberLine({ min = -2, max = 2, denom = 1, value, onChange, mirror = false, secondary = null, height = 130, interactive = true, snap = true }) {
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
  const y = height - 54; // hạ trục số xuống thấp, chừa chỗ phía trên cho nhãn (có thể xếp chồng)
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

  const head = Math.max(0, y - 70); // chỗ trống phía trên để nâng nhãn mà không bị cắt
  const liftFor = (vv) => (value != null && Math.abs(toX(vv) - toX(value)) < 72 ? Math.min(34, head) : 0);
  const Dot = ({ v, fill, big, lift = 0 }) => {
    const [n, d] = nearestFrac(v);
    return (
      <g>
        <line x1={toX(v)} y1={y} x2={toX(v)} y2={y - 34 - lift} stroke={fill} strokeWidth={2.5} strokeDasharray="3 3" opacity={0.5} />
        <circle cx={toX(v)} cy={y} r={big ? 11 : 8} fill={fill} stroke="#fff" strokeWidth={3} />
        <foreignObject x={toX(v) - 45} y={y - 70 - lift} width={90} height={36}>
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
          <Dot v={-value} fill={C.violet} lift={liftFor(-value)} />
        </>)}
        {secondary != null && <Dot v={secondary} fill={C.violet} lift={liftFor(secondary)} />}
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
