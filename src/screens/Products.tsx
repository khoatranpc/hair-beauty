"use client";
import React, { useState, useEffect } from "react";
import { Pagination, Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import ProductCard from "../components/ProductCard";
import { mockProducts } from "@/utils/mockProducts";
import useDebounce from "../hooks/useDebounce";

const { Option } = Select;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const filterProducts = React.useMemo(() => {
    let products = [...mockProducts];

    // Search filter using debounced value
    if (debouncedSearchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (category !== "all") {
      products = products.filter((product) => product.category === category);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "priceLow":
        products.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  }, [debouncedSearchTerm, sortBy, category, currentPage, pageSize]);
  const [filteredProducts, setFilteredProducts] = useState(filterProducts);
  // Memoize product cards
  const productCards = React.useMemo(() => {
    return filteredProducts.map((product) => (
      <div key={product.id}>
        <ProductCard product={product} />
      </div>
    ));
  }, [filteredProducts]);
  useEffect(() => {
    let products = [...mockProducts];

    // Search filter using debounced value
    if (debouncedSearchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (category !== "all") {
      products = products.filter((product) => product.category === category);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "priceLow":
        products.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    products = products.slice(startIndex, endIndex);

    setFilteredProducts(products);
  }, [debouncedSearchTerm, sortBy, category, currentPage, pageSize]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  // Get unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(
      mockProducts.map((product) => product.category)
    );
    return Array.from(uniqueCategories);
  }, []);

  // Calculate total products after filtering
  const totalProducts = React.useMemo(() => {
    let products = [...mockProducts];

    if (searchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "all") {
      products = products.filter((product) => product.category === category);
    }

    return products.length;
  }, [searchTerm, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 bg-white p-6 rounded-lg shadow-sm sticky top-[100px] z-2">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full md:w-1/3"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            placeholder="Sắp xếp theo"
            className="w-full md:w-1/4"
            value={sortBy}
            onChange={handleSortChange}
          >
            <Option value="popular">Phổ biến nhất</Option>
            <Option value="newest">Mới nhất</Option>
            <Option value="priceLow">Giá thấp đến cao</Option>
            <Option value="priceHigh">Giá cao đến thấp</Option>
          </Select>
          <Select
            placeholder="Danh mục"
            className="w-full md:w-1/4"
            value={category}
            onChange={handleCategoryChange}
          >
            <Option value="all">Tất cả</Option>
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                <span className="capitalize">{cat}</span>
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            className="w-full md:w-auto"
            onClick={() => {
              setSearchTerm("");
              setSortBy("popular");
              setCategory("all");
              setCurrentPage(1);
            }}
          >
            Đặt lại
          </Button>
        </div>
      </div>
      <div className="flex justify-end mt-8 mb-4">
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          className="bg-white !p-2 rounded-lg shadow-sm"
          responsive
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productCards}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          className="bg-white !p-2 rounded-lg shadow-sm"
          responsive
        />
      </div>
    </div>
  );
};

export default Products;
