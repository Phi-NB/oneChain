import React, { useState } from "react";
import { Modal, Spin, Avatar, Upload, Typography } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { storage } from "../firebase/config";
import { updateDataUser } from "../services/user.js";

import { useCookies } from "react-cookie";
const { Title } = Typography;

const convertDate = (value) => {
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

  const customUpload = async ({ file }) => {
    setLoading(true)
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
            if (props.user[0].dateOfBirth === undefined) {
              props.user[0].dateOfBirth = "";
            }
            if (props.user[0].citizenId === undefined) {
              props.user[0].citizenId = "";
            }
            if (props.user[0].phone === undefined) {
              props.user[0].phone = "";
            }
            if (props.user[0].gender === undefined) {
              props.user[0].gender = "";
            }
            if (props.user[0].hometouwn === undefined) {
              props.user[0].hometouwn = "";
            }
            if (props.user[0].username === undefined) {
              props.user[0].username = "";
            }
            updateDataUser(
              props.user[0],
              cookieUser.user,
              props.user[0].password,
              url,
              props.user[0].dateJoin
            );
            props.getDataUser();
            setTimeout(() => {
              setLoading(false);
            }, 2000)
          });
      }
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
              {props.user.length !== 0 && props.user[0].image !== "" ? (
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
                        {props.user.length !== 0 ? props.user[0].code : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Email</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 ? props.user[0].email : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Citizen Id
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 ? props.user[0].citizenId : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Gender</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 ? props.user[0].gender : ""}
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
                        {props.user.length !== 0 ? props.user[0].hometouwn : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Phone Number
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 ? props.user[0].phone : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">Name</td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 ? props.user[0].username : ""}
                      </td>
                    </tr>
                    <tr className="modal_display_infor_user">
                      <td className="modal_display_infor_user_label">
                        Date Join
                      </td>
                      <td className="modal_display_info_user_value">
                        <span>/</span>
                        {props.user.length !== 0 && props.user[0].dateJoin
                          ? convertDate(props.user[0].dateJoin)
                          : ""}
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
            onClick={props.showEditPro}
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
    </div>
  );
}

export default ModalDisplayInforUser;
