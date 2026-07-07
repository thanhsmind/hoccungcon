import { C } from "../lib/colors.js";
import { Frac } from "./Frac.jsx";

/* ───────── rich text từ token ───────── */
export function RichText({ content }) {
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
        if (t.br != null) return <br key={i} />;
        if (t.step != null) return <span key={i} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 999, background: C.violet, color: "#fff", fontSize: 13, fontWeight: 800, margin: "0 6px 0 0", verticalAlign: "middle" }}>{t.step}</span>;
        return null;
      })}
    </>
  );
}
/* đổi nội dung token -> chuỗi thuần (để gửi cho trợ lý AI) */
export function richToText(content) {
  if (content == null) return "";
  const arr = Array.isArray(content) ? content : [content];
  return arr.map((t) => {
    if (typeof t === "string") return t;
    if (t.frac) return ` ${t.frac[0]}/${t.frac[1]} `;
    if (t.b) return t.b;
    if (t.hl) return t.hl;
    if (t.sup) return "^" + t.sup;
    if (t.br != null) return "\n";
    if (t.step != null) return `(${t.step}) `;
    return "";
  }).join("");
}
