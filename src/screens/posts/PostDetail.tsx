import React from "react";
import dayjs from "dayjs";
import { Card, Tag, Skeleton, Avatar, Divider } from "antd";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCrud } from "@/hooks/useCrud";
import { blogSlice } from "@/store/reducers/blog";
import { IBlog } from "@/types/types";

import {
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const PostDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const blogs = useCrud("blogs", {
    fetchData: blogSlice.fetchData,
  });

  React.useEffect(() => {
    if (id) {
      blogs.fetch({ slugOrId: id });
    }
  }, [id]);

  const post = (blogs.single?.data as IBlog) ?? {};

  if (blogs.loading.fetch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {post?.categories?.map((category: any) => (
                <Link
                  href={`/posts?category=${category._id}`}
                  key={category._id}
                >
                  <Tag color="blue" className="cursor-pointer">
                    {category.name}
                  </Tag>
                </Link>
              ))}
            </div>

            <h1 className="text-3xl font-bold">{post?.title}</h1>

            <p className="text-lg text-gray-600">{post?.description}</p>

            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>{post?.author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined />
                <span>{dayjs(post?.createdAt).format("DD/MM/YYYY")}</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOutlined />
                <span>{post?.viewCount || 0} lượt xem</span>
              </div>
            </div>
          </div>

          {post?.thumbnail && (
            <div className="mb-8">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
          />

          {post.tags?.length && (
            <div className="mt-8">
              <Divider />
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag: string) => (
                  <Tag key={tag}>#{tag}</Tag>
                ))}
              </div>
            </div>
          )}

          {post?.author && (
            <div className="mt-8">
              <Divider />
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  src={post.author.avatar}
                  icon={<UserOutlined />}
                />
                <div>
                  <h3 className="text-lg font-semibold">{post.author.name}</h3>
                  <p className="text-gray-500">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
