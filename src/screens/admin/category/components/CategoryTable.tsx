import React from "react";
import { Table, Tag, Button, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IObj } from "@/types/types";
import type { ColumnsType } from "antd/es/table";
import { getTypeOfCategoryString } from "@/utils";
import { TypeOfCategory } from "@/types/enum";

interface CategoryTableProps {
  data: IObj[];
  loading: boolean;
  total: number;
  onEdit: (record: IObj) => void;
  onDelete: (id: string) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  loading,
  total,
  onEdit,
  onPaginationChange,
}) => {
  const columns: ColumnsType = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Loại danh mục",
      dataIndex: "type",
      key: "type",
      render(type) {
        return getTypeOfCategoryString[type as TypeOfCategory];
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      className: "text-center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey="_id"
      dataSource={data}
      loading={loading}
      pagination={{
        total: total,
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} danh mục`,
        onChange: onPaginationChange,
      }}
    />
  );
};

export default React.memo(CategoryTable, (prevProps, nextProps) => {
  if (
    prevProps.data !== nextProps.data ||
    prevProps.loading !== nextProps.loading ||
    prevProps.total !== nextProps.total
  ) {
    return false;
  }
  return true;
});
