import { C } from "../../lib/colors.js";

export const BAI_12 = {
  meta: { chapter: "Chương IV", lesson: "Bài 12", title: "Tổng các góc", highlight: "trong một tam giác",
    intro: "Dù tam giác hình dạng nào, tổng ba góc trong của nó luôn bằng 180°. Kéo hình để tự kiểm chứng." },
  stations: [
    { id: "tri", num: 0, title: "Tổng ba góc luôn bằng 180°", icon: "activity", type: "geometry", mode: "triangle", start: 55, start2: 60,
      prompt: "Kéo hai thanh trượt để đổi góc B và góc C của tam giác. Quan sát góc A và tổng ba góc — dù tam giác thay đổi thế nào, tổng vẫn luôn là 180°." },

    { id: "why", num: 1, title: "Tại sao tổng ba góc = 180° lại quan trọng?", icon: "why", type: "why",
      question: "Tại sao việc biết “ba góc của tam giác luôn cộng lại bằng 180°” lại quan trọng đến thế?",
      hint: "Nếu đã biết hai góc, em có còn cần đo góc thứ ba không?",
      answer: ["Đây là điều ", { b: "luôn đúng với mọi tam giác" }, ", dù to hay nhỏ, méo hay cân.", { br: 1 }, { br: 1 }, "Nhờ nó, chỉ cần biết ", { b: "hai góc" }, " là ", { hl: "tính ngay được góc thứ ba" }, " mà khỏi cần đo — rất tiện cho thợ và kĩ sư.", { br: 1 }, { br: 1 }, "Nó cũng là chìa khoá để chứng minh nhiều tính chất hình học khác."],
      takeaway: ["Một quy luật đơn giản (", { b: "tổng = 180°" }, ") nhưng đúng mãi mãi, giúp tính toán mà không cần đo từng cái."] },
    { id: "thm", num: 2, title: "Định lí tổng ba góc", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH LÍ",
      body: ["Tổng ba góc trong một tam giác bằng ", { hl: "180°", color: C.amber }, ". (Chứng minh: qua đỉnh A kẻ đường thẳng song song với BC, dùng các cặp góc so le trong sẽ thấy Â + B̂ + Ĉ = 180°.)"],
      figure: { kind: "triangle", b: 55, c: 65, labelA: "Â", labelB: "B̂", labelC: "Ĉ", caption: "Â + B̂ + Ĉ = 180°" } },

    { id: "kinds", num: 3, title: "Phân loại tam giác theo góc", icon: "book", type: "reveal",
      prompt: "Bấm để xem ba loại tam giác theo góc:",
      cards: [
        { label: "Tam giác nhọn", detail: ["Cả ba góc đều nhọn (đều nhỏ hơn 90°)."] },
        { label: "Tam giác vuông", detail: ["Có một góc vuông (90°). Hai góc nhọn còn lại ", { hl: "phụ nhau (tổng 90°)", color: C.teal }, "; cạnh đối diện góc vuông là cạnh huyền."] },
        { label: "Tam giác tù", detail: ["Có một góc tù (lớn hơn 90°)."] },
      ] },

    { id: "practice", num: 4, title: "Luyện tính số đo góc", icon: "hash", type: "fillin", placeholder: "vd: 70",
      questions: [
        { ask: "Tam giác có hai góc 50° và 60°. Số đo góc thứ ba (độ)?", answer: 70, hint: "Góc thứ ba = 180° − 50° − 60° = 70°.",
          figure: { kind: "triangle", b: 50, c: 60, labelA: "?", labelB: "50°", labelC: "60°", ans: "70°" } },
        { ask: "Tam giác vuông có một góc nhọn bằng 60°. Góc nhọn còn lại (độ)?", answer: 30, hint: "Hai góc nhọn của tam giác vuông phụ nhau: 90° − 60° = 30°.",
          figure: { kind: "triangle", b: 90, c: 60, labelA: "?", labelB: "90°", labelC: "60°", ans: "30°" } },
        { ask: "Tam giác có hai góc 90° và 55°. Số đo góc còn lại (độ)?", answer: 35, hint: "180° − 90° − 55° = 35°.",
          figure: { kind: "triangle", b: 90, c: 55, labelA: "?", labelB: "90°", labelC: "55°", ans: "35°" } },
        { ask: "Tam giác có một góc ngoài bằng 110°, một góc trong không kề bằng 50°. Góc trong không kề còn lại (độ)?", answer: 60, hint: ["“", { b: "Góc ngoài" }, "” tại một đỉnh là góc kề bù với góc trong ở đỉnh đó (nằm phía ngoài tam giác). Tính chất: góc ngoài = tổng hai góc trong KHÔNG kề với nó.", { br: 1 }, "Vậy góc trong còn lại = 110° − 50° = 60°."] },
      ] },

    { id: "reallife", num: 5, title: "Tam giác 180° quanh ta", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🏠", label: "Mái nhà", detail: ["Hai mái dốc và xà ngang tạo một tam giác. Biết hai góc dốc, thợ tính ngay góc còn lại vì ", { hl: "tổng ba góc = 180°" }, "."] },
      { emoji: "📐", label: "Eke", detail: ["Eke tam giác vuông có các góc ", { b: "90° + 60° + 30° = 180°" }, " hoặc 90° + 45° + 45°."] },
      { emoji: "🌉", label: "Giàn cầu", detail: ["Khung giàn thép hình tam giác rất vững; kĩ sư tính góc từng thanh dựa vào tổng ba góc luôn bằng 180°."] },
    ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
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
