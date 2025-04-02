"use client";
import React, { useContext, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Avatar,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ColumnType } from "antd/es/table";
import { useCrud } from "@/hooks/useCrud";
import { blogSlice } from "@/store/reducers/blog";
import { BlogsManagmantContext } from "./BlogsContextProvider";
import { IBlog, IObj } from "@/types/types";

interface IFilterProps {
  filters: IObj;
  setFilters: React.Dispatch<React.SetStateAction<IObj>>;
}
const FilterFunction = (props: IFilterProps) => {
  const router = useRouter();
  return (
    <div className="flex justify-between mb-4">
      <Input
        placeholder="Tìm kiếm bài viết"
        prefix={<SearchOutlined />}
        className="max-w-xs"
        allowClear
        // onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => router.push("/blogs/action?action=create")}
      >
        Thêm bài viết
      </Button>
    </div>
  );
};
const BlogsTable = ({ filters }: { filters: IObj }) => {
  const router = useRouter();
  const columns: ColumnType[] = [
    {
      title: "Bài viết",
      key: "post",
      width: 400,
      render: (record: IBlog) => (
        <div className="flex gap-3">
          <img
            src={record?.thumbnail || "/placeholder-image.jpg"}
            alt={record?.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex flex-col">
            <Tooltip title={record?.title}>
              <h3 className="font-medium text-base line-clamp-1">
                {record?.title}
              </h3>
            </Tooltip>
            <p className="text-gray-500 text-sm line-clamp-2">
              {record?.description}
            </p>
            <div className="flex gap-2 mt-1">
              {record.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      width: 150,
      render: (categories: any[]) => (
        <Space wrap>
          {categories.map((category) => (
            <Tag color="blue" key={category?._id || category}>
              {category?.name || category}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      render: (views: number) => (
        <Tag color="cyan">{views.toLocaleString()}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (record: IBlog) => (
        <Space>
          <Tag color={record?.isPublished ? "success" : "warning"}>
            {record?.isPublished ? "Đã xuất bản" : "Bản nháp"}
          </Tag>
          {record?.publishedAt && (
            <Tooltip
              title={dayjs(record?.publishedAt).format("DD/MM/YYYY HH:mm")}
            >
              <ClockCircleOutlined className="text-gray-400" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Tác giả",
      width: 150,
      render: (record: IBlog) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar src={record?.author?.avatar ?? ""} />
            <span>{record?.author?.fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      fixed: "right",
      render: (record: IBlog) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/blogs/action?id=${record._id}&action=edit`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => handleDelete(record?._id as string)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const blogs = useCrud("blogs", {
    fetchData: blogSlice.fetchData,
    deleteData: blogSlice.deleteData,
  });
  const getBlogsData = (blogs.single?.data?.items as IBlog[]) ?? [];

  const handleDelete = async (id: string) => {
    try {
      await blogs.remove(id);
      message.success("Xóa bài viết thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bài viết");
    }
  };
  useEffect(() => {
    if (!blogs.loading.fetch) {
      blogs.fetch({
        params: filters,
      });
    }
  }, [filters]);
  return (
    <Table
      columns={columns}
      dataSource={getBlogsData ?? []}
      loading={blogs.loading.fetch}
      rowKey="_id"
      pagination={{
        total: blogs.single?.data?.total ?? 0,
        pageSize: 10,
        onChange: (page, limit) => blogs.fetch({ page, limit }),
      }}
    />
  );
};
const MemoBlogsTable = React.memo(BlogsTable, (prevProps, nextProps) => {
  if (prevProps.filters !== nextProps.filters) {
    return false;
  }
  return true;
});
const ListBlog = () => {
  const { filters, setFilters } = useContext(BlogsManagmantContext);

  return (
    <div className="">
      <Card>
        <FilterFunction filters={filters} setFilters={setFilters} />
        <MemoBlogsTable filters={filters} />
      </Card>
    </div>
  );
};

export default ListBlog;
