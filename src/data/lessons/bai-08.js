import { C } from "../../lib/colors.js";

export const BAI_8 = {
  meta: { chapter: "Chương III", lesson: "Bài 8", title: "Góc đặc biệt &", highlight: "tia phân giác",
    intro: "Khi hai đường thẳng cắt nhau, chúng tạo ra những cặp góc đặc biệt. Kéo hình để khám phá quan hệ giữa chúng." },
  stations: [
    { id: "cross", num: 0, title: "Hai đường thẳng cắt nhau", icon: "activity", type: "geometry", mode: "crossing", start: 55,
      sliderLabel: "Kéo đổi góc",
      prompt: "Hai đường thẳng cắt nhau tại O tạo 4 góc. Kéo thanh trượt và quan sát: cặp nào luôn bằng nhau, cặp nào có tổng 180°?" },

    { id: "why", num: 1, title: "Tại sao đặt tên riêng cho vài góc?", icon: "why", type: "why",
      question: "Có vô số góc to nhỏ khác nhau. Tại sao lại phải đặt tên riêng cho vài góc như 90°, 180°?",
      hint: "Nghĩ xem góc nào hay gặp nhất khi xây nhà, kê bàn ghế.",
      answer: ["Vài góc ", { b: "xuất hiện khắp nơi" }, " nên được đặt tên để gọi cho nhanh:", { br: 1 }, "• Góc vuông 90° — góc của tường, cửa, mặt bàn.", { br: 1 }, "• Góc bẹt 180° — duỗi thẳng thành một đường thẳng.", { br: 1 }, { br: 1 }, "Còn ", { hl: "tia phân giác" }, " là tia chia một góc thành hai phần bằng nhau — rất hay dùng khi cần chia đều hay tạo đối xứng."],
      takeaway: ["Đặt tên cho góc đặc biệt giúp ta ", { b: "mô tả và dựng hình nhanh, chính xác" }, " trong xây dựng và thiết kế."] },
    { id: "kebu", num: 2, title: "Hai góc kề bù", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["“", { b: "Hai tia đối nhau" }, "” là hai tia chung gốc và nằm thẳng hàng, duỗi về hai phía ngược nhau (ghép lại thành một đường thẳng).", { br: 1 }, { br: 1 }, "Hai góc ", { hl: "kề bù", color: C.amber }, " là hai góc có một cạnh chung, hai cạnh còn lại là hai tia đối nhau — tức chúng nằm sát nhau và “trải” hết một nửa vòng. Vì thế hai góc kề bù có ", { hl: "tổng số đo bằng 180°", color: C.amber }, "."],
      figure: { kind: "kebu", a: 65, caption: "Hai góc kề bù: 65° + 115° = 180°" } },

    { id: "doidinh", num: 3, title: "Hai góc đối đỉnh", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Hai góc ", { hl: "đối đỉnh", color: C.amber }, " là hai góc mà mỗi cạnh của góc này là tia đối của một cạnh của góc kia. Tính chất: hai góc đối đỉnh thì ", { hl: "bằng nhau", color: C.amber }, "."],
      figure: { kind: "crossing", a: 58, caption: "Hai góc đối đỉnh (cùng màu) bằng nhau" } },

    { id: "bisector", num: 4, title: "Tia phân giác của một góc", icon: "activity", type: "geometry", mode: "bisector", start: 70,
      sliderLabel: "Kéo đổi góc xOy",
      prompt: "Tia Oz chia góc xOy thành hai phần bằng nhau. Kéo để đổi góc xOy và quan sát hai góc nhỏ luôn bằng nhau và bằng một nửa." },

    { id: "tpgdef", num: 5, title: "Định nghĩa tia phân giác", icon: "book", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Tia phân giác của một góc là tia nằm giữa hai cạnh của góc và tạo với hai cạnh ấy hai góc bằng nhau. Khi Oz là phân giác của xOy thì ", { hl: "xOz = zOy = ½ · xOy", color: C.amber }, "."],
      figure: { kind: "bisector", a: 70, caption: "Oz là phân giác: xOz = zOy = 35°" } },

    { id: "practice", num: 6, title: "Luyện tính số đo góc", icon: "hash", type: "fillin", placeholder: "vd: 60",
      questions: [
        { ask: "Hai góc kề bù, một góc bằng 60°. Góc còn lại bằng bao nhiêu độ?", answer: 120, hint: "Tổng hai góc kề bù = 180° → góc kia = 180° − 60° = 120°.",
          figure: { kind: "kebu", a: 60, lb: "60°", la: "?", ans: "120°", caption: "60° + ? = 180°" } },
        { ask: "xOy và x'Oy' là hai góc đối đỉnh, xOy = 70°. Số đo x'Oy' (độ)?", answer: 70, hint: "Hai góc đối đỉnh bằng nhau → 70°.",
          figure: { kind: "crossing", a: 70, l1: "70°", l3: "?", l2: "", l4: "", ans: "70°", caption: "Hai góc đối đỉnh bằng nhau" } },
        { ask: "Oz là tia phân giác của xOy = 68°. Số đo xOz (độ)?", answer: 34, hint: "xOz = ½ · 68° = 34°.",
          figure: { kind: "bisector", a: 68, hide: true, caption: "Oz chia đôi góc xOy = 68°" } },
        { ask: "Ot là tia phân giác của mOn = 70°. Số đo tOn (độ)?", answer: 35, hint: "tOn = ½ · 70° = 35°.",
          figure: { kind: "bisector", a: 70, hide: true, caption: "Ot chia đôi góc mOn = 70°" } },
      ] },

    { id: "reallife", num: 7, title: "Góc ở khắp nơi", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🕐", label: "Đồng hồ", detail: ["Lúc 3 giờ, kim giờ và kim phút tạo ", { b: "góc vuông 90°" }, "; lúc 6 giờ là ", { hl: "góc bẹt 180°" }, "."] },
      { emoji: "📄", label: "Gấp giấy", detail: ["Gấp đôi một góc giấy cho hai cạnh trùng nhau — nếp gấp chính là ", { hl: "tia phân giác" }, " chia góc thành hai phần bằng nhau."] },
      { emoji: "🏠", label: "Xây dựng", detail: ["Thợ dùng ke vuông để dựng tường ", { b: "90°" }, "; mái nhà, cầu thang đều thiết kế theo các góc đặc biệt cho chắc và đẹp."] },
    ] },

    { id: "ex", num: 8, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Hai góc kề bù có tổng số đo bằng bao nhiêu?", opts: ["90°", "180°", "360°"], correct: 1,
          figure: { kind: "kebu", a: 115, caption: "Hai góc kề bù" },
          solution: "Theo tính chất, hai góc kề bù có tổng số đo bằng 180°." },
        { q: "Hai góc đối đỉnh thì như thế nào?", opts: ["Bằng nhau", "Bù nhau", "Phụ nhau"], correct: 0,
          figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh (cùng màu)" },
          solution: "Hai góc đối đỉnh thì bằng nhau." },
        { q: "xx' và yy' cắt nhau tại O, góc xOy = 60°. Số đo góc x'Oy (kề bù với xOy)?",
          figure: { kind: "crossing", a: 60, l1: "60°", l2: "?", l3: "", l4: "", ans: "120°", caption: "x'Oy kề bù với xOy" },
          opts: ["120°", "60°", "30°"], correct: 0,
          solution: "x'Oy kề bù với xOy → x'Oy = 180° − 60° = 120°." },
        { q: "Cũng hình trên, số đo góc x'Oy' (đối đỉnh với xOy = 60°)?",
          figure: { kind: "crossing", a: 60, l1: "60°", l3: "?", l2: "", l4: "", ans: "60°", caption: "x'Oy' đối đỉnh với xOy" },
          opts: ["60°", "120°", "30°"], correct: 0,
          solution: "x'Oy' đối đỉnh với xOy nên x'Oy' = 60°." },
        { q: "Oz là tia phân giác của xOy = 68°. Số đo góc xOz?",
          figure: { kind: "bisector", a: 68, hide: true, caption: "Oz chia đôi góc xOy = 68°" },
          opts: ["34°", "68°", "136°"], correct: 0,
          solution: "xOz = ½ · xOy = ½ · 68° = 34°." },
      ] },
  ],
};
