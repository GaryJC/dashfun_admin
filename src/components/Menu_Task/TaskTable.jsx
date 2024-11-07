import {
  Table,
  Tag,
  Popconfirm,
  Typography,
  Input,
  Form,
  Select,
  message,
} from "antd";
import CreateTaskModal, {
  TaskCategoryFormItem,
  TaskRequireTypeFormItem,
  TaskRewardTypeFormItem,
  TaskTypeFormItem,
} from "./CreateTaskModal";
import { useCallback, useEffect, useState } from "react";
import API, { requestWithAuthHeader } from "../../modules/api";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import usePagination from "../../utils/usePagination";

// const pageSize = 10;

export default function TaskTable() {
  const [taskData, setTaskData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const { paginationParams, changePageHandler, changePaginationParams } =
    usePagination();

  const [editingKey, setEditingKey] = useState("");

  //   const [paginationParams, setPaginationParams] = useState({
  //     pageSize: 10,
  //     currentPage: 1,
  //     total: 10,
  //   });

  console.log("paginationParams", paginationParams);

  const [form] = Form.useForm();

  const fetchTaskData = useCallback(
    async (keyword = "") => {
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.taskSearch, {
          name: keyword,
          page: paginationParams.currentPage,
          size: paginationParams.pageSize,
        });
        const { code, data, msg } = res.data;
        console.log("res", code, data, msg);
        if (code === 0) {
          setTaskData(data.data);
          changePaginationParams(data);
        }
      } catch (e) {
        console.log("error", e);
      }
      setLoading(false);
    },
    [paginationParams.currentPage]
  );

  useEffect(() => {
    fetchTaskData();

    JSEvent.on(Events.TaskTable_Update, fetchTaskData);
    return () => {
      JSEvent.remove(Events.TaskTable_Update, fetchTaskData);
    };
  }, [fetchTaskData]);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    console.log("edit", record);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const onUpdate = async (record) => {
    // console.log("save", id);
    console.log("save", record);
    const row = await form.getFieldsValue();
    const updatedValues = {
      ...record,
      ...row,
    };
    try {
      setLoading(true);
      const res = await requestWithAuthHeader.post(
        API.taskUpdate,
        updatedValues
      );
      const { code, data, msg } = res.data;
      if (code === 0) {
        fetchTaskData();
        messageApi.success("Task updated successfully");
      } else {
        console.log("error", msg);
        messageApi.error(msg);
      }
    } catch (e) {
      console.log("error", e);
      messageApi.error("Task update failed");
    }
    setLoading(false);
    setEditingKey("");
  };

  //   const handlePageChange = (page) => {
  //     setPaginationParams({
  //       ...paginationParams,
  //       currentPage: page,
  //     });
  //   };

  const columns = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Game ID",
      dataIndex: "game_id",
      key: "game_id",
      editable: false,
    },
    {
      title: "Task Type",
      dataIndex: "task_type",
      key: "task_type",
      editable: true,
      render: (text) => {
        switch (text) {
          case 1:
            return <Tag color="blue">Normal Task</Tag>;
          case 2:
            return <Tag color="green">Daily Task</Tag>;
          default:
            return <Tag color="gray">Unknown</Tag>;
        }
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      editable: true,
      render: (text) => {
        switch (text) {
          case 1:
            return <Tag color="blue">Challenge Task</Tag>;
          case 2:
            return <Tag color="green">Daily Task</Tag>;
          default:
            return <Tag color="gray">Unknown</Tag>;
        }
      },
    },
    {
      title: "Is Open",
      dataIndex: "open",
      key: "open",
      editable: true,
      render: (text) => {
        return text ? (
          <Tag color="blue">Open</Tag>
        ) : (
          <Tag color="red">Close</Tag>
        );
      },
    },
    {
      title: "Requirments",
      editable: true,
      dataIndex: "requirments",
      children: [
        {
          title: "Type",
          dataIndex: ["require", "type"],
          key: "require.type",
          editable: true,
          render: (text) => {
            switch (text) {
              case 1:
                return <Tag color="blue">Play any game</Tag>;
              case 2:
                return <Tag color="green">Play specified game</Tag>;
              case 3:
                return <Tag color="orange">Upgrade to specified level</Tag>;
              case 4:
                return <Tag color="purple">Join Telegram Channel</Tag>;
              case 5:
                return <Tag color="cyan">Follow X</Tag>;
              case 6:
                return (
                  <Tag color="magenta">
                    Consume specified amount of Telegram Stars
                  </Tag>
                );
              default:
                return <Tag color="gray">Unknown</Tag>;
            }
          },
        },
        {
          title: "Count",
          dataIndex: ["require", "count"],
          key: "require.count",
          editable: true,
        },
        {
          title: "Condition",
          dataIndex: ["require", "condition"],
          key: "require.condition",
          editable: true,
        },
        {
          title: "Link",
          dataIndex: ["require", "link"],
          key: "require.link",
          editable: true,
        },
      ],
    },
    {
      title: "Reward",
      children: [
        {
          title: "Reward Type",
          dataIndex: ["reward", "reward_type"],
          key: "reward.reward_type",
          editable: true,
          render: (text) => {
            switch (text) {
              case 2:
                return <Tag color="blue">DashFun Point</Tag>;
              case 3:
                return <Tag color="green">Game Point</Tag>;
              default:
                return <Tag color="gray">Unknown</Tag>;
            }
          },
        },
        {
          title: "Amount",
          dataIndex: ["reward", "amount"],
          key: "reward.amount",
          editable: true,
        },
      ],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onUpdate(record)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = <Input />;

    if (Array.isArray(dataIndex)) {
      const [parentKey, childKey] = dataIndex; // Extract keys for nested data
      if (parentKey === "require") {
        if (childKey === "type") {
          inputNode = TaskRequireTypeFormItem();
        } else if (childKey === "link") {
          inputNode = <Input placeholder="Enter link" />;
        }
      } else if (parentKey === "reward" && childKey === "reward_type") {
        inputNode = TaskRewardTypeFormItem();
      }
    }

    switch (dataIndex) {
      case "task_type":
        inputNode = TaskTypeFormItem();
        break;
      case "category":
        inputNode = TaskCategoryFormItem();
        break;
      case "open":
        inputNode = (
          <Select>
            <Select.Option value={true}>Open</Select.Option>
            <Select.Option value={false}>Close</Select.Option>
          </Select>
        );
        break;
      case ["require", "type"]:
        inputNode = TaskRequireTypeFormItem();
        break;
      case ["reward", "reward_type"]:
        inputNode = TaskRewardTypeFormItem();
        break;
      default:
        break;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const mergedColumns = columns.map((col) => {
    if (col.children) {
      return {
        ...col,
        children: col.children.map((child) => ({
          ...child,
          onCell: (record) => ({
            record,
            dataIndex: child.dataIndex,
            title: child.title,
            editing: isEditing(record),
          }),
        })),
      };
    }
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        // inputType: col.dataIndex === "status" ? "number" : "text", // Define input types for status as number
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      {contextHolder}
      <CreateTaskModal />
      <Input.Search
        placeholder="input game name or id to search"
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={() => fetchTaskData(keyword)}
        className="w-full my-2"
      />
      <Table
        rowKey={"id"}
        loading={loading}
        columns={mergedColumns}
        dataSource={taskData}
        pagination={{
          ...paginationParams,
          onChange: (page) => {
            changePageHandler(page);
            cancel();
          },
        }}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    </Form>
  );
}
