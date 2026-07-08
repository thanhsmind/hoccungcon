import { C } from "../../lib/colors.js";

export const BAI_14 = {
  meta: { chapter: "Chương IV", lesson: "Bài 14", title: "Tam giác bằng nhau", highlight: "(c.g.c & g.c.g)",
    intro: "Không phải lúc nào cũng đo được hết ba cạnh. Hai trường hợp c.g.c và g.c.g cho ta những cách kiểm tra ngắn hơn." },
  stations: [
    { id: "xengiua", num: 0, title: "Góc xen giữa hai cạnh", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Trong tam giác ABC, góc A (góc BAC) là ", { hl: "góc xen giữa hai cạnh AB và AC", color: C.amber }, ". Tương tự, các góc B và C là các góc kề cạnh BC."],
      figure: { kind: "triangle", b: 55, c: 65, caption: "Góc A xen giữa hai cạnh AB và AC" } },

    { id: "why", num: 1, title: "Tại sao cần thêm c.g.c và g.c.g?", icon: "why", type: "why",
      question: "Đã có c.c.c để xét hai tam giác bằng nhau rồi. Tại sao còn cần thêm c.g.c và g.c.g?",
      hint: "Có phải lúc nào em cũng đo được đủ cả ba cạnh không?",
      answer: ["Nhiều khi ta ", { b: "không đo được cả ba cạnh" }, " (cạnh nằm bên kia sông, qua vực…), nhưng lại đo được góc.", { br: 1 }, { br: 1 }, "Vì thế cần thêm cách khác:", { br: 1 }, "• ", { hl: "c.g.c" }, ": hai cạnh và góc xen giữa bằng nhau.", { br: 1 }, "• ", { hl: "g.c.g" }, ": hai góc và cạnh xen giữa bằng nhau.", { br: 1 }, { br: 1 }, "Có nhiều “chìa khoá” thì gặp tình huống nào cũng mở được."],
      takeaway: ["Nhiều dấu hiệu bằng nhau giúp ta ", { b: "chứng minh và đo đạc trong mọi hoàn cảnh" }, ", kể cả khi không với tới."] },
    { id: "cgc", num: 2, title: "Trường hợp cạnh – góc – cạnh", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP 2 (c.g.c)",
      body: ["Nếu ", { hl: "hai cạnh và góc xen giữa", color: C.amber }, " của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia thì hai tam giác đó bằng nhau."],
      figure: { kind: "two-triangles", marks: "cgc", caption: "Hai cạnh + góc xen giữa bằng nhau ⟹ bằng nhau (c.g.c)" } },

    { id: "gcg", num: 3, title: "Trường hợp góc – cạnh – góc", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP 3 (g.c.g)",
      body: ["Nếu ", { hl: "một cạnh và hai góc kề", color: C.amber }, " của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau."],
      figure: { kind: "two-triangles", marks: "gcg", caption: "Một cạnh + hai góc kề bằng nhau ⟹ bằng nhau (g.c.g)" } },

    { id: "distinguish", num: 4, title: "Phân biệt c.g.c và g.c.g", icon: "book", type: "reveal",
      prompt: "Bấm để nhớ cách phân biệt hai trường hợp:",
      cards: [
        { label: "c.g.c", detail: ["Hai ", { hl: "CẠNH", color: C.teal }, " và ", { hl: "GÓC XEN GIỮA", color: C.teal }, " chúng bằng nhau (góc nằm giữa hai cạnh)."] },
        { label: "g.c.g", detail: ["Một ", { hl: "CẠNH", color: C.teal }, " và ", { hl: "HAI GÓC KỀ", color: C.teal }, " cạnh đó bằng nhau (cạnh nằm giữa hai góc)."] },
        { label: "Mẹo nhớ", detail: ["Đọc tên từ trái sang phải: c.g.c → cạnh-góc-cạnh (góc ở giữa); g.c.g → góc-cạnh-góc (cạnh ở giữa)."] },
      ] },

    { id: "practice", num: 5, title: "Luyện dùng c.g.c, g.c.g", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "Hai tam giác bằng nhau theo c.g.c. Một tam giác có cạnh 3 cm thì cạnh tương ứng của tam giác kia bằng bao nhiêu cm?", answer: 3, hint: "Hai tam giác bằng nhau ⟹ các cạnh tương ứng bằng nhau → 3 cm.",
          figure: { kind: "two-triangles", marks: "cgc", caption: "Cạnh tương ứng bằng nhau" } },
        { ask: "△ABC = △DEF, góc B = 80°. Số đo góc E tương ứng (độ)?", answer: 80, hint: "Góc E tương ứng với góc B → 80°.",
          figure: { kind: "two-triangles", names1: ["A", "B", "C"], names2: ["D", "E", "F"], marks: "gcg", caption: "Góc tương ứng: E ↔ B" } },
        { ask: "Tam giác có góc B = 80°, góc C = 40°. Số đo góc A (độ)?", answer: 60, hint: "Â = 180° − 80° − 40° = 60°.",
          figure: { kind: "triangle", b: 80, c: 40, labelA: "?", labelB: "80°", labelC: "40°", ans: "60°" } },
      ] },

    { id: "reallife", num: 6, title: "Đo cái không với tới", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🌊", label: "Bề rộng sông", detail: ["Không qua được sông, người ta dựng hai tam giác bằng nhau ", { b: "(g.c.g)" }, " trên bờ rồi đo đoạn tương ứng để biết ", { hl: "bề rộng sông" }, "."] },
      { emoji: "🌲", label: "Đo gián tiếp", detail: ["Đo khoảng cách tới cái cây bên kia hàng rào bằng cách tạo một tam giác bằng nó ", { b: "(c.g.c)" }, " ngay chỗ mình đứng."] },
      { emoji: "🗺️", label: "Trắc địa", detail: ["Kĩ thuật ", { b: "tam giác đạc" }, " trong đo đạc địa hình dựa vào các tam giác bằng nhau để tính khoảng cách lớn mà không đo trực tiếp."] },
    ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
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
