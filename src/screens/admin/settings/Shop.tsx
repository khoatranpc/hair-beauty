"use client";
import React, { useEffect } from "react";
import {
  Form,
  Input,
  TimePicker,
  Switch,
  Card,
  Button,
  message,
  Tabs,
  Select,
} from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TikTokOutlined,
} from "@ant-design/icons";
import { useCrud } from "@/hooks/useCrud";
import dayjs, { Dayjs } from "dayjs";
import { IShop } from "@/types/types";
import { shopSlice } from "@/store/reducers/shop";
import UploadImages from "@/components/UploadImages";

const Shop = () => {
  const [form] = Form.useForm();
  const shop = useCrud("shop", {
    fetchData: shopSlice.fetchData,
    createData: shopSlice.createData,
    updateData: shopSlice.updateData,
  });
  const getShopInfor = shop.single?.data as IShop;

  const handleSubmit = (values: IShop) => {
    try {
      const getBusinessHours = {
        open: (values.businessHours?.open as unknown as Dayjs)?.format("HH:mm"),
        close: (values.businessHours?.close as unknown as Dayjs)?.format(
          "HH:mm"
        ),
        isOpen: values.businessHours?.isOpen,
      };
      const getPayload = {
        ...values,
        businessHours: getBusinessHours,
      };
      console.log(shop.single);
      if (!shop.single?.data?._id) {
        shop.create(getPayload);
      } else {
        shop.update(shop.single?.data?._id, getPayload);
      }
      console.log(values);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const items = [
    {
      key: "basic",
      label: "Thông tin cơ bản",
      children: (
        <div className="space-y-6">
          <Card title="Thông tin chung" className="!mb-4">
            <Form.Item
              name="name"
              label="Tên cửa hàng"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="logo" label="Logo">
                <UploadImages
                  multiple={false}
                  maxCount={1}
                  limitMb={1}
                  onChange={(urls) => {
                    form.setFieldValue("logo", urls[0]);
                  }}
                  defaultImages={[getShopInfor?.logo as string]}
                />
              </Form.Item>
              <Form.Item name="banner" label="Banner">
                <UploadImages
                  multiple={false}
                  maxCount={1}
                  onChange={(urls) => {
                    form.setFieldValue("banner", urls[0]);
                  }}
                  limitMb={1}
                  defaultImages={[getShopInfor?.banner as string]}
                />
              </Form.Item>
            </div>
          </Card>

          <Card title="Thông tin liên hệ" className="!mb-4">
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Card>

          <Card title="Giờ làm việc">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name={["businessHours", "open"]} label="Giờ mở cửa">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
              <Form.Item name={["businessHours", "close"]} label="Giờ đóng cửa">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </div>
            <Form.Item
              name={["businessHours", "isOpen"]}
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch checkedChildren="Mở cửa" unCheckedChildren="Đóng cửa" />
            </Form.Item>
          </Card>
        </div>
      ),
    },
    {
      key: "social",
      label: "Mạng xã hội",
      children: (
        <Card title="Liên kết mạng xã hội">
          <Form.Item
            name={["socialMedia", "facebook"]}
            label={<FacebookOutlined className="text-blue-600" />}
          >
            <Input placeholder="Link Facebook" />
          </Form.Item>
          <Form.Item
            name={["socialMedia", "instagram"]}
            label={<InstagramOutlined className="text-pink-600" />}
          >
            <Input placeholder="Link Instagram" />
          </Form.Item>
          <Form.Item
            name={["socialMedia", "tiktok"]}
            label={<TikTokOutlined className="text-black" />}
          >
            <Input placeholder="Link TikTok" />
          </Form.Item>
          <Form.Item
            name={["socialMedia", "youtube"]}
            label={<YoutubeOutlined className="text-red-600" />}
          >
            <Input placeholder="Link Youtube" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "seo",
      label: "SEO",
      children: (
        <Card title="Tối ưu SEO">
          <Form.Item name={["seo", "metaTitle"]} label="Meta Title">
            <Input />
          </Form.Item>
          <Form.Item name={["seo", "metaDescription"]} label="Meta Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name={["seo", "keywords"]} label="Keywords">
            <Select mode="tags" placeholder="Nhập từ khóa" />
          </Form.Item>
        </Card>
      ),
    },
  ];
  useEffect(() => {
    if (getShopInfor) {
      form.setFieldsValue({
        ...getShopInfor,
        businessHours: {
          ...getShopInfor.businessHours,
          open: getShopInfor.businessHours?.open
            ? dayjs(getShopInfor.businessHours.open, "HH:mm")
            : null,
          close: getShopInfor.businessHours?.close
            ? dayjs(getShopInfor.businessHours.close, "HH:mm")
            : null,
        },
      });
    }
  }, [getShopInfor]);
  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Cài đặt cửa hàng</h1>
          <Button
            type="primary"
            htmlType="submit"
            loading={shop.loading.update}
          >
            Lưu thay đổi
          </Button>
        </div>

        <Tabs items={items} />
      </Form>
    </div>
  );
};

export default Shop;
