"use client";
import React from "react";
import { Button } from "antd";
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";

const NotFoundScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-primary-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Oops! Trang bạn tìm kiếm có vẻ không tồn tại hoặc chúng tôi vẫn đang xây dựng!
        </h2>
        <p className="text-gray-600 mb-8">
          Có vẻ như bạn đã lạc đường trong thế giới phụ kiện tóc của chúng tôi.
          Đừng lo lắng, hãy để chúng tôi đưa bạn trở lại với những sản phẩm tuyệt
          vời!
        </p>
        <Link href="/">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Về trang chủ
          </Button>
        </Link>
        <div className="mt-12">
          <img
            src="/images/logo.png"
            alt="Hair Accessories"
            className="w-64 md:w-80 mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
