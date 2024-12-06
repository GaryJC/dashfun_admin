import {
  Image,
  Space,
  Table,
  Form,
  Input,
  Popconfirm,
  Typography,
  Tag,
  Select,
  message,
  DatePicker,
} from "antd";
import CreateGame, { GenreSelect } from "./CreateGame";
import { useEffect, useState } from "react";
import API, { getImageUrl, requestWithAuthHeader } from "../../modules/api";
import ImageUploadModal from "./ImageUploadModal";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import GameFilter from "./GameFilter";
import Constants from "../../modules/constants";
import usePagination from "../../utils/usePagination";
import { data } from "autoprefixer";

const GameStatus = Constants.GameStatus;
const GameGenre = Constants.GameGenre;

// const pageSize = 10;

export default function GameTable() {
  const [form] = Form.useForm();
  const [gameData, setGameData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const { paginationParams, changePageHandler, changePaginationParams } =
    usePagination();

  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");

  const [editingData, setEditingData] = useState({});

  const [messageApi, contextHolder] = message.useMessage();

  /*
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [gameID, setGameID] = useState(null);

  const openTaskModal = (id) => {
    setGameID(id);
    setTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  };
  */

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      description: "",
      status: "",
      genre: "",
      url: "",
      // iconUrl: "",
      // mainImageUrl: "",
      // logoUrl: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    const getGameData = async (filter = {}) => {
      console.log("filter", filter);
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.gameSearch, {
          ...filter,
          page: paginationParams.currentPage,
          size: paginationParams.pageSize,
        });

        const { code, data, msg } = res.data;
        if (code === 0) {
          setGameData(data.data);
          changePaginationParams(data);
        } else {
          console.log("error", msg);
        }
      } catch (e) {
        console.log("error", e);
      }

      setLoading(false);
    };

    getGameData();

    JSEvent.on(Events.GameTable_Update, getGameData);
    return () => {
      JSEvent.remove(Events.GameTable_Update, getGameData);
    };
  }, [paginationParams.currentPage]);

  const onEditing = (val, dataIndex) => {
    // setEditingData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
    if (dataIndex == "openTime") {
      val = val ? val.valueOf() : 0;
    }
    setEditingData((pre) => ({ ...pre, [dataIndex]: val }));
    console.log("e", val, dataIndex, editingData);
  };

  const onSave = async (id) => {
    // form.validateFields();
    const updatedData = { id, ...editingData };
    console.log("updatedData", updatedData);
    try {
      const res = await requestWithAuthHeader.post(API.gameUpdate, updatedData);
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code === 0) {
        JSEvent.emit(Events.GameTable_Update);
        setEditingKey("");
        setEditingData({});
        messageApi.success("Game updated successfully");
      } else {
        messageApi.error(msg);
      }
    } catch (e) {
      console.log("error", e);
      messageApi.error("Game update failed");
    }
  };

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
    // console.log("record", record);
    let inputNode = <Input />;
    if (["name", "description", "url"].includes(dataIndex)) {
      inputNode = (
        <Input onChange={(e) => onEditing(e.target.value, dataIndex)} />
      );
    }

    if (dataIndex == "genre") {
      inputNode = <GenreSelect />
    }

    if (dataIndex == "openTime") {
      inputNode = <DatePicker onChange={(date) => onEditing(date, dataIndex)} />
    }

    //Handle image fields (iconUrl, mainImageUrl, logoUrl) with the Upload component
    // if (["iconUrl", "mainImageUrl", "logoUrl"].includes(dataIndex)) {
    //   inputNode = (
    //     <Upload
    //       maxCount={1}
    //       listType="picture-card"
    //       showUploadList={true} // Show the selected image file in the Upload component
    //       beforeUpload={() => false} // Prevent automatic upload
    //       onChange={(info) => handleFileChange(info, dataIndex)} // Handle file change
    //     >
    //       Upload
    //     </Upload>
    //   );
    // }

    if (dataIndex == "status") {
      inputNode = (
        <Select
          defaultValue={GameStatus.Online}
          onChange={(value) => onEditing(value, dataIndex)}
          style={{
            minWidth: 100,
          }}
        >
          <Select.Option value={GameStatus.Online}>Online</Select.Option>
          <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
          <Select.Option value={GameStatus.Pending}>Pending</Select.Option>
          {/* <Select.Option value={GameStatus.Undefined}>Undefined</Select.Option> */}
        </Select>
      );
    }

    // if(dataIndex == "genre"){
    //     inputNode = (
    //         <Select
    //           defaultValue={record.genre}
    //           onChange={(value) => onEditing(value, dataIndex)}
    //           mode="multiple"
    //         >
    //           <Select.Option value={GameStatus.Online}>Online</Select.Option>
    //           <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
    //           <Select.Option value={GameStatus.Pending}>Pending</Select.Option>
    //           <Select.Option value={GameStatus.Normal}>Normal</Select.Option>
    //         </Select>
    //       );
    // }

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (_, record) => {
        // const editable = isEditing(record);
        const status = record.status;
        // console.log("status", status, editable);
        // if (editable) {
        //   return (
        //     <Select
        //       defaultValue={status}
        //       onChange={(value) => {
        //         const newData = [...gameData];
        //         const index = newData.findIndex(
        //           (item) => record.id === item.id
        //         );
        //         if (index > -1) {
        //           const item = newData[index];
        //           newData.splice(index, 1, { ...item, status: value });
        //           setGameData(newData);
        //         }
        //       }}
        //     >
        //       <Select.Option value={GameStatus.Online}>Online</Select.Option>
        //       <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
        //       <Select.Option value={GameStatus.Pending}>Pending</Select.Option>
        //       <Select.Option value={GameStatus.Normal}>Normal</Select.Option>
        //     </Select>
        //   );
        // } else {
        if (status === GameStatus.Online) {
          return <Tag color="green">Online</Tag>;
        } else if (status === GameStatus.Removed) {
          return <Tag color="red">Removed</Tag>;
        } else if (status === GameStatus.Pending) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="orange">Undefined</Tag>;
          // return <Tag color="green">Online</Tag>;
        }
        // }
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      editable: true,
      render: (_, { genre }) => {
        const genres = [];
        if (genre & GameGenre.Card) {
          genres.push(<Tag color="blue">Card</Tag>);
        }
        if (genre & GameGenre.New) {
          genres.push(<Tag color="green">New</Tag>);
        }
        if (genre & GameGenre.RPG) {
          genres.push(<Tag color="orange">RPG</Tag>);
        }
        if (genre & GameGenre.Popular) {
          genres.push(<Tag color="red">Popular</Tag>);
        }
        if (genre & GameGenre.Strategy) {
          genres.push(<Tag color="purple">Strategy</Tag>);
        }
        return genres;
      }
    },
    {
      title: "Open Time",
      dataIndex: "openTime",
      key: "openTime",
      editable: true,
      render: (_, { openTime }) =>
        openTime == 0 ? "Opening" : new Date(openTime).toLocaleDateString(),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      editable: true,
    },
    {
      title: "Icon URL",
      dataIndex: "iconUrl",
      key: "iconUrl",
      editable: false,
      render: (_, { id, iconUrl }) =>
        iconUrl == "" ? null : (
          <Image src={getImageUrl(id, iconUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Logo URL",
      dataIndex: "logoUrl",
      key: "logoUrl",
      editable: false,
      render: (_, { id, logoUrl }) =>
        logoUrl == "" ? null : (
          <Image src={getImageUrl(id, logoUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Main Image URL",
      dataIndex: "mainImageUrl",
      key: "mainImageUrl",
      editable: false,
      render: (_, { id, mainPicUrl }) =>
        mainPicUrl == "" ? null : (
          <Image src={getImageUrl(id, mainPicUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onSave(record.id)}
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
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)} // Edit the row
            >
              Edit
            </Typography.Link>
            <ImageUploadModal data={record} disabled={editingKey != ""} />
            {/* <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => openTaskModal(record.id)}
            >
              Task
            </Typography.Link> */}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "status" ? "number" : "text", // Define input types for status as number
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      {contextHolder}
      <CreateGame />
      <GameFilter />
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        loading={loading}
        dataSource={gameData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          ...paginationParams,
          onChange: (page) => {
            changePageHandler(page);
            cancel();
          },
        }}
        rowKey="id" // Use the id field as a unique key for each row
      />
      {/* <GameTaskModal
        taskModalOpen={taskModalOpen}
        closeTaskModal={closeTaskModal}
        gameID={gameID}
      /> */}
    </Form>
  );
}
