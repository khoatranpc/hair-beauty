import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";


export const metadata: Metadata = {
  title: "Hair Accessories Shop",
  description: "Shop phụ kiện tóc chất lượng cao",
  icons: "/images/logo.png",
};

import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import StoreProvider from "@/store/StoreProvider";
import "react-quill-new/dist/quill.snow.css";
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
              {children}
            </StoreProvider>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
