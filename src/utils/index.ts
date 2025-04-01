import { LocalStorage, OrderStatus, TypeOfCategory } from "@/types/enum";

export const saveLocalStorage = (key: LocalStorage, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};
export const getLocalStorage = (key: LocalStorage) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};
export const removeLocalStorage = (key: LocalStorage) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(key);
  }
};
export const orderStatusString: Record<OrderStatus, string> = {
  cancelled: "Đã huỷ",
  pending: "Đang chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
};

export const getTypeOfCategoryString: Record<TypeOfCategory, string> = {
  blog: "Bài viết",
  product: "Sản phẩm",
};
