"use client";
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default layout;
