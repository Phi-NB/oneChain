import {
  UserOutlined,
  LogoutOutlined,
  UploadOutlined,
  MenuFoldOutlined,
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Modal,
  Form,
  Typography,
  Input,
  Radio,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Spin,
  Drawer,
} from "antd";
import moment from "moment";
import ImgCrop from "antd-img-crop";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/Home.scss";
import ContentHomeStudent from "../../components/ContentHomeStudent.jsx";
import { useCookies } from "react-cookie";
import getDataUsers, { updateDataUser } from "../../services/user.js";
import { storage } from "../../firebase/config";
import ModalDisplayInforUser from "../../components/ModalDisplayInforUser";
import ModalUpdateUser from "../../components/ModalDisplayIUpdateUser";

const { Content } = Layout;
const { Title } = Typography;

const success = (mess) => {
  message.success(mess);
};

const error = (mess) => {
  message.error(mess);
};

const warning = (mess) => {
  message.warning(mess);
};

function Home(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [cookieUser, setCookieUser] = useCookies(["user"]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEditProf, setIsModalVisibleEditProf] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    const response = await getDataUsers();
    const user = response.filter((doc) => {
      return doc.id === cookieUser.user;
    });
    setUser(user);
  };

  const logout = () => {
    setCookieUser("user", "", { path: "/" });
    navigate("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisibleEditProf(false);
  };

  const showInfoUser = () => {
    setIsModalVisible(true);
  };

  const showEditPro = () => {
    setIsModalVisibleEditProf(true);
    setIsModalVisible(false);
    form.setFieldsValue({
      code: user[0].code,
      email: user[0].email,
      username: user[0].username,
      gender: user[0].gender,
      dateOfBirth: user[0].dateOfBirth ? moment(user[0].dateOfBirth) : null,
      hometouwn: user[0].hometouwn,
      citizenId: user[0].citizenId,
      phone: user[0].phone,
    });
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const showDrawer = (data) => {
    setVisibleDrawer(data);
  };

  return (
    <Layout>
      <Layout className="site-layout">
        <Content
          className=""
          style={{
            minHeight: 280,
          }}
        >
          <ContentHomeStudent showDrawer={showDrawer} />
        </Content>
      </Layout>
      <Drawer
        placement="left"
        closable={false}
        onClose={onCloseDrawer}
        visible={visibleDrawer}
        width={window.innerWidth > 900 ? 240 : 200}
      >
        <div>
          <div className="logo">
            {user.length !== 0 && user.image !== "" ? (
              <Avatar
                onClick={showInfoUser}
                size={120}
                src={user[0].image}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Avatar
                onClick={showInfoUser}
                size={120}
                icon={<UserOutlined />}
              />
            )}
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
              {
                key: "2",
                icon: <UserOutlined />,
                label: "Teacher",
              },
            ]}
          />
        </div>
        <div className="logout">
          <LogoutOutlined onClick={logout} />
          <p>Logout</p>
        </div>
      </Drawer>

      <ModalDisplayInforUser
        visible={isModalVisible}
        onCancel={handleCancel}
        user={user}
        getDataUser={getDataUser}
        showEditPro={showEditPro}
      />

      {/* modal sửa thông tin user */}
      <ModalUpdateUser
        visible={isModalVisibleEditProf}
        onCancel={handleCancel}
        getDataUser={getDataUser}
      />
    </Layout>
  );
}

export default Home;
