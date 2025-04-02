"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Card,
  Row,
  Col,
  Tag,
  Empty,
  Skeleton,
  Pagination,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useCrud } from "@/hooks/useCrud";
import { blogSlice } from "@/store/reducers/blog";
import { IBlog } from "@/types/types";
import Link from "next/link";
import dayjs from "dayjs";
import SelectCategories from "@/components/SelectCategories";
import { TypeOfCategory } from "@/types/enum";

const ListPost = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  const blogs = useCrud("blogs", {
    fetchData: blogSlice.fetchData,
  });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    blogs.fetch({ search: value, category: filters.category });
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
    blogs.fetch({ search: filters.search, category: value });
  };
  useEffect(() => {
    blogs.fetch();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Bài viết mới nhất</h1>
        <div className="filter flex flex-col gap-4">
          <div className="flex gap-4">
            <Input.Search
              placeholder="Tìm kiếm bài viết"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              className="max-w-md [&_.ant-input-affix-wrapper]:!rounded-sm"
            />

            <SelectCategories
              type={TypeOfCategory.blog}
              // onChange={handleCategoryChange}
              // value={filters.category}
              placeholder="Chọn danh mục"
              allowClear
            />
          </div>
          <Pagination className="self-end"/>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {blogs.loading.fetch ? (
          Array(6)
            .fill(null)
            .map((_, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))
        ) : blogs.single?.data?.items?.length ? (
          (blogs.single?.data?.items ?? []).map((post: IBlog) => (
            <Col key={post._id} xs={24} sm={12} lg={8}>
              <Link href={`/posts/${post.slug}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={post.title}
                      src={post.thumbnail}
                      className="h-48 w-full object-cover"
                    />
                  }
                  className="h-full"
                >
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {post.categories.map((category: any) => (
                        <Tag key={category._id} color="blue">
                          {category.name}
                        </Tag>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.author?.name}</span>
                      <span>{dayjs(post.createdAt).format("DD/MM/YYYY")}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty
              description="Không tìm thấy bài viết nào"
              className="py-12"
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ListPost;
