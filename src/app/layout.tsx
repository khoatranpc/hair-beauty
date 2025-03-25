import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AntdRegistry } from "@ant-design/nextjs-registry";
const CustomerLayout = dynamic(() => import("@/layouts/CustomerLayout"), {
  loading() {
    return <p>Loading....</p>;
  },
});

export const metadata: Metadata = {
  title: "Hair Accessories Shop",
  description: "Shop phụ kiện tóc chất lượng cao",
  icons: "/images/logo.png",
};

import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import StoreProvider from "@/store/StoreProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ConfigProvider theme={theme}>
          <AntdRegistry>
            <StoreProvider>
              <CustomerLayout>{children}</CustomerLayout>
            </StoreProvider>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
