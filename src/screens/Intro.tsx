"use client";
import React, { useEffect } from "react";
import { Button, Card, Rate, Typography } from "antd";
import { motion } from "framer-motion";
import { StarOutlined, ToolOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { productSlice } from "@/store/reducers/product";
import { IObj } from "@/types/types";
import ProductCard from "@/components/ProductCard";
import ProductsLoading from "@/components/ProductsLoading";
import SectionShareTypesIntro from "@/components/SectionShareTypesIntro";
import SectionNewsIntro from "@/components/SectionNewsIntro";

const { Title, Paragraph } = Typography;

const Intro = () => {
  const products = useCrud("products", {
    fetchData: productSlice.fetchData,
  });
  const router = useRouter();
  const getProducts = (products.single?.data.items as IObj[]) ?? [];
  const feedbacks = [
    {
      id: 1,
      name: "Nguyễn Thị A",
      rating: 5,
      comment: "Sản phẩm rất đẹp và chất lượng!",
      avatar: "/images/avatar1.jpg",
      purchasedItem: "Kẹp tóc cao cấp",
      reviewDate: "15/07/2023",
    },
    {
      id: 2,
      name: "Trần Văn B",
      rating: 5,
      comment: "Dịch vụ tuyệt vời, giao hàng nhanh.",
      avatar: "/images/avatar2.jpg",
      purchasedItem: "Dây buộc tóc lụa",
      reviewDate: "20/07/2023",
    },
    {
      id: 3,
      name: "Lê Thị C",
      rating: 4,
      comment: "Sản phẩm đẹp, giá cả hợp lý.",
      avatar: "/images/avatar3.jpg",
      purchasedItem: "Băng đô thời trang",
      reviewDate: "25/07/2023",
    },
  ];

  useEffect(() => {
    products.fetch({
      page: 1,
      limit: 10,
    });
  }, []);
  return (
    <div className="space-y-20 py-12">
      {/* Store Info Section */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Title level={1} className="!text-4xl !font-bold">
                Hair Beauty - Phụ kiện tóc cao cấp
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Chuyên cung cấp các sản phẩm phụ kiện tóc chất lượng cao, với
                mẫu mã đa dạng và phong phú. Chúng tôi cam kết mang đến trải
                nghiệm mua sắm tốt nhất cho khách hàng.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                className="bg-primary-600"
                onClick={() => {
                  router.push("/products");
                }}
              >
                Khám phá ngay
              </Button>
            </div>
            <motion.div
              className="lg:w-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/images/banner.jpeg"
                alt="Store Banner"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Title level={2} className="text-center mb-12">
              Sản phẩm nổi bật
            </Title>
          </motion.div>
          {products.loading.fetch || !products.single ? (
            <ProductsLoading total={3} className="xl:!grid-cols-3" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(getProducts.slice(0, 3) as IObj[]).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <SectionShareTypesIntro />
      <SectionNewsIntro />
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <Title level={2} className="!text-3xl !font-bold mb-4">
              Khách hàng nói gì về chúng tôi
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những phản hồi chân thực từ khách hàng đã trải nghiệm sản phẩm của
              chúng tôi
            </Paragraph>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-lg h-full border-none">
                <div className="flex flex-col items-center text-center p-8">
                  <div className="relative mb-6">
                    <img
                      src={feedback.avatar}
                      alt={feedback.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Khách hàng
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">
                    {feedback.name}
                  </h4>
                  <Rate
                    disabled
                    defaultValue={feedback.rating}
                    className="mb-4"
                    character={<StarOutlined className="text-yellow-400" />}
                  />
                  <blockquote className="text-gray-600 mb-6 italic relative">
                    <span className="absolute -top-4 left-0 text-4xl text-gray-200">
                      "
                    </span>
                    {feedback.comment}
                  </blockquote>
                  <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                    <p>
                      Đã mua:{" "}
                      <span className="font-medium">
                        {feedback.purchasedItem}
                      </span>
                    </p>
                    <p>
                      Ngày đánh giá:{" "}
                      <span className="font-medium">{feedback.reviewDate}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-primary-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="!text-3xl !font-bold text-white mb-6">
            Sẵn sàng làm mới phong cách của bạn?
          </Title>
          <Paragraph className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Khám phá bộ sưu tập phụ kiện tóc đa dạng và tìm kiếm phong cách phù
            hợp với bạn
          </Paragraph>
          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              size="large"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => {
                router.push("/products");
              }}
            >
              Mua ngay
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => {
                router.push("/contact");
              }}
            >
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
