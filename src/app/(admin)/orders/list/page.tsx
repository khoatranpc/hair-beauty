import dynamic from "next/dynamic";
import React from "react";
const OrderList = dynamic(() => import("@/screens/admin/order/OrderList"));

const page = () => {
  return <OrderList />;
};

export default page;
