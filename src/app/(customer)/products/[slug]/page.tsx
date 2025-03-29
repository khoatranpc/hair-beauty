import dynamic from "next/dynamic";
import React from "react";
const ProductDetail = dynamic(() => import("@/screens/products/ProductDetail"));

const page = () => {
  return <ProductDetail />;
};

export default page;
