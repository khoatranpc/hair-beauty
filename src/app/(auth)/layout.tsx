"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { userProfileSlice } from "@/store/reducers/user";
import { LocalStorage } from "@/types/enum";
import { getLocalStorage, removeLocalStorage } from "@/utils";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomerLayout from "@/layouts/CustomerLayout";
import { cartSlice } from "@/store/reducers/cart";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const cart = useCrud("cart", {
    fetchData: cartSlice.fetchData,
  });
  const userProfile = useCrud(
    "userProfile",
    {
      fetchData: userProfileSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "read":
            cart.fetch();
            break;
          default:
            break;
        }
      },
    }
  );
  const getAccessToken = getLocalStorage(LocalStorage.access_token);
  useEffect(() => {
    if (getAccessToken) {
      userProfile.fetch();
    }
  }, []);
  if (getAccessToken && !userProfile.single && !userProfile.fetched.fetch)
    return <Loading3QuartersOutlined className="animate-spin" />;
  if (userProfile.error.fetch || !getAccessToken) {
    removeLocalStorage(LocalStorage.access_token);
    return <CustomerLayout>{children}</CustomerLayout>;
  }
  return redirect("/account");
};

export default Layout;
