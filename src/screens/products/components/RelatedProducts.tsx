import React, { memo } from "react";
import { IObj } from "@/types/types";
import { Carousel } from "antd";
import ProductCard from "@/components/ProductCard";

interface Props {
  products?: IObj;
}
const RelatedProducts = (props: Props) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">
        Sản phẩm liên quan ({props.products?.total ?? 0} sản phẩm)
      </h2>
      <Carousel
        infinite={false}
        slidesToShow={props.products?.total < 5 ? props.products?.total : 5}
        draggable
      >
        {(props.products?.items as IObj[])?.map((product) => (
          <div key={product._id} className="px-2">
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default memo(RelatedProducts, (prevProps, nextProps) => {
  if (nextProps.products?.items) {
    return false;
  }
  return true;
});
