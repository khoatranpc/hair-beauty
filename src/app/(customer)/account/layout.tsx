"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { userProfileSlice } from "@/store/reducers/user";
import { LocalStorage } from "@/types/enum";
import { getLocalStorage, removeLocalStorage } from "@/utils";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const userProfile = useCrud("userProfile", {
    fetchData: userProfileSlice.fetchData,
  });
  const getAccessToken = getLocalStorage(LocalStorage.access_token);
  if (!getAccessToken) return redirect("/login");
  useEffect(() => {
    if (getAccessToken) {
      userProfile.fetch();
    }
  }, []);
  if (getAccessToken && !userProfile.single)
    return <Loading3QuartersOutlined className="animate-spin" />;
  if (userProfile.error.fetch) {
    removeLocalStorage(LocalStorage.access_token);
    return redirect("/login");
  }
  return children;
};

export default Layout;
