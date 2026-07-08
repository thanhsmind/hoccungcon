import { C } from "../../lib/colors.js";

export const BAI_13 = {
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

    { id: "why", num: 1, title: "Tại sao cần hai tam giác bằng nhau?", icon: "why", type: "why",
      question: "Hai tam giác “bằng nhau” để làm gì, và tại sao chỉ cần ba cạnh giống nhau là đủ kết luận?",
      hint: "Lấy 3 que có độ dài cố định — em ghép được mấy hình tam giác khác nhau?",
      answer: ["Hai tam giác bằng nhau nghĩa là ", { b: "chồng khít lên nhau" }, " — mọi cạnh, mọi góc đều như nhau.", { br: 1 }, { br: 1 }, "Điều thú vị: nếu ", { hl: "ba cạnh đôi một bằng nhau" }, " thì hình đã bị “khoá cứng”, không thể méo khác đi → hai tam giác chắc chắn bằng nhau (trường hợp ", { b: "c.c.c" }, ").", { br: 1 }, { br: 1 }, "Nhờ vậy ta ", { b: "đo gián tiếp" }, " được: suy ra cạnh hoặc góc của hình này từ hình kia."],
      takeaway: ["“Bằng nhau” cho phép ", { b: "sao chép và đo gián tiếp" }, " — nền tảng của sản xuất hàng loạt và đo đạc thực địa."] },
    { id: "def", num: 2, title: "Hai tam giác bằng nhau", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Hai tam giác bằng nhau là hai tam giác có ", { hl: "các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau", color: C.amber }, ".", { br: 1 }, { br: 1 }, "“", { b: "Tương ứng" }, "” = ở cùng vị trí. Khi viết ", { b: "△ABC = △A′B′C′" }, " phải viết đỉnh đúng thứ tự: A ứng với A′, B với B′, C với C′. Khi đó cạnh AB ứng với A′B′, góc A ứng với góc A′…"] },

    { id: "ccc", num: 3, title: "Trường hợp c.c.c", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP BẰNG NHAU 1",
      body: ["Nếu ", { hl: "ba cạnh của tam giác này bằng ba cạnh của tam giác kia", color: C.amber }, " thì hai tam giác đó bằng nhau (cạnh – cạnh – cạnh, viết tắt c.c.c). Không cần kiểm tra các góc!"],
      figure: { kind: "two-triangles", caption: "Ba cạnh bằng nhau ⟹ hai tam giác bằng nhau (c.c.c)" } },

    { id: "build", num: 4, title: "Vì sao chỉ cần ba cạnh?", icon: "book", type: "reveal",
      prompt: "Bấm để xem cách dựng tam giác khi biết ba cạnh (bằng compa):",
      cards: [
        { label: "B1", detail: ["Vẽ một cạnh, chẳng hạn BC = 6 cm bằng thước."] },
        { label: "B2", detail: ["Vẽ cung tròn tâm B bán kính 5 cm và cung tròn tâm C bán kính 4 cm, chúng cắt nhau tại A."] },
        { label: "B3", detail: ["Nối A với B, C. Ba cạnh đã cố định nên hình tam giác là ", { hl: "duy nhất", color: C.teal }, " — vì thế ba cạnh bằng nhau là đủ để hai tam giác bằng nhau."] },
      ] },

    { id: "practice", num: 5, title: "Luyện dùng tam giác bằng nhau", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "△ABC = △DEF và BC = 4 cm. Độ dài EF (cm)?", answer: 4, hint: "BC và EF là hai cạnh tương ứng → EF = BC = 4 cm.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], caption: "△ABC = △DEF: cạnh tương ứng bằng nhau" } },
        { ask: "Tam giác ABC có góc ABC = 40°, góc ACB = 60°. Số đo góc A (độ)?", answer: 80, hint: "Â = 180° − 40° − 60° = 80°.",
          figure: { kind: "triangle", b: 40, c: 60, labelA: "?", labelB: "40°", labelC: "60°", ans: "80°" } },
        { ask: "△ABC = △DEF với góc A = 80°. Số đo góc EDF tương ứng (độ)?", answer: 80, hint: "Góc EDF tương ứng với góc A → EDF = 80°.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], caption: "Góc tương ứng bằng nhau: D ↔ A" } },
      ] },

    { id: "reallife", num: 6, title: "Bằng nhau nhờ ba cạnh", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🏭", label: "Sản xuất hàng loạt", detail: ["Mọi chiếc eke, mọi tấm lợp tam giác cùng khuôn đều ", { hl: "bằng nhau (c.c.c)" }, " vì ba cạnh được cắt giống hệt."] },
      { emoji: "🔺", label: "Khung vững", detail: ["Tam giác ba cạnh cố định thì hình ", { b: "không méo được" }, " — vì thế giàn giáo, cầu, mái đều dùng hình tam giác."] },
      { emoji: "✂️", label: "Cắt rập", detail: ["Thợ may dùng một mẫu rập tam giác để cắt nhiều mảnh vải giống nhau — tất cả bằng nhau theo ba cạnh."] },
    ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
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
