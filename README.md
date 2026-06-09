# Học Toán 7 tương tác (Kết nối tri thức)

Website dạy Toán lớp 7 qua các bài học tương tác (số hữu tỉ, số thực, góc & đường thẳng song song, tam giác bằng nhau). Hình học có hình minh hoạ phản ứng theo câu trả lời.

Dự án dùng **React + Vite**. Toàn bộ nội dung bài học nằm trong `src/App.jsx`.

## Cấu trúc

```
index.html              # trang gốc Vite
vite.config.js          # cấu hình build (base: "./" để chạy trên GitHub Pages)
package.json            # phụ thuộc + lệnh build
src/App.jsx             # TOÀN BỘ bài học (engine + dữ liệu) — chỉnh ở đây
src/main.jsx            # điểm vào, mount App vào #root
.github/workflows/deploy.yml  # tự build & deploy lên GitHub Pages khi push
```

## Chạy thử ở máy

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # xuất thư mục dist/ (bản tĩnh)
npm run preview  # xem thử bản build
```

## Đưa lên GitHub + tự deploy (một lần)

1. Tạo repository mới trên GitHub (ví dụ `toan7`), để **Public**.
2. Trong thư mục này:

   ```bash
   git init
   git add .
   git commit -m "Website học Toán 7 tương tác"
   git branch -M main
   git remote add origin https://github.com/<TÊN-GITHUB>/toan7.git
   git push -u origin main
   ```

3. Trên GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Mỗi lần `git push`, workflow sẽ tự `npm ci` → `npm run build` → deploy.
   Trang chạy tại: `https://<TÊN-GITHUB>.github.io/toan7/`

## Cập nhật nội dung

Chỉ cần sửa `src/App.jsx` (thêm bài, sửa câu hỏi, thêm hình), commit & push — GitHub tự build lại.

## Lưu ý

Nút "Nhờ trợ lý nhận xét cách làm" gọi API của Claude, chỉ hoạt động trong môi trường Claude. Trên trang tĩnh nút này báo lỗi nhẹ, phần còn lại vẫn chạy bình thường.
