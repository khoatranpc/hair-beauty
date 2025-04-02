import React from "react";
import BlogsContextProvider from "@/screens/admin/blogs/BlogsContextProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <BlogsContextProvider>{children}</BlogsContextProvider>;
};

export default layout;
