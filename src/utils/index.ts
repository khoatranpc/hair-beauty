import { LocalStorage } from "@/types/enum";

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
