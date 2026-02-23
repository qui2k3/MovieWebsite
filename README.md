# 🎬 Movie Website

Dự án web xem phim trực tuyến được xây dựng bằng **ReactJS**, **TailwindCSS**, **Firebase**, **Facebook Plugin**  và **Vite**.  
Ứng dụng tích hợp nhiều tính năng hiện đại như đăng nhập bằng Facebook, gợi ý phim theo lịch sử người xem và bình luận trực tiếp qua plugin Facebook.

---

## 🚀 Tính năng nổi bật
- 🔍 **Tìm kiếm phim** theo tên.
- ⏳ **Loading Skeleton** để tăng trải nghiệm người dùng khi tải dữ liệu.
- 🔑 **Đăng nhập bằng Facebook** thông qua Firebase Authentication.
- 🎯 **Gợi ý phim** dựa trên lịch sử xem, sử dụng API Recommend (Flask, deploy trên Render).
- 💬 **Bình luận phim** bằng Facebook Plugin.
- 📱 **Responsive UI** với TailwindCSS.

---

## 🛠️ Công nghệ sử dụng
- **Frontend**: ReactJS + Vite + TailwindCSS
- **Authentication**: Firebase (Facebook Login)
- **API phim**: KKPhim API
- **Recommendation System**: Flask API (deploy trên Render)
- **Comment Plugin**: Facebook Comments Plugin

---


## 📦 Cài đặt và chạy dự án

# 1. Clone repo
```bash
 git clone [https://github.com/your-username/movie-web-app.git](https://github.com/qui2k3/MovieWebsite.git)
```
```bash
 cd movie-web-app
```
# 2. Cài đặt dependencies
```bash
 npm install
```
# 3. Tạo project trên Firebase
- Truy cập Firebase Console (console.firebase.google.com in Bing) và tạo một project mới.
- Vào phần Authentication → Sign-in method → bật Facebook.
- Lấy các thông tin cấu hình (API Key, Auth Domain, Project ID, App ID, v.v.) từ phần Project Settings → General → Your apps.
# 4. Cấu hình môi trường
- Tạo file .env trong thư mục gốc và thêm:
```bash
 VITE_FIREBASE_API_KEY=your_firebase_api_key
```
- Thay đổi Auth Domain, Project ID, App ID, v.v. trong file firebaseconfig.js cho phù hợp
# 5. Tích hợp Facebook Comment Plugin
- Truy cập Facebook for Developers và tạo một App ID.
- Thêm đoạn script SDK của Facebook vào file index.html
- Khi chạy ở localhost, sử dụng ngrok để tạo URL public do Plugin comment cần một URL công khai (ví dụ: https://example.com) để gắn comment vào đúng trang:
```bash
  ngrok http 5173
```
# 6. Chạy dự án
```bash
 npm run dev
```
