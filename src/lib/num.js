/* ───────── tiện ích số ───────── */
export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export function simplify(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
export function decToFrac(x) {
  const neg = x < 0; const s = Math.abs(x).toString();
  if (!s.includes(".")) return simplify(neg ? -Math.abs(x) : Math.abs(x), 1);
  const dec = s.split(".")[1].length, den = Math.pow(10, dec);
  const num = Math.round(Math.abs(x) * den);
  return simplify(neg ? -num : num, den);
}
// tìm phân số đúng (mẫu nhỏ nhất) ứng với một giá trị — tránh lỗi số thực lặp vô hạn
export function nearestFrac(x, maxD = 36) {
  for (let d = 1; d <= maxD; d++) {
    const n = Math.round(x * d);
    if (Math.abs(x - n / d) < 1e-6) return simplify(n, d);
  }
  return decToFrac(x);
}
export function parseNum(str) {
  if (str == null) return NaN;
  let s = String(str).trim().replace(/\s/g, "").replace(",", ".");
  if (s.includes("/")) { const [a, b] = s.split("/"); return parseFloat(a) / parseFloat(b); }
  return parseFloat(s);
}
/* chia dài để phát hiện: hữu hạn hay vô hạn tuần hoàn + chu kì */
export function decimalInfo(n, d) {
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
