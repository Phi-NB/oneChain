import React from "react";
import { Modal, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const convertDate = value => {
    const date = new Date(value);
    const day = date.getDate();
    const mounth = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + "-" + mounth + "-" + year;
};

const { Title } = Typography;

function ModalDisplayInforStudent(props) {
    const item = ({ dataLeft, dataRight, titleLeft, titleRight }) => {
        return (
            <>
                <div className="modal_display_info_stu_item_left">
                    <p className="modal_display_info_stu_item_value">
                        {titleLeft}
                    </p>
                    <p>{dataLeft}</p>
                </div>
                <div className="modal_display_info_stu_item_right">
                    <p className="modal_display_info_stu_item_value">
                        {titleRight}
                    </p>
                    <p>{dataRight}</p>
                </div>
            </>
        );
    };
    const data = [
        {
            titleLeft: "Email",
            titleRight: "Phone",
            dataLeft: props.data.email,
            dataRight: props.data.phone
        },
        {
            titleLeft: "Date of Birth",
            titleRight: "Gender",
            dataLeft: convertDate(props.data.dateOfBirth),
            dataRight: props.data.gender
        },
        {
            titleLeft: "Ganeration",
            titleRight: "Class",
            dataLeft: props.data.ganeration,
            dataRight: props.data.class
        },
        {
            titleLeft: "Hometouwn",
            titleRight: "Status",
            dataLeft: props.data.hometouwn,
            dataRight: props.data.status
        }
    ];
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
                        {data.map((element, index) => (
                            <div
                                className="modal_display_info_stu_item"
                                key={index}
                            >
                                {item(element)}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ModalDisplayInforStudent;
