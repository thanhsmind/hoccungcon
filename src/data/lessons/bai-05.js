import { C } from "../../lib/colors.js";

export const BAI_5 = {
  meta: { chapter: "Chương II", lesson: "Bài 5", title: "Số thập phân", highlight: "vô hạn tuần hoàn",
    intro: "Có những phép chia không bao giờ dừng. Nhận biết số thập phân hữu hạn, vô hạn tuần hoàn và cách làm tròn theo độ chính xác." },
  stations: [
    { id: "hook", num: 0, title: "Phép chia nào dừng, phép chia nào không?", icon: "activity", type: "decimal",
      prompt: ["Bạn Tròn chia ", { frac: [4, 5] }, " được 0,8 rồi dừng. Bạn Vuông chia ", { frac: [5, 18] }, " mãi không ra. Còn ", { frac: [2, 3] }, " thì sao? Em đoán mỗi số là loại nào, rồi để máy khai triển:"],
      items: [{ n: 4, d: 5 }, { n: 5, d: 18 }, { n: 2, d: 3 }] },

    { id: "why", num: 1, title: "Tại sao có số lẻ kéo dài vô tận?", icon: "why", type: "why",
      question: "Tại sao có phép chia như 10 : 3 mãi không bao giờ hết, cứ 3,333… kéo dài vô tận?",
      hint: "Thử đặt phép chia 10 : 3 và để ý số dư cứ lặp lại.",
      answer: ["Khi chia, đôi khi số dư cứ ", { b: "lặp đi lặp lại" }, " nên kết quả không bao giờ dừng: 10 : 3 = 3,3333…", { br: 1 }, { br: 1 }, "Phần lặp lại đó gọi là ", { hl: "chu kì" }, ", và ta gọi nó là số thập phân ", { b: "vô hạn tuần hoàn" }, ".", { br: 1 }, { br: 1 }, "Trong đời thực không thể ghi vô số chữ số, nên phải ", { hl: "làm tròn" }, " (ví dụ 3,33) để dùng được."],
      takeaway: ["Bài này dạy ta chấp nhận: nhiều con số ", { b: "dài vô tận" }, ", và làm tròn là cách biến chúng thành con số dùng được."] },
    { id: "def", num: 2, title: "Số thập phân vô hạn tuần hoàn & chu kì", icon: "hash", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Khi chia mãi không dừng và một nhóm chữ số lặp lại vô hạn, ta được ", { hl: "số thập phân vô hạn tuần hoàn", color: C.amber }, ". Nhóm chữ số lặp gọi là ", { hl: "chu kì", color: C.amber }, ", viết gọn trong ngoặc: 0,2777… = 0,2(7); −1,545454… = −1,(54). Các số như 0,8; 1,25 là ", { hl: "số thập phân hữu hạn", color: C.amber }, "."] },

    { id: "classify", num: 3, title: "Tự phân loại nhiều phân số", icon: "hash", type: "decimal",
      prompt: "Đoán hữu hạn hay vô hạn tuần hoàn, rồi kiểm chứng và xem chu kì:",
      items: [{ n: 1, d: 4 }, { n: 2, d: 11 }, { n: 7, d: 22 }, { n: 1, d: 9 }] },

    { id: "note", num: 4, title: "Một điều luôn đúng", icon: "book", type: "text", variant: "note", title2: "CHÚ Ý",
      body: ["Mọi số hữu tỉ đều viết được dưới dạng số thập phân ", { hl: "hữu hạn", color: C.violet }, " hoặc ", { hl: "vô hạn tuần hoàn", color: C.violet }, ". Không có số hữu tỉ nào cho thập phân vô hạn mà KHÔNG tuần hoàn."] },

    { id: "roundrule", num: 5, title: "Làm tròn theo độ chính xác", icon: "book", type: "text", variant: "definition", title2: "QUY TẮC",
      body: ["Nhắc lại tên các hàng sau dấu phẩy: 3,", { b: "1" }, "4", { b: "1" }, "… — chữ số đầu là ", { hl: "hàng phần mười", color: C.amber }, ", chữ số thứ hai là ", { hl: "hàng phần trăm", color: C.amber }, ".", { br: 1 }, { br: 1 }, "Cách làm tròn (chỉ 2 bước):", { br: 1 }, { step: 1 }, "Nhìn chữ số ", { b: "ngay sau" }, " hàng cần làm tròn.", { br: 1 }, { step: 2 }, "Nếu nó ", { hl: "≥ 5 thì tăng thêm 1", color: C.amber }, ", nếu ", { hl: "< 5 thì giữ nguyên", color: C.amber }, "; rồi bỏ hết phần phía sau.", { br: 1 }, { br: 1 }, "Ví dụ làm tròn 3,14159 đến hàng phần trăm: chữ số sau hàng phần trăm là 1 (< 5) → giữ nguyên → 3,14."] },

    { id: "table", num: 6, title: "Bảng độ chính xác", icon: "book", type: "reveal",
      prompt: "Bấm từng hàng để xem độ chính xác tương ứng:",
      cards: [
        { label: "Hàng trăm", detail: ["Làm tròn đến hàng trăm → độ chính xác ", { hl: "50", color: C.teal }] },
        { label: "Hàng chục", detail: ["Độ chính xác ", { hl: "5", color: C.teal }] },
        { label: "Hàng đơn vị", detail: ["Độ chính xác ", { hl: "0,5", color: C.teal }] },
        { label: "Hàng phần mười", detail: ["Độ chính xác ", { hl: "0,05", color: C.teal }] },
        { label: "Hàng phần trăm", detail: ["Độ chính xác ", { hl: "0,005", color: C.teal }] },
      ] },

    { id: "roundpractice", num: 7, title: "Luyện làm tròn", icon: "hash", type: "fillin",
      questions: [
        { ask: "Làm tròn a = 46,333… đến hàng đơn vị.", answer: 46, hint: "Chữ số sau hàng đơn vị là 3 < 5 → giữ nguyên: ≈ 46." },
        { ask: "Làm tròn b = −1,27(534) đến hàng phần trăm.", answer: -1.28, hint: "−1,27534… chữ số sau hàng phần trăm là 5 → làm tròn lên: ≈ −1,28." },
        { ask: "Làm tròn π = 3,14159… đến hàng phần trăm.", answer: 3.14, hint: "Chữ số sau hàng phần trăm là 1 < 5 → ≈ 3,14." },
      ] },

    { id: "reallife", num: 8, title: "Làm tròn trong cuộc sống", icon: "globe", type: "reallife",
    cards: [
      { emoji: "💵", label: "Tiền lẻ", detail: ["Chia 100 000đ cho 3 người = 33 333,33…đ (vô hạn tuần hoàn). Thực tế phải ", { hl: "làm tròn" }, " còn 33 000đ mỗi người."] },
      { emoji: "⛽", label: "Đổ xăng", detail: ["Đồng hồ hiện 1,837 lít nhưng số tiền luôn được làm tròn đến ", { b: "đồng" }, ". Mọi máy đo đều làm tròn."] },
      { emoji: "📏", label: "Đo đạc", detail: ["Cân nặng 42,7 kg, chiều cao 1,58 m… máy đo luôn cho số đã ", { hl: "làm tròn đến độ chính xác" }, " của nó, không bao giờ vô hạn chữ số."] },
    ] },

    { id: "ex", num: 9, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: ["Kết quả phép chia 1 cho 9, tức ", { frac: [1, 9] }, ", là số thập phân loại nào?"],
          opts: ["Hữu hạn", "Vô hạn tuần hoàn, chu kì 1", "Vô hạn nhưng không tuần hoàn"], correct: 1,
          solution: [{ frac: [1, 9] }, " = 0,111… , chữ số 1 lặp vô hạn nên là số thập phân vô hạn tuần hoàn chu kì 1, viết gọn 0,(1)."] },
        { q: "Viết gọn số thập phân 0,2777… là?",
          opts: ["0,2(7)", "0,(27)", "0,27(7)"], correct: 0,
          solution: "Chỉ chữ số 7 lặp lại, phần 0,2 đứng trước không lặp → viết gọn 0,2(7)." },
        { q: ["", { frac: [1, 4] }, " viết dưới dạng số thập phân là?"],
          opts: ["0,25 (hữu hạn)", "0,2(5)", "0,(25)"], correct: 0,
          solution: [{ frac: [1, 4] }, " = 0,25, phép chia dừng lại nên đây là số thập phân hữu hạn."] },
        { q: "Làm tròn một số với độ chính xác 0,005 nghĩa là làm tròn đến hàng nào?",
          opts: ["Hàng phần mười", "Hàng phần trăm", "Hàng phần nghìn"], correct: 1,
          solution: "0,005 là một nửa của 0,01 (đơn vị hàng phần trăm) → làm tròn đến hàng phần trăm." },
        { q: "Làm tròn a = 46,333… đến hàng đơn vị được kết quả nào?",
          opts: ["46", "47", "46,3"], correct: 0,
          solution: "Chữ số ngay sau hàng đơn vị là 3 < 5 nên giữ nguyên phần đơn vị → 46." },
      ] },
  ],
};
