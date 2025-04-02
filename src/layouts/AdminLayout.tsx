"use client";
import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, theme, Avatar, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  DatabaseOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import Link from "next/link";
import { removeLocalStorage } from "@/utils";
import { LocalStorage } from "@/types/enum";
import { useCrud } from "@/hooks/useCrud";
import { shopSlice } from "@/store/reducers/shop";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const shop = useCrud("shop", {
    fetchData: shopSlice.fetchData,
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href={"/dashboard"}>Tổng quan</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: "Sản phẩm",
      children: [
        {
          key: "/products/list",
          label: <Link href={"/products/list"}>Danh sách</Link>,
        },
        {
          key: "/products/categories",
          label: <Link href={"/products/categories"}>Danh mục</Link>,
        },
      ],
    },
    {
      key: "/orders/list",
      icon: <ShopOutlined />,
      label: <Link href={"/orders/list"}>Đơn hàng</Link>,
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: "Khách hàng",
    },
    {
      key: "/blogs",
      icon: <FileWordOutlined />,
      label: "Bài viết",
      children: [
        {
          key: "/blogs/list",
          label: <Link href={"/blogs/list"}>Danh sách</Link>,
        },
        {
          key: "/blogs/categories",
          label: <Link href={"/blogs/categories"}>Danh mục</Link>,
        },
      ],
    },
    // {
    //   key: "/admin/promotions",
    //   icon: <TagOutlined />,
    //   label: "Khuyến mãi",
    //   children: [
    //     {
    //       key: "/admin/promotions/vouchers",
    //       label: "Mã giảm giá",
    //     },
    //     {
    //       key: "/admin/promotions/combos",
    //       label: "Combo sản phẩm",
    //     },
    //   ],
    // },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      children: [
        {
          key: "/settings/shop",
          label: <Link href={"/settings/shop"}>Cửa hàng</Link>,
          icon: <DatabaseOutlined />,
        },
      ],
    },
  ];

  const userMenuItems: ItemType[] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick() {
        removeLocalStorage(LocalStorage.access_token);
        router.replace("/");
      },
    },
  ];
  useEffect(() => {
    if (!shop.single?.data && !shop.fetched.fetch) {
      shop.fetch();
    }
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="p-4 flex justify-center">
          <img
            src="/images/logo.png"
            alt="Hair Beauty Logo"
            className="h-20 object-contain"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname || ""]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between items-center px-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <div className="flex items-center gap-4">
              <Button type="text" icon={<BellOutlined />} className="text-xl" />
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar icon={<UserOutlined />} />
                  <span className="hidden md:inline">Admin Name</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
