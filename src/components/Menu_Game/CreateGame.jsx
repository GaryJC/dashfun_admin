import { Form, Input, Select, Button, Space, Modal, Alert, DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import API, { requestWithAuthHeader } from "../../modules/api";
import { useEffect, useState } from "react";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

import PropTypes from 'prop-types';

export const GenreSelect = ({ value = [], onChange }) => {

  GenreSelect.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const res = await requestWithAuthHeader.get(API.gameGenres);
        const { code, data, msg } = res.data;
        console.log("genre", data)
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
  }, []);

  return (
    <Select mode="multiple" value={value} onChange={onChange}>
      {
        genres.map((g) => (
          <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
        ))
      }
    </Select>
  )
}

export default function CreateGame() {
  const [form] = Form.useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onCreateGame = async (values) => {
    let { name, desc, url, genre, open_time } = values;
    open_time = open_time ? open_time.valueOf() : 0;

    try {
      const res = await requestWithAuthHeader.post(API.gameCreate, {
        name,
        desc,
        url,
        genre,
        open_time
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        setFeedback({ type: "success", msg: "Game created successfully" });
        JSEvent.emit(Events.GameTable_Update);
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
            <GenreSelect />
          </Form.Item>
          <Form.Item
            label="Open time"
            name="open_time"
          >
            <DatePicker />
            <div className="text-gray-500 text-xs">If open time is not specified, this game will be regarded as open when it is created.</div>
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
