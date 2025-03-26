import { createGenericSlice } from "@/utils/createGenericSlice";

export const uploadImagesSlice = createGenericSlice(
  "uploadImages",
  "/api/v1/upload/images"
);
