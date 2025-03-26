"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Image,
  Space,
  Button,
  Divider,
  Form,
  Drawer,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { productSlice } from "@/store/reducers/product";
import { IObj } from "@/types/types";
import ProductForm from "./components/ProductForm";

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug as string;
  const [form] = Form.useForm<IObj>();
  const [drawer, setDrawer] = useState(false);
  const uploadImages = useCrud("uploadImages", {});
  const { fetch, single, loading } = useCrud("products", {
    fetchData: productSlice.fetchData,
  });

  const product = single?.data as IObj;

  useEffect(() => {
    if (id) {
      fetch({
        slugOrId: id,
      });
    }
  }, [id]);

  return (
    <Card
      loading={loading.fetch}
      title={
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/products/list")}
          />
          <span>Chi tiết sản phẩm</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            const mapProduct = {
              ...product,
              categories: (product.categories as IObj[]).map(
                (item) => item._id as string
              ),
            };
            form.setFieldsValue(mapProduct);
            setDrawer(true);
          }}
        >
          Chỉnh sửa
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <Image.PreviewGroup>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product?.images?.map((image: string, index: number) => (
                  <div key={index} className="aspect-square">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="object-cover rounded w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        </div>

        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên sản phẩm">
              {product?.name}
            </Descriptions.Item>

            <Descriptions.Item label="Danh mục">
              {product?.categories?.map((category: IObj) => (
                <Tag key={category._id}>{category.name}</Tag>
              ))}
            </Descriptions.Item>

            <Descriptions.Item label="Giá">
              {product?.price?.toLocaleString()}đ
            </Descriptions.Item>

            <Descriptions.Item label="Tồn kho">
              {product?.stock}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              <Tag color={product?.isActive ? "success" : "error"}>
                {product?.isActive ? "Đang bán" : "Ngừng bán"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <h3 className="font-medium mb-2">Mô tả sản phẩm</h3>
            <p className="whitespace-pre-line">{product?.description}</p>
          </div>
        </div>
      </div>
      <Drawer
        size="large"
        open={drawer}
        onClose={() => {
          setDrawer(false);
        }}
        classNames={{
          body: "!flex-none",
        }}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-4">
            <Button variant="outlined" color="primary">
              Huỷ
            </Button>
            <Popconfirm
              title="Xác nhận xoá sản phẩm?"
              onConfirm={() => {
                console.log("Deleted");
              }}
            >
              <Button
                variant="dashed"
                color="primary"
                icon={<DeleteOutlined />}
                loading={loading.delete}
              >
                Xoá sản phẩm
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={form.submit}
              icon={<SaveOutlined />}
              loading={loading.update || uploadImages.loading.create}
            >
              Lưu
            </Button>
          </div>
        }
      >
        <ProductForm form={form} handleModal={setDrawer} />
      </Drawer>
    </Card>
  );
};

export default ProductDetail;
