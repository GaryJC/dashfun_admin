import { Layout, theme } from "antd";
import SideMenu from "./SideMenu";
import BackendAccounts from "./Menu_BackendAccount/BackendAccounts";
import Constants from "../modules/constants";
import { useCallback, useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import GameTable from "./Menu_Game/GameTable";
import JSEvent from "../utils/JSEvent";
import Events from "../modules/Events";
import TaskTable from "./Menu_Task/TaskTable";

const { Content } = Layout;

const { MenuItems } = Constants;

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const [selectedMenu, setSelectedMenu] = useState(MenuItems.BackendAccounts);
  const [currentContent, setCurrentContent] = useState(<BackendAccounts />);

  const onSelectMenu = useCallback((item) => {
    console.log("onSelectMenu", item);
    switch (item.key) {
      case MenuItems.BackendAccounts:
        setCurrentContent(<BackendAccounts />);
        break;
      case MenuItems.Game:
        setCurrentContent(<GameTable />);
        break;
      case MenuItems.Task:
        setCurrentContent(<TaskTable />);
        break;
      default:
        setCurrentContent(null);
        break;
    }
  }, []);

  useEffect(() => {
    const onLogout = () => {
      setCurrentContent(null);
    };

    JSEvent.on(Events.Account.Logout, onLogout);

    return () => {
      JSEvent.remove(Events.Account.Logout, onLogout);
    };
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <LoginModal />
      <SideMenu onSelectMenu={onSelectMenu} />
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        
        /> */}
        <Content
          style={{
            margin: "16px",
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {currentContent}
          </div>
        </Content>
        {/* <Footer>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Home;
