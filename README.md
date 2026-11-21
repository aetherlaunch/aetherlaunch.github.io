# AetherLaunch – trang giới thiệu (GitHub Pages)

React + Vite, giao diện Liquid Glass (blur, kính mờ, nền aurora), tự đổi sáng/tối theo giờ máy người truy cập.

## Theme tự động

- 06:00–17:59 giờ địa phương của người truy cập: **sáng**. Còn lại: **tối**.
- Trang tự kiểm tra lại mỗi 30 giây và khi quay lại tab, nên sang 18:00 là đổi ngay.
- Nút trên thanh điều hướng đổi vòng: Tự động → Sáng → Tối → Tự động (lưu trong `localStorage`).
- Đổi mốc giờ trong `src/config.js` (`DAY_START`, `NIGHT_START`).

## Chỉnh nội dung

- Link repo, tải về, tác giả: `src/config.js`
- Nội dung các mục: `src/App.jsx`
- Màu, blur, hiệu ứng: `src/styles.css` (biến ở đầu file)

## Chạy thử

```
npm install
npm run dev
```

## Đưa lên GitHub Pages

1. Tạo repo (ví dụ `aetherlaunch` hoặc `aoh20119.github.io`), đẩy mã nguồn này lên nhánh `main`.
2. Vào **Settings → Pages → Build and deployment → Source** chọn **GitHub Actions**.
3. Mỗi lần push, workflow `.github/workflows/deploy.yml` tự build và deploy.

`vite.config.js` dùng `base: './'` nên chạy được cả ở `https://<user>.github.io/<repo>/` lẫn domain riêng.
