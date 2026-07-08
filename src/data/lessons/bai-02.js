import { C } from "../../lib/colors.js";

export const BAI_2 = {
  meta: { chapter: "Chương I", lesson: "Bài 2", title: "Cộng, trừ, nhân, chia", highlight: "số hữu tỉ",
    intro: "Mọi phép tính trong ℚ đều quy về phân số hoặc số thập phân. Học cách tính đúng — và tính nhanh một cách hợp lí." },
  stations: [
    { id: "hook", num: 0, title: "Khinh khí cầu cách mặt đất bao xa?", icon: "activity", type: "calculator",
      prompt: ["Một khinh khí cầu bay lên từ mặt đất với vận tốc 0,8 m/s trong 50 giây, rồi hạ độ cao với vận tốc ", { frac: [5, 9] }, " m/s. Sau 27 giây kể từ khi hạ, nó còn cách mặt đất bao nhiêu mét?"],
      inputs: [{ key: "vUp", label: "Vận tốc lên (m/s)", default: 0.8 }, { key: "tUp", label: "Thời gian lên (s)", default: 50 }, { key: "tDown", label: "Thời gian hạ (s)", default: 27 }],
      formula: "vUp*tUp - (5/9)*tDown", decimals: 0, cta: "Tính độ cao",
      onResultNote: ["Bay lên: 0,8 × 50 = 40 m. Hạ xuống: ", { frac: [5, 9] }, " × 27 = 15 m. Vậy còn cách mặt đất 40 − 15 = ", { hl: "25 m" }, ". Đó chính là một phép ", { b: "trừ số hữu tỉ" }, " — nội dung của bài này!"] },

    { id: "why", num: 1, title: "Tại sao phải học lại bốn phép tính?", icon: "why", type: "why",
      question: "Ở tiểu học ta đã cộng, trừ, nhân, chia rồi. Vậy tại sao lớp 7 còn phải học lại các phép tính này?",
      hint: "Để ý: bây giờ các số có thêm dấu âm, và là phân số hoặc số thập phân.",
      answer: ["Hồi nhỏ ta chỉ tính với số đếm: 3 + 5, 12 : 4… luôn ra số “đẹp”.", { br: 1 }, { br: 1 }, "Nhưng số hữu tỉ có thêm ", { b: "dấu âm" }, " và ", { b: "phân số, số thập phân" }, ", nên cần quy tắc mới:", { br: 1 }, "• Cộng hai số âm, hay trừ đi một số âm thì làm sao?", { br: 1 }, "• Cộng hai phân số khác mẫu thì phải quy đồng trước.", { br: 1 }, { br: 1 }, "Học bài này để tính đúng với ", { hl: "mọi loại số hữu tỉ" }, ", không chỉ số đếm."],
      takeaway: ["Bốn phép tính là ", { b: "công cụ dùng hằng ngày" }, ": tính tiền, đo đạc, cộng trừ nhiệt độ. Nắm chắc thì việc gì cũng tính được."] },
    { id: "addrule", num: 2, title: "Cộng, trừ hai số hữu tỉ", icon: "plus", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Viết các số về phân số ", { hl: "cùng mẫu dương", color: C.amber }, " (quy đồng) rồi cộng (trừ) các tử, giữ nguyên mẫu.", { br: 1 }, { br: 1 }, "Vài từ hơi “sang chảnh” nhưng ý rất đơn giản:", { br: 1 }, "• ", { b: "Giao hoán" }, " = đổi chỗ thoải mái: a + b = b + a (giống 2 + 3 = 3 + 2).", { br: 1 }, "• ", { b: "Kết hợp" }, " = nhóm lại tuỳ ý: (a + b) + c = a + (b + c).", { br: 1 }, "• ", { b: "a + (−a) = 0" }, ": một số cộng với số đối của nó luôn bằng 0 (ví dụ 5 + (−5) = 0)."] },

    { id: "addsteps", num: 3, title: "Tính hợp lí một tổng", icon: "book", type: "reveal",
      prompt: ["Bấm từng ví dụ để xem cách nhóm số hạng cho dễ tính. Mỗi ví dụ là một tình huống khác nhau:"],
      cards: [
        { label: "Ví dụ 1", detail: ["Tính ", { frac: [-2, 3] }, " + 2,5 + ", { frac: [1, 3] }, " + 1½.", { br: 1 }, { step: 1 }, "Đưa tất cả về phân số: ", { frac: [-2, 3] }, " + ", { frac: [5, 2] }, " + ", { frac: [1, 3] }, " + ", { frac: [3, 2] }, ".", { br: 1 }, { step: 2 }, "Nhóm các phân số cùng mẫu: ( ", { frac: [-2, 3] }, " + ", { frac: [1, 3] }, " ) + ( ", { frac: [5, 2] }, " + ", { frac: [3, 2] }, " ).", { br: 1 }, { step: 3 }, "= ", { frac: [-1, 3] }, " + 4 = ", { frac: [11, 3], color: C.teal }, " ≈ 3,67.", { br: 1 }, { b: "Góc nhìn:" }, " gom các phân số cùng mẫu để cộng cho gọn."] },
        { label: "Ví dụ 2", detail: ["Tính ", { frac: [3, 7] }, " + (−2,5) + ", { frac: [4, 7] }, " + 2,5.", { br: 1 }, { step: 1 }, "Đổi chỗ cho các số “bạn bè” đứng cạnh nhau: ( ", { frac: [3, 7] }, " + ", { frac: [4, 7] }, " ) + ( −2,5 + 2,5 ).", { br: 1 }, { step: 2 }, "Cặp số đối triệt tiêu: −2,5 + 2,5 = 0; còn ", { frac: [3, 7] }, " + ", { frac: [4, 7] }, " = ", { frac: [7, 7] }, " = 1.", { br: 1 }, { step: 3 }, "= 1 + 0 = ", { hl: "1", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " tìm cặp số đối (a và −a) để khử nhau, tính nhanh hơn."] },
        { label: "Ví dụ 3", detail: ["Tính ", { frac: [1, 6] }, " + (−0,5) + ", { frac: [5, 6] }, " + (−1,5).", { br: 1 }, { step: 1 }, "Nhóm phân số cùng mẫu, nhóm số thập phân: ( ", { frac: [1, 6] }, " + ", { frac: [5, 6] }, " ) + ( −0,5 + (−1,5) ).", { br: 1 }, { step: 2 }, { frac: [1, 6] }, " + ", { frac: [5, 6] }, " = 1; còn −0,5 + (−1,5) = −2.", { br: 1 }, { step: 3 }, "= 1 + (−2) = ", { hl: "−1", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " kết quả có thể âm — cộng hai số âm thì cộng phần số rồi giữ dấu “−”."] },
      ] },

    { id: "bracket", num: 4, title: "Quy tắc dấu ngoặc", icon: "book", type: "text", variant: "note", title2: "GHI NHỚ",
      body: ["Trong ℚ, quy tắc dấu ngoặc giống hệt trong ℤ: bỏ ngoặc có dấu “−” đằng trước thì ", { hl: "đổi dấu mọi số hạng", color: C.violet }, " bên trong; có dấu “+” đằng trước thì giữ nguyên. Ta cũng được đổi chỗ và đặt ngoặc để nhóm các số hạng tuỳ ý."] },

    { id: "addpractice", num: 5, title: "Luyện cộng, trừ", icon: "hash", type: "fillin",
      questions: [
        { ask: ["Bỏ ngoặc rồi tính ", { frac: [9, 10] }, " − ( ", { frac: [6, 5] }, " − ", { frac: [7, 4] }, " )"], answer: 1.45,
          hint: ["Quy đồng mẫu 20. Trong ngoặc: ", { frac: [24, 20] }, " − ", { frac: [35, 20] }, " = ", { frac: [-11, 20] }, ". Vậy ", { frac: [18, 20] }, " − ( ", { frac: [-11, 20] }, " ) = ", { frac: [29, 20] }, " = 1,45."] },
        { ask: "Tính −21,25 + 13,3", answer: -7.95, hint: "Hai số thập phân khác dấu: −(21,25 − 13,3) = −7,95." },
        { ask: "Trong 100 g khoai tây khô có 11 g nước, 6,6 g protein, 0,3 g chất béo, 75,1 g glucid. Khối lượng các chất khác (g) là?", answer: 7,
          hint: "100 − (11 + 6,6 + 0,3 + 75,1) = 100 − 93 = 7 (g)." },
      ] },

    { id: "mulrule", num: 6, title: "Nhân, chia hai số hữu tỉ", icon: "scale", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Viết các số về phân số rồi ", { hl: "nhân tử với tử, mẫu với mẫu", color: C.amber }, ".", { br: 1 }, { br: 1 }, "• ", { b: "Nghịch đảo" }, " của một phân số là ", { hl: "lật ngược nó lại", color: C.amber }, ": nghịch đảo của ", { frac: [2, 3] }, " là ", { frac: [3, 2] }, ". ", { b: "Chia" }, " một số = ", { b: "nhân" }, " với nghịch đảo của số đó.", { br: 1 }, "• ", { b: "Phân phối" }, " là mẹo gom thừa số chung: a·c + b·c = (a + b)·c (ví dụ 7·2 + 3·2 = (7 + 3)·2 = 20)."] },

    { id: "distribute", num: 7, title: "Dùng tính chất phân phối để tính nhanh", icon: "book", type: "reveal",
      prompt: ["Bấm từng ví dụ để thấy cách đặt thừa số chung giúp tính nhanh, qua ba tình huống khác nhau:"],
      cards: [
        { label: "Ví dụ 1", detail: ["Tính nhanh ", { frac: [7, 6] }, " · 3¼ + ", { frac: [7, 6] }, " · (−0,25).", { br: 1 }, { step: 1 }, "Hai số hạng có chung thừa số ", { frac: [7, 6] }, ": ", { frac: [7, 6] }, " · ( 3¼ + (−0,25) ).", { br: 1 }, { step: 2 }, "Trong ngoặc: 3,25 + (−0,25) = 3.", { br: 1 }, { step: 3 }, "= ", { frac: [7, 6] }, " · 3 = ", { frac: [21, 6] }, " = ", { frac: [7, 2], color: C.teal }, " = 3,5.", { br: 1 }, { b: "Góc nhìn:" }, " gộp hai tích về một phép nhân duy nhất."] },
        { label: "Ví dụ 2", detail: ["Tính nhanh ", { frac: [-3, 5] }, " · 12 + ", { frac: [-3, 5] }, " · (−2).", { br: 1 }, { step: 1 }, "Đặt thừa số chung ", { frac: [-3, 5] }, ": ", { frac: [-3, 5] }, " · ( 12 + (−2) ).", { br: 1 }, { step: 2 }, "Trong ngoặc: 12 + (−2) = 10.", { br: 1 }, { step: 3 }, "= ", { frac: [-3, 5] }, " · 10 = ", { frac: [-30, 5] }, " = ", { hl: "−6", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " thừa số chung có thể âm; dấu “−” theo suốt phép tính."] },
        { label: "Ví dụ 3", detail: ["Tính nhanh 0,4 · ", { frac: [5, 9] }, " + 0,4 · ", { frac: [13, 9] }, ".", { br: 1 }, { step: 1 }, "Đặt thừa số chung 0,4: 0,4 · ( ", { frac: [5, 9] }, " + ", { frac: [13, 9] }, " ).", { br: 1 }, { step: 2 }, "Trong ngoặc: ", { frac: [5, 9] }, " + ", { frac: [13, 9] }, " = ", { frac: [18, 9] }, " = 2.", { br: 1 }, { step: 3 }, "= 0,4 · 2 = ", { hl: "0,8", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " thừa số chung có thể là số thập phân; gộp phân số cùng mẫu cho ngoặc tròn trịa."] },
      ] },

    { id: "mulpractice", num: 8, title: "Luyện nhân, chia", icon: "hash", type: "fillin",
      questions: [
        { ask: ["Tính ", { frac: [-9, 13] }, " · ", { frac: [-4, 5] }], answer: 36 / 65, tol: 1e-3,
          hint: ["Nhân hai số âm ra số dương: ", { frac: [9, 13] }, " · ", { frac: [4, 5] }, " = ", { frac: [36, 65] }, ". (Nhập 36/65)"] },
        { ask: ["Tính −2,4 : ", { frac: [6, 5] }], answer: -2,
          hint: ["−2,4 = ", { frac: [-24, 10] }, ". Chia là nhân nghịch đảo: ", { frac: [-24, 10] }, " · ", { frac: [5, 6] }, " = ", { frac: [-120, 60] }, " = −2."] },
        { ask: "Tính 1,25 · (−4,6)", answer: -5.75, hint: "Hai số thập phân khác dấu: 1,25 · 4,6 = 5,75 → kết quả −5,75." },
      ] },

    { id: "reallife", num: 9, title: "Tính toán mỗi ngày", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🛒", label: "Đi chợ", detail: ["Mua 1,5 kg táo (32 000đ/kg) và 0,75 kg nho (80 000đ/kg). Tổng tiền = ", { b: "1,5 × 32 000 + 0,75 × 80 000 = 108 000đ" }, " — nhân rồi cộng số hữu tỉ."] },
      { emoji: "🏦", label: "Tài khoản", detail: ["Tài khoản đang nợ ", { b: "−50 000đ" }, ", nạp thêm 200 000đ thì còn −50 000 + 200 000 = ", { hl: "150 000đ" }, ". Cộng số âm với số dương như trong bài."] },
      { emoji: "🍲", label: "Nấu ăn", detail: ["Công thức cần ", { frac: [3, 4] }, " lít nước, nhưng nấu nửa khẩu phần → chỉ cần ", { frac: [3, 4] }, " × ", { frac: [1, 2] }, " = ", { frac: [3, 8] }, " lít. Nhân phân số."] },
    ] },

    { id: "exercises", num: 10, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Nhiệt độ tại Sa Pa là −0,7°C, tại Lào Cai là 9,6°C. Lào Cai cao hơn Sa Pa bao nhiêu °C?",
          opts: ["8,9°C", "10,3°C", "9,6°C"], correct: 1,
          solution: "Lấy nhiệt độ cao trừ nhiệt độ thấp: 9,6 − (−0,7) = 9,6 + 0,7 = 10,3°C." },
        { q: "Ngăn sách dài 120 cm, mỗi cuốn dày khoảng 2,4 cm. Xếp được nhiều nhất bao nhiêu cuốn?",
          opts: ["48 cuốn", "50 cuốn", "52 cuốn"], correct: 1,
          solution: "Số cuốn = 120 : 2,4 = 50. Vậy nhiều nhất 50 cuốn." },
        { q: ["So sánh ", { frac: [123, 7] }, " và 17,75"],
          opts: [[{ frac: [123, 7] }, " > 17,75"], [{ frac: [123, 7] }, " < 17,75"], "Bằng nhau"], correct: 1,
          solution: [{ frac: [123, 7] }, " ≈ 17,57. Vì 17,57 < 17,75 nên ", { frac: [123, 7] }, " < 17,75."] },
        { q: "Tính (−9,15) + 8,09",
          opts: ["−1,06", "1,06", "−17,24"], correct: 0,
          solution: "Hai số khác dấu: lấy 9,15 − 8,09 = 1,06, rồi giữ dấu của số có trị tuyệt đối lớn hơn (−9,15) → kết quả −1,06." },
        { q: ["Tính nhanh ", { frac: [3, 2] }, " · ( ", { frac: [-37, 10] }, " ) + ", { frac: [17, 2] }, " · ( ", { frac: [-37, 10] }, " )"],
          opts: ["−37", "37", "−10"], correct: 0,
          solution: ["Đặt thừa số chung ( ", { frac: [-37, 10] }, " ): ( ", { frac: [3, 2] }, " + ", { frac: [17, 2] }, " ) · ( ", { frac: [-37, 10] }, " ) = 10 · ( ", { frac: [-37, 10] }, " ) = −37."] },
      ] },
  ],
};
