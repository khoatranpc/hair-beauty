"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Space, Input, Modal, Form, Select } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useCrud } from "@/hooks/useCrud";
import { categoriesSlice } from "@/store/reducers/category";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import { IObj } from "@/types/types";
import CategoryTable from "./components/CategoryTable";
import CategoryForm from "./components/CategoryForm";
import { TypeOfCategory } from "@/types/enum";

interface FilterState {
  search: string;
  isActive?: boolean;
}
interface Props {
  type?: TypeOfCategory;
}
const CategoryList = (props: Props) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    isActive: undefined,
    ...(props.type ? { type: props.type } : {}),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleStatusChange = (value: boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  const debouncedSearch = useDebounce(filters, 1000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const listCategory = useCrud(
    "categories",
    {
      fetchData: categoriesSlice.fetchData,
      createData: categoriesSlice.createData,
      updateData: categoriesSlice.updateData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            toast.success("Thêm mới danh mục thành công!");
            setIsModalOpen(false);
            listCategory.fetch({
              params: filters,
            });
            break;
          case "update":
            toast.success("Cập nhật danh mục thành công!");
            setIsModalOpen(false);
            listCategory.fetch({
              params: filters,
            });
            break;
          default:
            break;
        }
      },
    }
  );
  const getData = listCategory.single?.data as IObj;
  const getListCategory = useMemo(() => {
    return (getData?.items as IObj[]) ?? ([] as IObj[]);
  }, [getData?.items]);

  const handleEdit = useCallback((category: IObj) => {
    const formData = {
      ...category,
      parentCategories:
        category.parentCategories?.map((item: IObj) => item._id) || [],
    };
    form.setFieldsValue(formData);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        console.log("Delete category:", id);
      },
    });
  }, []);
  const handleSubmit = async (values: any) => {
    const isEditing = !!values._id;

    if (isEditing) {
      listCategory.update(values._id, values);
    } else {
      listCategory.create(values);
    }
  };
  useEffect(() => {
    listCategory.fetch({
      params: debouncedSearch,
    });
  }, [debouncedSearch]);
  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <Space size="middle">
          <Input
            placeholder="Tìm kiếm danh mục"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={handleSearchChange}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
            value={filters.isActive}
            onChange={handleStatusChange}
            options={[
              {
                label:
                  props.type === TypeOfCategory.product
                    ? "Đang bán"
                    : "Đang mở",
                value: true,
              },
              {
                label:
                  props.type === TypeOfCategory.product ? "Ngừng bán" : "Ngừng",
                value: false,
              },
            ]}
          />
        </Space>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              listCategory.fetch({
                params: filters,
              })
            }
            loading={listCategory.loading.fetch}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm danh mục
          </Button>
        </Space>
      </div>

      <CategoryTable
        data={getListCategory}
        loading={listCategory.loading.fetch}
        total={getData?.total || 0}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPaginationChange={(page, pageSize) => {
          setFilters((prev) => ({
            ...prev,
            page,
            limit: pageSize,
          }));
        }}
      />

      <Modal
        title={
          form.getFieldValue("_id") ? "Chỉnh sửa danh mục" : "Thêm danh mục"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
        okText={form.getFieldValue("_id") ? "Cập nhật" : "Thêm"}
        okButtonProps={{
          loading: listCategory.loading.create || listCategory.loading.update,
        }}
        cancelText="Hủy"
        destroyOnClose
      >
        <CategoryForm
          type={props.type}
          form={form}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </Card>
  );
};

export default CategoryList;
