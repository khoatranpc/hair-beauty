import React from "react";
import CategoryList from "@/screens/admin/category/CategoryList";
import { TypeOfCategory } from "@/types/enum";

const page = () => {
  return <CategoryList type={TypeOfCategory.blog} />;
};

export default page;
