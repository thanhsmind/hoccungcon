import { C } from "../../lib/colors.js";

export const BAI_10 = {
  meta: { chapter: "Chương III", lesson: "Bài 10", title: "Tiên đề Euclid &", highlight: "đường thẳng song song",
    intro: "Qua một điểm ngoài đường thẳng chỉ có duy nhất một đường song song — và từ đó suy ra các tính chất về góc." },
  stations: [
    { id: "trans", num: 0, title: "Khi a // b thì các góc bằng nhau", icon: "activity", type: "geometry", mode: "transversal", start: 50,
      sliderLabel: "Kéo đổi đường cắt",
      prompt: "Hai đường a, b song song bị đường c cắt. Bấm nút và kéo thanh trượt để xác nhận: các góc so le trong bằng nhau, các góc đồng vị cũng bằng nhau." },

    { id: "why", num: 1, title: "Tại sao có điều được thừa nhận?", icon: "why", type: "why",
      question: "Toán cái gì cũng đòi chứng minh. Vậy tại sao lại có một điều được phép “thừa nhận luôn mà không chứng minh”?",
      hint: "Muốn xây nhà phải có nền móng. Vậy điều đầu tiên trong hình học dựa vào đâu?",
      answer: ["Không thể chứng minh mọi thứ từ con số 0 — phải có vài điều ", { b: "hiển nhiên, ai cũng đồng ý" }, " để làm điểm xuất phát. Đó gọi là ", { hl: "tiên đề" }, ".", { br: 1 }, { br: 1 }, "Tiên đề Euclid nói: qua một điểm nằm ngoài một đường thẳng, ", { b: "chỉ kẻ được đúng một đường" }, " song song với đường đó.", { br: 1 }, { br: 1 }, "Từ tiên đề này suy ra hàng loạt tính chất về góc và đường song song."],
      takeaway: ["Tiên đề là ", { b: "viên gạch nền" }, " của hình học: thừa nhận vài điều hiển nhiên để xây nên mọi điều còn lại."] },
    { id: "axiom", num: 2, title: "Tiên đề Euclid", icon: "book", type: "text", variant: "definition", title2: "TIÊN ĐỀ",
      body: ["Qua một điểm ở ngoài một đường thẳng, ", { hl: "chỉ có một đường thẳng song song", color: C.amber }, " với đường thẳng đó. (Đường thẳng song song đi qua điểm đó là duy nhất.)"],
      figure: { kind: "euclid", caption: "Qua M chỉ kẻ được một đường thẳng song song với a" } },

    { id: "property", num: 3, title: "Tính chất hai đường thẳng song song", icon: "book", type: "text", variant: "definition", title2: "TÍNH CHẤT",
      body: ["Nếu một đường thẳng cắt hai đường thẳng ", { hl: "song song", color: C.amber }, " thì: hai góc so le trong bằng nhau; hai góc đồng vị bằng nhau (và hai góc trong cùng phía bù nhau).", { br: 1 }, { br: 1 }, { b: "Để ý chiều ngược với Bài 9:" }, " ở Bài 9 ta thấy ", { hl: "góc bằng nhau ⟹ kết luận song song", color: C.violet }, " (dấu hiệu). Ở đây ta đã biết ", { hl: "song song rồi ⟹ suy ra góc bằng nhau", color: C.violet }, " (tính chất). Cùng một hình, nhưng dùng theo hai chiều khác nhau."],
      figure: { kind: "parallel", a: 55, mark: "soletrong", caption: "a // b: hai góc so le trong bằng nhau" } },

    { id: "hequa", num: 4, title: "Vài hệ quả thường dùng", icon: "book", type: "reveal",
      prompt: "Bấm để xem các hệ quả suy ra từ tiên đề Euclid:",
      cards: [
        { label: "Cắt một thì cắt cả hai", detail: ["Một đường thẳng cắt một trong hai đường thẳng song song thì ", { hl: "cũng cắt đường thẳng còn lại", color: C.teal }, "."] },
        { label: "Vuông góc theo", detail: ["Một đường thẳng vuông góc với một trong hai đường thẳng song song thì ", { hl: "cũng vuông góc với đường kia", color: C.teal }, "."] },
        { label: "Cùng song song", detail: ["Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì ", { hl: "song song với nhau", color: C.teal }, "."] },
      ] },

    { id: "practice", num: 5, title: "Luyện tính góc khi a // b", icon: "hash", type: "fillin", placeholder: "vd: 50",
      questions: [
        { ask: "a // b, một góc so le trong bằng 50°. Góc so le trong kia bằng bao nhiêu độ?", answer: 50, hint: "a // b nên hai góc so le trong bằng nhau → 50°.",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "?", ans: "50°", caption: "a // b: hai góc so le trong bằng nhau" } },
        { ask: "xy // x'y', một góc đồng vị bằng 50°. Góc đồng vị tương ứng bằng bao nhiêu độ?", answer: 50, hint: "Hai góc đồng vị bằng nhau khi hai đường song song → 50°.",
          figure: { kind: "parallel", a: 50, mark: "dongvi", la: "50°", lb: "?", ans: "50°", caption: "xy // x'y': hai góc đồng vị bằng nhau" } },
        { ask: "a // b, một góc trong cùng phía bằng 70°. Góc trong cùng phía còn lại bằng bao nhiêu độ?", answer: 110, hint: "Hai góc trong cùng phía bù nhau: 180° − 70° = 110°.",
          figure: { kind: "parallel", a: 70, mark: "trongcungphia", la: "?", lb: "70°", ans: "110°", caption: "Hai góc trong cùng phía bù nhau (= 180°)" } },
      ] },

    { id: "reallife", num: 6, title: "Một đường song song duy nhất", icon: "globe", type: "reallife",
    cards: [
      { emoji: "🗺️", label: "Quy hoạch", detail: ["Vẽ con đường mới song song với đường cũ: qua một điểm chỉ kẻ được ", { hl: "đúng một đường" }, " song song — đó là tiên đề Euclid."] },
      { emoji: "🏗️", label: "Xây nhà", detail: ["Hai tầng nhà có sàn song song; thợ dùng tính chất ", { b: "góc đồng vị bằng nhau" }, " để kiểm tra sàn có thật sự song song."] },
      { emoji: "🪟", label: "Khung cửa", detail: ["Các thanh ngang của khung cửa song song; nhờ tiên đề Euclid mà mỗi thanh chỉ có một vị trí song song chuẩn."] },
    ] },

    { id: "ex", num: 7, title: "Bài tập tổng hợp", icon: "trophy", type: "quiz",
      questions: [
        { q: "Qua một điểm ngoài một đường thẳng, có bao nhiêu đường thẳng song song với nó?",
          figure: { kind: "euclid", caption: "Tiên đề Euclid" },
          opts: ["Đúng một đường", "Hai đường", "Vô số đường"], correct: 0,
          solution: "Theo tiên đề Euclid: chỉ có duy nhất một đường thẳng song song." },
        { q: "a // b. Một đường thẳng c cắt a. Khi đó c và b thế nào?",
          figure: { kind: "parallel", a: 55, mark: "dongvi", la: "", lb: "", caption: "c cắt a, với a // b" },
          opts: ["c cũng cắt b", "c song song b", "Không xác định"], correct: 0,
          solution: "Hệ quả của tiên đề Euclid: cắt một trong hai đường song song thì cũng cắt đường kia." },
        { q: "a // b, một góc so le trong bằng 50°. Góc so le trong kia bằng?",
          figure: { kind: "parallel", a: 50, mark: "soletrong", la: "50°", lb: "?", ans: "50°", caption: "a // b" },
          opts: ["50°", "130°", "40°"], correct: 0,
          solution: "Một đường cắt hai đường song song → hai góc so le trong bằng nhau = 50°." },
        { q: "a // b, một góc đồng vị bằng 60°. Góc đồng vị tương ứng bằng?",
          figure: { kind: "parallel", a: 60, mark: "dongvi", la: "60°", lb: "?", ans: "60°", caption: "a // b" },
          opts: ["60°", "120°", "30°"], correct: 0,
          solution: "Hai góc đồng vị bằng nhau khi a // b → 60°." },
        { q: "Một đường thẳng vuông góc với một trong hai đường thẳng song song thì với đường còn lại?",
          figure: { kind: "parallel", a: 90, mark: "dongvi", la: "90°", lb: "?", ans: "90°", caption: "Vuông góc với a, mà a // b" },
          opts: ["Cũng vuông góc", "Song song", "Tạo góc 45°"], correct: 0,
          solution: "Hệ quả: vuông góc với một đường thì cũng vuông góc với đường song song kia." },
      ] },
  ],
};
