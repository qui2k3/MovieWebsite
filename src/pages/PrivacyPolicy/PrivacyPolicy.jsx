import React from "react";

const PrivacyPolicy = () => {
  return (
    <div
      style={{
        padding: "50px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#333",
        lineHeight: "1.6",
      }}
    >
      <h1>Chính sách Quyền riêng tư - ProjectMovieWeb</h1>
      <p>Ngày cập nhật: 21 tháng 03, 2026</p>

      <h3>1. Thông tin chúng tôi thu thập</h3>
      <p>
        Khi bạn đăng nhập bằng Facebook, chúng tôi thu thập các thông tin công
        khai từ hồ sơ của bạn bao gồm: Tên hiển thị, địa chỉ Email và ảnh đại
        diện.
      </p>

      <h3>2. Mục đích sử dụng</h3>
      <p>
        Thông tin này được sử dụng để định danh tài khoản, lưu trữ lịch sử xem
        phim và cung cấp các gợi ý phim phù hợp với sở thích của bạn thông qua
        hệ thống AI của chúng tôi.
      </p>

      <h3>3. Bảo mật dữ liệu</h3>
      <p>
        Chúng tôi cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của
        bạn cho bất kỳ bên thứ ba nào. Dữ liệu được lưu trữ an toàn trên nền
        tảng Firebase của Google.
      </p>

      <h3>4. Quyền xóa dữ liệu</h3>
      <p>
        Nếu bạn muốn xóa tài khoản và toàn bộ dữ liệu lịch sử xem phim, vui lòng
        liên hệ với chúng tôi qua email:{" "}
        <strong>trinhnguyennhutqui@gmail.com</strong>.
      </p>

      <footer
        style={{
          marginTop: "30px",
          borderTop: "1px solid #ccc",
          paddingTop: "10px",
        }}
      >
        <p>© 2026 ProjectMovieWeb. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
