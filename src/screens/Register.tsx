"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Input, Card, Alert, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useCrud } from "@/hooks/useCrud";
import { userRegisterSlice } from "@/store/reducers/user";

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  fullName: yup.string().required("Họ tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const userRegister = useCrud(
    "userRegister",
    {
      createData: userRegisterSlice.createData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            console.log("Đăng ký thành công!");
            break;

          default:
            break;
        }
      },
      onError(error, type) {
        switch (type) {
          case "create":
            console.log(error.message);
            break;

          default:
            break;
        }
      },
    }
  );
  const onSubmit = (data: RegisterFormData) => {
    userRegister.create(data);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50/30">
      <Card className="w-full max-w-[400px] shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          <img src="/images/logo.png" alt="Logo" className="w-32 h-auto mb-6" />
          <h2
            className="text-center text-2xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Đăng ký
          </h2>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-4"
          disabled={userRegister.loading.create}
        >
          <Form.Item
            validateStatus={errors.fullName ? "error" : ""}
            help={errors.fullName?.message}
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Họ tên"
                  size="large"
                  className="rounded-md"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email"
                  size="large"
                  className="rounded-md"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone?.message}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Số điện thoại"
                  size="large"
                  className="rounded-md"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  size="large"
                  className="rounded-md"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                  className="rounded-md"
                />
              )}
            />
          </Form.Item>
          {userRegister.error.create && (
            <Form.Item>
              <Alert
                type="error"
                description={
                  <Typography.Text type="danger">
                    {userRegister.error.create as string}
                  </Typography.Text>
                }
              />
            </Form.Item>
          )}
          {userRegister.single?.message && !userRegister.error.create && (
            <Form.Item>
              <Alert
                type="success"
                description={
                  <Typography.Text type="success">
                    {userRegister.single?.message as string}
                  </Typography.Text>
                }
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
              loading={userRegister.loading.create}
            >
              Đăng ký
            </Button>
            <p className="mt-2 text-center">
              <span>
                Đã có tài khoản? <Link href={"/login"}>Đăng nhập ngay</Link>
              </span>
            </p>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
