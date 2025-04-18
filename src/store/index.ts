import { configureStore } from "@reduxjs/toolkit";
import {
  userLoginSlice,
  userProfileSlice,
  userRegisterSlice,
} from "./reducers/user";
import { categoriesSlice } from "./reducers/category";
import { productSlice } from "./reducers/product";
import { uploadImagesSlice } from "./reducers/upload";
import { cartSlice } from "./reducers/cart";
import { orderSlice } from "./reducers/order";
import { shopSlice } from "./reducers/shop";
import { blogSlice } from "./reducers/blog";

export const store = configureStore({
  reducer: {
    // reducers will be added dynamically
    userRegister: userRegisterSlice.slice.reducer,
    userLogin: userLoginSlice.slice.reducer,
    userProfile: userProfileSlice.slice.reducer,
    categories: categoriesSlice.slice.reducer,
    products: productSlice.slice.reducer,
    uploadImages: uploadImagesSlice.slice.reducer,
    cart: cartSlice.slice.reducer,
    orders: orderSlice.slice.reducer,
    shop: shopSlice.slice.reducer,
    blogs: blogSlice.slice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
