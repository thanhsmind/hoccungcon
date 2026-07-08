import { C } from "../../lib/colors.js";

export const BAI_7 = {
  meta: { chapter: "Chương II", lesson: "Bài 7", title: "Tập hợp các", highlight: "số thực",
    intro: "Gộp số hữu tỉ và số vô tỉ lại, ta được số thực ℝ. Học số đối, so sánh và giá trị tuyệt đối." },
  stations: [
    { id: "hook", num: 0, title: "Tất cả đều là số thực", icon: "activity", type: "reveal",
      prompt: "“Lại thêm số thực nữa?” — Đừng lo, toàn số đã biết! Bấm để thấy mỗi số đều là một số thực:",
      cards: [
        { label: [{ frac: [3, 4] }], detail: [{ frac: [3, 4] }, " = 0,75 (hữu tỉ) ∈ ℝ"] },
        { label: [{ frac: [1, 9] }], detail: [{ frac: [1, 9] }, " = 0,(1) (hữu tỉ) ∈ ℝ"] },
        { label: "√2", detail: ["√2 = 1,4142… (vô tỉ) ∈ ℝ"] },
        { label: "π", detail: ["π = 3,14159… (vô tỉ) ∈ ℝ"] },
      ] },

    { id: "why", num: 1, title: "Tại sao gộp lại thành số thực?", icon: "why", type: "why",
      question: "Tại sao phải gộp số hữu tỉ và số vô tỉ lại thành một nhà chung tên là “số thực”?",
      hint: "Hình dung trục số: giữa các điểm phân số liệu còn chỗ trống không?",
      answer: ["Nếu chỉ có số hữu tỉ thì trục số vẫn còn ", { b: "những lỗ hổng" }, " — đúng chỗ các số vô tỉ như √2, π.", { br: 1 }, { br: 1 }, "Gộp cả hai loại lại, ta được ", { hl: "số thực" }, " — lấp đầy hoàn toàn trục số, không còn khe hở nào.", { br: 1 }, { br: 1 }, "Nhờ đó mọi độ dài, mọi điểm trên trục đều ứng với ", { b: "một số thực" }, "."],
      takeaway: ["Số thực thể hiện ý tưởng: ", { b: "mọi đại lượng đo được trong thực tế" }, " đều có một vị trí trên trục số — không sót cái nào."] },
    { id: "def", num: 2, title: "Số thực là gì?", icon: "hash", type: "text", variant: "definition", title2: "KHÁI NIỆM",
      body: ["Số hữu tỉ và số vô tỉ được gọi chung là ", { hl: "số thực", color: C.amber }, ". Tập hợp các số thực kí hiệu là ℝ. Như vậy mọi số em từng học (tự nhiên, nguyên, hữu tỉ, vô tỉ) đều là số thực."] },

    { id: "opp", num: 3, title: "Số đối & trục số thực", icon: "book", type: "reveal",
      prompt: "Bấm để xem số đối và ý nghĩa trục số thực:",
      cards: [
        { label: "Số đối của 5,08(299)", detail: ["Đổi dấu: ", { hl: "−5,08(299)", color: C.teal }] },
        { label: "Số đối của −√5", detail: ["Đổi dấu: ", { hl: "√5", color: C.teal }] },
        { label: "Trục số thực", detail: ["Mỗi số thực ứng với đúng một điểm trên trục, và ngược lại mỗi điểm ứng với một số thực — nên gọi là trục số thực."] },
      ] },

    { id: "cmp", num: 4, title: "So sánh hai số thực", icon: "book", type: "reveal",
      prompt: "Viết về dạng thập phân rồi so sánh như số hữu tỉ. Bấm xem ví dụ:",
      cards: [
        { label: "0,24(7) và 0,2382", detail: ["0,24(7) = 0,2477… > 0,2382 nên ", { hl: "0,24(7) > 0,2382", color: C.teal }] },
        { label: "√5 và 2,36", detail: ["√5 = 2,236… < 2,36 nên ", { hl: "√5 < 2,36", color: C.teal }] },
        { label: "−√2 và −1,41", detail: ["√2 = 1,414… > 1,41 nên ", { hl: "−√2 < −1,41", color: C.teal }, " (với số âm thì ngược lại)."] },
      ] },

    { id: "abs", num: 5, title: "Giá trị tuyệt đối", icon: "hash", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Giá trị tuyệt đối của a, kí hiệu ", { hl: "|a|", color: C.amber }, ", là ", { b: "khoảng cách từ a đến số 0" }, " trên trục số. Khoảng cách thì không bao giờ âm, nên ", { hl: "|a| luôn ≥ 0", color: C.amber }, ".", { br: 1 }, { br: 1 }, "Mẹo dễ nhớ: ", { b: "cứ bỏ dấu âm đi" }, ". Ví dụ |−7| = 7 ; |7| = 7 ; |0| = 0.", { br: 1 }, { br: 1 }, "Viết bằng công thức: |a| = a nếu a ≥ 0; |a| = −a nếu a < 0 (khi a âm thì −a chính là phần dương của nó, ví dụ a = −7 thì −a = 7)."] },

    { id: "abspractice", num: 6, title: "Luyện giá trị tuyệt đối", icon: "hash", type: "fillin",
      questions: [
        { ask: "Tính |−2,3|", answer: 2.3, hint: "−2,3 < 0 nên |−2,3| = −(−2,3) = 2,3." },
        { ask: "Tính |−11|", answer: 11, hint: "Số âm: lấy số đối → 11." },
        { ask: "Tính |0|", answer: 0, hint: "|0| = 0." },
        { ask: "Tìm giá trị dương của x biết |x| = 2,5", answer: 2.5, hint: "|x| = 2,5 → x = 2,5 hoặc x = −2,5; giá trị dương là 2,5." },
      ] },

    { id: "reallife", num: 7, title: "Số thực đong đầy cuộc sống", icon: "globe", type: "reallife",
    cards: [
      { emoji: "📏", label: "Đo liên tục", detail: ["Chiều cao, cân nặng, nhiệt độ, thời gian… mọi đại lượng đo được lấp đầy ", { hl: "trục số thực" }, " — giữa hai số luôn còn vô số số khác."] },
      { emoji: "🥧", label: "Số π", detail: ["Chu vi bánh xe = π × đường kính, với π ≈ 3,14159… là ", { b: "số vô tỉ" }, ", vẫn là một số thực trên trục số."] },
      { emoji: "🧭", label: "Định vị GPS", detail: ["Toạ độ như 21,0278 ; 105,8342 là số thực. Mỗi điểm trên bản đồ ứng với một ", { hl: "số thực" }, "."] },
    ] },

    { id: "ex", num: 8, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Cách viết nào sau đây đúng?", opts: ["√2 ∈ ℚ", "π ∈ 𝕀", "15 ∉ ℝ"], correct: 1,
          solution: "√2 là số vô tỉ nên √2 ∉ ℚ; 15 là số thực nên 15 ∈ ℝ. Chỉ có π ∈ 𝕀 (π là số vô tỉ) là đúng." },
        { q: "Số đối của −√5 là?", opts: ["√5", "−√5", "5"], correct: 0,
          solution: "Số đối của a là −a; số đối của −√5 là √5." },
        { q: "−√81 là số gì?", opts: ["Số vô tỉ", "Số hữu tỉ (= −9)", "Không xác định"], correct: 1,
          solution: "√81 = 9 nên −√81 = −9, là một số nguyên ⊂ số hữu tỉ." },
        { q: "So sánh √5 và 2,36.", opts: ["√5 > 2,36", "√5 < 2,36", "Bằng nhau"], correct: 1,
          solution: "√5 ≈ 2,236 < 2,36 nên √5 < 2,36." },
        { q: "Phương trình |x| = 2,5 có bao nhiêu giá trị x?", opts: ["1", "2 (x = 2,5 và x = −2,5)", "Vô số"], correct: 1,
          solution: "Có hai số cách O đúng 2,5 đơn vị là 2,5 và −2,5 → 2 giá trị." },
      ] },
  ],
};
