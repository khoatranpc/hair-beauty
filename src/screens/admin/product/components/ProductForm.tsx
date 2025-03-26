"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  Modal,
  FormInstance,
} from "antd";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import SelectCategories from "@/components/SelectCategories";
import { IObj } from "@/types/types";
import { useCrud } from "@/hooks/useCrud";
import { uploadImagesSlice } from "@/store/reducers/upload";
import { productSlice } from "@/store/reducers/product";
import { useParams } from "next/navigation";

interface ProductFormProps {
  form: FormInstance;
  loading?: boolean;
  handleModal?: (open: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, handleModal }) => {
  const id = useParams()?.slug as string;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    const defaultImages = form.getFieldValue("images");
    if (Array.isArray(defaultImages) && typeof defaultImages[0] === "string") {
      return defaultImages.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: "done",
        url: url,
      }));
    }
    return [];
  });

  const products = useCrud(
    "products",
    {
      createData: productSlice.createData,
      updateData: productSlice.updateData,
      fetchData: productSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            products.fetch();
            toast.success("Thêm sản phẩm thành công!");
            handleModal?.(false);
            break;
          case "update":
            products.fetch({
              slugOrId: id,
            });
            toast.success("Cập nhật sản phẩm thành công!");
            handleModal?.(false);
          default:
            break;
        }
      },
    }
  );

  const product = products.single?.data as IObj;
  const uploadImages = useCrud(
    "uploadImages",
    {
      createData: uploadImagesSlice.createData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            if (!id) {
              products.create({
                ...form.getFieldsValue(),
                images: data.data.map((img: IObj) => img.url),
              });
              form.resetFields();
            } else {
              const getListImages = form
                .getFieldValue("images")
                .fileList.filter((img: UploadFile) => img.url)
                .map((img: UploadFile) => img.url);
              console.log("first");
              products.update(product._id, {
                ...form.getFieldsValue(),
                slug: product.slug as string,
                images: [
                  ...getListImages,
                  ...data.data.map((img: IObj) => img.url),
                ],
              });
            }
            break;
          default:
            break;
        }
      },
    }
  );

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.thumbUrl as string));
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }: any) =>
    setFileList(newFileList);

  const uploadButton = (
    <button type="button">
      <PlusOutlined />
      <div>Upload</div>
    </button>
  );
  const handleSubmit = (values: IObj) => {
    console.log(values);
    if (!id) {
      const formData = new FormData();
      if (values.images.fileList.length) {
        (values.images.fileList as IObj[])
          .map((file) => file.originFileObj as File)
          .forEach((file) => {
            formData.append("images", file);
          });
        uploadImages.create(formData, {
          "Content-Type": "multipart/form-data",
        });
      } else {
        products.create({
          ...form.getFieldsValue(),
        });
      }
    } else {
      const formData = new FormData();
      if (
        values.images.fileList?.length &&
        (values.images?.fileList as UploadFile[]).find(
          (file) => file.originFileObj
        )
      ) {
        (values.images.fileList as IObj[])
          .filter((file) => {
            return file.originFileObj as File;
          })
          .forEach((file) => {
            formData.append("images", file.originFileObj as File);
          });
        uploadImages.create(formData, {
          "Content-Type": "multipart/form-data",
        });
      } else {
        products.update(product._id, {
          ...form.getFieldsValue(),
          slug: product.slug as string,
          images: values.images.fileList
            ? values.images.fileList?.map((img: UploadFile) => img.url)
            : values.images,
        });
      }
    }
  };
  useEffect(() => {
    const defaultImages = form.getFieldValue("images");
    if (Array.isArray(defaultImages) && typeof defaultImages[0] === "string") {
      setFileList(
        defaultImages.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: url,
        }))
      );
    }
  }, [form.getFieldValue("images")]);
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="images"
        label="Hình ảnh"
        rules={[
          { required: true, message: "Vui lòng chọn ít nhất 1 hình ảnh" },
        ]}
      >
        <Upload
          listType="picture-card"
          accept=".jpg,.jpeg,.png,.webp"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          multiple
          maxCount={10}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </Form.Item>

      <Form.Item
        name="categories"
        label="Danh mục"
        rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
      >
        <SelectCategories />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Vui lòng nhập giá" }]}
      >
        <InputNumber
          className="w-full"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          addonAfter="VND"
        />
      </Form.Item>
      <Form.Item name="salePrice" label="Giảm giá">
        <InputNumber
          className="w-full"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          addonAfter="VND"
        />
      </Form.Item>

      <Form.Item
        name="stock"
        label="Tồn kho"
        rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
      >
        <InputNumber className="w-full" min={0} />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="isActive" label="Trạng thái bán" valuePropName="checked">
        <Switch defaultValue={true} />
      </Form.Item>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Form>
  );
};

export default React.memo(ProductForm);
