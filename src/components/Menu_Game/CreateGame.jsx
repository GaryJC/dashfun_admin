import { Form, Input, Select, Button, Space, Modal, Alert } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import API, { requestWithAuthHeader } from "../../modules/api";
import { useEffect, useState } from "react";
import JSEvent from "../../utils/JSEvent";

export default function CreateGame() {
  const [form] = Form.useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(()=>{
    const getGenres = async () => {
      try {
        const res = await requestWithAuthHeader.post(API.gameGenres);
        const { code, data, msg } = res.data;
        if (code == 0) {
          setGenres(data);
        } else {
          console.log("error", msg);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getGenres();
  },[])

  console.log("genres", genres);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onCreateGame = async (values) => {
    const { name, desc, url, genre } = values;
    console.log(name, desc, url, genre);

    try {
      const res = await requestWithAuthHeader.post(API.gameCreate, {
        name,
        desc,
        url,
        genre,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        setFeedback({ type: "success", msg: "Game created successfully" });
        JSEvent.emit("GameTable_Update");
        form.resetFields();
      } else {
        console.log("error", msg);
        setFeedback({ type: "error", msg });
      }
    } catch (e) {
      const errorMsg = e.response.data.msg;
      setFeedback({ type: "error", msg: errorMsg });
      console.log(errorMsg);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={onOpen} icon={<PlusCircleOutlined />}>
        Create Game
      </Button>
      <Modal
        title="Create Game"
        open={isOpen}
        onCancel={onClose}
        centered
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onFinish={onCreateGame}
        >
          <Form.Item
            label="Game Name"
            name="name"
            rules={[{ required: true, message: "Please enter the game name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: "Please enter the URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: "Please select the genre" }]}
          >
            <Select mode="multiple">
              <Select.Option value={1}>Action</Select.Option>
              <Select.Option value={2}>Adventure</Select.Option>
              <Select.Option value={3}>RPG</Select.Option>
              <Select.Option value={4}>Strategy</Select.Option>
            </Select>
          </Form.Item>
          {feedback && (
            <Alert
              message={feedback.msg}
              type={feedback.type}
              showIcon
              className="mb-3"
            />
          )}
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 18,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
              <Button onClick={onReset}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
