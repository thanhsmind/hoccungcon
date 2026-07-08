import { C } from "../../lib/colors.js";

export const BAI_6 = {
  meta: { chapter: "Chương II", lesson: "Bài 6", title: "Số vô tỉ &", highlight: "căn bậc hai",
    intro: "Có những độ dài không thể viết bằng phân số. Làm quen số vô tỉ và căn bậc hai số học." },
  stations: [
    { id: "hook", num: 0, title: "Cạnh hình vuông diện tích 2 dm²", icon: "activity", type: "calculator",
      prompt: "Ghép được một hình vuông có diện tích đúng 2 dm². Độ dài cạnh x của nó thoả mãn x² = 2. Hãy tính x.",
      inputs: [{ key: "area", label: "Diện tích hình vuông (dm²)", default: 2 }],
      formula: "Math.sqrt(area)", decimals: 9, hideFrac: true, cta: "Tính độ dài cạnh",
      onResultNote: ["Con số 1,414213562… này ", { hl: "không bao giờ dừng và cũng không lặp lại theo chu kì" }, ". Nó không phải số hữu tỉ! Những số như thế gọi là ", { hl: "số vô tỉ" }, " — và x chính là ", { b: "√2" }, "."] },

    { id: "why", num: 1, title: "Tại sao cần thêm số vô tỉ?", icon: "why", type: "why",
      question: "Đã có đủ số nguyên, phân số, số thập phân rồi. Tại sao vẫn cần thêm số vô tỉ?",
      hint: "Thử tìm một số mà nhân với chính nó bằng đúng 2 — viết được thành phân số không?",
      answer: ["Có những độ dài rất thật mà ", { b: "không phân số nào tả nổi" }, ".", { br: 1 }, { br: 1 }, "Ví dụ hình vuông cạnh 1, đường chéo của nó dài đúng √2 = 1,41421356… — kéo dài mãi và ", { hl: "không tuần hoàn" }, ", nên không phải số hữu tỉ.", { br: 1 }, { br: 1 }, "Những số như vậy gọi là ", { b: "số vô tỉ" }, ". Căn bậc hai chính là công cụ tìm ra chúng (từ diện tích suy ra cạnh)."],
      takeaway: ["Số vô tỉ thể hiện: thế giới có những đại lượng ", { b: "không viết được thành phân số" }, " nhưng vẫn tồn tại và đo được trên trục số."] },
    { id: "irr", num: 2, title: "Số vô tỉ là gì?", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Số vô tỉ là số viết được dưới dạng số thập phân ", { hl: "vô hạn KHÔNG tuần hoàn", color: C.amber }, ". Tập hợp các số vô tỉ kí hiệu là 𝕀. Ví dụ: √2 = 1,4142135… ; π = 3,1415926… đều là số vô tỉ."] },

    { id: "sqrtdef", num: 3, title: "Căn bậc hai số học", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Dấu ", { hl: "√", color: C.amber }, " gọi là “căn bậc hai”. Hỏi ", { hl: "√a", color: C.amber }, " tức là hỏi: ", { b: "số nào (không âm) nhân với chính nó thì ra a?" }, { br: 1 }, { br: 1 }, "Ví dụ √9 = 3 vì 3 · 3 = 9; √25 = 5 vì 5 · 5 = 25.", { br: 1 }, "Nói gọn: √a là số x ≥ 0 sao cho x² = a (x² nghĩa là x · x).", { br: 1 }, { br: 1 }, "Vì cạnh hình vuông luôn dương, cạnh của hình vuông diện tích 2 dm² đúng bằng √2 dm."] },

    { id: "exact", num: 4, title: "Tính căn cho kết quả đúng", icon: "book", type: "reveal",
      prompt: "Bấm từng ví dụ — căn cho kết quả đúng với cả số nguyên, số thập phân và phân số:",
      cards: [
        { label: "√169", detail: ["Tìm số không âm nhân với chính nó ra 169: 13² = 169 và 13 > 0 nên √169 = ", { hl: "13", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " số nguyên chính phương cho căn là số nguyên."] },
        { label: "√0,49", detail: ["0,7² = 0,49 và 0,7 > 0 nên √0,49 = ", { hl: "0,7", color: C.teal }, ".", { br: 1 }, { b: "Góc nhìn:" }, " số thập phân cũng có thể là “chính phương” và cho căn đúng."] },
        { label: ["√", { frac: [9, 16] }], detail: ["Căn của một phân số = căn tử chia căn mẫu: √", { frac: [9, 16] }, " = ", { frac: [3, 4], color: C.teal }, " (vì √9 = 3 và √16 = 4).", { br: 1 }, { b: "Góc nhìn:" }, " khai căn từng phần tử/mẫu khi cả hai đều chính phương."] },
      ] },

    { id: "practice", num: 5, title: "Luyện căn của số chính phương", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính √16", answer: 4, hint: "4² = 16 và 4 > 0 → √16 = 4." },
        { ask: "Tính √81", answer: 9, hint: "9² = 81 → √81 = 9." },
        { ask: "Sàn thi đấu cử tạ hình vuông có diện tích 144 m². Cạnh sàn dài bao nhiêu mét?", answer: 12, hint: "Cạnh = √144 = 12 m (vì 12² = 144)." },
      ] },

    { id: "calc", num: 6, title: "Máy tính căn bậc hai", icon: "scale", type: "calculator",
      prompt: "Với số không chính phương, ta dùng máy tính (kết quả là số gần đúng đã được làm tròn). Thử bấm:",
      inputs: [{ key: "a", label: "Tính căn của số", default: 91 }],
      formula: "Math.sqrt(a)", decimals: 4, hideFrac: true, cta: "Bấm căn",
      presets: [{ label: "√91", values: { a: 91 } }, { label: "√15", values: { a: 15 } }, { label: "√52198,16 (đáy kim tự tháp)", values: { a: 52198.16 } }],
      onResultNote: ["Máy chỉ hiện một số chữ số nên kết quả đã được làm tròn. Ví dụ √91 ≈ 9,5394 (đến chữ số thập phân thứ tư) hoặc ≈ 9,5 (độ chính xác 0,05)."] },

    { id: "reallife", num: 7, title: "Căn bậc hai ngoài đời", icon: "globe", type: "reallife",
    cards: [
      { emoji: "📺", label: "Màn hình TV", detail: ["TV “55 inch” là độ dài ", { b: "đường chéo" }, ". Từ chiều rộng và cao, đường chéo = √(rộng² + cao²) — phải khai căn."] },
      { emoji: "🪜", label: "Đường chéo", detail: ["Nền nhà vuông cạnh 3 m có đường chéo = ", { b: "√(3² + 3²)" }, " = √18 ≈ ", { hl: "4,24 m" }, " — một số vô tỉ."] },
      { emoji: "📐", label: "Diện tích → cạnh", detail: ["Mảnh đất vuông rộng 50 m² thì cạnh = ", { b: "√50" }, " ≈ 7,07 m. Từ diện tích tìm cạnh luôn cần căn bậc hai."] },
    ] },

    { id: "ex", num: 8, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cho biết 153² = 23409. Tính √23409.", opts: ["153", "151", "1530"], correct: 0,
          solution: "√23409 = √(153²) = 153 (vì 153 > 0)." },
        { q: "Căn bậc hai số học của 81 là?", opts: ["9", "−9", "9 và −9"], correct: 0,
          solution: "Căn bậc hai số học phải là số KHÔNG âm, nên √81 = 9 (không lấy −9)." },
        { q: "Tính √129600, biết 360² = 129600.", opts: ["360", "3600", "1296"], correct: 0,
          solution: "√129600 = √(360²) = 360." },
        { q: "Hình chữ nhật dài 8 dm, rộng 5 dm. Đường chéo dài khoảng bao nhiêu dm? (đường chéo² = dài² + rộng²)",
          opts: ["≈ 9,4 dm", "≈ 13 dm", "≈ 6,4 dm"], correct: 0,
          solution: "Đường chéo = √(8² + 5²) = √89 ≈ 9,4 dm." },
        { q: "Số nào dưới đây là số vô tỉ?", opts: ["√2", "√16", "0,(3)"], correct: 0,
          solution: "√16 = 4 và 0,(3) = 1/3 đều là số hữu tỉ. Chỉ √2 = 1,4142… vô hạn không tuần hoàn → số vô tỉ." },
      ] },
  ],
};
