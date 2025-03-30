import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Card, DatePicker, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { orderStatusString } from "@/utils";
import { IObj } from "@/types/types";
import useDebounce from "@/hooks/useDebounce";

interface OrderFilterProps {
  onFilter?: (filters: any) => void;
  filters?: IObj;
}

const OrderFilter = ({ onFilter, filters }: OrderFilterProps) => {
  const [filtersChild, setFilters] = React.useState<IObj>(filters as IObj);
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };
  const debouncedFilter = useDebounce(filtersChild, 1000);
  const getDateRange = String(filtersChild?.dateRange)?.split(",") ?? [];
  const defaultDateRange =
    getDateRange?.[0] && getDateRange?.[1]
      ? [dayjs(Number(getDateRange?.[0])), dayjs(Number(getDateRange?.[1]))]
      : undefined;
  useEffect(() => {
    onFilter?.(debouncedFilter);
  }, [debouncedFilter]);
  return (
    <Card className="!mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mã đơn hàng</label>
          <Input
            defaultValue={filtersChild?.orderCode}
            placeholder="Tìm mã đơn hàng"
            prefix={<SearchOutlined />}
            onChange={(e) => handleFilterChange("orderCode", e.target.value)}
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Khách hàng</label>
          <Input
            defaultValue={filtersChild?.search}
            placeholder="Tìm theo tên/SĐT"
            prefix={<SearchOutlined />}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <Select
            placeholder="Chọn trạng thái"
            style={{ width: "100%" }}
            onChange={(value) => handleFilterChange("status", value)}
            allowClear
            defaultValue={filtersChild?.status}
          >
            {Object.entries(orderStatusString).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thời gian</label>
          <DatePicker.RangePicker
            defaultValue={defaultDateRange as any}
            style={{ width: "100%" }}
            onChange={(dates) => {
              handleFilterChange(
                "dateRange",
                dates
                  ? [
                      dates?.[0]?.toDate().getTime(),
                      dates?.[1]?.toDate().getTime(),
                    ]
                  : null
              );
            }}
            format={"DD/MM/YYYY"}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderFilter;
