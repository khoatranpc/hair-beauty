import React from "react";
import { Form, Input, Switch } from "antd";
import SelectCategories from "@/components/SelectCategories";
import slugify from "slugify";
import SelectTypeOfCategory from "@/components/SelectTypeOfCategory";
import { TypeOfCategory } from "@/types/enum";

interface CategoryFormProps {
  form: any;
  handleSubmit: any;
  type?: TypeOfCategory;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  form,
  handleSubmit,
  type,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = slugify(name, { lower: true, locale: "vi" });
    form.setFieldsValue({
      name,
      slug,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="_id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Tên danh mục"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
      >
        <Input onChange={handleNameChange} />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true, message: "Vui lòng nhập slug" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="type" label="Loại danh mục">
        <SelectTypeOfCategory optionType="button" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="parentCategories" label="Danh mục cha">
        <SelectCategories type={type} />
      </Form.Item>

      <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default React.memo(CategoryForm);
