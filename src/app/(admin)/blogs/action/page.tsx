"use client";
import React, { useContext } from "react";
import { Breadcrumb } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import BlogForm from "@/screens/admin/blogs/BlogForm";
import { FileWordOutlined } from "@ant-design/icons";
import { BlogsManagmantContext } from "@/screens/admin/blogs/BlogsContextProvider";
import useUrlQueryParams from "@/hooks/useUrlQueryParams";

const page = () => {
  const searchParams = useSearchParams();
  const getAction = searchParams.get("action") ?? "create";
  const router = useRouter();
  const { filters } = useContext(BlogsManagmantContext);
  const queriesParams = useUrlQueryParams();
  return (
    <div>
      <Breadcrumb
        className="p-6 !mb-4"
        items={[
          {
            key: "blogs",
            title: (
              <span>
                <FileWordOutlined /> Danh sách bài viết
              </span>
            ),
            className: "cursor-pointer hover:text-black",
            onClick() {
              router.push(
                `/blogs/list?${queriesParams.creatQueryParams(filters, [
                  "action",
                  "id",
                ])}`
              );
            },
          },
          {
            key: "action",
            title:
              getAction === "create" ? "Thêm bài viết" : "Cập nhật bài viết",
          },
        ]}
      />
      <BlogForm action={getAction as "edit" as "create"} />
    </div>
  );
};

export default page;
