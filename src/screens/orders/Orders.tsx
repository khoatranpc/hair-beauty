"use client";
import React, { useEffect } from "react";
import { Badge, Card, Divider, Empty, Steps, Tabs, Tag, Timeline } from "antd";
import { useCrud } from "@/hooks/useCrud";
import { orderSlice } from "@/store/reducers/order";
import { OrderStatus } from "@/types/enum";
import { orderStatusString } from "@/utils";
import { IObj } from "@/types/types";

export const mapStatusToColor = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "processing";
    case "confirmed":
      return "warning";
    case "shipping":
      return "processing";
    case "cancelled":
      return "error";
    case "delivered":
      return "success";
    default:
      return "default";
  }
};
const Orders = () => {
  const orders = useCrud("orders", {
    fetchData: orderSlice.fetchData,
  });
  const getOrdersData = (orders.single?.data as IObj)?.items as IObj[];

  useEffect(() => {
    orders.fetch();
  }, []);
  if (!getOrdersData?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          description="Bạn chưa có đơn hàng nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs
        defaultActiveKey="all"
        items={[
          { key: "all", label: "Tất cả đơn hàng" },
          { key: "pending", label: "Chờ xác nhận" },
          { key: "confirmed", label: "Đã xác nhận" },
          { key: "shipping", label: "Đang giao hàng" },
          { key: "completed", label: "Đã giao hàng" },
          { key: "cancelled", label: "Đã hủy" },
        ]}
      />

      <div className="space-y-6 mt-6">
        {getOrdersData?.map((order: any) => {
          return (
            <Card key={order._id} className="shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-gray-500 mb-1">
                    Mã đơn hàng: #{order.orderCode}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <Tag color={mapStatusToColor(order.status)}>
                  {orderStatusString[order.status as OrderStatus]}
                </Tag>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Số lượng: {item.quantity}
                      </p>
                      <div className="text-primary-600 font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider />

              <div className="flex justify-between items-center">
                <div className="text-gray-500">
                  {order.items.length} sản phẩm
                </div>
                <div>
                  <span className="text-gray-500 mr-2">Tổng tiền:</span>
                  <span className="text-xl font-semibold text-primary-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Steps
                  progressDot
                  current={
                    order.status === "cancelled"
                      ? -1
                      : [
                          "pending",
                          "confirmed",
                          "shipping",
                          "completed",
                        ].indexOf(order.status)
                  }
                  items={[
                    { title: "Đặt hàng" },
                    { title: "Xác nhận" },
                    { title: "Vận chuyển" },
                    { title: "Hoàn thành" },
                  ]}
                  className="max-w-2xl mx-auto"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
