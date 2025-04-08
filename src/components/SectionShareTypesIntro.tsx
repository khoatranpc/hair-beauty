import React, { useEffect } from "react";
import { Button, Card, Typography } from "antd";
import { motion } from "framer-motion";
import { ToolOutlined } from "@ant-design/icons";
import {
  mockCategoryProductAccessNews,
  mockCategoryShareType,
} from "@/utils/mock";
import { IObj } from "@/types/types";
import { useCrud } from "@/hooks/useCrud";
import { blogSlice } from "@/store/reducers/blog";
import { globalBlogsShareTypesIntro } from "@/global";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;
const SectionShareTypesIntro = () => {
  const router = useRouter();
  const blogs = useCrud(
    "blogs",
    {
      fetchData: blogSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "read":
            const getItemsTypes: IObj[] = [];
            const getItemsNews: IObj[] = [];
            (data?.data?.items as IObj[]).map((item) => {
              console.log(item.categories);
              if (
                item.categories.find(
                  (cate: IObj) => cate._id === mockCategoryShareType._id.$oid
                )
              ) {
                getItemsTypes.push(item);
              } else {
                getItemsNews.push(item);
              }
            });
            globalBlogsShareTypesIntro[mockCategoryShareType._id.$oid] =
              getItemsTypes;
            globalBlogsShareTypesIntro[mockCategoryProductAccessNews._id.$oid] =
              getItemsNews;
            break;
        }
      },
    }
  );

  useEffect(() => {
    blogs.fetch({
      params: {
        categories: [mockCategoryShareType._id.$oid],
      },
    });
  }, []);
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Title level={2} className="!text-3xl !font-bold mb-4">
            {mockCategoryShareType.name}
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            {mockCategoryShareType.description}
          </Paragraph>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(
            globalBlogsShareTypesIntro[mockCategoryShareType._id.$oid] ?? []
          ).map((tip: any) => (
            <motion.div
              key={tip._id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="h-full shadow-lg border-none overflow-hidden"
                cover={
                  <div className="relative h-56">
                    <img
                      alt={tip.title}
                      src={tip.thumbnail}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                }
              >
                <div className="p-6">
                  <Title level={4} className="!text-xl !font-bold mb-4">
                    {tip.title}
                  </Title>
                  <Paragraph className="text-gray-600 mb-4 line-clamp-2">
                    {tip.description}
                  </Paragraph>
                  <Button
                    type="primary"
                    className="bg-primary-600 hover:bg-primary-700 w-full flex items-center justify-center gap-2"
                    onClick={() => router.push(`/posts/${tip._id}`)}
                  >
                    <ToolOutlined />
                    Xem chi tiết
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

export default SectionShareTypesIntro;
