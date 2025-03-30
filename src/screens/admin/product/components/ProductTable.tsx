"use client";
import React from "react";
import { Table, Tag, Button, Space, Tooltip, Image } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { IObj } from "@/types/types";

interface ProductTableProps {
  data: IObj[];
  loading: boolean;
  total: number;
  onDelete: (id: string) => void;
  onEdit?: (record: IObj) => void;
  onView?: (record: IObj) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  loading,
  total,
  onDelete,
  onPaginationChange,
}) => {
  const router = useRouter();
  const columns: ColumnsType = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "image",
      width: 100,
      render: (image) => (
        <Image
          src={image[0]}
          alt="product"
          width={50}
          height={50}
          className="object-cover rounded"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      render(value) {
        return (
          <div>
            {(value as IObj[]).map((item, idx) => {
              return (
                <Link href={item._id}>
                  {item.name} {idx < value.length - 1 ? "| " : ""}
                </Link>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (status) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              className="flex items-center"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                router.push(`/products/list/${record.slug}`);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data}
      rowKey="_id"
      pagination={{
        total: total,
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} sản phẩm`,
        onChange: onPaginationChange,
      }}
    />
  );
};

export default React.memo(ProductTable, (prevProps, nextProps) => {
  if (
    prevProps.data !== nextProps.data ||
    prevProps.total !== nextProps.total ||
    prevProps.loading !== nextProps.loading
  ) {
    return false;
  }
  return true;
});
