import React, { useState, useEffect } from "react";
import {
  Star, Sparkles,
  Trophy, ChevronDown, BookOpen, List
} from "lucide-react";
import { C } from "./lib/colors.js";
import { btnGhost } from "./lib/styles.js";
import { Pill } from "./components/ui/Pill.jsx";
import { StationShell } from "./components/ui/StationShell.jsx";
import { renderBlock } from "./components/blocks/renderBlock.jsx";
import { LESSONS } from "./data/lessons/index.js";

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
   9) "reallife"    → "Ứng dụng vào đời sống": thẻ bấm mở từng tình huống thực tế (có sao khi mở hết)
                      props: prompt?, cards:[{emoji, label, detail}]
  10) "why"         → "Tại sao?": nêu câu hỏi để HS tự nghĩ, bấm để lật lời giải đáp (có sao)
                      props: question, hint?, answer, takeaway?

   Trong nội dung còn có token {br} (xuống dòng) và {step:1} (huy hiệu số bước) để diễn giải từng bước.
   Mỗi trạm tương tác tự hiển thị một dòng hướng dẫn thao tác (component HowTo) ngay trong renderer —
   không cần khai báo trong dữ liệu bài.

   NỘI DUNG (body/detail/q…) có thể là chuỗi, HOẶC mảng "token" để chèn toán:
     "Bình thường" | {b:"in đậm"} | {hl:"tô màu"} | {frac:[3,2]} | {sup:"2"}
   ════════════════════════════════════════════════════════════════ */

/* C (màu), tiện ích số và hình học đã tách sang src/lib/ — xem import ở đầu file. */

/* Frac, RichText/richToText, NumberLine, Card, Pill, HowTo, StationShell
   đã tách sang src/components/ (và src/components/ui/) — xem import ở đầu file. */


/* DỮ LIỆU BÀI HỌC (BAI_1..15 + LESSONS) đã tách sang src/data/lessons/ — xem import ở đầu file. */

/* ════════════════════════════════════════════════════════════════
   APP — engine đọc lesson và dựng giao diện
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [starsByLesson, setStarsByLesson] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const isMobile = vw < 640;
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
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {isMobile ? (
            <button onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}
              style={{ ...btnGhost, padding: "9px 14px", fontSize: 14, flex: 1, justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><List size={16} /> Mục lục các trạm</span>
              <ChevronDown size={18} style={{ transition: "transform .15s", transform: menuOpen ? "rotate(180deg)" : "none" }} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
              {lesson.stations.map((s) => (
                <button key={s.id} onClick={() => go(s.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: C.ink, padding: "5px 8px", borderRadius: 8, fontFamily: "'Be Vietnam Pro'" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.ink + "12")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {s.num}. {s.title.length > 16 ? s.title.slice(0, 15) + "…" : s.title}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            {isMobile ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 800, fontSize: 14 }}><Star size={18} fill={C.amber} color={C.amber} /> {earned}/{total}</span>
            ) : (
              Array.from({ length: total }).map((_, i) => <Star key={i} size={19} fill={i < earned ? C.amber : "transparent"} color={i < earned ? C.amber : C.ink + "44"} />)
            )}
          </div>
        </div>
        {isMobile && menuOpen && (
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 12px 10px", display: "grid", gap: 4, maxHeight: "62vh", overflowY: "auto" }}>
            {lesson.stations.map((s) => (
              <button key={s.id} onClick={() => { setMenuOpen(false); setTimeout(() => go(s.id), 70); }}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: stars[s.id] ? C.teal + "18" : "#fff", border: "1.5px solid " + C.ink + "22", cursor: "pointer", fontWeight: 700, fontSize: 14, color: C.ink, padding: "10px 12px", borderRadius: 10, fontFamily: "'Be Vietnam Pro'" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 7, background: C.ink, color: C.paper, fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{s.num}</span>
                <span style={{ flex: 1 }}>{s.title}</span>
                {stars[s.id] && <Star size={15} fill={C.amber} color={C.amber} style={{ flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        )}
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
