import { Button, Form, message, Space, Table, Tag } from "antd";
import Constants from "../../modules/constants";
import { useEffect, useState } from "react";
import API, { requestWithAuthHeader } from "../../modules/api";
import DataCenter from "../../modules/DataCenter";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import AuthChangeModal from "./AuthChangeModal";
import StatusChangeModal from "./StatusChangeModal";
import AccountFilter from "./AccountFilter";
import ResetPasswordButton from "./ResetPasswordButton";
import usePagination from "../../utils/usePagination";

const { UserStatus, Authority } = Constants;

// const pageSize = 10;

const hasAuth = (auth) => {
  const auths = [];
  if (auth & Authority.UserManagement)
    auths.push(
      <Tag color="green" key="um">
        User Management
      </Tag>
    );
  if (auth & Authority.GameManagement)
    auths.push(
      <Tag color="blue" key={"gm"}>
        Game Management
      </Tag>
    );
  if (auth & Authority.TaskManagement)
    auths.push(
      <Tag color="purple" key={"tm"}>
        Task Management
      </Tag>
    );
  return auths;
};

export default function AccountTable() {
  const [form] = Form.useForm();
  const { paginationParams, changePageHandler, changePaginationParams } =
    usePagination();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getUserData = async (filter = {}) => {
      console.log("isloggedin", DataCenter.isLoggedIn);
      if (!DataCenter.isLoggedIn) return;
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.userSearch, {
          ...filter,
          page: paginationParams.currentPage,
          size: paginationParams.pageSize,
        });

        const { code, data, msg } = res.data;
        console.log("ressss", code, data, msg);
        if (code == 0) {
          setData(data.data);
        } else {
          console.log("error", msg);
        }
        setLoading(false);
      } catch (e) {
        console.log("error", e);
      }
    };

    getUserData();

    JSEvent.on(Events.Account.Login, getUserData);
    JSEvent.on(Events.AccountTable_Update, getUserData);
    JSEvent.on(Events.AccountTable_Update, getUserData);

    return () => {
      JSEvent.remove(Events.Account.Login, getUserData);
      JSEvent.remove(Events.AccountTable_Update, getUserData);
      JSEvent.remove(Events.AccountTable_Update, getUserData);
    };
  }, [paginationParams.currentPage]);

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      editable: true, // Mark this column as editable
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      editable: true, // Mark this column as editable
    },
    {
      title: "Authorization",
      dataIndex: "authorization",
      key: "authorization",
      editable: true, // Mark this column as editable
      render: (auth) => {
        // console.log(auth);
        auth === -1 && <></>;
        return <>{hasAuth(auth)}</>;
      },
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case UserStatus.Normal:
            return <Tag color="green">Normal</Tag>;
          case UserStatus.ResetPassword:
            return <Tag color="yellow">Reset Password</Tag>;
          default:
            return <Tag color="red">Ban</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.id == DataCenter.userInfo.userId) return <></>;

        let btns = [];

        // switch (record.status) {
        //   case UserStatus.Normal:
        btns.push(
          <AuthChangeModal record={record} key={1} messageApi={messageApi} />
        );
        btns.push(
          <StatusChangeModal record={record} key={2} messageApi={messageApi} />
        );
        btns.push(
          <ResetPasswordButton
            record={record}
            key={3}
            messageApi={messageApi}
          />
        );
        // break;
        /*
            btns.push(
              <Button
                key={2}
                danger
                loading={btnDisableLoading[record.id]}
                onClick={() => disableAccount(record)}
              >
                Disable
              </Button>
            );
            break;
          case UserStatus.ResetPassword:
            btns.push(
              <Button
                key={1}
                danger
                loading={btnDisableLoading[record.id]}
                onClick={() => disableAccount(record)}
              >
                Disable
              </Button>
            );
            break;
          case UserStatus.Ban:
            btns.push(
              <Button
                key={1}
                loading={btnEnableLoading[record.id]}
                onClick={() => enableAccount(record)}
              >
                Enable
              </Button>
            );
            break;
            */
        //   default:
        //     break;
        // }

        return (
          <Space size="middle">
            <Button.Group>{btns}</Button.Group>
          </Space>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      {contextHolder}
      <AccountFilter />
      <Table
        loading={loading}
        form={form}
        columns={columns}
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        dataSource={data} // Use the dummy data directly
        rowKey="id" // Use `id` as the row key
        pagination={{
          pageSize: 10,
          onChange: (page) => {
            changePageHandler(page);
          },
        }}
      />
    </Form>
  );
}
