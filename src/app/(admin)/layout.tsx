"use client";
import dynamic from "next/dynamic";
import React from "react";
const AdminLayout = dynamic(() => import("@/layouts/AdminLayout"));

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default layout;
