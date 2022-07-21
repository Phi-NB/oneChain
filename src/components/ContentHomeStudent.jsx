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
  Card,
  Col,
  Row,
  Avatar,
  Dropdown,
  Menu,
  Upload,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EyeOutlined,
  UserOutlined,
  MoreOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import "../styles/ContentStudentHome.scss";
import getDataStudent, {
  addDataStudent,
  deleteDataStudent,
  updateDataStudent,
  filterStudent,
  searchStudent,
} from "../services/student";
import moment from "moment";
import Loading from "../components/Loading.jsx";
import ModalDisplayInforStudent from "./ModalDisplayInforStudent";
import ModalAddUpdateInforStudent from "./ModalAddUpdateInforStudent";
import { storage } from "../firebase/config";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Header } = Layout;
const { Meta } = Card;

const success = (mess) => {
  message.success(mess);
};

const error = (mess) => {
  message.error(mess);
};

function ContentHomeStudent(props) {
  // Khai báo các state
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleFormShowInfo, setVisibleFormShowInfo] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [displayBtnAdd, setDisplayBtnAdd] = useState(false);
  const [idStudent, setIdStudent] = useState("");
  const [idStudentUpdate, setIdStudentUpdate] = useState("");
  const [inforStudent, setInforStudent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [displayTable, setDisplayTable] = useState(false);
  const [displayGrid, setDisplayTGrid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Khởi chạy dữ liệu
  useEffect(() => {
    try {
      getStudent();
    } catch {
    } finally {
    }
  }, []);

  // Hàm lấy dữ liệu
  const getStudent = async () => {
    const data = await getDataStudent();
    setStudents(data);
  };

  // Hàm chuyển đổi dữ liệu trước khi thêm vào bảng
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
      image: student.image,
    };
  });

  if (data.length === 0) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  if (isLoading) {
    return <Loading />;
  }

  const columns = [
    {
      title: "Index",
      dataIndex: "key",
      key: "key",
      align: "center",
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
      align: "center",
    },
    {
      title: "Specialized",
      dataIndex: "specialized",
      key: "specialized",
      align: "center",
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
      align: "center",
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
              showProfileStudent(record);
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
    setTitleForm("Update imformation student");
    setVisible(true);
    setDisplayBtnAdd(false);
    setIdStudentUpdate(record.id);
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

  // Hàm đóng modal hiển thị thông tin sinh viên
  const handleCancelFormShowInfo = () => {
    setVisibleFormShowInfo(false);
  };

  const showProfileStudent = (record) => {
    setVisibleFormShowInfo(true);
    setInforStudent(record);
  };

  // Hàm tìm kiếm theo mã sinh viên
  const onSearch = async (value) => {
    const students = await getDataStudent();
    const result = students.filter((student) => {
      return student.code.includes(value);
    });
    setStudents(result);
  };

  // Hàm lọc sinh viên theo trạng thái

  const handleChangeSelectionStatus = async (value) => {
    console.log("status", value);
    if (value === "all") {
      getStudent();
    } else {
      const result = await filterStudent("status", value);

      setStudents(result);
    }
  };

  // Hàm lọc sinh viên theo lớp
  const handleChangeSelectionClass = async (value) => {
    console.log("class", value);
    if (value === "all") {
      getStudent();
    } else {
      const result = await filterStudent("class", value);
      setStudents(result);
    }
  };

  // Hàm call api xóa thông tin người dùng
  const handleDeleteStudent = async (record) => {
    await deleteDataStudent(idStudent);
    success("Delete student successfully");
    getStudent();
  };

  const showGridView = () => {
    setDisplayTGrid(true);
    setDisplayTable(false);
  };

  const showTableView = () => {
    setDisplayTGrid(false);
    setDisplayTable(true);
  };

  const confirmDeleteStudentGridView = async (element) => {
    await deleteDataStudent(element.id);
    success("Delete student successfully");
    getStudent();
  };

  const menu = (element) => (
    <Menu
      items={[
        {
          label: (
            <span onClick={() => handleUpdateStudent(element)}>Update</span>
          ),
          key: "1",
        },
        {
          label: (
            <Popconfirm
              title="Title"
              onConfirm={() => confirmDeleteStudentGridView(element)}
            >
              Remove
            </Popconfirm>
          ),
          key: "3",
        },
      ]}
    />
  );

  const setShowDrawer = () => {
    props.showDrawer(true);
  }

  // Render dữ liệu ra màn hình
  return (
    <div>
      <Header className="site-layout-background">
        <Button className="add-student btnOpenDrawer" onClick={setShowDrawer} >
          <MenuUnfoldOutlined />
        </Button>
        <div className="site-layout-header-title">
          <Title style={{ color: "#fff" }} level={3}>
            STUDENT MANAGEMENT
          </Title>
        </div>
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
          className="input-search"
        />
        <div className="input-groups-select">
          <Select
            defaultValue="Choose status"
            onChange={handleChangeSelectionStatus}
            className="input-Select"
          >
            <Option value="all">All</Option>
            <Option value="Studying">Studying</Option>
            <Option value="Studyed">Studyed</Option>
          </Select>
          <Select
            defaultValue="Choose class"
            onChange={handleChangeSelectionClass}
            className="input-Select"
          >
            <Option value="all">All</Option>
            <Option value="D101">D101</Option>
            <Option value="D115">D115</Option>
            <Option value="D112">D112</Option>
            <Option value="D118">D118</Option>
          </Select>
        </div>
      </div>
      <div className='groupsBtn-tranfer-view'>
        <Button
          onClick={showGridView}
          type="primary"
          className="btn_add_up_stu"
        >
          View list as grid
        </Button>
        <Button
          onClick={showTableView}
          style={{ marginLeft: 20 }}
          type="primary"
          className="btn_add_up_stu"
        >
          View list as table
        </Button>
      </div>

      {/* Bảng render thông tin các học sinh */}

      {displayTable && (
        <Table columns={columns} dataSource={data} pagination={false} />
      )}

      {displayGrid && (
        <div className="site-card-wrapper">
          <Row gutter={42} justify="start">
            {data.map((element, index) => {
              return (
                <Col
                  xs={{ span: 24 }}
                  xl={{ span: 4 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  key={index}
                >
                  <Card
                    bordered={false}
                    style={{ marginBottom: 40, borderRadius: 6 }}
                  >
                    <Dropdown
                      className="drop-down"
                      overlay={menu(element)}
                      trigger={["click"]}
                    >
                      <MoreOutlined />
                    </Dropdown>

                    <div style={{ margin: "-14px 0" }}>
                      <Spin spinning={loading}>
                        {element.image ? (
                          <Avatar
                            size={120}
                            src={element.image}
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        ) : (
                          <Avatar
                            size={120}
                            icon={<UserOutlined />}
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        )}
                      </Spin>
                      {/* <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        customRequest={customUpload}
                        onClick={() => getStudentUpdate(element)}
                      >
                        {image ? (
                          <img src={image} alt="avatar" />
                        ) : (
                          uploadButton
                        )}
                      </Upload> */}
                    </div>
                    <Title
                      style={{ textAlign: "center", marginTop: 20 }}
                      level={5}
                    >
                      {element.username}
                    </Title>
                    <div className="card_display_info_stu">
                      <div>
                        <div className="card_display_info_stu_item">
                          <p style={{ textAlign: "center", width: "100%" }}>
                            {element.code}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          type="primary"
                          style={{ width: "100%" }}
                          onClick={() => showProfileStudent(element)}
                        >
                          View profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {/* Modal thêm và update thồng tin học sinh */}

      <ModalAddUpdateInforStudent
        title={titleForm}
        visible={visible}
        onCancel={handleCancel}
        displayBtnAdd={displayBtnAdd}
        getStudent={getStudent}
        handleCancel={handleCancel}
        idStudentUpdate={idStudentUpdate}
        form={form}
      />

      {/* Modal hiển thị thông tin học sinh */}
      <ModalDisplayInforStudent
        visible={visibleFormShowInfo}
        onCancel={handleCancelFormShowInfo}
        data={inforStudent}
      />

    </div>
  );
}

export default ContentHomeStudent;
