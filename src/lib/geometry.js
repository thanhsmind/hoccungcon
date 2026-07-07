/* SVG: điểm cực + cung tròn (góc tính bằng độ, trục y hướng xuống nên dùng −sin) */
export const RAD = Math.PI / 180;
export function P(cx, cy, r, deg) { return { x: cx + r * Math.cos(deg * RAD), y: cy - r * Math.sin(deg * RAD) }; }
export function arc(cx, cy, r, a0, a1) {
  let span = (((a1 - a0) % 360) + 360) % 360;
  const large = span > 180 ? 1 : 0;
  const p0 = P(cx, cy, r, a0), p1 = P(cx, cy, r, a1);
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}
