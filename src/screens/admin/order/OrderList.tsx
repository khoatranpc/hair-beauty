"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Button, Card, Table, Tag, Tooltip } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { orderSlice } from "@/store/reducers/order";
import { ColumnsType } from "antd/es/table";
import OrderFilter from "./components/OrderFilter";
import { IObj } from "@/types/types";
import { orderStatusString, saveLocalStorage } from "@/utils";
import { LocalStorage, OrderStatus } from "@/types/enum";
import { mapStatusToColor } from "@/screens/orders/Orders";

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  const orders = useCrud("orders", {
    fetchData: orderSlice.fetchData,
  });
  const getListOrder = ((orders.single?.data as IObj)?.items as IObj[]) ?? [];
  const searchParams = useSearchParams();
  const initialFilters = {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 10,
    orderCode: searchParams.get("orderCode") || "",
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
    dateRange: searchParams.get("dateRange") || [],
  };
  const [filters, setFilters] = useState<IObj>(initialFilters);

  const columns: ColumnsType = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 160,
      render: (orderCode: string) => {
        return <span>#{orderCode}</span>;
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user: any) => (
        <div>
          <div>{user?.fullName}</div>
          <div className="text-gray-500 text-sm">{user?.phone}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "items",
      render: (items: any[]) => (
        <div className="space-y-2">
          {items?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={item.product?.images?.[0]}
                alt={item.product?.name}
                className="w-10 h-10 object-cover rounded"
              />
              <Tooltip title={item.product?.name}>
                <div className="flex-1 truncate max-w-[200px]">
                  <div className="font-medium truncate">
                    {item.product?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                    {" x "}
                    {item.quantity}
                  </div>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "items",
      key: "quantity",
      width: 200,
      render: (items: any[]) => {
        const totalQuantity = items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return <span>{totalQuantity} sản phẩm</span>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (total: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(total),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => (
        <Tag color={mapStatusToColor(status as OrderStatus)}>
          {orderStatusString[status as OrderStatus]}
        </Tag>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => {
            router.push(`/orders/detail/${record._id}`);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  useEffect(() => {
    orders.fetch({
      params: filters,
    });
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.set(key, filters[key]);
      }
    });
    const mapUrl = `/orders/list?${params.toString()}`;
    saveLocalStorage(LocalStorage.callBackUrl, mapUrl);
    router.push(mapUrl);
  }, [filters]);

  return (
    <div className="p-6">
      <OrderFilter
        filters={filters}
        onFilter={(filters) => {
          setFilters(filters);
        }}
      />
      <Card title="Danh sách đơn hàng" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={getListOrder}
          loading={orders.loading.fetch}
          rowKey="_id"
          scroll={{ x: 1300 }}
          pagination={{
            total: orders.single?.total,
            pageSize: filters.limit,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            onChange(page, pageSize) {
              setFilters({
                ...filters,
                page,
                limit: pageSize,
              });
            },
          }}
        />
      </Card>

      {/* ... Rest of the drawer code remains the same ... */}
    </div>
  );
};

export default OrderList;
