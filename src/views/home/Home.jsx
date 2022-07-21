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

const { Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
  const [collapsed, setCollapsed] = useState(true);
  const [cookieUser, setCookieUser] = useCookies(["user"]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEditProf, setIsModalVisibleEditProf] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState("");
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const uploadButton = (
    <div className="editImg">
      <EditOutlined />
      Edit
    </div>
  );

  window.onresize = function onresize() {
    if (typeof window.innerWidth != "undefined") {
      setViewportWidth(window.innerWidth);
    }
  };

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

  const convertDate = (value) => {
    const date = new Date(value);
    const day = date.getDate();
    const mounth = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + "-" + mounth + "-" + year;
  };

  const onFinish = async (data) => {
    const dataUser = await getDataUsers();
    const user = dataUser.filter((element) => {
      return element.code === data.code || element.email === data.email;
    });
    if (user.length === 1) {
      if (!data.citizenId) {
        data.citizenId = "";
      }
      if (!data.hometouwn) {
        data.hometouwn = "";
      }
      if (!data.phone) {
        data.phone = "";
      }
      if (!data.username) {
        data.username = "";
      }
      await updateDataUser(
        data,
        cookieUser.user,
        user[0].password,
        !urlImage ? "" : urlImage,
        user[0].dateJoin
      );
      form.resetFields();
      success("Update student success");
      getDataUser();
      setIsModalVisibleEditProf(false);
    } else {
      error("Student code or email already exist");
    }
  };

  const onFinishFailed = () => {};

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

  const handleChange = (info) => {
    console.log(info.file.status);
    if (info.file.status === "uploading") {
      warning("Updating image");
      setLoading(true);
    }
    if (info.file.status === "done") {
    }
  };
  const beforeUpload = (file) => {};

  const customUpload = async ({ file }) => {
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadTask = storage.ref(`images/${file.name}`).put(file, metadata);

    uploadTask.on(
      "state_change",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setUrlImage(url);
            if (user[0].dateOfBirth === undefined) {
              user[0].dateOfBirth = "";
            }
            if (user[0].citizenId === undefined) {
              user[0].citizenId = "";
            }
            if (user[0].phone === undefined) {
              user[0].phone = "";
            }
            if (user[0].gender === undefined) {
              user[0].gender = "";
            }
            if (user[0].hometouwn === undefined) {
              user[0].hometouwn = "";
            }
            if (user[0].username === undefined) {
              user[0].username = "";
            }
            updateDataUser(
              user[0],
              cookieUser.user,
              user[0].password,
              url,
              user[0].dateJoin
            );
            getDataUser();
            console.log(url);
            setLoading(false);
          });
      }
    );
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
            padding: "0 24px",
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

      {/* modal hiển thị thông tin user */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className="modal_display_info_user">
          <div>
            <Spin spinning={loading}>
              {user.length !== 0 && user.image !== "" ? (
                <Avatar size={120} src={user[0].image} />
              ) : (
                <Avatar size={120} icon={<UserOutlined />} />
              )}
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customUpload}
              >
                {image ? <img src={image} alt="avatar" /> : uploadButton}
              </Upload>
            </Spin>
          </div>
          <div>
            <Title level={3} style={{ color: "#36363c", fontWeight: "700" }}>
              DETAIL PROFILE
            </Title>
            <div className="modal_display_info_user_content">
              <div>
                <table>
                  <tbody>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        UserName
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].code : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Email</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].email : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Citizen Id
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].citizenId : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Gender</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].gender : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal_display_infor_user_colLeft">
                <table>
                  <tbody>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Hometouwn
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].hometouwn : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Phone Number
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].phone : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Name</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? user[0].username : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Date Join
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {user.length !== 0 ? convertDate(user[0].dateJoin) : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="group_btn_edit_profile">
          <button
            onClick={showEditPro}
            className="btn_edit_profile ant-btn-primary ant-btn"
          >
            Edit Profile
          </button>
        </div>
      </Modal>

      {/* modal sửa thông tin user */}

      <Modal
        title="Edit Profile User"
        visible={isModalVisibleEditProf}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        forceRender
      >
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <div className="formAddUpdateStudent">
            <div className="formAddUpdateStudent-item">
              <Form.Item>
                <Title level={5}>Username</Title>
                <Form.Item
                  name="code"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length > 0 && value.length < 7) {
                          return Promise.reject("Code length 7-20");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Email</Title>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input placeholder="Email" type="email" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Name</Title>
                <Form.Item name="username">
                  <Input placeholder="Name" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Gender</Title>
                <Form.Item name="gender">
                  <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form.Item>
            </div>
            <div className="formAddUpdateStudent-item">
              <Form.Item>
                <Title level={5}>Date of birth</Title>
                <Form.Item name="dateOfBirth">
                  <DatePicker format={"YYYY/MM/DD"} />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Hometouwn</Title>
                <Form.Item name="hometouwn">
                  <Input placeholder="Hometown" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Citizen ID</Title>
                <Form.Item name="citizenId">
                  <Input placeholder="ID" type="number" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Phone number</Title>
                <Form.Item name="phone">
                  <Input placeholder="Phone" type="number" />
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            {
              <Button
                type="primary"
                htmlType="submit"
                className="btn_add_up_stu"
              >
                UPDATE
              </Button>
            }
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Home;
