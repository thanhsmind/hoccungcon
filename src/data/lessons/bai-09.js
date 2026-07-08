import { C } from "../../lib/colors.js";

export const BAI_9 = {
  meta: { chapter: "Chương III", lesson: "Bài 9", title: "Hai đường thẳng", highlight: "song song",
    intro: "Khi một đường thẳng cắt hai đường thẳng, nó tạo ra các cặp góc đặc biệt — và chúng cho ta dấu hiệu nhận biết song song." },
  stations: [
    { id: "trans", num: 0, title: "Đường thẳng cắt hai đường thẳng", icon: "activity", type: "geometry", mode: "transversal", start: 55,
      sliderLabel: "Kéo đổi đường cắt",
      prompt: "Đường thẳng c cắt hai đường thẳng a, b. Bấm nút để xem cặp góc so le trong / đồng vị, và kéo thanh trượt để thấy chúng luôn bằng nhau khi a song song b." },

    { id: "why", num: 1, title: "Tại sao cần khái niệm song song?", icon: "why", type: "why",
      question: "Tại sao cần khái niệm “song song”, và làm sao biết chắc hai đường có song song hay không?",
      hint: "Hai đường ray tàu hoả nếu lỡ cắt nhau thì điều gì xảy ra?",
      answer: ["Rất nhiều thứ cần ", { b: "luôn cách đều, không bao giờ cắt nhau" }, ": đường ray, dòng kẻ vở, hai mép bàn.", { br: 1 }, { br: 1 }, "Nhưng nhìn bằng mắt dễ nhầm. Toán cho ta ", { hl: "dấu hiệu chắc chắn" }, ": nếu một đường thứ ba cắt qua tạo ra ", { b: "cặp góc so le trong bằng nhau" }, " thì hai đường đó song song.", { br: 1 }, { br: 1 }, "Có dấu hiệu rồi thì kiểm tra được chính xác, khỏi cần đoán."],
      takeaway: ["Bài này cho ta cách ", { b: "chứng minh song song bằng góc" }, " thay vì nhìn áng chừng — nền tảng của mọi bản vẽ kĩ thuật."] },
    { id: "viTri", num: 2, title: "Góc so le trong, góc đồng vị", icon: "book", type: "reveal",
      prompt: "Bấm để xem vị trí của từng loại cặp góc:",
      cards: [
        { label: "So le trong", detail: ["Là cặp góc nằm ở ", { hl: "phần trong (giữa a và b)", color: C.teal }, " và ở hai phía khác nhau của đường cắt c."] },
        { label: "Đồng vị", detail: ["Là cặp góc ở ", { hl: "cùng một vị trí", color: C.teal }, " tại hai giao điểm (ví dụ: cùng phía trên–bên phải)."] },
        { label: "Trong cùng phía", detail: ["Là cặp góc nằm trong và cùng một phía của c; tổng của chúng bằng 180° khi a // b."] },
      ] },

    { id: "dauhieu", num: 3, title: "Dấu hiệu nhận biết", icon: "book", type: "text", variant: "definition", title2: "DẤU HIỆU",
      body: ["Nếu đường thẳng c cắt hai đường thẳng a, b và trong các góc tạo thành có ", { hl: "một cặp góc so le trong bằng nhau", color: C.amber }, " (hoặc ", { hl: "một cặp góc đồng vị bằng nhau", color: C.amber }, ") thì a song song với b."],
      figure: { kind: "parallel", a: 50, mark: "soletrong", caption: "Một cặp so le trong bằng nhau ⟹ a // b" } },

    { id: "practice", num: 4, title: "Luyện nhận biết", icon: "hash", type: "fillin", placeholder: "vd: 40",
      questions: [
        { ask: "Một cặp góc so le trong, một góc bằng 40°. Để a // b thì góc kia phải bằng bao nhiêu độ?", answer: 40, hint: "Để song song, hai góc so le trong phải bằng nhau → 40°.",
          figure: { kind: "parallel", a: 40, mark: "soletrong", la: "40°", lb: "?", ans: "40°", caption: "Hai góc so le trong" } },
        { ask: "a // b. Một góc đồng vị bằng 60°. Góc đồng vị tương ứng bằng bao nhiêu độ?", answer: 60, hint: "Khi a // b, hai góc đồng vị bằng nhau → 60°.",
          figure: { kind: "parallel", a: 60, mark: "dongvi", la: "60°", lb: "?", ans: "60°", caption: "a // b: hai góc đồng vị" } },
        { ask: "Hai góc so le trong đều bằng 50°. Khi đó góc trong cùng phía (kề một trong hai góc) bằng bao nhiêu độ?", answer: 130, hint: "Góc trong cùng phía kề bù với góc so le trong: 180° − 50° = 130°.",
          figure: { kind: "parallel", a: 50, mark: "trongcungphia", la: "?", lb: "50°", ans: "130°", caption: "Hai góc trong cùng phía bù nhau" } },
      ] },

    { id: "reallife", num: 5, title: "Song song quanh ta", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🛤️", label: "Đường ray", detail: ["Hai thanh ray xe lửa luôn ", { hl: "song song" }, ", cách đều nhau và không bao giờ cắt — nếu cắt thì tàu trật bánh!"] },
      { emoji: "📒", label: "Dòng kẻ vở", detail: ["Các dòng kẻ ngang trên trang vở là những đường thẳng song song giúp chữ viết thẳng hàng."] },
      { emoji: "🚧", label: "Vạch kẻ đường", detail: ["Hai vạch sơn của một làn xe song song nhau; ", { b: "góc so le trong bằng nhau" }, " là dấu hiệu nhận biết song song."] },
    ] },

    { id: "ex", num: 6, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Để hai đường thẳng a, b song song, một cặp góc so le trong phải như thế nào?",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "50°", caption: "Cặp góc so le trong" },
          opts: ["Bằng nhau", "Bù nhau", "Phụ nhau"], correct: 0,
          solution: "Dấu hiệu: một cặp góc so le trong bằng nhau thì a // b." },
        { q: "Đường c cắt a, b tạo một cặp góc đồng vị 40° và 40°. Hai đường a, b thế nào?",
          figure: { kind: "parallel", a: 40, mark: "dongvi", la: "40°", lb: "40°", caption: "Cặp góc đồng vị bằng nhau" },
          opts: ["Song song", "Cắt nhau", "Vuông góc"], correct: 0,
          solution: "Cặp góc đồng vị bằng nhau (40° = 40°) → a // b." },
        { q: "Hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì?",
          figure: { kind: "parallel", a: 90, mark: "dongvi", la: "90°", lb: "90°", caption: "Cùng vuông góc với c" },
          opts: ["Song song với nhau", "Cắt nhau", "Trùng nhau"], correct: 0,
          solution: "Cả hai cùng tạo góc 90° (đồng vị bằng nhau) với đường thứ ba nên chúng song song." },
        { q: "Biết góc MEF = 40° và EMN = 40° là hai góc so le trong. Khi đó?",
          figure: { kind: "parallel", a: 40, mark: "soletrong", la: "40°", lb: "40°", caption: "Hai góc so le trong bằng nhau" },
          opts: ["EF // NM", "EF cắt NM", "Không kết luận được"], correct: 0,
          solution: "Hai góc so le trong bằng nhau (40° = 40°) → EF // NM." },
        { q: "a // b, một góc so le trong bằng 65°. Góc trong cùng phía với nó bằng?",
          figure: { kind: "parallel", a: 65, mark: "trongcungphia", la: "?", lb: "65°", ans: "115°", caption: "Hai góc trong cùng phía bù nhau" },
          opts: ["115°", "65°", "25°"], correct: 0,
          solution: "Góc trong cùng phía kề bù với góc so le trong: 180° − 65° = 115°." },
      ] },
  ],
};
