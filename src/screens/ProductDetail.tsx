"use client";
import React from "react";
import { Button, Rate, Tabs, Image, Space, Divider, Carousel } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";

import ProductCard from "../components/ProductCard";
import { mockProducts } from "@/utils/mockProducts";

const { TabPane } = Tabs;

const ProductDetail = () => {
  const product = {
    id: 1,
    name: "Băng đô hoa văn cổ điển",
    price: 150000,
    images: [
      "/images/bang_do.png",
      "/images/kep_toc_caocap.jpeg",
      "/images/day_buoc_toc_lua.jpeg",
      "/images/bang_do.png",
      "/images/kep_toc_caocap.jpeg",
      "/images/day_buoc_toc_lua.jpeg",
      "/images/bang_do.png",
      "/images/kep_toc_caocap.jpeg",
      "/images/day_buoc_toc_lua.jpeg",
      "/images/bang_do.png",
      "/images/kep_toc_caocap.jpeg",
      "/images/day_buoc_toc_lua.jpeg",
    ],
    rating: 4.5,
    reviews: 120,
    description: `
      <p>Băng đô hoa văn cổ điển với thiết kế tinh tế, phù hợp cho mọi dịp.</p>
      <ul>
        <li>Chất liệu: Vải cao cấp</li>
        <li>Màu sắc: Đen, Trắng, Be</li>
        <li>Kích thước: One size</li>
        <li>Dễ dàng điều chỉnh</li>
      </ul>
    `,
    specifications: `
      <table>
        <tr><th>Chất liệu</th><td>Vải cao cấp</td></tr>
        <tr><th>Màu sắc</th><td>Đen, Trắng, Be</td></tr>
        <tr><th>Kích thước</th><td>One size</td></tr>
        <tr><th>Trọng lượng</th><td>50g</td></tr>
      </table>
    `,
    isNew: true,
    stock: 10,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Image.PreviewGroup>
            <div className="grid grid-cols-1 gap-4">
              <Image
                src={product.images[0]}
                alt={product.name}
                className="rounded-lg"
              />
              <Carousel
                arrows
                infinite={false}
                slidesToShow={5}
                draggable
                className="[&_.slick-track]:!flex [&_.slick-track]:gap-2"
              >
                {product.images.slice(1).map((img, index) => {
                  return (
                    <div className="mr-1">
                      <Image
                        preview={false}
                        key={index}
                        src={img}
                        alt={product.name}
                        className="rounded-lg mr-2"
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </Image.PreviewGroup>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.isNew && (
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
              Mới
            </span>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <Rate
              allowHalf
              defaultValue={product.rating}
              disabled
              className="text-primary-600"
            />
            <span className="text-gray-500">({product.reviews} đánh giá)</span>
          </div>
          <div className="text-3xl font-bold text-primary-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </div>

          <Divider />

          {/* Purchase Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="w-full"
              >
                Thêm vào giỏ hàng
              </Button>
              <Button size="large" icon={<HeartOutlined />} className="w-full hover:!text-white">
                Yêu thích
              </Button>
            </div>
            <div className="text-gray-500">
              Còn {product.stock} sản phẩm trong kho
            </div>
          </div>

          <Divider />

          {/* Product Tabs */}
          <Tabs defaultActiveKey="1" className="custom-tabs">
            <TabPane tab="Mô tả sản phẩm" key="1">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">
                  Chi tiết sản phẩm
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">
                    Hướng dẫn sử dụng
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Làm sạch tóc trước khi sử dụng</li>
                    <li>Điều chỉnh băng đô theo kích thước đầu</li>
                    <li>Cố định bằng các kẹp đi kèm</li>
                    <li>Tháo nhẹ nhàng sau khi sử dụng</li>
                  </ol>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Thông số kỹ thuật" key="2">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">
                  Thông số chi tiết
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <th className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                          Chất liệu
                        </th>
                        <td className="py-3 px-4 text-gray-600">Vải cao cấp</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <th className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                          Màu sắc
                        </th>
                        <td className="py-3 px-4 text-gray-600">
                          Đen, Trắng, Be
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <th className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                          Kích thước
                        </th>
                        <td className="py-3 px-4 text-gray-600">One size</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <th className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                          Trọng lượng
                        </th>
                        <td className="py-3 px-4 text-gray-600">50g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Thông tin bảo quản</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Giặt tay với nước lạnh</li>
                  <li>Không sử dụng chất tẩy rửa mạnh</li>
                  <li>Phơi khô tự nhiên, tránh ánh nắng trực tiếp</li>
                  <li>Bảo quản nơi khô ráo, thoáng mát</li>
                </ul>
              </div>
            </TabPane>

            <TabPane tab={`Đánh giá (${product.reviews})`} key="3">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    Đánh giá sản phẩm
                  </h2>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl font-bold">4.8</div>
                    <div>
                      <Rate
                        allowHalf
                        defaultValue={4.8}
                        disabled
                        className="text-primary-600"
                      />
                      <div className="text-gray-500 mt-1">120 đánh giá</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>5 sao</span>
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-primary-600 rounded-full"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <span>96</span>
                      </div>
                      {/* Repeat for other ratings */}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div
                      key={review}
                      className="bg-white p-6 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div>
                            <div className="font-medium">Nguyễn Văn A</div>
                            <Rate
                              allowHalf
                              defaultValue={5}
                              disabled
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div className="text-gray-500">2 ngày trước</div>
                      </div>
                      <div className="mt-4 text-gray-600">
                        Sản phẩm rất đẹp và chất lượng tốt. Tôi rất hài lòng với
                        sản phẩm này.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan (10 sản phẩm)</h2>
        <Carousel
          arrows
          infinite={false}
          slidesToShow={5}
          draggable
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {mockProducts.slice(5, 15).map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductDetail;
