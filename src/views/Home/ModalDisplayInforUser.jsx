import React, { useState } from "react";
import { Modal, Spin, Avatar, Upload, Typography } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { storage } from "../../firebase/config.js";
import { updateDataUser } from "../../services/user.js";
import { useCookies } from "react-cookie";
import ModalChangePassword from "./ModalChangePassword.jsx";
import "../../styles/ModalDisplayInforUser.scss";

const { Title } = Typography;

const convertDate = value => {
    const date = new Date(value);
    const day = date.getDate();
    const mounth = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + "-" + mounth + "-" + year;
};

const uploadButton = (
    <div className="editImg">
        <EditOutlined />
        Edit
    </div>
);

function ModalDisplayInforUser(props) {
    const [loading, setLoading] = useState(false);
    const [cookieUser, setCookieUser] = useCookies(["user"]);
    const [displayModalChangePass, setDisplayModalChangePass] = useState(false);

    const showChangePass = () => {
        setDisplayModalChangePass(true);
        props.onCancel();
    };

    const onCancel = () => {
        setDisplayModalChangePass(false);
        props.showInfoUser();
    };

    const customUpload = async ({ file }) => {
        setLoading(true);
        const metadata = {
            contentType: "image/jpeg"
        };
        const uploadTask = storage
            .ref(`images/${file.name}`)
            .put(file, metadata);

        uploadTask.on(
            "state_change",
            snapshot => {},
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(file.name)
                    .getDownloadURL()
                    .then(url => {
                        updateDataUser(
                            props.user[0],
                            cookieUser.user,
                            props.user[0].password,
                            url
                        );
                        props.getDataUser();
                        setTimeout(() => {
                            setLoading(false);
                        }, 2000);
                    });
            }
        );
    };

    const dataTable1 = [
        {
            title: "Username",
            data: props.user.length !== 0 ? props.user[0].code : ""
        },
        {
            title: "Email",
            data: props.user.length !== 0 ? props.user[0].email : ""
        },
        {
            title: "Citizen Id",
            data: props.user.length !== 0 ? props.user[0].citizenId : ""
        },
        {
            title: "Gender",
            data: props.user.length !== 0 ? props.user[0].gender : ""
        }
    ];

    const dataTable2 = [
        {
            title: "Hometouwn",
            data: props.user.length !== 0 ? props.user[0].hometouwn : ""
        },
        {
            title: "Phone Number",
            data: props.user.length !== 0 ? props.user[0].phone : ""
        },
        {
            title: "Name",
            data: props.user.length !== 0 ? props.user[0].username : ""
        },
        {
            title: "Date Join",
            data:
                props.user.length !== 0
                    ? convertDate(props.user[0].dateJoin)
                    : ""
        }
    ];

    const trTable = ({ title, data }) => {
        return (
            <>
                <td className="modal_display_infor_user_label">{title}</td>
                <td className="modal_display_info_user_value">
                    <span>/</span>
                    {data ? data : ""}
                </td>
            </>
        );
    };

    return (
        <div>
            <Modal
                visible={props.visible}
                onCancel={props.onCancel}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
            >
                <div className="modal_display_info_user">
                    <div>
                        <Spin spinning={loading}>
                            {props.user.length !== 0 &&
                            props.user[0].image !== undefined &&
                            props.user[0].image !== "" ? (
                                <Avatar size={120} src={props.user[0].image} />
                            ) : (
                                <Avatar size={120} icon={<UserOutlined />} />
                            )}
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                customRequest={customUpload}
                            >
                                {uploadButton}
                            </Upload>
                        </Spin>
                    </div>
                    <div>
                        <Title
                            level={3}
                            style={{ color: "#36363c", fontWeight: "700" }}
                        >
                            DETAIL PROFILE
                        </Title>
                        <div className="modal_display_info_user_content">
                            <div>
                                <table>
                                    <tbody>
                                        {dataTable1.map((item, index) => (
                                            <tr className="modal_display_infor_user" key={index}>
                                                {trTable(item)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal_display_infor_user_colLeft">
                                <table>
                                    <tbody>
                                        {dataTable2.map((item, index) => (
                                            <tr className="modal_display_infor_user" key={index}>
                                                {trTable(item)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="group_btn_edit_profile">
                    <button
                        onClick={showChangePass}
                        className="btn_edit_profile ant-btn-primary ant-btn"
                        style={{ marginRight: 8 }}
                    >
                        Change Password
                    </button>
                    <button
                        onClick={props.showEditPro}
                        className="btn_edit_profile ant-btn-primary ant-btn"
                    >
                        Edit Profile
                    </button>
                </div>
            </Modal>

            <ModalChangePassword
                onCancel={onCancel}
                displayModal={displayModalChangePass}
                user={props.user[0]}
                getDataUser={props.getDataUser}
            />
        </div>
    );
}

export default ModalDisplayInforUser;
