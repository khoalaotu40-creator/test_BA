# Cogo - Đi Chung An Toàn 🚗🎓

Nền tảng kết nối đi chung xe an toàn dành riêng cho sinh viên các trường Đại học & Cao đẳng, với quy trình xác thực sinh viên chính danh qua Mã số sinh viên (MSSV) và ảnh thẻ sinh viên.

---

## 🌟 Tính Năng Nổi Bật

- **Quy trình xác thực sinh viên chặt chẽ**:
  - Lựa chọn trường Đại học / Cao đẳng từ danh sách chuẩn hóa.
  - Nhập MSSV và xác minh thông tin sinh viên chính chủ.
  - Tải ảnh thẻ sinh viên hoặc chụp ảnh trực tiếp qua Webcam/Camera thiết bị.
- **Trải nghiệm xác thực & tài khoản chuẩn mẫu thiết kế**:
  - Giao diện đăng nhập số điện thoại với bộ lọc bảo mật.
  - Đăng ký tài khoản nhanh chóng, trực quan.
  - Huy hiệu sinh viên xác thực (*Verified Student Badge*) tăng độ tin cậy khi kết nối chuyến đi.
- **Đồng bộ hóa dữ liệu toàn diện (Full-Stack Sync)**:
  - API máy chủ `/api/sync` đồng bộ dữ liệu thời gian thực.
  - Sao lưu và phục hồi dữ liệu qua tệp JSON (Export / Import).
  - Tự động lưu trữ cục bộ khi mất kết nối mạng (Offline-first fallback).
