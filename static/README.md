# Học Toán 7 tương tác (Kết nối tri thức)

Trang web tĩnh dạy Toán lớp 7 qua các bài học tương tác: số hữu tỉ, số thực, góc & đường thẳng song song, tam giác bằng nhau. Hình học có hình minh hoạ phản ứng theo câu trả lời.

Trang đã được **đóng gói sẵn** (`index.html` + `app.js`) — không cần build, chỉ cần đưa lên hosting tĩnh bất kỳ.

## Cách đưa lên GitHub + tự deploy (một lần)

1. Tạo một repository mới trên GitHub (ví dụ tên `toan7`), để **Public**.
2. Trong thư mục này, chạy:

   ```bash
   git init
   git add .
   git commit -m "Trang học Toán 7 tương tác"
   git branch -M main
   git remote add origin https://github.com/<TÊN-GITHUB>/toan7.git
   git push -u origin main
   ```

3. Trên GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Mỗi lần `git push`, workflow trong `.github/workflows/deploy.yml` sẽ tự build & deploy.
   Trang sẽ chạy tại: `https://<TÊN-GITHUB>.github.io/toan7/`

## Cập nhật nội dung sau này

File `app.js` được dựng từ mã nguồn `khung-bai-giang.jsx` (file React gốc bạn đang chỉnh trong Claude).
Khi có bản `.jsx` mới, dựng lại `app.js` bằng:

```bash
npm install react@18 react-dom@18 lucide-react@0.383.0 esbuild@0.23.0
# tạo src/main.jsx import App từ khung-bai-giang.jsx rồi:
npx esbuild src/main.jsx --bundle --minify --loader:.jsx=jsx \
  --define:process.env.NODE_ENV='"production"' --outfile=app.js
```

rồi commit & push lại.

## Lưu ý

Nút "Nhờ trợ lý nhận xét cách làm" gọi API của Claude chỉ hoạt động trong môi trường Claude; trên trang tĩnh nút này sẽ báo lỗi nhẹ và phần còn lại vẫn chạy bình thường.
