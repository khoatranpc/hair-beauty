"use client";
import React, { useState } from "react";
import { Layout, Menu, Badge, Input } from "antd";
import Link from "next/link";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";

const { Header, Content, Footer } = Layout;

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname();


  const navItems = [
    {
      key: "home",
      label: "Trang chủ",
      href: "/",
    },
    {
      key: "products",
      label: "Sản phẩm",
      href: "/products",
    },
    {
      key: "new",
      label: "Hàng mới về",
      href: "/new-arrivals",
    },
    {
      key: "sale",
      label: "Khuyến mãi",
      href: "/sale",
    },
    {
      key: "posts",
      label: "Bài viết",
      href: "/posts",
    },
    {
      key: "acbout-us",
      label: "Về cửa hàng",
      href: "/about-us",
    },
    {
      key: "contact",
      label: "Liên hệ",
      href: "/contact",
    },
  ];
  const getNavItemClass = (href: string) => {
    const isActive = pathname === href;
    return `text-gray-700 hover:text-primary-600 transition-colors text-sm lg:text-base font-medium p-2 rounded-sm ${
      isActive ? "!text-primary-600 font-semibold !bg-[var(--primary-soft)]" : ""
    }`;
  };

  const navMenu = (
    <Menu>
      {navItems.map((item) => (
        <Menu.Item key={item.key}>
          <Link href={item.href} className="text-gray-700">
            {item.label}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <Header className="!bg-white border-b border-gray-100 flex flex-col fixed w-full z-10 !p-0 !h-auto">
        {/* Top bar */}
        <div className="border-b-[0.5px] border-b-(--primary) py-2 px-4 text-center text-sm">
          Miễn phí vận chuyển cho đơn hàng từ 500k 🎀
        </div>

        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center flex-1 gap-4 lg:gap-12">
            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              onClick={() => setMenuVisible(true)}
              className="!flex md:!hidden"
            />
            <Drawer
              placement="left"
              onClose={() => setMenuVisible(false)}
              open={menuVisible}
              className="md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 transition-colors text-base font-medium py-2"
                    onClick={() => setMenuVisible(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </Drawer>
            <div>
              <Link
                href="/"
                className="text-xl lg:text-2xl font-bold flex items-center"
              >
                <Image
                  src={"/images/logo.png"}
                  alt="HairBeauty"
                  width={80}
                  height={80}
                />
                <span className="text-primary-600">Hair</span>
                <span className="text-gray-800">Beauty</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {navItems.slice(0, 2).map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={getNavItemClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
              <Dropdown overlay={navMenu} placement="bottomRight">
                <Button
                  type="text"
                  className="text-gray-700 hover:text-primary-600 !px-2"
                >
                  Thêm <i className="fas fa-chevron-down text-xs ml-1"></i>
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:block">
              <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-[150px] lg:w-[250px] rounded-full border-gray-200 hover:border-primary-400 focus:border-primary-500"
              />
            </div>

            <Link
              href="/cart"
              className="text-gray-700 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-full relative"
            >
              <Badge count={0} size="small" className="custom-badge">
                <ShoppingCartOutlined className="text-lg lg:text-xl" />
              </Badge>
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 hover:bg-primary-50 rounded-full"
            >
              <UserOutlined className="text-lg lg:text-xl" />
              <span className="hidden md:inline font-medium">Tài khoản</span>
            </Link>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content className="pt-20 md:pt-24 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto py-4 md:py-8">{children}</div>
      </Content>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 md:py-12">
            {/* About Us */}
            <div className="mb-6 sm:mb-0">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                Về chúng tôi
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Chuyên cung cấp các phụ kiện tóc chất lượng cao với mẫu mã đa
                dạng. Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách
                hàng.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                Liên kết nhanh
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm md:text-base">
                <li>
                  <Link
                    href="/about-us"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Về cửa hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sale"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Khuyến mãi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                Thông tin liên hệ
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <i className="fas fa-map-marker-alt text-primary-500 mt-1"></i>
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-phone text-primary-500 mt-1"></i>
                  <span>(+84) 123 456 789</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-envelope text-primary-500 mt-1"></i>
                  <span>info@hairbeauty.com</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                Kết nối với chúng tôi
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <i className="fab fa-tiktok text-xl"></i>
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Đăng ký nhận tin</h4>
                <div className="flex">
                  <Input
                    placeholder="Nhập email của bạn"
                    className="rounded-l-full border-gray-700 bg-gray-800 text-white"
                  />
                  <Button
                    type="primary"
                    className="rounded-r-full !bg-primary-500 hover:!bg-primary-600"
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 py-4 md:py-6 text-center text-sm md:text-base text-gray-400">
            © 2024 Hair Beauty. All rights reserved.
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;
