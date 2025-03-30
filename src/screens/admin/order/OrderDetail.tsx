"use client";
import React, { useEffect } from "react";
import {
  Card,
  Descriptions,
  Steps,
  Tag,
  Timeline,
  Button,
  Divider,
  Breadcrumb,
} from "antd";
import { toast } from "react-toastify";
import { ShopOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { orderSlice } from "@/store/reducers/order";
import { LocalStorage, OrderStatus } from "@/types/enum";
import { getLocalStorage, orderStatusString } from "@/utils";
import { mapStatusToColor } from "@/screens/orders/Orders";

export const OrderDetail = () => {
  const { slug } = useParams();
  const router = useRouter();
  const orders = useCrud(
    "orders",
    {
      fetchData: orderSlice.fetchData,
      updateData: orderSlice.updateData,
    },
    {
      onSuccess(_, type) {
        switch (type) {
          case "update":
            toast.success("Cập nhật trạng thái đơn hàng thành công");
            break;
          default:
            break;
        }
      },
      onError(error, type) {
        switch (type) {
          case "update":
            toast.error(
              error?.message || "Cập nhật trạng thái đơn hàng thất bại"
            );
            break;
          default:
            break;
        }
      },
    }
  );

  const orderData = orders.single?.data ?? {};

  const currentStep = orderData?.status
    ? Object.values(OrderStatus).indexOf(orderData.status)
    : 0;
  const getBackurl = (
    getLocalStorage(LocalStorage.callBackUrl) as string
  ).includes("/orders/list")
    ? (getLocalStorage(LocalStorage.callBackUrl) as string)
    : "/orders/list";
  useEffect(() => {
    if (slug) {
      orders.fetch({ slugOrId: slug });
    }
  }, [slug]);
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        className="!mb-4"
        items={[
          {
            key: "orders",
            title: (
              <span>
                <ShopOutlined /> Đơn hàng
              </span>
            ),
            onClick() {
              router.push(getBackurl);
            },
            className: "cursor-pointer",
          },
          {
            key: "detail",
            title: <span>#{orderData?.orderCode}</span>,
          },
        ]}
      />
      <Card
        title="Chi tiết đơn hàng"
        extra={
          <Tag color={mapStatusToColor(orderData?.status as OrderStatus)}>
            {orderStatusString[orderData?.status as OrderStatus]}
          </Tag>
        }
      >
        <Steps
          current={currentStep}
          items={[
            { title: "Đặt hàng" },
            { title: "Xác nhận" },
            { title: "Đang giao" },
            { title: "Hoàn thành" },
          ]}
        />

        <Divider />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Descriptions title="Thông tin người đặt" column={1}>
            <Descriptions.Item label="Họ tên">
              {orderData?.user?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {orderData?.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {orderData?.user?.phone}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Thông tin người nhận" column={1}>
            <Descriptions.Item label="Họ tên">
              {orderData?.shippingAddress?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {orderData?.shippingAddress?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ nhận hàng">
              {orderData?.shippingAddress?.address}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Thông tin đơn hàng" column={1}>
            <Descriptions.Item label="Mã đơn hàng">
              #{orderData?.orderCode}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {new Date(orderData?.createdAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {orderData?.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {orderData?.note || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      <Card title="Sản phẩm" className="!my-4">
        <div className="space-y-4">
          {orderData?.items?.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={item.product?.images?.[0]}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                <div className="text-primary-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderData?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <Divider />
            <div className="flex justify-between text-lg font-medium">
              <span>Tổng cộng:</span>
              <span className="text-primary-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderData?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Cập nhật trạng thái"
        className="!mb-4"
        loading={orders.loading.update}
      >
        <div className="space-x-4">
          {Object.values(OrderStatus).map((status) => (
            <Button
              key={status}
              type={orderData?.status === status ? "primary" : "default"}
              disabled={orderData?.status === status}
              onClick={() => {
                orders.update(orderData?._id, { status });
              }}
            >
              {orderStatusString[status]}
            </Button>
          ))}
        </div>
      </Card>

      <Card title="Lịch sử đơn hàng">
        <Timeline
          items={[
            {
              color: "green",
              children: `Đặt hàng - ${new Date(
                orderData?.createdAt
              ).toLocaleString("vi-VN")}`,
            },
            // Add more timeline items based on order history
          ]}
        />
      </Card>
    </div>
  );
};
