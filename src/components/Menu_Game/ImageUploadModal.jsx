import { Form, Image, Modal, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import API, { getImageUrl, requestWithAuthHeader } from "../../modules/api";
import PropTypes from "prop-types";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ImageUploadModal({ data, disabled }) {
  ImageUploadModal.propTypes = {
    data: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  };

  // console.log("data", data);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState({});
  const [loading, setLoading] = useState(false);

  const iconImage = data.iconUrl
    ? {
        uid: 1,
        name: "icon.png",
        url: getImageUrl(data.id, data.iconUrl),
      }
    : null;

  const logoImage = data.logoUrl
    ? {
        uid: 2,
        name: "logo.png",
        url: getImageUrl(data.id, data.logoUrl),
      }
    : null;

  const mainImage = data.mainImageUrl
    ? {
        uid: 3,
        name: "main.png",
        url: getImageUrl(data.id, data.mainImageUrl),
      }
    : null;

  const [open, setOpen] = useState(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onUpdateImages = async () => {
    // setOpen(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("game_id", data.id);
    for (const key in fileList) {
      if (fileList[key]) {
        formData.append(key, fileList[key]);
      }
    }
    console.log("formData", formData);
    try {
      const res = await requestWithAuthHeader.post(API.updateImage, formData);
      console.log("res", res);
    } catch (e) {
      console.log("error", e);
    }
    setLoading(false);
    JSEvent.emit(Events.GameTable_Update);
    onClose();
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (info, name) => {
    console.log("info, name", info, name);
    setFileList((pre) => ({ ...pre, [name]: info.file }));
  };

  console.log("fileList", fileList);

  return (
    <>
      <Typography.Link
        //   disabled={editingKey !== ""}
        disabled={disabled}
        onClick={onOpen}
        style={{
          marginInlineEnd: 8,
        }}
      >
        Upload Image
      </Typography.Link>

      <Modal
        title="Upload Image"
        okButtonProps={{ loading }}
        open={open}
        onOk={onUpdateImages}
        onCancel={onClose}
        okText="Update"
      >
        <Form>
          <Form.Item name="icon" label="Icon Image">
            <Upload
              maxCount={1}
              listType="picture-card"
              onPreview={handlePreview}
              onChange={(info) => onChange(info, "icon")}
              defaultFileList={iconImage ? [iconImage] : []}
              beforeUpload={() => false}
            >
              <UploadOutlined /> Upload
            </Upload>
          </Form.Item>
          <Form.Item name="logo" label="Logo Image">
            <Upload
              maxCount={1}
              listType="picture-card"
              onPreview={handlePreview}
              onChange={(info) => onChange(info, "logo")}
              defaultFileList={logoImage ? [logoImage] : []}
              beforeUpload={() => false}
            >
              <UploadOutlined /> Upload
            </Upload>
          </Form.Item>
          <Form.Item name="main" label="Main Image">
            <Upload
              maxCount={1}
              listType="picture-card"
              onPreview={handlePreview}
              onChange={(info) => onChange(info, "main")}
              defaultFileList={mainImage ? [mainImage] : []}
              beforeUpload={() => false}
            >
              <UploadOutlined /> Upload
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}

// Define prop types for the component
ImageUploadModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    iconUrl: PropTypes.string,
    logoUrl: PropTypes.string,
    mainImageUrl: PropTypes.string,
  }).isRequired, // data prop is required, and it should have these properties
};
