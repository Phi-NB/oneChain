import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Avatar, Form, Drawer } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/Home.scss";
import ContentHomeStudent from "../../components/ContentHomeStudent/index.jsx";
import { useCookies } from "react-cookie";
import getDataUsers from "../../services/user.js";
import ModalDisplayInforUser from "./ModalDisplayInforUser";
import ModalUpdateUser from "./ModalDisplayUpdateUser";

const { Content } = Layout;

function Home(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [cookieUser, setCookieUser] = useCookies(["user"]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleEditProf, setIsModalVisibleEditProf] = useState(false);
    const [form] = Form.useForm();
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    useEffect(() => {
        getDataUser();
    }, []);

    const getDataUser = async () => {
        const response = await getDataUsers();
        const user = response.filter(doc => {
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
        // showInfoUser()
    };
    const handleCancelModalUpdate = () => {
        setIsModalVisible(true);
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
            dateOfBirth: user[0].dateOfBirth
                ? moment(user[0].dateOfBirth)
                : null,
            hometouwn: user[0].hometouwn,
            citizenId: user[0].citizenId,
            phone: user[0].phone
        });
    };

    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };

    const showDrawer = data => {
        setVisibleDrawer(data);
    };

    return (
        <Layout>
            <Layout className="site-layout">
                <Content
                    className=""
                    style={{
                        minHeight: 280
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
                        {user.length !== 0 &&
                        user[0].image !== undefined &&
                        user[0].image !== "" ? (
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
                                label: "Student"
                            },
                            {
                                key: "2",
                                icon: <UserOutlined />,
                                label: "Teacher"
                            }
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
                showInfoUser={showInfoUser}
            />

            {/* modal sửa thông tin user */}
            <ModalUpdateUser
                visible={isModalVisibleEditProf}
                onCancel={handleCancelModalUpdate}
                getDataUser={getDataUser}
                form={form}
            />
        </Layout>
    );
}

export default Home;
