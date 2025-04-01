"use client";
import React from "react";
import { Button, Form, Input, message } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useCrud } from "@/hooks/useCrud";
import { shopSlice } from "@/store/reducers/shop";
import { IObj } from "@/types/types";
import parsePhoneNumber from "libphonenumber-js";

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const shop = useCrud("shop", {
    fetchData: shopSlice.fetchData,
  });
  const getShopInfor = shop.single?.data as IObj;
  const onFinish = (values: any) => {
    console.log("Received values:", values);
    message.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.");
    form.resetFields();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold text-center mb-8"
      >
        Liên hệ với chúng tôi
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h2>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={6} placeholder="Nhập nội dung tin nhắn" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Gửi tin nhắn
              </Button>
            </Form.Item>
          </Form>
        </motion.div>

        {/* Contact Information */}
        <div className="space-y-8">
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <EnvironmentOutlined className="text-2xl text-primary-600" />
                <div>
                  <h3 className="font-medium text-lg">Địa chỉ cửa hàng</h3>
                  <p className="text-gray-600">{getShopInfor?.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <PhoneOutlined className="text-2xl text-primary-600" />
                <div>
                  <h3 className="font-medium text-lg">Điện thoại</h3>
                  <p className="text-gray-600">
                    {getShopInfor?.phone
                      ? parsePhoneNumber(
                          getShopInfor?.phone as string,
                          "VN"
                        )?.formatInternational()
                      : ""}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    (Hotline: {getShopInfor?.businessHours?.open} -{" "}
                    {getShopInfor?.businessHours?.close} hàng ngày)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MailOutlined className="text-2xl text-primary-600" />
                <div>
                  <h3 className="font-medium text-lg">Email & Mạng xã hội</h3>
                  <p className="text-gray-600"> {getShopInfor?.email}</p>
                  <div className="flex space-x-4 mt-2">
                    <a
                      href="#"
                      className="text-gray-500 hover:text-primary-600"
                    >
                      <i className="fab fa-facebook text-xl"></i>
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-primary-600"
                    >
                      <i className="fab fa-instagram text-xl"></i>
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-primary-600"
                    >
                      <i className="fab fa-youtube text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-6">Vị trí cửa hàng</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789012!2d106.12345678901234!3d10.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDA3JzI0LjQiTiAxMDbCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                className="w-full h-full rounded-lg border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              <i className="fas fa-info-circle text-primary-600 mr-2"></i>
              Bãi đỗ xe miễn phí dành cho khách hàng tại tầng hầm
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
