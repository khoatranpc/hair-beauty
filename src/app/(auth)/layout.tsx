"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { userProfileSlice } from "@/store/reducers/user";
import { LocalStorage } from "@/types/enum";
import { getLocalStorage } from "@/utils";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const userProfile = useCrud("userProfile", {
    fetchData: userProfileSlice.fetchData,
  });
  const getAccessToken = getLocalStorage(LocalStorage.access_token);
  useEffect(() => {
    if (getAccessToken) {
      userProfile.fetch();
    }
  }, []);
  if (getAccessToken && !userProfile.single)
    return <Loading3QuartersOutlined className="animate-spin" />;
  if (userProfile.error.fetch) return children;
  return redirect("/account");
};

export default Layout;
