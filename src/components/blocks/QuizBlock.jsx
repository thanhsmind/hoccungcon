import React, { useState } from "react";
import { C } from "../../lib/colors.js";
import { btnPrimary, btnGhost } from "../../lib/styles.js";
import { RichText, richToText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { Pill } from "../ui/Pill.jsx";
import { HowTo } from "../ui/HowTo.jsx";
import { Figure } from "../Figure.jsx";
import { Check, X, ArrowRight, Star, Sparkles } from "lucide-react";

export function QuizBlock({ s, award }) {
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
      <div><HowTo>Với mỗi câu: ① bấm chọn đáp án, ② gõ ngắn gọn cách em làm, rồi ③ bấm “Nộp bài” (nút chỉ bật khi đã làm xong cả hai bước).</HowTo></div>
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
