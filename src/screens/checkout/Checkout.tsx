"use client";
import React, { useEffect } from "react";
import { Button, Card, Divider, Form, Input, Steps } from "antd";
import { useRouter } from "next/navigation";
import { IObj } from "@/types/types";
import { useCrud } from "@/hooks/useCrud";
import { cartSlice } from "@/store/reducers/cart";
import { getLocalStorage, removeLocalStorage } from "@/utils";
import { LocalStorage } from "@/types/enum";
import { orderSlice } from "@/store/reducers/order";
import { toast } from "react-toastify";

const Checkout = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const cart = useCrud("cart", {
    fetchData: cartSlice.fetchData,
  });
  const getCart = (cart.single?.data as IObj) ?? {};
  const order = useCrud(
    "orders",
    {
      fetchData: orderSlice.fetchData,
      createData: orderSlice.createData,
      clearDataState: orderSlice.slice.actions.clearData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            toast.success("Đặt hàng thành công");
            order.clearData();
            break;
          default:
            break;
        }
      },
    }
  );
  const getCheckoutProducts = (getLocalStorage(
    LocalStorage.checkout_products
  ) as string)
    ? JSON.parse(getLocalStorage(LocalStorage.checkout_products) as string)
    : [];
  const products = getCheckoutProducts?.map((_id: string) => {
    return (getCart.items?.items as IObj[])?.find((item: IObj) => {
      if (item.product._id === _id) {
        return item;
      }
    });
  });
  const selectedItems = products;
  const totals = selectedItems?.reduce(
    (acc: any, item: IObj) => {
      const price = item?.product?.price || 0;
      const salePrice = item?.product?.salePrice;
      const finalPrice = price;
      const quantity = item.quantity || 1;

      acc.subtotal += finalPrice * quantity;
      acc.discount += salePrice ? (price - salePrice) * quantity : 0;
      return acc;
    },
    { subtotal: 0, discount: 0 }
  );

  const onFinish = (values: any) => {
    order.create({
      productIds: getCheckoutProducts,
      shippingAddress: values,
    });
  };
  useEffect(() => {
    return () => {
      removeLocalStorage(LocalStorage.checkout_products);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Steps
        current={1}
        items={[
          { title: "Giỏ hàng" },
          { title: "Xác nhận đơn hàng" },
          { title: "Hoàn tất" },
        ]}
        className="!mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input.TextArea placeholder="Nhập địa chỉ giao hàng" rows={3} />
              </Form.Item>

              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                  rows={3}
                />
              </Form.Item>
            </Form>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
            <div className="space-y-4">
              {selectedItems?.map((item: IObj) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item?.product?.images?.[0]}
                    alt={item?.product?.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium">{item?.product?.name}</h3>
                    <p className="text-gray-500 text-sm">
                      Số lượng: {item.quantity}
                    </p>
                    <div className="text-primary-600 font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        (item?.product?.salePrice ||
                          item?.product?.price ||
                          0) * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card bordered={false} className="sticky top-[100px]">
            <h3 className="text-lg font-medium mb-4">Tổng đơn hàng</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totals?.subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá:</span>
                <span className="text-red-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totals?.discount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <Divider />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Tổng cộng:</span>
                <span className="font-semibold text-primary-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format((totals?.subtotal || 0) - (totals?.discount || 0))}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => form.submit()}
              >
                Đặt hàng
              </Button>
              <Button block onClick={() => router.back()}>
                Quay lại
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
