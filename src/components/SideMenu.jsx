import { useState } from "react";
import { Menu, Layout } from "antd";
import {
  DesktopOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import AccountButton from "./AccountButton";
import Constants from "../modules/constants";
import PropTypes from "prop-types";

const { Sider } = Layout;

const { MenuItems } = Constants;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Backend Accounts", MenuItems.BackendAccounts, <UserOutlined />),
  getItem("Games", MenuItems.Game, <DesktopOutlined />),
  getItem("Task", MenuItems.Task, <UnorderedListOutlined />),
  // getItem("Games", "sub1", <UserOutlined />, [
  //   getItem("Create Game", MenuItems.CreateGame, <FileOutlined />),
  //   getItem("Update Game", "3"),
  // ]),
];

export default function SideMenu({ onSelectMenu }) {
  SideMenu.propTypes = {
    onSelectMenu: PropTypes.func.isRequired,
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <img src={"/img/logo_dashfun.jpeg"} />
      <div className="w-[60%] mx-auto my-5">
        <AccountButton />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onSelect={onSelectMenu}
      />
    </Sider>
  );
}
