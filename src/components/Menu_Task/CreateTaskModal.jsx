import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Alert,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import Constants from "../../modules/constants";
import API, { requestWithAuthHeader } from "../../modules/api";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import { clearFormErrors, formValidationHandler } from "./FormHandler";

const { Task } = Constants;

// Component for rendering Task Type form item with Select options
export const TaskTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.Type.Normal}>Normal Task</Select.Option>
    <Select.Option value={Task.Type.Daily}>Daily Task</Select.Option>
  </Select>
);

// Component for rendering Task Category form item with Select options
export const TaskCategoryFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.Category.Challenge}>Challenge Task</Select.Option>
    <Select.Option value={Task.Category.Daily}>Daily Task</Select.Option>
  </Select>
);

// Component for rendering Task Requirement Type form item with Select options
export const TaskRequireTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.RequireType.PlayRandomGame}>Play Random Game</Select.Option>
    <Select.Option value={Task.RequireType.PlayGame}>Play Specific Game</Select.Option>
    <Select.Option value={Task.RequireType.LevelUp}>Level Up in Game</Select.Option>
    <Select.Option value={Task.RequireType.JoinTGChannel}>Join Telegram Channel</Select.Option>
    <Select.Option value={Task.RequireType.FollowX}>Follow X</Select.Option>
    <Select.Option value={Task.RequireType.SpendTGStars}>Spend Telegram Stars</Select.Option>
  </Select>
);

// Component for rendering Task Reward Type form item with Select options
export const TaskRewardTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.RewardType.DashfunPoint}>DashFun Point</Select.Option>
    <Select.Option value={Task.RewardType.GamePoint}>Game Point</Select.Option>
  </Select>
);

export default function CreateTaskModal() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const showModal = () => {
    setVisible(true);
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Received values:", values);

    try {
      // Clear previous validation errors
      clearFormErrors(form);

      const gameID = form.getFieldValue("game_id");
      const validated = formValidationHandler(form, values, setLoading);
      if (!validated) return;

      // Prepare task data for submission
      const taskData = {
        game_id: gameID,
        ...values,
      };
      console.log("taskData", taskData);

      const res = await requestWithAuthHeader.post(API.taskCreate, taskData);
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);

      if (code === 0) {
        setFeedback({ type: "success", message: "Task created successfully" });
        JSEvent.emit(Events.TaskTable_Update);
      } else {
        setFeedback({ type: "error", message: msg || "Error creating task" });
      }
    } catch (e) {
      setFeedback({ type: "error", message: "Error creating task" });
    }

    setLoading(false);
  };

  const handleSearch = async (value) => {
    console.log("search:", value);
    const fetchGameData = async () => {
      try {
        const res = await requestWithAuthHeader.post(API.gameSearch, {
          keyword: value,
          page: 1,
          size: 20,
        });
        const { code, data, msg } = res.data;
        if (code === 0 && data.data.length > 0) {
          const gameData = data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setGameData(gameData);
        }
      } catch (e) {
        console.log("error", e);
      }
    };

    if (value) {
      fetchGameData();
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        className="mb-3"
        icon={<EditOutlined />}
      >
        Create Task
      </Button>
      <Modal
        title="Create Task"
        open={visible}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <Form
          form={form}
          name="createTask"
          onFinish={onFinish}
        >
          {/* Game Select Input */}
          <Form.Item
            label="Select Game"
            name="game_id"
          >
            <Select
              showSearch
              value={form.getFieldValue("game_id")}
              onSearch={handleSearch}
              onChange={(value) => form.setFieldsValue({ game_id: value })}
              placeholder="Select a game or type a game ID"
              filterOption={false}
              mode="combobox"
              options={(gameData || []).map((d) => ({
                value: d.value,
                label: d.label,
              }))}
            />
          </Form.Item>

          <Form.Item label="Task ID" name="id">
            <Input />
          </Form.Item>
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Task Type"
            name="task_type"
            rules={[{ required: true, message: "Please select the task type!" }]}
          >
            <TaskTypeFormItem />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <TaskCategoryFormItem />
          </Form.Item>

          <p>Requirments</p>
          <Form.Item
            label="Task Requirement Type"
            name={["require", "type"]}
            // rules={[{ required: true, message: "Please select the requirement type!" }]}
          >
            <TaskRequireTypeFormItem />
          </Form.Item>

          {/* Other Form Fields */}
          <Form.Item
            label="Count"
            name={["require", "count"]}
            rules={[
              {
                // required: true,
                type: "number",
                min: 1,
                // message: "It must be a positive number",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Condition" name={["require", "condition"]}>
            <Input />
          </Form.Item>

          <Form.Item label="Link" name={["require", "link"]}>
            <Input />
          </Form.Item>

          <p>Reward</p>
          <Form.Item
            label="Type"
            name={["reward", "type"]}
            // rules={[
            //   { required: true, message: "Please input the reward type!" },
            // ]}
          >
            <TaskRewardTypeFormItem />
          </Form.Item>

          <Form.Item
            label="Amount"
            name={["reward", "amount"]}
            // rules={[{ required: true, message: "Please input the reward amount!" }]}
          >
            <InputNumber />
          </Form.Item>

          {/* Feedback Alert for success or error messages */}
          {feedback.type && (
            <Alert
              message={feedback.message}
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
              <Button type="primary" htmlType="submit" loading={loading}>
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
