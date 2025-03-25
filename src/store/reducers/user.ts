import { createGenericSlice } from "@/utils/createGenericSlice";

export const userRegisterSlice = createGenericSlice("userRegister", "/api/v1/auth/register");
export const userLoginSlice = createGenericSlice("userLogin", "/api/v1/auth/login");
export const userProfileSlice = createGenericSlice("userProfile", "/api/v1/auth");
