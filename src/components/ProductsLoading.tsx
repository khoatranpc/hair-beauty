import React from "react";
import { Card, Skeleton } from "antd";

interface Props {
  total?: number;
  className?: string;
}
const ProductsLoading = (props: Props) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${
        props.className ?? ""
      }`}
    >
      {[...Array(props.total ?? 10)].map((_, index) => (
        <Card
          key={index}
          classNames={{
            body: "!p-1",
          }}
          className="border-none shadow-sm h-full flex flex-col"
          cover={
            <div className="h-38 sm:h-56 md:h-64">
              <Skeleton.Image active className="!w-full !h-full" />
            </div>
          }
        >
          <div className="flex flex-col flex-grow p-1 space-y-2 sm:space-y-3">
            <Skeleton.Input
              active
              block
              className="!w-full !min-h-[2.5rem] sm:!min-h-[3rem]"
            />
            <div className="flex items-center justify-between mt-auto">
              <Skeleton.Input active size="small" className="!w-10" />
            </div>
            <Skeleton.Input active size="small" className="!w-14" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductsLoading;