- **Hai chế độ hiển thị linh hoạt**:
  - 📱 **Interactive View**: Mô phỏng trải nghiệm ứng dụng thực tế trên khung điện thoại thông minh.
  - 🖼️ **Mockup Overview**: Xem song song 3 màn hình mẫu (Đăng nhập, Đăng ký, Xác thực) để dễ dàng kiểm thử và đối chiếu thiết kế.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Motion](https://motion.dev/) (Animation mượt mà)
  - [Lucide React](https://lucide.dev/) (Bộ icon chuẩn)
  - [Vite 8](https://vite.dev/)
- **Backend & Server**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - Đóng gói [esbuild](https://esbuild.github.io/) cho bundle `dist/server.cjs`
- **CI/CD & DevOps**:
  - GitHub Actions Workflows (`frontend.yml`, `backend.yml`, `deploy.yml`)
  - Sẵn sàng triển khai tức thì trên [Render](https://render.com/) hoặc Cloud Run

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu hệ thống
- Node.js >= 20.0.0
- npm >= 9.0.0

### 2. Cài đặt các gói thư viện
```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ khởi chạy tại: `http://localhost:3000`

### 4. Kiểm tra TypeScript & Đóng gói sản phẩm (Build)
```bash
# Kiểm tra lỗi typecheck
npm run lint

# Đóng gói cả frontend SPA và backend server
npm run build

# Chạy server sản xuất đã đóng gói
npm start
```

---

## 🌐 Hướng Dẫn Triển Khai Lên Render (Web Service)

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/) và chọn **New +** -> **Web Service**.
2. Kết nối với kho lưu trữ GitHub chứa dự án này.
3. Điền các thông số cấu hình:
   - **Name**: `cogo-rideshare` (hoặc tên tùy chọn)
   - **Environment**: `Node`
   - **Branch**: `main` (hoặc `master`)
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
4. Nhấn **Create Web Service**. 
*(Hệ thống máy chủ đã được tích hợp tự động nhận diện biến môi trường `PORT` và `RENDER` của Render mà không cần thiết lập thủ công)*.

---

## 🔍 Môi Trường Xem Trước & Deploy Preview (Pull Request)

Dự án hỗ trợ tính năng **Deploy Preview tự động** khi mở hoặc cập nhật Pull Request trên GitHub:

- **Nút "View deployment" trực tiếp trên PR**: Khi workflow `deploy.yml` chạy thành công, GitHub Actions sẽ kích hoạt deployment environment `preview` kèm theo URL xem trước. Người đánh giá (reviewer) chỉ cần nhấn **"View deployment"** ngay trong khung trạng thái của Pull Request để mở bản demo.
- **Bình luận tự động (PR Preview Comment)**: GitHub Actions tự động đăng một bình luận kèm liên kết Live Preview, mã commit và trạng thái build.
- **Kích hoạt Render Pull Request Previews** (tùy chọn):
  1. Trên Render Dashboard, vào service của bạn -> chọn tab **Settings**.
  2. Bật tính năng **Pull Request Previews** (Render sẽ tự động tạo một phiên bản máy chủ tạm thời cho mỗi PR và tự hủy khi PR đóng lại).

---

## 🛠️ Công Cụ Kiểm Tra & Debug Triển Khai (Deployment Diagnostics)

Dự án cung cấp các phương thức kiểm tra toàn diện để xác thực việc triển khai trên Render / Cloud Server:

### 1. Nút "Kiểm tra Deploy" trực tiếp trên giao diện
Tại thanh công cụ phía trên ứng dụng, nhấn nút **"Kiểm tra Deploy"** (biểu tượng sóng xung điện tim) để mở bảng thông số tức thì:
- Môi trường chạy (`PRODUCTION` hay `DEVELOPMENT`).
- Nền tảng hosting (`Render Cloud Platform` hay `Container / Local`).
- Kiểm tra sự tồn tại và kích thước của các tệp bundle (`dist/index.html`, `dist/server.cjs`).
- Độ trễ ping thời gian thực, dung lượng RAM sử dụng và thời gian uptime.

### 2. Các Endpoint API kiểm tra máy chủ
- **`GET /api/health`**: Kiểm tra trạng thái sẵn sàng (health check) của máy chủ với thời gian phản hồi nhanh.
  ```json
  {
    "status": "ok",
    "service": "Cogo Rideshare API",
    "environment": "production",
    "uptimeSeconds": 142
  }
  ```
- **`GET /api/debug`**: Trả về toàn bộ thông số chi tiết hệ thống (Node version, OS, PID, RAM RSS/Heap, Port, biến môi trường, số lượng bản ghi sync).

### 3. Xem log kiểm tra khởi động trên Render Dashboard
Khi máy chủ khởi động thành công, trong tab **Logs** của Render sẽ xuất hiện thông báo:
```text
==================================================
🚀 Cogo Server is LIVE and listening on 0.0.0.0:10000
🔧 Mode:       PRODUCTION (serving static dist)
☁️ Platform:   Render Cloud Platform
📦 Node:       v22.x (linux x64)
🟢 Health:     http://0.0.0.0:10000/api/health
🔍 Diagnostics: http://0.0.0.0:10000/api/debug
==================================================
```

---

## 🔄 Cấu Trúc CI/CD Workflows

Dự án được trang bị sẵn các kịch bản kiểm thử và triển khai tự động trong thư mục `.github/workflows/` (và `workflow/`):

| Tệp Workflow | Mục Đích |
| :--- | :--- |
| **`frontend.yml`** | Kiểm tra cú pháp TypeScript và build kiểm thử giao diện React khi có commit frontend. |
| **`backend.yml`** | Typecheck và đóng gói bundle `dist/server.cjs` máy chủ Express bằng esbuild. |
| **`deploy.yml`** | Pipeline tự động build, kiểm tra dry-run, tạo Preview Environment trên Render và đăng khung thông tin URL trực tiếp vào Pull Request. |

### 🌐 Preview Environments & Khung Thông Tin Trên Pull Request (PR)
Dự án tích hợp tệp cấu hình **`render.yaml`** (Render Blueprint IaC) hỗ trợ tạo môi trường Ephemeral Preview:
- **Tự động sinh URL:** Mỗi PR sẽ tương ứng với URL dạng `https://cogo-rideshare-pr-<PR_NUMBER>.onrender.com`.
- **Khung thông tin xem trước trong PR:** Bot CI/CD tự động bình luận một khối **"KHUNG THÔNG TIN XEM TRƯỚC"** nổi bật ngay trong cuộc trò chuyện PR, kèm link bấm trực tiếp, link healthcheck `/api/health`, và link debug `/api/debug`.
- **Nút "View deployment":** Tự động liên kết với hệ thống GitHub Deployments để kích hoạt nút kiểm tra trực quan trên giao diện GitHub.
- **Tự động hủy:** Khi PR được gộp (merged) hoặc đóng (closed), Render tự động thu hồi môi trường sau 3 ngày để tối ưu chi phí.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
├── .github/workflows/       # GitHub Actions CI/CD workflows
│   ├── frontend.yml
│   ├── backend.yml
│   └── deploy.yml
├── public/                  # Tài nguyên tĩnh
├── src/
│   ├── components/          # Các components giao diện (Màn hình đăng nhập, xác thực thẻ,...)
│   ├── data/                # Dữ liệu mẫu danh sách trường học và chuyến đi
│   ├── services/            # Tầng dịch vụ đồng bộ máy chủ và local storage
│   ├── types.ts             # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx              # Điều phối luồng màn hình chính
│   ├── main.tsx             # Điểm gắn kết ứng dụng React
│   └── index.css            # Cấu hình Tailwind CSS v4
├── server.ts                # Máy chủ Express & API đồng bộ dữ liệu
├── vite.config.ts           # Cấu hình Vite
├── package.json             # Danh mục thư viện và scripts
└── README.md                # Tài liệu hướng dẫn dự án
```

---

## 📄 Bản Quyền & Giấy Phép

Dự án phát triển với mục tiêu đem lại giải pháp di chuyển an toàn, tiết kiệm và gắn kết cho cộng đồng sinh viên.

