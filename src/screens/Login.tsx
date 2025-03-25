"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Input, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCrud } from "@/hooks/useCrud";
import { userLoginSlice, userProfileSlice } from "@/store/reducers/user";
import { useRouter } from "next/navigation";
import { saveLocalStorage } from "@/utils";
import { LocalStorage } from "@/types/enum";

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const userProfile = useCrud(
    "userProfile",
    {
      fetchData: userProfileSlice.fetchData,
    },
    {
      onSuccess(data, type) {
        if (type === "read") {
          router.push("/");
        }
      },
    }
  );
  const userLogin = useCrud(
    "userLogin",
    {
      createData: userLoginSlice.createData,
    },
    {
      onSuccess(data, type) {
        switch (type) {
          case "create":
            saveLocalStorage(LocalStorage.access_token, data.data?.token);
            userProfile.fetch();
            break;

          default:
            break;
        }
      },
    }
  );
  const onSubmit = (data: LoginFormData) => {
    userLogin.create(data);
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
            Đăng nhập
          </h2>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-4"
          disabled={userLogin.loading.create}
        >
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
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Email"
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
          {userLogin.error.create && (
            <Form.Item>
              <Alert
                description={userLogin.error.create as string}
                type="error"
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
              style={{ backgroundColor: "var(--primary)" }}
              loading={userLogin.loading.create}
            >
              Đăng nhập
            </Button>
            <p className="mt-2 text-right">
              <Link href={"/register"}>Quên mật khẩu</Link>
            </p>
            <p className="mt-2 text-center">
              <span>
                Bạn chưa có tài khoản?{" "}
                <Link href={"/register"}>Đăng ký ngay</Link>
              </span>
            </p>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
