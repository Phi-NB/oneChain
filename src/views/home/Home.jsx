import {
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/Home.scss";
import db from "../../firebase/config.js";
import ContentHomeStudent from "../../components/ContentHomeStudent.jsx";
import { useCookies } from "react-cookie";

const { Sider, Content } = Layout;

const events = db.collection("user");
function Home(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [cookieUser, setCookieUser] = useCookies(["user"]);

  useEffect(() => {
    getDataUser();
  }, []);
  const getDataUser = () => {
    events.get().then((querySnapshot) => {
      const tempDoc = [];
      querySnapshot.forEach((doc) => {
        tempDoc.push({ id: doc.id, ...doc.data() });
      });
      const user = tempDoc.filter((doc) => {
        return doc.id === cookieUser.user;
      });
      setUser(user);
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getcollapsed = (data) => {
    setCollapsed(data);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div>
          <div className="logo">
            <Avatar size={64} icon={<UserOutlined />} />
            <p>{user.length !== 0 ? user[0].code : ""}</p>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Student",
              },
            ]}
          />
        </div>
        <div className="logout">
          <LogoutOutlined onClick={logout} />
          <p>Logout</p>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Content
          className=""
          style={{
            padding: "0 24px",
            minHeight: 280,
          }}
        >
          <ContentHomeStudent collapsed={getcollapsed} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
