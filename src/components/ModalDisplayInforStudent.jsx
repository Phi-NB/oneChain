import React from "react";
import { Modal, Typography, Avatar } from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";

const convertDate = (value) => {
  const date = new Date(value);
  const day = date.getDate();
  const mounth = date.getMonth() + 1;
  const year = date.getFullYear();
  return day + "-" + mounth + "-" + year;
};

const { Title } = Typography;

function ModalDisplayInforStudent(props) {

  return (
    <div>
      <Modal
        visible={props.visible}
        onCancel={props.onCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        forceRender
        className="modal_show_infor"
      >
        <div className="modal_display_info_stu">
          <div className="modal_display_info_stu_avatar">
            {props.data.image !== "" ? (
              <Avatar size={120} src={props.data.image} />
            ) : (
              <Avatar size={120} icon={<UserOutlined />} />
            )}
            <div className="modal_display_info_stu_name">
              <p className="">{props.data.username}</p>
            </div>
            <div className="modal_display_info_stu_name">
              <p className="">{props.data.code}</p>
            </div>
          </div>
          <div className="modal_display_info_stu_list">
            <div className="modal_display_info_stu_item">
              <Title level={3}>INFORMATION</Title>
            </div>
            <div className="modal_display_info_stu_item">
              <div className="modal_display_info_stu_item_left">
                <p className="modal_display_info_stu_item_value">Email</p>
                <p>{props.data.email}</p>
              </div>
              <div className="modal_display_info_stu_item_right">
                <p className="modal_display_info_stu_item_value">Phone</p>
                <p>{props.data.phone}</p>
              </div>
            </div>
            <div className="modal_display_info_stu_item">
              <div className="modal_display_info_stu_item_left">
                <p className="modal_display_info_stu_item_value">
                  Date of birth
                </p>
                <p>{convertDate(props.data.dateOfBirth)}</p>
              </div>
              <div className="modal_display_info_stu_item_right">
                <p className="modal_display_info_stu_item_value">Gender</p>
                <p>{props.data.gender}</p>
              </div>
            </div>
            <div className="modal_display_info_stu_item">
              <div className="modal_display_info_stu_item_left">
                <p className="modal_display_info_stu_item_value">Ganeration</p>
                <p>{props.data.ganeration}</p>
              </div>
              <div className="modal_display_info_stu_item_right">
                <p className="modal_display_info_stu_item_value">Class</p>
                <p>{props.data.class}</p>
              </div>
            </div>

            <div className="modal_display_info_stu_item">
              <div className="modal_display_info_stu_item_left">
                <p className="modal_display_info_stu_item_value">Hometouwn</p>
                <p>{props.data.hometouwn}</p>
              </div>
              <div className="modal_display_info_stu_item_right">
                <p className="modal_display_info_stu_item_value">Status</p>
                <p>{props.data.status}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalDisplayInforStudent;
