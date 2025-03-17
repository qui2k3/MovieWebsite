import React, { useEffect, useState } from "react";

const Footer = () => {
  return (
    <footer className="text-xs md:text-2xl grid grid-cols-2 md:grid-cols-3 bg-[#010810] text-white gap-x-10 text-center  pt-36">
      <div className=" flex flex-col gap-5 justify-start items-center mx-auto">
        <h2 className="text-center  text-shadow text-lg md:text-4xl">MọtPhim</h2>
        <img
        className="max-w-full h-auto"
          src="../../footer-ChungNhan_dathongbao.png"
          alt="ảnh chứng nhận đã thông báo bộ công thương"
        ></img>
        <img
        className="max-w-full h-auto"
          src="../../footer-ChungNhan_duocbaove.png"
          alt="ảnh chứng nhận được bảo vệ"
        ></img>
      </div>
      <div className=" flex flex-col  justify-start items-center">
        <p>Quy định</p>
        <p>Điều khoản sử dụng</p>
        <p>Chính sách và Quy định chung</p>
        <p>Chính sách về Quyền riêng tư</p>
        <p>Chính sách về Sở hữu trí tuệ</p>
        <p>Qui định</p>
      </div>
      <div className=" flex flex-col  justify-start items-center ">
        <p>Trợ Giúp</p>
        <p>FAQs</p>
        <p>Liên hệ</p>
        <p>Góp ý</p>
      </div>
      <div className="col-span-2 md:col-span-3  border-t-2 border-black p-5">
        <p>Công ty cổ phần phát triển VT Mobie</p>
        <p>
          Email: trinhnguyennhutqui@gmail.com | Hotline: 0375867539 (miễn phí)
        </p>
        <p>
          Giấy phép Cung cấp Dịch vụ Phát Thanh, Truyền hình trả tiền số
          192/GP-BTTTT cấp ngày 21/03/2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
