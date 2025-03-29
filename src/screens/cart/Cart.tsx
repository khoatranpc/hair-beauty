"use client";
import React, { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Image,
  InputNumber,
} from "antd";
import { useForm, useFieldArray } from "react-hook-form";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { IObj } from "@/types/types";
import { useCrud } from "@/hooks/useCrud";
import { cartSlice } from "@/store/reducers/cart";
import { saveLocalStorage } from "@/utils";
import { LocalStorage } from "@/types/enum";

interface CartFormValues {
  items: IObj[];
}

const Cart = () => {
  const router = useRouter();
  const cart = useCrud("cart", {
    fetchData: cartSlice.fetchData,
  });
  const cartItems: IObj[] = (cart.single?.data?.items?.items as IObj[]) ?? [];

  const { control, watch, setValue, reset } = useForm<CartFormValues>({
    defaultValues: {
      items: cartItems.map((item) => {
        return {
          ...item,
          id: item._id,
          quantity: item.quantity,
          selected: false,
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const totals = watchItems.reduce(
    (acc, item) => {
      if (item.selected) {
        const price = item?.product?.price || 0;
        const salePrice = item?.product?.salePrice;
        const quantity = item.quantity || 1;

        acc.subtotal += price * quantity;
        acc.discount += salePrice ? (price - salePrice) * quantity : 0;
      }
      return acc;
    },
    { subtotal: 0, discount: 0 }
  );

  const handleSelectAll = (checked: boolean) => {
    setValue(
      "items",
      watchItems.map((item) => ({ ...item, selected: checked }))
    );
  };
  const handleSubmit = () => {
    const getListProductSelectedForOrder = watchItems.filter(
      (item) => item.selected
    );
    saveLocalStorage(
      LocalStorage.checkout_products,
      JSON.stringify(getListProductSelectedForOrder)
    );
    router.push("/checkout");
  };

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng trống"
        >
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => router.push("/products")}
          >
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </div>
    );
  }
  useEffect(() => {
    if (cart.single) {
      reset({
        items: cartItems.map((item) => {
          return {
            ...item,
            id: item._id,
            quantity: item.quantity,
            selected: false,
          };
        }),
      });
    }
  }, [cart.single]);
  return (
    <div className="container mx-auto px-4 py-8 min-h-[50vh]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-6 text-gray-800 border-b pb-4">
            <h2 className="text-2xl font-semibold">
              Giỏ hàng của bạn ({cartItems.length} sản phẩm)
            </h2>
            <Checkbox
              checked={watchItems.every((item) => item.selected)}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Chọn tất cả
            </Checkbox>
          </div>

          {fields.map((item: IObj, index) => {
            return (
              <Card
                key={item?._id}
                className="shadow-md hover:shadow-lg transition-shadow !mb-2"
              >
                <div className="flex gap-6">
                  <Checkbox
                    checked={watchItems[index]?.selected}
                    onChange={(e) => {
                      setValue(`items.${index}.selected`, e.target.checked);
                    }}
                    className="mt-8"
                  />
                  <div className="relative group">
                    <Image
                      src={item?.product?.images?.[0]}
                      alt={item?.product?.name}
                      className="!w-24 !h-24 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800 hover:text-primary-600 transition-colors cursor-pointer">
                          {item?.product?.name}
                        </h3>
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-50"
                        onClick={() => console.log("Remove item:", item.id)}
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="space-y-1.5">
                        {item.product.salePrice ? (
                          <>
                            <div className="text-xl font-semibold text-red-500">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.product.salePrice)}
                            </div>
                            <div className="text-sm text-gray-400 line-through">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.product.price)}
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-semibold text-primary-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </div>
                        )}
                      </div>
                      <InputNumber
                        min={1}
                        max={cartItems[index]?.product?.stock}
                        value={watchItems[index]?.quantity}
                        onChange={(value) =>
                          setValue(`items.${index}.quantity`, value || 1)
                        }
                        className="w-24"
                        controls
                        size="small"
                      />
                      <div className="text-xl font-semibold text-primary-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          (item.salePrice || item.price) * item.quantity
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card bordered={false} className="sticky top-[100px] shadow-md">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Tổng đơn hàng ({watchItems.filter((item) => item.selected).length}{" "}
              sản phẩm)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá:</span>
                <span className="font-medium text-red-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totals.discount)}
                </span>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between text-lg">
                <span className="font-medium text-gray-800">Tổng tiền:</span>
                <span className="font-semibold text-primary-600 text-xl">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totals.subtotal - totals.discount)}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                block
                className="h-12 text-base font-medium mt-4"
                disabled={!watchItems.some((item) => item.selected)}
                onClick={handleSubmit}
              >
                Tiến hành đặt hàng
              </Button>
              <Button
                block
                onClick={() => router.push("/products")}
                className="h-10 text-base"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
