import {
  UserOutlined,
  LogoutOutlined,
  UploadOutlined,
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
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/Home.scss";
import ContentHomeStudent from "../../components/ContentHomeStudent.jsx";
import { useCookies } from "react-cookie";
import getDataUsers from "../../services/user.js";

const { Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function Home(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [cookieUser, setCookieUser] = useCookies(["user"]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEditProf, setIsModalVisibleEditProf] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

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

  const getcollapsed = (data) => {
    setCollapsed(data);
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

    return day + "/" + mounth + "/" + year;
  };

  const onFinish = () => {};

  const onFinishFailed = () => {};

  const showEditPro = () => {
    setIsModalVisibleEditProf(true);
    setIsModalVisible(false);
    form.setFieldsValue({
      code: user[0].code,
      email: user[0].email, 
    });
  };

  const onPreviewUpload = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
    console.log(src);
  };

  const onChangeUpload = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div>
          <div className="logo">
            <Avatar onClick={showInfoUser} size={64} icon={<UserOutlined />} />
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

      {/* modal hiển thị thông tin user */}
      <Modal
        title="Information User"
        visible={isModalVisible}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className="modal_display_info_stu">
          <div>
            <div className="modal_display_info_stu_item">
              <p>Code: </p>
              <p className="modal_display_info_stu_item_value">
                {user.length !== 0 ? user[0].code : ""}
              </p>
            </div>
            <div className="modal_display_info_stu_item">
              <p>Email: </p>
              <p className="modal_display_info_stu_item_value">
                {user.length !== 0 ? user[0].email : ""}
              </p>
            </div>
            <div className="modal_display_info_stu_item">
              <p>Date Join: </p>
              <p className="modal_display_info_stu_item_value">
                {user.length !== 0 ? convertDate(user[0].dateJoin) : ""}
              </p>
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "45%" }}>
              <Form.Item>
                <Title level={5}>Code</Title>
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
                  <Input placeholder="Code" />
                </Form.Item>
              </Form.Item>
              {/* <Form.Item>
                <Title level={5}>Avatart</Title>
                <Form.Item name="code">
                  <ImgCrop rotate>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChangeUpload}
                      onPreview={onPreviewUpload}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Form.Item> */}
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
                <Form.Item
                  name="username"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length < 7 || value.length > 20) {
                          return Promise.reject("Username length 7-20");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Gender</Title>
                <Form.Item
                  name="gender"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form.Item>
            </div>
            <div style={{ width: "45%" }}>
              <Form.Item>
                <Title level={5}>Date of birth</Title>
                <Form.Item
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
                >
                  <DatePicker format={"YYYY/MM/DD"} />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Hometouwn</Title>
                <Form.Item
                  name="hometouwn"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length < 7 || value.length > 100) {
                          return Promise.reject("Hometouwn length 7-100");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Hometown" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Citizen ID</Title>
                <Form.Item
                  name="citizenId"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length > 13 || value.length < 11) {
                          return Promise.reject("Citizen ID length 12");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input placeholder="ID" type="number" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Phone number</Title>
                <Form.Item
                  name="phone"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length > 11 || value.length < 9) {
                          return Promise.reject("Phone number length 10");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
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
