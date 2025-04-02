import React, { useState, useEffect } from "react";
import { Upload, Modal, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useCrud } from "@/hooks/useCrud";
import { uploadImagesSlice } from "@/store/reducers/upload";

interface UploadImagesProps {
  defaultImages?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  limitMb?: number;
}

const UploadImages: React.FC<UploadImagesProps> = ({
  defaultImages = [],
  onChange = () => {},
  maxCount = 10,
  accept = ".jpg,.jpeg,.png,.webp",
  multiple = true,
  disabled = false,
  limitMb = 5,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    defaultImages.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}`,
      status: "done",
      url: url,
    }))
  );

  const uploadImages = useCrud("uploadImages", {
    createData: uploadImagesSlice.createData,
  });

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.thumbUrl as string));
    setPreviewOpen(true);
  };

  const [uploadError, setUploadError] = useState<string>("");

  const handleChange = async ({ fileList: newFileList, file }: any) => {
    setUploadError("");

    if (file.size > limitMb * 1024 * 1024) {
      setUploadError(`File size should not exceed ${limitMb}MB.`);
      return;
    }

    setFileList(newFileList);
    if (file.status === "done") {
      try {
        const formData = new FormData();
        newFileList
          .filter((f: UploadFile) => f.originFileObj)
          .forEach((f: UploadFile) => {
            formData.append("images", f.originFileObj as File);
          });

        if (formData.has("images")) {
          const result = await uploadImages.create(formData, {
            "Content-Type": "multipart/form-data",
          });

          if (result?.data) {
            const uploadedUrls = result.data.map((img: any) => img.url);
            const existingUrls = newFileList
              .filter((f: UploadFile) => f.url && !f.originFileObj)
              .map((f: UploadFile) => f.url as string);

            onChange([...existingUrls, ...uploadedUrls]);

            setFileList((prev) =>
              prev.map((f) => {
                if (f.uid === file.uid) {
                  return { ...f, url: uploadedUrls[0], status: "done" };
                }
                return f;
              })
            );
          }
        }
      } catch (error: any) {
        setUploadError(error.message || "Failed to upload image");
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      }
    }
  };

  useEffect(() => {
    if (defaultImages.length) {
      setFileList(
        defaultImages.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: url,
        }))
      );
    }
  }, [defaultImages]);

  const uploadButton = (
    <button type="button">
      <PlusOutlined />
      <div>Upload</div>
    </button>
  );

  return (
    <>
      <Tooltip
        title={uploadError}
        open={!!uploadError}
        color="red"
        placement="topLeft"
      >
        <Upload
          listType="picture-card"
          accept={accept}
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          multiple={multiple}
          maxCount={maxCount}
          disabled={disabled}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
      </Tooltip>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImages;
