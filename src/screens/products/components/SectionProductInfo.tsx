"use client";
import React, { memo } from "react";
import { Button, Carousel, Divider, Image, Rate, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { IObj } from "@/types/types";
import { useForm } from "react-hook-form";
import { InputNumber } from "antd";
import { useCrud } from "@/hooks/useCrud";
import { cartSlice } from "@/store/reducers/cart";
import { toast } from "react-toastify";
import { CartActionType } from "@/types/enum";

interface Props {
  product?: IObj;
}
interface CartForm {
  quantity: number;
}

const SectionProductInfo = ({ product }: Props) => {
  const currentUser = useCrud("userProfile", {});
  const { register, handleSubmit, watch, setValue } = useForm<CartForm>({
    defaultValues: {
      quantity: 1,
    },
  });
  const cart = useCrud(
    "cart",
    {
      createData: cartSlice.createData,
      fetchData: cartSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
            cart.fetch();
            break;

          default:
            break;
        }
      },
    }
  );
  const onSubmit = (data: CartForm) => {
    if (currentUser.error.fetch) {
      toast.warning("Bạn cần đăng nhập trước!");
    } else {
      cart.create({
        productId: product?._id,
        quantity: data.quantity,
        action: CartActionType.ADD,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Image.PreviewGroup>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src={product?.images?.[0]}
              alt={product?.name}
              className="rounded-lg"
            />
            <Carousel
              arrows
              infinite={false}
              slidesToShow={5}
              draggable
              className="[&_.slick-track]:!flex [&_.slick-track]:gap-2"
            >
              {(product?.images as string[])?.slice(1).map((img, index) => {
                return (
                  <div className="mr-1">
                    <Image
                      preview={false}
                      key={index}
                      src={img}
                      alt={product?.name}
                      className="rounded-lg mr-2"
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
        </Image.PreviewGroup>
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product?.name}</h1>
        <div className="flex items-center space-x-4">
          <Rate
            allowHalf
            defaultValue={product?.rating}
            disabled
            className="text-primary-600"
          />
          <span className="text-gray-500">({product?.reviews} đánh giá)</span>
        </div>
        <div className="space-y-2">
          {product?.salePrice ? (
            <>
              <div className="text-3xl font-bold text-red-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.salePrice)}
              </div>
              <div className="text-xl text-gray-400 line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </div>
              <div className="inline-block bg-red-100 text-red-500 text-sm px-2 py-1 rounded">
                Giảm{" "}
                {Math.round(
                  ((product.price - product.salePrice) / product.price) * 100
                )}
                %
              </div>
            </>
          ) : (
            <div className="text-3xl font-bold text-primary-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product?.price)}
            </div>
          )}
        </div>

        <Divider />

        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Số lượng:</span>
              <InputNumber
                min={1}
                max={product?.stock}
                value={watch("quantity")}
                onChange={(value) => setValue("quantity", value || 1)}
                className="w-24"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="w-full"
                htmlType="submit"
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="large"
                icon={<HeartOutlined />}
                className="w-full hover:!text-white"
              >
                Yêu thích
              </Button>
            </div>
          </form>
          <div className="text-gray-500">
            Còn {Number(product?.stock).toLocaleString()} sản phẩm trong kho
          </div>
        </div>

        <Divider />

        <Tabs defaultActiveKey="1" className="custom-tabs">
          <TabPane tab="Mô tả sản phẩm" key="1">
            {product?.description}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default memo(SectionProductInfo, (prevProps, nextProps) => {
  if (nextProps.product?._id) return false;
  return true;
});
