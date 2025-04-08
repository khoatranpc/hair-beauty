import React from "react";
import { Button, Card, Typography } from "antd";
import { motion } from "framer-motion";
import { globalBlogsShareTypesIntro } from "@/global";
import { mockCategoryShareType } from "@/utils/mock";
import { IObj } from "@/types/types";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

const SectionNewsIntro = () => {
  const blogPosts =
    (globalBlogsShareTypesIntro[mockCategoryShareType._id.$oid] as IObj[]) ??
    ([] as IObj[]);
  const router = useRouter();
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Title level={2} className="!text-3xl !font-bold mb-4">
            Tin tức & Mẹo làm đẹp
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những xu hướng làm đẹp mới nhất và các mẹo chăm sóc tóc
          </Paragraph>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="h-full shadow-md"
                cover={
                  <img
                    alt={post.title}
                    src={post.thumbnail}
                    className="h-48 w-full object-cover"
                  />
                }
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Button
                    type="link"
                    className="p-0"
                    onClick={() => router.push(`/posts/${post._id}`)}
                  >
                    Đọc thêm
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionNewsIntro;
