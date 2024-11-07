import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Alert,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import Constants from "../../modules/constants";
import API, { requestWithAuthHeader } from "../../modules/api";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const { Task } = Constants;

export const TaskTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.Type.Normal}>Normal Task</Select.Option>
    <Select.Option value={Task.Type.Daily}>Daily Task</Select.Option>
  </Select>
);

export const TaskCategoryFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.Category.Challenge}>
      Challenge Task
    </Select.Option>
    <Select.Option value={Task.Category.Daily}>Daily Task</Select.Option>
  </Select>
);

export const TaskRequireTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.RequireType.PlayAnyGame}>
      Play Any Game
    </Select.Option>
    <Select.Option value={Task.RequireType.PlaySpecificGame}>
      Play Specific Game
    </Select.Option>
    <Select.Option value={Task.RequireType.UpgradeToSpecificLevel}>
      Upgrade to Specific Level
    </Select.Option>
    <Select.Option value={Task.RequireType.JoinTelegramChannel}>
      Join Telegram Channel
    </Select.Option>
    <Select.Option value={Task.RequireType.FollowX}>Follow X</Select.Option>
    <Select.Option value={Task.RequireType.ConsumeXTelegramStars}>
      Consume X Telegram Stars
    </Select.Option>
  </Select>
);

export const TaskRewardTypeFormItem = (props) => (
  <Select {...props}>
    <Select.Option value={Task.RewardType.DashfunPoint}>
      DashFun Point
    </Select.Option>
    <Select.Option value={Task.RewardType.GamePoint}>Game Point</Select.Option>
  </Select>
);

export default function CreateTaskModal() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  //   const [validated, setValidated] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [gameID, setGameID] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  let timeout;

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
    // setVisible(false);
    const taskData = {
      game_id: gameID,
      ...values,
    };
    console.log("taskData", taskData);
    try {
      const res = await requestWithAuthHeader.post(API.taskCreate, taskData);
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);

      if (code === 0) {
        setFeedback({ type: "success", message: "Task created successfully" });
        // form.resetFields();
        JSEvent.emit(Events.TaskTable_Update);
      } else {
        setFeedback({ type: "error", message: msg });
      }
    } catch (e) {
      console.log("error", e);
    }
    setLoading(false);
  };

  const handleSearch = async (value) => {
    console.log("search:", value);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const fetchGameData = async () => {
      try {
        const res = await requestWithAuthHeader.post(API.gameSearch, {
          keyword: value,
          page: 1,
          size: 20,
        });
        const { code, data, msg } = res.data;
        console.log("search res", code, data, msg);
        if (code === 0 && data.data.length > 0) {
          const gameData = data.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          setGameData(gameData);
        }
      } catch (e) {
        console.log("error", e);
      }
    };
    if (value) {
      timeout = setTimeout(fetchGameData, 300);
    }
  };

  const onSearchGameID = async (gameID) => {
    try {
      const res = await requestWithAuthHeader.post(API.getGameInfo(gameID));
      const { code, data, msg } = res.data;
      console.log("search res", code, data, msg);
      if (code === 0) {
        if (data) {
          setGameName(data.name);
          setGameID(data.id);
        } else {
          setGameName("not found");
          setGameID(0);
        }
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleChange = (value) => {
    console.log("select:", value);
    setGameID(value);
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
        // onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <Input.Search
          placeholder="input game ID"
          enterButton="Search"
          onSearch={onSearchGameID}
        />
        <p>Game Name: {gameName}</p>

        <Alert
          message="If no valid game is selected, the task will default to the Dashfun task. You can also search for a game by name."
          className="my-2"
        />

        <Select
          defaultValue={null}
          showSearch
          value={gameID}
          placeholder="input a game name"
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
          options={(gameData || []).map((d) => ({
            value: d.value,
            label: d.label,
          }))}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <Form
          form={form}
          name="createTask"
          onFinish={onFinish}
          //   disabled={validated}
        >
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
            rules={[{ required: true, message: "Please input the task type!" }]}
          >
            <TaskTypeFormItem />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <TaskCategoryFormItem />
          </Form.Item>

          <Form.Item label="Is Open" name="open">
            <Radio.Group>
              <Radio value={true}>Open</Radio>
              <Radio value={false}>Close</Radio>
            </Radio.Group>
          </Form.Item>

          <p>Requirments</p>
          <Form.Item
            label="Type"
            name={["require", "type"]}
            rules={[
              { required: true, message: "Please input the require type!" },
            ]}
          >
            <TaskRequireTypeFormItem />
          </Form.Item>

          <Form.Item
            label="Count"
            name={["require", "count"]}
            rules={[
              { required: true, message: "Please input the require count!" },
            ]}
          >
            <InputNumber />
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
            rules={[
              { required: true, message: "Please input the reward type!" },
            ]}
          >
            <TaskRewardTypeFormItem />
          </Form.Item>
          <Form.Item
            label="Amount"
            name={["reward", "amount"]}
            rules={[
              { required: true, message: "Please input the reward amount!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

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
