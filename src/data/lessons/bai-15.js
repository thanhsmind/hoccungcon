import { C } from "../../lib/colors.js";

export const BAI_15 = {
  meta: { chapter: "Chương IV", lesson: "Bài 15", title: "Tam giác bằng nhau", highlight: "(tam giác vuông)",
    intro: "Tam giác vuông đã có sẵn một góc 90°, nên việc kiểm tra bằng nhau gọn hơn — chỉ cần vài yếu tố." },
  stations: [
    { id: "vocab", num: 0, title: "Cạnh huyền và cạnh góc vuông", icon: "book", type: "text", variant: "definition", title2: "GHI NHỚ",
      body: ["Trong tam giác vuông, cạnh đối diện góc vuông là ", { hl: "cạnh huyền", color: C.amber }, " (cạnh dài nhất); hai cạnh kề góc vuông là ", { hl: "cạnh góc vuông", color: C.amber }, "."],
      figure: { kind: "right-triangles", marks: "none", caption: "Hai cạnh góc vuông và cạnh huyền (chéo)" } },

    { id: "why", num: 1, title: "Tại sao tam giác vuông xét riêng?", icon: "why", type: "why",
      question: "Tam giác vuông cũng là tam giác. Tại sao nó lại có những cách xét bằng nhau riêng?",
      hint: "Tam giác vuông có sẵn một thứ mà tam giác khác chưa chắc có — đó là gì?",
      answer: ["Tam giác vuông luôn có sẵn ", { b: "một góc vuông 90°" }, " — coi như đã biết trước một góc, nên việc xét bằng nhau ", { hl: "dễ hơn" }, ".", { br: 1 }, { br: 1 }, "Chỉ cần thêm vài yếu tố (như cạnh huyền và một cạnh góc vuông) là kết luận được hai tam giác vuông bằng nhau.", { br: 1 }, { br: 1 }, "Loại tam giác này gặp ở khắp nơi: thang dựa tường, bóng nắng, các góc vuông của nhà cửa."],
      takeaway: ["Tam giác vuông là ", { b: "hình “xương sống” của đo đạc" }, " — hiểu nó là tính được chiều cao, khoảng cách mà không cần với tới."] },
    { id: "three", num: 2, title: "Ba trường hợp (suy từ tam giác thường)", icon: "book", type: "reveal",
      prompt: "Tam giác vuông đã có một góc 90° bằng nhau sẵn, nên chỉ cần thêm vài yếu tố. Bấm xem ba trường hợp:",
      figure: { kind: "right-triangles", marks: "huyen-goc", caption: "Ví dụ: cạnh huyền – góc nhọn bằng nhau" },
      cards: [
        { label: "Hai cạnh góc vuông", detail: ["Hai cạnh góc vuông bằng nhau từng đôi ⟹ bằng nhau (suy từ ", { hl: "c.g.c", color: C.teal }, ")."] },
        { label: "Cạnh góc vuông – góc nhọn kề", detail: ["Một cạnh góc vuông và một góc nhọn kề bằng nhau ⟹ bằng nhau (suy từ ", { hl: "g.c.g", color: C.teal }, ")."] },
        { label: "Cạnh huyền – góc nhọn", detail: ["Cạnh huyền và một góc nhọn bằng nhau ⟹ ", { hl: "hai tam giác vuông bằng nhau", color: C.teal }, "."] },
      ] },

    { id: "special", num: 3, title: "Trường hợp đặc biệt: cạnh huyền – cạnh góc vuông", icon: "book", type: "text", variant: "definition", title2: "TRƯỜNG HỢP ĐẶC BIỆT",
      body: ["Nếu ", { hl: "cạnh huyền và một cạnh góc vuông", color: C.amber }, " của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau."],
      figure: { kind: "right-triangles", marks: "huyen-cgv", caption: "Cạnh huyền + một cạnh góc vuông bằng nhau" } },

    { id: "practice", num: 4, title: "Luyện về tam giác vuông", icon: "hash", type: "fillin", placeholder: "Nhập số",
      questions: [
        { ask: "Tam giác vuông có một góc nhọn bằng 35°. Góc nhọn còn lại bằng bao nhiêu độ?", answer: 55, hint: "Hai góc nhọn phụ nhau: 90° − 35° = 55°.",
          figure: { kind: "right-triangles", marks: "gcg", caption: "Tam giác vuông" } },
        { ask: "Hai tam giác vuông bằng nhau (cạnh huyền – góc nhọn). Một góc nhọn bằng 40° thì góc nhọn tương ứng (độ)?", answer: 40, hint: "Hai tam giác bằng nhau ⟹ góc tương ứng bằng nhau → 40°.",
          figure: { kind: "right-triangles", marks: "huyen-goc", caption: "Cạnh huyền – góc nhọn" } },
        { ask: "Tam giác vuông có cạnh huyền 5, một cạnh góc vuông 3. Cạnh góc vuông còn lại bằng bao nhiêu? (gợi ý: bộ ba 3 – 4 – 5)", answer: 4, hint: "Theo bộ ba Pythagore quen thuộc 3 – 4 – 5: cạnh còn lại bằng 4.",
          figure: { kind: "right-triangles", marks: "huyen-cgv", caption: "Cạnh huyền 5, cạnh góc vuông 3" } },
      ] },

    { id: "reallife", num: 5, title: "Góc vuông vững chãi", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🪜", label: "Thang dựa tường", detail: ["Chân thang, tường và mặt đất tạo một ", { hl: "tam giác vuông" }, ". Đặt chân thang đúng khoảng cách để góc an toàn, khỏi trượt."] },
      { emoji: "📐", label: "Kiểm tra góc vuông", detail: ["Thợ xây dùng quy tắc “", { b: "3 – 4 – 5" }, "”: đo 3 và 4, nếu cạnh chéo đúng 5 thì góc đúng 90°."] },
      { emoji: "🌳", label: "Đo chiều cao", detail: ["Cây và bóng nắng tạo tam giác vuông; hai tam giác vuông bằng nhau cho phép tính ", { hl: "chiều cao" }, " mà không cần trèo lên."] },
    ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
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
