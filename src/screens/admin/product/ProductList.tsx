"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Card, Button, Input, Space, Select, Modal, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useCrud } from "@/hooks/useCrud";
import { productSlice } from "@/store/reducers/product";
import { IObj } from "@/types/types";
import ProductTable from "./components/ProductTable";
import SelectCategories from "@/components/SelectCategories";
import ProductForm from "./components/ProductForm";
import ContextProductAdminProvider, {
  ContextProductAdmin,
} from "./ContextProvider";

const ProductScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { debouncedFilters, filters, setFilters } =
    useContext(ContextProductAdmin);
  const products = useCrud("products", {
    fetchData: productSlice.fetchData,
    deleteData: productSlice.deleteData,
  });
  const uploadImages = useCrud("uploadImages", {});
  const getProducts = (products.single?.data as IObj) ?? {};

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        console.log("Delete product:", id);
      },
    });
  };
  const handleFetchData = useCallback(() => {
    products.fetch({
      params: debouncedFilters,
    });
  }, [debouncedFilters]);
  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <Space size="middle">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            prefix={<SearchOutlined />}
            defaultValue={filters.search}
            onChange={(e) => {
              setFilters({
                ...filters,
                search: e.target.value,
                page: 1,
              });
            }}
            style={{ width: 250 }}
          />
          <SelectCategories
            placeholder="Danh mục"
            className="!min-w-[15rem] !max-w-[25rem]"
            defaultValue={filters.categories}
            onChange={(value) => {
              setFilters({
                ...filters,
                categories: value,
                page: 1,
              });
            }}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
            value={filters.isActive}
            onChange={(value) => {
              setFilters({
                ...filters,
                isActive: value,
                page: 1,
              });
            }}
            options={[
              { label: "Đang bán", value: true },
              { label: "Ngừng bán", value: false },
            ]}
          />
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <ProductTable
        loading={products.loading.fetch}
        data={getProducts.items as IObj[]}
        total={getProducts.total ?? 0}
        onDelete={handleDelete}
        onPaginationChange={(page, pageSize) => {
          setFilters({
            ...filters,
            page: page,
            limit: pageSize,
          });
        }}
      />

      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
        destroyOnClose
        okButtonProps={{
          loading: products.loading.create || uploadImages.loading.create,
        }}
      >
        {isModalOpen && (
          <ProductForm
            handleModal={setIsModalOpen}
            form={form}
            loading={products.loading.create}
          />
        )}
      </Modal>
    </Card>
  );
};
const ProductList = () => {
  return (
    <ContextProductAdminProvider>
      <ProductScreen />
    </ContextProductAdminProvider>
  );
};
export default ProductList;
