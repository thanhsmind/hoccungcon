import { C } from "../../lib/colors.js";

export const BAI_11 = {
  meta: { chapter: "Chương III", lesson: "Bài 11", title: "Định lí &", highlight: "chứng minh",
    intro: "Đo đạc chỉ cho kết quả gần đúng trong vài trường hợp. Muốn chắc chắn đúng cho MỌI trường hợp, ta cần định lí và chứng minh." },
  stations: [
    { id: "why", num: 0, title: "Tại sao phải chứng minh?", icon: "why", type: "why",
      question: "Đo bằng thước thấy đúng rồi, tại sao toán học vẫn bắt phải “chứng minh”?",
      hint: "Thước có sai số không? Và em đo được bao nhiêu trường hợp?",
      answer: ["Đo bằng mắt, bằng thước luôn có ", { b: "sai số" }, ", và em chỉ đo được ", { b: "vài trường hợp" }, " — không thể đo hết mọi tam giác trên đời.", { br: 1 }, { br: 1 }, "“", { hl: "Chứng minh" }, "” là dùng lí lẽ chặt chẽ đi từ ", { b: "giả thiết" }, " (điều đã cho) đến ", { b: "kết luận" }, ", đảm bảo điều đó đúng cho ", { hl: "mọi trường hợp" }, ", mãi mãi.", { br: 1 }, { br: 1 }, "Một khi đã chứng minh xong, ta gọi đó là ", { b: "định lí" }, " và tin dùng được."],
      takeaway: ["Chứng minh cho ta sự chắc chắn tuyệt đối — và rèn ", { b: "tư duy lập luận có căn cứ" }, ", dùng được cả ngoài đời."] },

    { id: "defn", num: 1, title: "Định lí, giả thiết và kết luận", icon: "book", type: "text", variant: "definition", title2: "ĐỊNH NGHĨA",
      body: ["Định lí là một khẳng định được suy ra từ những khẳng định đúng đã biết, thường phát biểu dạng “Nếu … thì …”. Phần giữa “nếu” và “thì” là ", { hl: "giả thiết (GT)", color: C.amber }, "; phần sau “thì” là ", { hl: "kết luận (KL)", color: C.amber }, "."] },

    { id: "split", num: 2, title: "Tách giả thiết — kết luận", icon: "book", type: "reveal",
      prompt: "Bấm từng định lí để thấy đâu là giả thiết (GT), đâu là kết luận (KL):",
      figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh (cùng màu) bằng nhau" },
      cards: [
        { label: "Hai góc đối đỉnh", detail: ["“Nếu hai góc đối đỉnh thì chúng bằng nhau.” → GT: ", { hl: "hai góc đối đỉnh", color: C.teal }, " ; KL: ", { hl: "hai góc đó bằng nhau", color: C.teal }] },
        { label: "Vuông góc theo", detail: ["“Nếu d ⊥ d′ và d′ // d″ thì d ⊥ d″.” → GT: ", { hl: "d ⊥ d′, d′ // d″", color: C.teal }, " ; KL: ", { hl: "d ⊥ d″", color: C.teal }] },
        { label: "Cắt một thì cắt hai", detail: ["“Nếu a // b và c cắt a thì c cắt b.” → GT: ", { hl: "a // b, c cắt a", color: C.teal }, " ; KL: ", { hl: "c cắt b", color: C.teal }] },
      ] },

    { id: "what", num: 3, title: "Chứng minh định lí là gì?", icon: "book", type: "text", variant: "definition", title2: "GHI NHỚ",
      body: ["Chứng minh một định lí là ", { hl: "dùng lập luận", color: C.amber }, " để từ giả thiết và những khẳng định đúng đã biết, suy ra được kết luận."] },

    { id: "proof", num: 4, title: "Một chứng minh mẫu", icon: "book", type: "reveal",
      prompt: "Chứng minh “Hai góc đối đỉnh thì bằng nhau” (gọi các góc Ô₁, Ô₂, Ô₃). Bấm từng bước:",
      figure: { kind: "crossing", a: 50, caption: "Ô₁ đối đỉnh Ô₂; mỗi góc kề bù với Ô₃" },
      cards: [
        { label: "B1", detail: ["Ô₁ và Ô₃ kề bù nên Ô₁ + Ô₃ = 180°."] },
        { label: "B2", detail: ["Ô₂ và Ô₃ kề bù nên Ô₂ + Ô₃ = 180°."] },
        { label: "B3", detail: ["Từ đó Ô₁ + Ô₃ = Ô₂ + Ô₃, suy ra ", { hl: "Ô₁ = Ô₂", color: C.teal }, " (hai góc đối đỉnh bằng nhau)."] },
      ] },

    { id: "reallife", num: 5, title: "Lập luận chặt chẽ mỗi ngày", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🔍", label: "Suy luận", detail: ["Bác sĩ chẩn bệnh, thám tử phá án… đều đi từ ", { b: "giả thiết" }, " (triệu chứng, bằng chứng) đến ", { hl: "kết luận" }, " bằng lập luận — như chứng minh định lí."] },
      { emoji: "⚖️", label: "Toà án", detail: ["Luật sư phải “chứng minh” bằng chứng cứ và lí lẽ, không nói suông. Mỗi bước đều phải có ", { hl: "căn cứ" }, "."] },
      { emoji: "🧩", label: "Lập trình", detail: ["Máy tính chạy theo logic “nếu… thì…”. Một chương trình đúng cũng là chuỗi suy luận có căn cứ như một bài chứng minh."] },
    ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Trong định lí “Nếu hai góc đối đỉnh thì hai góc đó bằng nhau”, đâu là giả thiết?",
          figure: { kind: "crossing", a: 55, caption: "Hai góc đối đỉnh" },
          opts: ["hai góc đối đỉnh", "hai góc bằng nhau", "cả hai vế"], correct: 0,
          solution: "Phần giữa “nếu” và “thì” là giả thiết → “hai góc đối đỉnh”. Phần sau “thì” (“hai góc bằng nhau”) là kết luận." },
        { q: "Định lí là gì?", opts: ["Khẳng định suy ra từ các khẳng định đúng đã biết", "Một phép đo chính xác", "Một ví dụ minh hoạ"], correct: 0,
          solution: "Định lí là khẳng định được suy ra (chứng minh) từ những khẳng định đúng đã biết." },
        { q: "“Hai góc đối đỉnh thì bằng nhau” là đúng. Vậy “hai góc bằng nhau thì đối đỉnh” có đúng không?",
          figure: { kind: "crossing", a: 55, caption: "Đối đỉnh thì bằng nhau — nhưng điều ngược lại?" },
          opts: ["Không — có phản ví dụ", "Có, luôn đúng", "Chỉ đúng với góc nhọn"], correct: 0,
          solution: "Sai. Hai góc có thể bằng nhau mà không đối đỉnh (ví dụ hai góc của một tam giác đều). Mệnh đề đảo không đương nhiên đúng." },
        { q: "Cho góc xOy không bẹt. Khẳng định nào ĐÚNG?",
          opts: ["Nếu Ot là phân giác của xOy thì xOt = tOy", "Nếu xOt = tOy thì Ot chắc chắn là phân giác của xOy", "Cả hai đều đúng"], correct: 0,
          solution: "Chiều thuận đúng. Chiều đảo sai vì Ot có thể là tia đối của tia phân giác, khi đó vẫn có xOt = tOy nhưng Ot không nằm giữa hai cạnh." },
        { q: "Để chứng minh một định lí, ta dùng?", opts: ["Lập luận từ GT và điều đã biết", "Đo đạc nhiều lần", "Vẽ thật chính xác"], correct: 0,
          solution: "Chứng minh là dùng lập luận suy ra kết luận từ giả thiết và những điều đúng đã biết." },
      ] },
  ],
};
