import React, { useState } from "react";
import {
    Input,
    Button,
    Typography,
    Modal,
    Select,
    Form,
    Radio,
    DatePicker,
    message,
    Upload
} from "antd";
import getDataStudent, {
    addDataStudent,
    updateDataStudent
} from "../../services/student";
import { storage } from "../../firebase/config";
import { UploadOutlined } from "@ant-design/icons";
import checkLengthRequire, { checkEmail, checkChooseRadio } from '../../utils/validateForm.js'

const { Title } = Typography;
const { Option } = Select;

const layout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

const success = mess => {
    message.success(mess);
};

const error = mess => {
    message.error(mess);
};

function ModalAddUpdateInforStudent(props) {
    const [urlImage, setUrlImage] = useState("");
    const [fileList, setFileList] = useState([]);

    // Hàm call api add và update thông tin sinh viên
    const onFinish = async values => {
        if (props.displayBtnAdd) {
            const dataStudent = await getDataStudent();
            const user = dataStudent.filter(element => {
                return (
                    element.code === values.code ||
                    element.email === values.email
                );
            });
            if (user.length === 0) {
                await addDataStudent(values, urlImage);
                props.form.resetFields();
                success("Create student success");
                setFileList([]);
                props.getStudent();
            } else {
                error("Code and email no duplicates");
            }
        } else {
            const dataStudent = await getDataStudent();
            const user = dataStudent.filter(element => {
                return (
                    element.code === values.code ||
                    element.email === values.email
                );
            });
            if (user.length === 1) {
                await updateDataStudent(
                    values,
                    props.idStudentUpdate,
                    urlImage ? urlImage : user[0].image
                );
                success("Update student success");
                setFileList([]);
                props.getStudent();
                props.handleCancel();
            } else {
                error("Student code or email already exist");
            }
        }
    };

    const customUpload = async ({ onSuccess, onProgress, onError, file }) => {
        const metadata = {
            contentType: "image/jpeg"
        };

        const uploadTask = storage
            .ref(`images/${file.name}`)
            .put(file, metadata);

        uploadTask.on(
            "state_change",
            function progress(snapshot) {
                onProgress(
                    {
                        percent:
                            Math.floor(
                                snapshot.bytesTransferred / snapshot.totalBytes
                            ).toFixed(2) * 100
                    },
                    file
                );
            },
            function error(err) {
                onError(err, file);
            },

            function complete() {
                storage
                    .ref("images")
                    .child(file.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrlImage(url);
                        storage
                            .ref("images")
                            .child(file.name)
                            .getDownloadURL()
                            .then(url => {
                                setUrlImage(url);
                                console.log(url);
                                onSuccess(url, file);
                            });
                    });
            },
            snapshot => {},
            error => {
                console.log(error);
            }
        );
    };

    const onChangeUpload = info => {
        setFileList([info.file]);
    };

    const onFinishFailed = async errorInfo => {
        if (props.displayBtnAdd) {
            error("Create student failed");
        } else {
            error("Update student failed");
        }
    };
    return (
        <div>
            <Modal
                title={props.title}
                visible={props.visible}
                onCancel={props.handleCancel}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
                forceRender
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    form={props.form}
                >
                    <div className="formAddUpdateStudent">
                        <div className="formAddUpdateStudent-item">
                            <Form.Item>
                                <Title level={5}>Student Code</Title>
                                <Form.Item
                                    name="code"
                                    rules={[
                                        checkLengthRequire(7, 20, 'Student Code')
                                    ]}
                                >
                                    <Input placeholder="Student Code" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Name</Title>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        checkLengthRequire(7, 20, 'Name')
                                    ]}
                                >
                                    <Input placeholder="Name" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Email</Title>
                                <Form.Item
                                    name="email"
                                    rules={checkEmail()}
                                >
                                    <Input placeholder="Email" type="email" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Gender</Title>
                                <Form.Item
                                    name="gender"
                                    rules={checkChooseRadio()}
                                >
                                    <Radio.Group>
                                        <Radio value="Male">Male</Radio>
                                        <Radio value="Female">Female</Radio>
                                        <Radio value="other">Other</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Status</Title>
                                <Form.Item
                                    name="status"
                                    rules={checkChooseRadio()}
                                >
                                    <Radio.Group>
                                        <Radio value="Studying">Studying</Radio>
                                        <Radio value="Studyed">Studyed</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Date of birth</Title>
                                <Form.Item
                                    name="dateOfBirth"
                                    rules={checkChooseRadio()}
                                >
                                    <DatePicker format={"YYYY/MM/DD"} />
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className="formAddUpdateStudent-item">
                            <Form.Item>
                                <Title level={5}>Hometouwn</Title>
                                <Form.Item
                                    name="hometouwn"
                                    rules={[
                                        checkLengthRequire(7, 100, 'Hometouwn')
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
                                        checkLengthRequire(11, 13, 'Citizen ID')
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
                                        checkLengthRequire(9, 11, 'Phone number')
                                    ]}
                                >
                                    <Input placeholder="Phone" type="number" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Specialized</Title>
                                <Form.Item
                                    name="specialized"
                                    rules={checkChooseRadio()}
                                >
                                    <Select>
                                        <Option value="Information Technology">
                                            Information Technology
                                        </Option>
                                        <Option value="Medicine">
                                            Medicine
                                        </Option>
                                        <Option value="Travel">Travel</Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Class</Title>
                                <Form.Item
                                    name="class"
                                    rules={checkChooseRadio()}
                                >
                                    <Select>
                                        <Option value="D101">D101</Option>
                                        <Option value="D115">D115</Option>
                                        <Option value="D112">D112</Option>
                                        <Option value="D118">D118</Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Ganeration</Title>
                                <Form.Item
                                    name="ganeration"
                                    rules={checkChooseRadio()}
                                >
                                    <Select>
                                        <Option value="11">11</Option>
                                        <Option value="12">12</Option>
                                        <Option value="13">13</Option>
                                        <Option value="14">14</Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Title level={5}>Avatart</Title>
                                <Form.Item>
                                    <Upload
                                        customRequest={e => customUpload(e)}
                                        fileList={fileList}
                                        onChange={onChangeUpload}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            Click to upload avatart
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item>
                        {props.displayBtnAdd ? (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="btn_add_up_stu"
                            >
                                ADD
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="btn_add_up_stu"
                            >
                                UPDATE
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ModalAddUpdateInforStudent;
