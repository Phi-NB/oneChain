import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Popconfirm,
  Typography,
  Modal,
  Select,
  Layout,
  Table,
  Form,
  Radio,
  DatePicker,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "../styles/ContentStudentHome.scss";
import getDataStudent, {
  addDataStudent,
  deleteDataStudent,
  updateDataStudent,
  filterStudent,
  searchStudent
} from "../services/student";
import moment from "moment";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Header } = Layout;

const success = (mess) => {
  message.success(mess);
};

const error = (mess) => {
  message.error(mess);
};

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

function ContentHomeStudent(props) {
  // Khai báo các state
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [displayBtnAdd, setDisplayBtnAdd] = useState(false);
  const [idStudent, setIdStudent] = useState("");
  const [idStudentUpdate, setIdStudentUpdate] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  const [form] = Form.useForm();

  // Khởi chạy dữ liệu
  useEffect(() => {
    getStudent();
  }, []);

  // Hàm lấy dữ liệu
  const getStudent = async () => {
    const data = await getDataStudent();
    setStudents(data);
  };
  
  const data = students.map((student, index) => {
    return {
      key: index + 1,
      id: student.id,
      citizenId: student.citizenId,
      class: student.class,
      code: student.code,
      dateOfBirth: student.dateOfBirth,
      email: student.email,
      ganeration: student.ganeration,
      gender: student.gender,
      hometouwn: student.hometouwn,
      specialized: student.specialized,
      username: student.username,
      phone: student.phone,
      status: student.status,
    };
  });


  const columns = [
    {
      title: "Index",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Student Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Specialized",
      dataIndex: "specialized",
      key: "specialized",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Sure to update?"
            onClick={() => setIdStudentUpdatess(record)}
            onConfirm={() => handleUpdateStudent(record)}
          >
            <EditOutlined className="icon-handle" />
          </Popconfirm>
          <Popconfirm
            title="Sure to delete?"
            onClick={() => setIdStudentDelete(record)}
            onConfirm={() => {
              handleDeleteStudent(record);
            }}
          >
            <DeleteOutlined className="icon-handle" />
          </Popconfirm>
          <Popconfirm
            title="Sure to see?"
            onClick={() => setIdStudentDelete(record)}
            onConfirm={() => {
              
            }}
          >
            <EyeOutlined className="icon-handle" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Hàm lấy id để xóa phần tử
  const setIdStudentDelete = (record) => {
    setIdStudent(record.id);
  };
  const setIdStudentUpdatess = (record) => {
    setIdStudentUpdate(record.id);
  };

  // Hàm lấy id và hiển thị form update
  const handleUpdateStudent = (record) => {
    console.log(record);
    setTitleForm("Update imformation student");
    setVisible(true);
    setDisplayBtnAdd(false);
    form.setFieldsValue({
      citizenId: record.citizenId,
      class: record.class,
      code: record.code,
      dateOfBirth: moment(record.dateOfBirth),
      email: record.email,
      ganeration: record.ganeration,
      gender: record.gender,
      hometouwn: record.hometouwn,
      specialized: record.specialized,
      username: record.username,
      phone: record.phone,
      status: record.status,
    });
  };

  // Hàm lấy id và hiển thị form add
  const handleAdd = () => {
    setTitleForm("Add information student");
    setVisible(true);
    setDisplayBtnAdd(true);
  };

  // Hàm thoát form
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  // Hàm tìm kiếm theo tên

  const onSearch = async (value) => {
    const students = await getDataStudent();
    const result = students.filter(student => {
      return student.code.includes(value)
    })
    setStudents(result)
  };

  // Hàm lọc sinh viên theo trạng thái

  const handleChangeSelectionStatus = async (value) => {
    const result = await filterStudent("status", value);
    setStudents(result);
  };

  // Hàm lọc sinh viên theo lớp
  const handleChangeSelectionClass = async (value) => {
    const result = await filterStudent("class", value);
    setStudents(result);
  };


  // Hàm call api xóa thông tin người dùng
  const handleDeleteStudent = async (record) => {
    await deleteDataStudent(idStudent);
    success("Delete student successfully");
    getStudent();
  };

  const onFinish = async (values) => {
    if (displayBtnAdd) {
      const dataStudent = await getDataStudent();
      const user = dataStudent.filter((element) => {
        return element.code === values.code || element.email === values.email;
      });
      if (user.length === 0) {
        await addDataStudent(values);
        form.resetFields();
        success("Create student success");
        getStudent();
      } else {
        error("Code and email no duplicates");
      }
    } else {
      const dataStudent = await getDataStudent();
      const user = dataStudent.filter((element) => {
        return (element.code === values.code || element.email === values.email) ;
      });

      if (user.length === 1) {
        await updateDataStudent(values, idStudentUpdate);
        form.resetFields();
        success("Update student success");
        getStudent();
      } else {
        error("Student code or email already exist");
      }
    }
  };

  const onFinishFailed = async (errorInfo) => {
    if (displayBtnAdd) {
      error("Create student failed");
    } else {
      error("Update student failed");
    }
  };

  // Render dữ liệu ra màn hình
  return (
    <div>
      <Header className="site-layout-background">
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => {
              props.collapsed(collapsed);
              setCollapsed(!collapsed);
            },
          }
        )}
        <Button className="add-student" onClick={handleAdd}>
          <UserAddOutlined />
          Add Student
        </Button>
      </Header>
      <div className="input-sort">
        <Search
          placeholder="Enter student code"
          onSearch={onSearch}
          enterButton
          style={{ width: "300px" }}
        />
        <Select
          defaultValue="Choose status"
          style={{ width: 200, marginLeft: "20px" }}
          onChange={handleChangeSelectionStatus}
        >
          <Option value="Studying">Studying</Option>
          <Option value="Studyed">Studyed</Option>
        </Select>
        <Select
          defaultValue="Choose class"
          style={{ width: 200, marginLeft: "20px" }}
          onChange={handleChangeSelectionClass}
        >
          <Option value="D101">D101</Option>
          <Option value="D115">D115</Option>
          <Option value="D112">D112</Option>
          <Option value="D118">D118</Option>
        </Select>
      </div>

      {/* Bảng render thông tin các học sinh */}

      <Table columns={columns} dataSource={data} pagination={false} />

      {/* Modal thêm và update thồng tin học sinh */}

      <Modal
        title={titleForm}
        visible={visible}
        onCancel={handleCancel}
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
                  <DatePicker format={"YYYY/MM/DD"}/>
                </Form.Item>
              </Form.Item>
            </div>
            <div style={{ width: "45%" }}>
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
            </div>
          </div>
          <Form.Item>
            {displayBtnAdd ? (
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

export default ContentHomeStudent;
