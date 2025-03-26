import { createGenericSlice } from "@/utils/createGenericSlice";

export const categoriesSlice = createGenericSlice(
  "categoriesSlice",
  "/api/v1/categories"
);
