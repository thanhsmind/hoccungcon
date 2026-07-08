import { C } from "../../lib/colors.js";

export const BAI_4 = {
  meta: { chapter: "Chương I", lesson: "Bài 4", title: "Thứ tự phép tính &", highlight: "quy tắc chuyển vế",
    intro: "Tính đúng thứ tự các phép tính, rồi dùng quy tắc chuyển vế để tìm số chưa biết x." },
  stations: [
    { id: "hook", num: 0, title: "Cân thăng bằng — quả bưởi nặng bao nhiêu?", icon: "scale", type: "calculator",
      prompt: "Một đĩa cân có vật 5,1 kg và quả bưởi x kg; đĩa kia có vật 7 kg. Cân thăng bằng nên 5,1 + x = 7. Quả bưởi nặng bao nhiêu kg?",
      inputs: [{ key: "known", label: "Vật đã biết (kg)", default: 5.1 }, { key: "total", label: "Tổng hai đĩa (kg)", default: 7 }],
      formula: "total - known", decimals: 1, cta: "Tìm khối lượng bưởi",
      onResultNote: ["Vì 5,1 + x = 7, ta chuyển 5,1 sang vế phải và đổi dấu: x = 7 − 5,1 = ", { hl: "1,9 kg" }, ". Đó chính là ", { b: "quy tắc chuyển vế" }, " — nội dung bài này."] },

    { id: "why", num: 1, title: "Tại sao cần quy tắc thứ tự?", icon: "why", type: "why",
      question: "Trong một biểu thức có cả +, −, ×, : và ngoặc — tại sao không tính lần lượt từ trái sang phải cho nhanh?",
      hint: "Thử tính 2 + 3 × 4 theo hai cách: trái-qua-phải và nhân-trước. Có ra giống nhau không?",
      answer: ["Nếu mỗi người tính một kiểu thì cùng một bài sẽ ra ", { b: "nhiều kết quả khác nhau" }, " — rất loạn.", { br: 1 }, { br: 1 }, "Ví dụ 2 + 3 × 4: tính trái-qua-phải ra 20, nhưng nhân trước mới đúng và ra ", { hl: "14" }, ".", { br: 1 }, { br: 1 }, "Vì thế cần một ", { b: "quy ước chung về thứ tự" }, ": ngoặc → luỹ thừa → nhân chia → cộng trừ. Còn quy tắc chuyển vế giúp ta “", { hl: "tìm số chưa biết x" }, "” một cách gọn gàng."],
      takeaway: ["Quy tắc thứ tự để ", { b: "ai tính cũng ra một kết quả duy nhất" }, "; chuyển vế là chìa khoá giải mọi bài “tìm x”."] },
    { id: "order", num: 2, title: "Thứ tự thực hiện phép tính", icon: "book", type: "text", variant: "note", title2: "GHI NHỚ",
      body: ["Biểu thức không có ngoặc: thực hiện theo thứ tự ", { hl: "Luỹ thừa → Nhân, chia → Cộng, trừ", color: C.violet }, ". Biểu thức có ngoặc: làm trong ngoặc trước, theo thứ tự ( ) → [ ] → { }."] },

    { id: "ordersteps", num: 3, title: "Tính theo đúng thứ tự", icon: "book", type: "reveal",
      prompt: "Bấm từng ví dụ để luyện thứ tự phép tính, qua ba kiểu biểu thức khác nhau:",
      cards: [
        { label: "Ví dụ 1", detail: ["Tính 1,2 − 3² + 7,5 : 3.", { br: 1 }, { step: 1 }, "Luỹ thừa và chia trước: 3² = 9; 7,5 : 3 = 2,5.", { br: 1 }, { step: 2 }, "Thay vào: 1,2 − 9 + 2,5.", { br: 1 }, { step: 3 }, "Cộng trừ từ trái sang phải: 1,2 − 9 = −7,8; rồi −7,8 + 2,5 = ", { hl: "−5,3", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " không ngoặc thì luỹ thừa → nhân/chia → cộng/trừ."] },
        { label: "Ví dụ 2", detail: ["Tính 9,8 + 1,5 · 6 + (6,8 − 2) : 3.", { br: 1 }, { step: 1 }, "Làm trong ngoặc trước: 6,8 − 2 = 4,8.", { br: 1 }, { step: 2 }, "Nhân, chia: 1,5 · 6 = 9; 4,8 : 3 = 1,6.", { br: 1 }, { step: 3 }, "Cộng lần lượt: 9,8 + 9 + 1,6 = ", { hl: "20,4", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " có ngoặc thì xử ngoặc đầu tiên, dù nó nằm ở cuối biểu thức."] },
        { label: "Ví dụ 3", detail: ["Tính 12,4 · 6,25 + (−12,4) · (−2,5)².", { br: 1 }, { step: 1 }, "Luỹ thừa trước: (−2,5)² = 6,25.", { br: 1 }, { step: 2 }, "Hai số hạng đều nhân 6,25: ( 12,4 + (−12,4) ) · 6,25.", { br: 1 }, { step: 3 }, "= 0 · 6,25 = ", { hl: "0", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " để ý luỹ thừa của số âm, và mẹo gộp thừa số chung để ra 0."] },
      ] },

    { id: "orderpractice", num: 4, title: "Luyện thứ tự phép tính", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính 9,8 + 1,5 · 6 + (6,8 − 2) : 3", answer: 20.4, hint: "Ngoặc trước: 6,8 − 2 = 4,8. Rồi 1,5·6 = 9 và 4,8:3 = 1,6. Vậy 9,8 + 9 + 1,6 = 20,4." },
        { ask: "Tính 1,2 − 3² + 7,5 : 3", answer: -5.3, hint: "3² = 9; 7,5:3 = 2,5 → 1,2 − 9 + 2,5 = −5,3." },
        { ask: "Tính 12,4 · 6,25 + (−12,4) · (−2,5)²", answer: 0, hint: "(−2,5)² = 6,25 → (12,4 + (−12,4)) · 6,25 = 0 · 6,25 = 0." },
      ] },

    { id: "moverule", num: 5, title: "Quy tắc chuyển vế", icon: "move", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["“Đẳng thức” là hai vế nối nhau bởi dấu “=”, giống một ", { hl: "cái cân thăng bằng", color: C.amber }, ". Muốn để x đứng một mình, ta chuyển các số khác sang vế kia — nhưng khi chuyển phải ", { hl: "đổi dấu", color: C.amber }, " số đó (“+” thành “−”, “−” thành “+”).", { br: 1 }, { br: 1 }, "Ví dụ: x + 3 = 10 → chuyển 3 sang phải, đổi dấu: x = 10 − 3 = 7.", { br: 1 }, "Hay x − 4 = 6 → chuyển 4 sang phải, đổi dấu: x = 6 + 4 = 10.", { br: 1 }, { br: 1 }, "Công thức chung: nếu a + b = c thì a = c − b; nếu a − b = c thì a = c + b."] },

    { id: "movesteps", num: 6, title: "Tìm x bằng chuyển vế", icon: "book", type: "reveal",
      prompt: ["Bấm từng ví dụ để luyện tìm x bằng chuyển vế, qua ba dạng khác nhau:"],
      cards: [
        { label: "Ví dụ 1", detail: ["Tìm x biết x + ", { frac: [1, 2] }, " = ", { frac: [-6, 7] }, ".", { br: 1 }, { step: 1 }, "Chuyển ", { frac: [1, 2] }, " sang vế phải, đổi dấu: x = ", { frac: [-6, 7] }, " − ", { frac: [1, 2] }, ".", { br: 1 }, { step: 2 }, "Quy đồng mẫu 14: x = ", { frac: [-12, 14] }, " − ", { frac: [7, 14] }, ".", { br: 1 }, { step: 3 }, "x = ", { frac: [-19, 14], color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " số hạng đang “+” khi chuyển vế thành “−”."] },
        { label: "Ví dụ 2", detail: ["Tìm x biết x − ", { frac: [3, 4] }, " = ", { frac: [9, 8] }, ".", { br: 1 }, { step: 1 }, "Chuyển −", { frac: [3, 4] }, " sang vế phải, đổi dấu thành “+”: x = ", { frac: [9, 8] }, " + ", { frac: [3, 4] }, ".", { br: 1 }, { step: 2 }, "Quy đồng mẫu 8: x = ", { frac: [9, 8] }, " + ", { frac: [6, 8] }, ".", { br: 1 }, { step: 3 }, "x = ", { frac: [15, 8], color: C.teal }, " = 1,875.", { br: 1 }, { b: "Góc nhìn:" }, " số hạng đang “−” khi chuyển vế thành “+”."] },
        { label: "Ví dụ 3", detail: ["Tìm x biết 2x + ", { frac: [1, 2] }, " = ", { frac: [7, 9] }, ".", { br: 1 }, { step: 1 }, "Chuyển ", { frac: [1, 2] }, " sang phải, đổi dấu: 2x = ", { frac: [7, 9] }, " − ", { frac: [1, 2] }, ".", { br: 1 }, { step: 2 }, "Quy đồng mẫu 18: 2x = ", { frac: [14, 18] }, " − ", { frac: [9, 18] }, " = ", { frac: [5, 18] }, ".", { br: 1 }, { step: 3 }, "Chia hai vế cho 2: x = ", { frac: [5, 36], color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " khi x có hệ số, chuyển vế xong còn một bước chia nữa."] },
      ] },

    { id: "movepractice", num: 7, title: "Luyện tìm x", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tìm x biết x + 7,25 = 15,75", answer: 8.5, hint: "Chuyển vế: x = 15,75 − 7,25 = 8,5." },
        { ask: ["Tìm x biết x − ", { frac: [3, 4] }, " = ", { frac: [9, 8] }], answer: 1.875,
          hint: ["x = ", { frac: [9, 8] }, " + ", { frac: [3, 4] }, " = ", { frac: [9, 8] }, " + ", { frac: [6, 8] }, " = ", { frac: [15, 8] }, " = 1,875. (Nhập 15/8 hoặc 1,875)"] },
        { ask: "Bánh chưng nặng 0,8 kg gồm 0,5 kg gạo, 0,125 kg đậu xanh, 0,04 kg lá dong, còn lại là thịt. Khối lượng thịt (kg)?", answer: 0.135,
          hint: "Thịt = 0,8 − (0,5 + 0,125 + 0,04) = 0,8 − 0,665 = 0,135 kg." },
      ] },

    { id: "reallife", num: 8, title: "Tính đúng thứ tự, tìm ẩn số", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🧾", label: "Hoá đơn", detail: ["Mua 3 quyển vở (12 000đ) và 1 bút (8 000đ): tính ", { b: "3 × 12 000 + 8 000 = 44 000đ" }, " (nhân trước, cộng sau). Sai thứ tự là sai tiền!"] },
      { emoji: "⚖️", label: "Tìm x", detail: ["Tổng hai vật là 5 kg, một vật 1,8 kg thì vật kia x thoả x + 1,8 = 5 → ", { hl: "x = 5 − 1,8 = 3,2 kg" }, ". Đúng quy tắc chuyển vế."] },
      { emoji: "🍳", label: "Chia tiền", detail: ["Hoá đơn 340 000đ, một bạn trả trước 100 000đ. Ba người còn lại mỗi người trả x: 3x + 100 000 = 340 000 → ", { hl: "x = 80 000đ" }, "."] },
    ] },

    { id: "ex", num: 9, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cân thăng bằng: 5,1 + x = 7. Quả bưởi (x) nặng bao nhiêu?",
          opts: ["1,9 kg", "2,9 kg", "12,1 kg"], correct: 0,
          solution: "Chuyển vế: x = 7 − 5,1 = 1,9 kg." },
        { q: "Tính 1,2 − 3² + 7,5 : 3",
          opts: ["−5,3", "5,3", "−0,5"], correct: 0,
          solution: "Làm luỹ thừa & chia trước: 3² = 9, 7,5:3 = 2,5 → 1,2 − 9 + 2,5 = −5,3." },
        { q: ["Tìm x biết 2x + ", { frac: [1, 2] }, " = ", { frac: [7, 9] }],
          opts: [[{ frac: [5, 36] }], [{ frac: [5, 18] }], [{ frac: [5, 9] }]], correct: 0,
          solution: ["2x = ", { frac: [7, 9] }, " − ", { frac: [1, 2] }, " = ", { frac: [14, 18] }, " − ", { frac: [9, 18] }, " = ", { frac: [5, 18] }, " → x = ", { frac: [5, 36] }, "."] },
        { q: ["Tìm x biết x − ", { frac: [5, 7] }, " = ", { frac: [9, 14] }],
          opts: [[{ frac: [19, 14] }], [{ frac: [-1, 14] }], [{ frac: [1, 2] }]], correct: 0,
          solution: ["x = ", { frac: [9, 14] }, " + ", { frac: [5, 7] }, " = ", { frac: [9, 14] }, " + ", { frac: [10, 14] }, " = ", { frac: [19, 14] }, "."] },
        { q: "Làm một cái bánh cần 2¾ cốc bột. Lan đã có 1½ cốc. Lan cần thêm bao nhiêu cốc bột?",
          opts: ["1¼ cốc", "1½ cốc", "4¼ cốc"], correct: 0,
          solution: "Cần thêm = 2¾ − 1½ = 2,75 − 1,5 = 1,25 = 1¼ cốc." },
      ] },
  ],
};
