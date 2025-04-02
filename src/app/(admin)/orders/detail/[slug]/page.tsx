import React from "react";
import dynamic from "next/dynamic";

const OrderDetail = dynamic(() => import("@/screens/admin/order/OrderDetail"));

const page = () => {
  return <OrderDetail />;
};

export default page;
