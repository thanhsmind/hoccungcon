import { C } from "../../lib/colors.js";

export const BAI_3 = {
  meta: { chapter: "Chương I", lesson: "Bài 3", title: "Luỹ thừa của", highlight: "số hữu tỉ",
    intro: "Khi một số nhân với chính nó nhiều lần, luỹ thừa giúp viết gọn lại. Học cách nhân, chia và nâng luỹ thừa." },
  stations: [
    { id: "hook", num: 0, title: "Bể nước khổng lồ của Trái Đất", icon: "activity", type: "calculator",
      prompt: "Gom hết nước trên Trái Đất vào một bể hình lập phương thì cạnh bể tới khoảng 1111,34 km. Thể tích nước (km³) = cạnh × cạnh × cạnh. Hãy tính.",
      inputs: [{ key: "edge", label: "Cạnh bể (km)", default: 1111.34 }],
      formula: "edge*edge*edge", decimals: 0, cta: "Tính thể tích",
      onResultNote: ["Một con số khổng lồ! Thay vì viết 1111,34 × 1111,34 × 1111,34, ta viết gọn thành ", { b: "1111,34³" }, " — đó là ", { hl: "luỹ thừa" }, ", nội dung bài này."] },

    { id: "why", num: 1, title: "Tại sao cần luỹ thừa?", icon: "why", type: "why",
      question: "Đã có phép nhân rồi, tại sao còn phải nghĩ ra luỹ thừa?",
      hint: "Thử viết số 2 nhân với chính nó 10 lần ra giấy xem có mỏi tay không.",
      answer: ["Khi một số nhân với chính nó rất nhiều lần, viết ra sẽ dài kinh khủng: 2 × 2 × 2 × … × 2 (mười lần).", { br: 1 }, { br: 1 }, "Luỹ thừa là cách ", { b: "viết gọn" }, " lại — chỉ cần 2¹⁰. Vừa nhanh vừa dễ đọc.", { br: 1 }, { br: 1 }, "Nó còn giúp diễn tả những số ", { hl: "cực lớn hoặc cực nhỏ" }, " (dân số, khoảng cách vũ trụ, kích thước vi khuẩn) mà cách viết thường không kham nổi."],
      takeaway: ["Luỹ thừa thể hiện ý tưởng: ", { b: "gói sự lặp lại nhiều lần vào một kí hiệu ngắn" }, " để con người tính và đọc dễ hơn."] },
    { id: "def", num: 2, title: "Luỹ thừa bậc n là gì?", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Luỹ thừa bậc n của x nghĩa là ", { hl: "lấy x nhân với chính nó n lần", color: C.amber }, ": ", { b: "xⁿ = x · x · … · x" }, " (n thừa số).", { br: 1 }, { br: 1 }, "Đọc tên hai phần của xⁿ:", { br: 1 }, "• ", { hl: "x là cơ số", color: C.amber }, " — số được đem nhân (số ở dưới, to).", { br: 1 }, "• ", { hl: "n là số mũ", color: C.amber }, " — cho biết nhân mấy lần (số nhỏ ở trên).", { br: 1 }, "Ví dụ 2³ = 2 · 2 · 2 = 8 (cơ số 2, số mũ 3).", { br: 1 }, { br: 1 }, "Quy ước: x⁰ = 1 (với x ≠ 0); x¹ = x."] },

    { id: "expand", num: 3, title: "Khai triển luỹ thừa", icon: "book", type: "reveal",
      prompt: "Bấm để xem mỗi luỹ thừa là tích của bao nhiêu thừa số:",
      cards: [
        { label: "(−3)³", detail: ["(−3)³ = (−3)·(−3)·(−3) = ", { hl: "−27", color: C.teal }] },
        { label: [{ frac: [1, 3] }, { sup: "4" }], detail: [{ frac: [1, 3] }, { sup: "4" }, " = ", { frac: [1, 3] }, "·", { frac: [1, 3] }, "·", { frac: [1, 3] }, "·", { frac: [1, 3] }, " = ", { frac: [1, 81], color: C.teal }] },
        { label: "(0,7)³", detail: ["(0,7)³ = 0,7·0,7·0,7 = ", { hl: "0,343", color: C.teal }] },
      ] },

    { id: "rules", num: 4, title: "Ba nhóm công thức luỹ thừa", icon: "book", type: "reveal",
      prompt: "Bấm từng nhóm để xem công thức cần nhớ:",
      cards: [
        { label: "Tích & thương", detail: ["Luỹ thừa của một tích: (x·y)ⁿ = xⁿ·yⁿ. Luỹ thừa của một thương: (x:y)ⁿ = xⁿ:yⁿ (y ≠ 0)."] },
        { label: "Cùng cơ số", detail: ["Nhân: xᵐ·xⁿ = x", { sup: "m+n" }, " (giữ cơ số, cộng số mũ). Chia: xᵐ:xⁿ = x", { sup: "m−n" }, " (giữ cơ số, trừ số mũ; x ≠ 0, m ≥ n)."] },
        { label: "Luỹ thừa của luỹ thừa", detail: ["(xᵐ)ⁿ = x", { sup: "m·n" }, " (giữ cơ số, nhân hai số mũ)."] },
      ] },

    { id: "practice", num: 5, title: "Luyện tính số mũ", icon: "hash", type: "fillin",
      questions: [
        { ask: "(−2)³ · (−2)⁴ = (−2)ⁿ. Nhập n.", answer: 7, hint: "Nhân cùng cơ số: cộng số mũ 3 + 4 = 7." },
        { ask: "(0,25)⁷ : (0,25)³ = (0,25)ⁿ. Nhập n.", answer: 4, hint: "Chia cùng cơ số: trừ số mũ 7 − 3 = 4." },
        { ask: "[(−5)³]⁷ = (−5)ⁿ. Nhập n.", answer: 21, hint: "Luỹ thừa của luỹ thừa: nhân số mũ 3 · 7 = 21." },
        { ask: "(−5)⁵ : (−5)⁵ = ? Nhập giá trị.", answer: 1, hint: "Số mũ 5 − 5 = 0, mà x⁰ = 1 với x ≠ 0." },
      ] },

    { id: "reallife", num: 6, title: "Sức mạnh của luỹ thừa", icon: "globe", type: "reallife",
    cards: [
      { emoji: "💾", label: "Bộ nhớ máy tính", detail: ["1 KB = ", { b: "2¹⁰" }, " byte, 1 MB = 2²⁰ byte… Dung lượng máy tính luôn tính theo ", { hl: "luỹ thừa của 2" }, "."] },
      { emoji: "🦠", label: "Nhân đôi", detail: ["Một tế bào cứ mỗi giờ tách đôi: sau n giờ có ", { b: "2ⁿ" }, " tế bào. Sau 10 giờ là 2¹⁰ = 1024 — tăng cực nhanh."] },
      { emoji: "🌍", label: "Số rất lớn", detail: ["Khoảng cách, khối lượng nguyên tử hay viết gọn bằng luỹ thừa của 10, ví dụ vận tốc ánh sáng ", { b: "3 × 10⁸ m/s" }, "."] },
    ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Viết 125 dưới dạng luỹ thừa của 5.", opts: [["5", { sup: "2" }], ["5", { sup: "3" }], ["5", { sup: "4" }]], correct: 1,
          solution: "5 · 5 · 5 = 125 nên 125 = 5³." },
        { q: "Biết (−3)⁷ = −2187, hãy tính (−3)⁸.", opts: ["−6561", "6561", "2187"], correct: 1,
          solution: "(−3)⁸ = (−3)⁷ · (−3) = (−2187) · (−3) = 6561 (tích hai số âm là số dương)." },
        { q: ["Viết ", { frac: [1, 9] }, { sup: "5" }, " dưới dạng luỹ thừa cơ số ", { frac: [1, 3] }, "."],
          opts: [[{ frac: [1, 3] }, { sup: "7" }], [{ frac: [1, 3] }, { sup: "10" }], [{ frac: [1, 3] }, { sup: "5" }]], correct: 1,
          solution: [{ frac: [1, 9] }, " = ", { frac: [1, 3] }, { sup: "2" }, " nên ", { frac: [1, 9] }, { sup: "5" }, " = (", { frac: [1, 3] }, { sup: "2" }, ")", { sup: "5" }, " = ", { frac: [1, 3] }, { sup: "10" }, "."] },
        { q: "Khoảng cách Mộc tinh–Mặt Trời (7,78·10⁸ km) gấp khoảng mấy lần khoảng cách Trái Đất–Mặt Trời (1,5·10⁸ km)?",
          opts: ["≈ 3,2 lần", "≈ 5,2 lần", "≈ 7,8 lần"], correct: 1,
          solution: "7,78·10⁸ : (1,5·10⁸) = 7,78 : 1,5 ≈ 5,19 ≈ 5,2 lần." },
        { q: ["Kết quả của ", { frac: [2, 3] }, { sup: "5" }, " · ", { frac: [2, 3] }, { sup: "3" }, " là?"],
          opts: [[{ frac: [2, 3] }, { sup: "8" }], [{ frac: [2, 3] }, { sup: "15" }], [{ frac: [4, 9] }, { sup: "8" }]], correct: 0,
          solution: ["Nhân hai luỹ thừa cùng cơ số: giữ cơ số, cộng số mũ 5 + 3 = 8 → ", { frac: [2, 3] }, { sup: "8" }, "."] },
      ] },
  ],
};
