"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Pagination, Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import ProductCard from "../../components/ProductCard";
import useDebounce from "../../hooks/useDebounce";
import { useCrud } from "@/hooks/useCrud";
import { productSlice } from "@/store/reducers/product";
import { IObj } from "@/types/types";
import ProductsLoading from "@/components/ProductsLoading";

const { Option } = Select;

const Products = () => {
  const products = useCrud("products", {
    fetchData: productSlice.fetchData,
  });
  const data = products.single?.data as IObj;
  const getProducts = (data?.items as IObj[]) ?? [];
  const [filters, setFilters] = useState<IObj>({});
  const debouncedFilters = useDebounce(filters, 1000);
  const handleFetchData = useCallback(() => {
    products.fetch({
      params: debouncedFilters,
    });
  }, [debouncedFilters]);
  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 bg-white p-6 rounded-lg shadow-sm sticky top-[100px] z-2">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full md:w-1/3"
            onChange={(e) => {
              setFilters({
                ...filters,
                search: e.target.value,
                page: 1,
              });
            }}
          />
          <Select
            placeholder="Sắp xếp theo giá"
            className="w-full md:w-1/4"
            onChange={(value) => {
              setFilters({
                ...filters,
                sortPrice: value,
              });
            }}
          >
            <Option value="0">Mặc định</Option>
            <Option value="asc">Giá thấp đến cao</Option>
            <Option value="desc">Giá cao đến thấp</Option>
          </Select>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            className="w-full md:w-auto"
            onClick={() => {
              if (Object.keys(filters).length) {
                setFilters({});
              }
            }}
          >
            Đặt lại
          </Button>
        </div>
      </div>
      <div className="flex justify-end mt-8 mb-4">
        <Pagination
          total={data?.total ?? 0}
          showSizeChanger={true}
          showTotal={(total) => {
            return <span>Tổng {total} sản phẩm</span>;
          }}
          pageSizeOptions={["10", "20", "50"]}
          className="bg-white !p-2 rounded-lg shadow-sm"
          responsive
          pageSize={filters?.limit}
          onChange={(page, limit) => {
            setFilters({
              ...filters,
              page,
              limit,
            });
          }}
        />
      </div>
      {products.loading.fetch || !data ? (
        <ProductsLoading />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getProducts?.map((product) => {
            return <ProductCard product={product} key={product._id}/>;
          })}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Pagination
          total={data?.total ?? 0}
          showSizeChanger={true}
          pageSize={filters?.limit}
          showTotal={(total) => {
            return <span>Tổng {total} sản phẩm</span>;
          }}
          pageSizeOptions={["10", "20", "50"]}
          className="bg-white !p-2 rounded-lg shadow-sm"
          responsive
          onChange={(page, limit) => {
            setFilters({
              ...filters,
              page,
              limit,
            });
          }}
        />
      </div>
    </div>
  );
};

export default Products;
