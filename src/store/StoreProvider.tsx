"use client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from ".";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ToastContainer />
      {children}
    </Provider>
  );
}
