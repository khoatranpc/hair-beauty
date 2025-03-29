"use client";
import React, { useEffect, useRef } from "react";
import { Breadcrumb } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { ProductOutlined } from "@ant-design/icons";
import { productSlice } from "@/store/reducers/product";
import ProductDetailLoading from "./components/ProductDetailLoading";
import { IObj } from "@/types/types";
import SectionProductInfo from "./components/SectionProductInfo";
import RelatedProducts from "./components/RelatedProducts";

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const productName = useRef<string>("");
  const products = useCrud(
    "products",
    {
      fetchData: productSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "read":
            if (data.data._id) {
              productName.current = data.data.name;
              const getCategories = (
                (data.data?.categories as IObj[]) ?? []
              ).map((cat) => cat._id);
              products.fetch({
                params: {
                  categories: getCategories,
                  page: 1,
                },
              });
            }
            break;

          default:
            break;
        }
      },
    }
  );
  const handleFetchCurrentProduct = () => {
    products.fetch({
      slugOrId: slug,
    });
  };
  const product = products.single?.data as IObj;
  useEffect(() => {
    handleFetchCurrentProduct();
  }, []);
  const checkLoading =
    (!product && !products.loading.fetch) || products.loading.fetch;
  return (
    <div>
      <Breadcrumb
        items={[
          {
            key: "Products",
            href: "/products",
            title: (
              <p>
                <ProductOutlined /> Sản phẩm
              </p>
            ),
            onClick() {
              router.push("/products");
            },
          },
          {
            key: "ProductDetail",
            href: `/products/${slug}`,
            title: <p>{productName.current}</p>,
          },
        ]}
      />
      <div className={`${checkLoading ? "block" : "hidden"}`}>
        <ProductDetailLoading />
      </div>
      <div
        className={`container mx-auto px-4 py-8 ${
          !checkLoading ? "block" : "hidden"
        }`}
      >
        <SectionProductInfo product={product} />
        <RelatedProducts products={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
