"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Switch, Select, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrud } from "@/hooks/useCrud";
import { blogSlice } from "@/store/reducers/blog";
import UploadImages from "@/components/UploadImages";
import type { IBlog } from "@/types/types";
import SelectCategories from "@/components/SelectCategories";
import { TypeOfCategory } from "@/types/enum";
import { uploadImagesSlice } from "@/store/reducers/upload";
import { watch } from "fs";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const BlogForm = ({ action }: { action: "create" | "update" }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IBlog>({
    defaultValues: {
      isPublished: false,
      tags: [],
      categories: [],
    },
  });
  const uploadImages = useCrud("uploadImages", {});
  const blogs = useCrud(
    "blogs",
    {
      createData: blogSlice.createData,
      updateData: blogSlice.updateData,
      fetchData: blogSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "read":
            const getData = data?.data as IBlog;
            reset({
              ...getData,
              categories: getData.categories.map((category) => category._id),
            });
            break;
          case "update":
            toast.success("Cập nhật bài viết thành công!");
            break;
          case "create":
            toast.success("Tạo bài viết thành công!");
            break;
          default:
            break;
        }
      },
      onError(error, type) {
        switch (type) {
          case "create":
            toast.error(
              `Có lỗi xảy ra khi tạo bài viết! ${
                (error.message as string) ?? ""
              }`
            );
            break;
          case "update":
            toast.error(
              `Có lỗi xảy ra khi cập nhật bài viết! ${
                (error.message as string) ?? ""
              }`
            );
            break;
          default:
            break;
        }
      },
    }
  );

  const onSubmit = async (values: IBlog) => {
    try {
      const data = {
        ...values,
      };

      if (action === "create") {
        await blogs.create(data);
        message.success("Tạo bài viết thành công!");
      } else {
        await blogs.update(id as string, data);
        message.success("Cập nhật bài viết thành công!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };
  useEffect(() => {
    if (id) {
      blogs.fetch({
        slugOrId: id,
      });
    }
  }, []);
  return (
    <div className="">
      <Form
        onFinish={handleSubmit(onSubmit)}
        className="flex gap-6"
        layout="vertical"
      >
        <div className="flex-1 space-y-6">
          <Card title="Thông tin bài viết">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Vui lòng nhập tiêu đề" }}
              render={({ field }) => (
                <Form.Item
                  label="Tiêu đề"
                  validateStatus={errors.title ? "error" : ""}
                  help={errors.title?.message}
                  required
                >
                  <Input {...field} placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Vui lòng nhập mô tả" }}
              render={({ field }) => (
                <Form.Item
                  label="Mô tả ngắn"
                  validateStatus={errors.description ? "error" : ""}
                  help={errors.description?.message}
                  required
                >
                  <Input.TextArea
                    {...field}
                    rows={3}
                    placeholder="Nhập mô tả ngắn về bài viết"
                  />
                </Form.Item>
              )}
            />

            <Form.Item label="Nội dung">
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  return (
                    <ReactQuill
                      theme="snow"
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      modules={modules}
                      className="h-[400px] mb-12"
                      value={field.value}
                    />
                  );
                }}
              />
            </Form.Item>
          </Card>
        </div>

        <div className="w-80 space-y-6">
          <Card title="Xuất bản">
            <Controller
              name="isPublished"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Form.Item>
                  <Switch
                    checked={value}
                    onChange={onChange}
                    checkedChildren="Xuất bản"
                    unCheckedChildren="Bản nháp"
                  />
                </Form.Item>
              )}
            />

            <Button
              htmlType="submit"
              block
              loading={blogs.loading.create || blogs.loading.update}
            >
              {action === "create" ? "Tạo bài viết" : "Cập nhật"}
            </Button>
          </Card>

          <Card title="Thumbnail">
            <Controller
              name="thumbnail"
              control={control}
              rules={{ required: "Vui lòng chọn hình ảnh" }}
              render={({ field: { onChange } }) => (
                <Form.Item
                  validateStatus={errors.thumbnail ? "error" : ""}
                  help={errors.thumbnail?.message}
                  required
                >
                  <UploadImages
                    maxCount={1}
                    limitMb={5}
                    onChange={(urls) => onChange(urls[0])}
                    defaultImages={
                      (watch("thumbnail") as string)
                        ? [watch("thumbnail") as string]
                        : []
                    }
                  />
                  {uploadImages.loading.create && (
                    <p className="text-red-300">Ảnh đang được tải lên!</p>
                  )}
                </Form.Item>
              )}
            />
          </Card>

          <Card title="Danh mục & Thẻ">
            <Controller
              name="categories"
              control={control}
              rules={{ required: "Vui lòng chọn danh mục" }}
              render={({ field }) => {
                return (
                  <Form.Item
                    required
                    label="Danh mục"
                    validateStatus={errors.categories ? "error" : ""}
                    help={errors.categories?.message}
                  >
                    <SelectCategories
                      {...field}
                      defaultValue={field.value}
                      type={TypeOfCategory.blog}
                    />
                  </Form.Item>
                );
              }}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Form.Item label="Thẻ">
                  <Select
                    {...field}
                    mode="tags"
                    placeholder="Nhập thẻ"
                    options={[]}
                  />
                </Form.Item>
              )}
            />
          </Card>

          <Card title="SEO">
            <Controller
              name="seo.metaTitle"
              control={control}
              render={({ field }) => (
                <Form.Item label="Meta Title">
                  <Input {...field} />
                </Form.Item>
              )}
            />

            <Controller
              name="seo.metaDescription"
              control={control}
              render={({ field }) => (
                <Form.Item label="Meta Description">
                  <Input.TextArea {...field} rows={3} />
                </Form.Item>
              )}
            />

            <Controller
              name="seo.keywords"
              control={control}
              render={({ field }) => (
                <Form.Item label="Keywords">
                  <Select
                    {...field}
                    mode="tags"
                    placeholder="Nhập từ khóa SEO"
                  />
                </Form.Item>
              )}
            />
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default BlogForm;
