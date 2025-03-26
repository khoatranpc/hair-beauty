import React, { useEffect, useState, useMemo } from "react";
import { Select, SelectProps } from "antd";
import axiosInstance from "@/api/axiosConfig";
import { IObj } from "@/types/types";

interface SelectCategoriesProps extends Omit<SelectProps, "options"> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const SelectCategories: React.FC<SelectCategoriesProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const handleFetch = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/categories", {
        params: {
          isGetAll: true,
        },
      });
      const items = response.data.data as IObj[];
      const formattedCategories = items.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);
  const filteredOptions = useMemo(() => {
    if (!searchText) return categories;
    return categories.filter((item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [categories, searchText]);

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%", }}
      placeholder="Chọn danh mục"
      defaultValue={value}
      onChange={onChange}
      options={filteredOptions}
      loading={loading}
      showSearch
      onSearch={setSearchText}
      filterOption={false}
      {...props}
    />
  );
};

export default SelectCategories;
