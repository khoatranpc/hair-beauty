import { configureStore } from "@reduxjs/toolkit";
import {
  userLoginSlice,
  userProfileSlice,
  userRegisterSlice,
} from "./reducers/user";

export const store = configureStore({
  reducer: {
    // reducers will be added dynamically
    userRegister: userRegisterSlice.slice.reducer,
    userLogin: userLoginSlice.slice.reducer,
    userProfile: userProfileSlice.slice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
