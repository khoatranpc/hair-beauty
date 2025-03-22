"use client";
import React from "react";
import { Card, Rate, Button } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
export type Product = {
  id: number;
  name: string;
  price: number; // in VND
  image: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  category: string;
  createdAt: string;
};
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card
      classNames={{
        body: "!p-1",
      }}
      hoverable
      className="border-none shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
      cover={
        <div className="relative h-38 sm:h-56 md:h-64 group">
          <img
            alt={product.name}
            src={product.image}
            className="w-full h-full object-cover"
          />
          {product.isNew && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs">
              Mới
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<HeartOutlined className="text-xs sm:text-sm" />}
                className="shadow-lg"
              />
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<ShoppingCartOutlined className="text-xs sm:text-sm" />}
                className="shadow-lg"
              />
            </div>
          </div>
        </div>
      }
    >
      <div
        className="flex flex-col flex-grow p-1 space-y-2 sm:space-y-3"
        onClick={() => {
          router.push(`/products/${product.id}`);
        }}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors cursor-pointer line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm sm:text-md font-bold text-[var(--primary)]">
            {formatPrice(product.price)}
          </div>
          <Rate
            disabled
            defaultValue={product.rating}
            className="text-xs sm:text-sm !hidden md:!inline-block"
            character={<span className="text-yellow-400">★</span>}
          />
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          ({product.reviews} đánh giá)
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
