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
  Spin,
  Upload,
  Progress,
} from "antd";
import getDataStudent, {
  addDataStudent,
  updateDataStudent,
} from "../services/student";
import { storage } from "../firebase/config";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const success = (mess) => {
  message.success(mess);
};

const error = (mess) => {
  message.error(mess);
};

function ModalAddUpdateInforStudent(props) {
  const [urlImage, setUrlImage] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);

  // Hàm call api add và update thông tin sinh viên
  const onFinish = async (values) => {
    console.log(values);
    if (props.displayBtnAdd) {
      const dataStudent = await getDataStudent();
      const user = dataStudent.filter((element) => {
        return element.code === values.code || element.email === values.email;
      });
      if (user.length === 0) {
        await addDataStudent(values, urlImage);
        props.form.resetFields();
        success("Create student success");
        props.getStudent();
      } else {
        error("Code and email no duplicates");
      }
    } else {
      const dataStudent = await getDataStudent();
      const user = dataStudent.filter((element) => {
        return element.code === values.code || element.email === values.email;
      });
      if (user.length === 1) {
        await updateDataStudent(values, props.idStudentUpdate, urlImage);
        success("Update student success");
        props.getStudent();
        props.handleCancel();
      } else {
        error("Student code or email already exist");
      }
    }
  };

  const getFileUploadInput = (e) => {
    if (e.target.files[0]) {
      const uploadTask = storage
        .ref(`images/${e.target.files[0].name}`)
        .put(e.target.files[0]);

      uploadTask.on(
        "state_change",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(e.target.files[0].name)
            .getDownloadURL()
            .then((url) => {
              setUrlImage(url);
            });
        }
      );
    }
  };

  const handleChange = (info) => {
    // if (info.file.status === "uploading") {
    //   console.log(info.file, info.fileList);
    // }

    // if (info.file.status === "done") {
    //   success(`${info.file.name} file uploaded successfully`);
    // } else if (info.file.status === "error") {
    //   error(`${info.file.name} file upload failed.`);
    // }
  };

  const customUpload = async ({ onSuccess, onProgress, onError, file }) => {
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadTask = storage.ref(`images/${file.name}`).put(file, metadata);

    uploadTask.on(
      "state_change",
      function progress(snapshot) {
        onProgress(
          {
            percent:
              Math.floor(
                snapshot.bytesTransferred / snapshot.totalBytes
              ).toFixed(2) * 100,
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
          .then((url) => {
            setUrlImage(url);
            storage
              .ref("images")
              .child(file.name)
              .getDownloadURL()
              .then((url) => {
                setUrlImage(url);
                console.log(url);
                onSuccess(url, file);
              });
          });
      },
      (snapshot) => {},
      (error) => {
        console.log(error);
      }
    );
  };

  const onFinishFailed = async (errorInfo) => {
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
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={props.form}
        >
          <div className="formAddUpdateStudent">
            <div className="formAddUpdateStudent-item">
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
                  <Input placeholder="Student Code" />
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
              <Form.Item>
                <Title level={5}>Status</Title>
                <Form.Item
                  name="status"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
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
              <Form.Item>
                <Title level={5}>Specialized</Title>
                <Form.Item
                  name="specialized"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
                >
                  <Select>
                    <Option value="Information Technology">
                      Information Technology
                    </Option>
                    <Option value="Medicine">Medicine</Option>
                    <Option value="Travel">Travel</Option>
                  </Select>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Class</Title>
                <Form.Item
                  name="class"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
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
                    onChange={handleChange}
                    customRequest={(e) => customUpload(e)}
                  >
                    <Button icon={<UploadOutlined />}>Click to upload avatart</Button>
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
