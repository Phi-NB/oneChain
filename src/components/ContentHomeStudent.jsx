import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Select,
  Layout,
  Form,
  message,
  Pagination,
} from "antd";
import {
  UserAddOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import "../styles/ContentStudentHome.scss";
import getDataStudent, {
  deleteDataStudent,
  filterStudent,
} from "../services/student";
import moment from "moment";
import Loading from "../components/Loading.jsx";
import ModalDisplayInforStudent from "./ModalDisplayInforStudent";
import ModalAddUpdateInforStudent from "./ModalAddUpdateInforStudent";
import GridViewStudent from "./GridViewStudent";
import TableViewStudent from "./TableViewStudent";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Header } = Layout;

const success = (mess) => {
  message.success(mess);
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
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const indexOfLastCut = currentPage * limit;
  const indexOfFirstCut = indexOfLastCut - limit;
  const currentTodos = students.slice(indexOfFirstCut, indexOfLastCut);
  const [colorActiveButtonGrid, setColorActiveButtonGrid] = useState("#f0b376");
  const [colorActiveButtonTable, setColorActiveButtonTable] =
    useState("#e78539");

  // Khởi chạy dữ liệu
  useEffect(() => {
    getStudent();
  }, []);

  // Hàm lấy dữ liệu
  const getStudent = async () => {
    const data = await getDataStudent();
    setStudents(data);
  };

  // Hàm chuyển đổi dữ liệu trước khi thêm vào bảng
  const data = currentTodos.map((student, index) => {
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

  // loading
  if (data.length === 0) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  if (isLoading) {
    return <Loading />;
  }

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
    if (value === "all") {
      getStudent();
    } else {
      const result = await filterStudent("status", value);
      setStudents(result);
    }
  };

  // Hàm lọc sinh viên theo lớp
  const handleChangeSelectionClass = async (value) => {
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
    setColorActiveButtonGrid("#f0b376");
    setColorActiveButtonTable("#e78539");
  };

  const showTableView = () => {
    setDisplayTGrid(false);
    setDisplayTable(true);
    setColorActiveButtonGrid("#e78539");
    setColorActiveButtonTable("#f0b376");
  };

  const confirmDeleteStudentGridView = async (element) => {
    await deleteDataStudent(element.id);
    success("Delete student successfully");
    getStudent();
  };

  // show side bar
  const setShowDrawer = () => {
    props.showDrawer(true);
  };

  // chuyển page phân trang
  const onChangePage = (page) => {
    setCurrentPage(page);
    // getStudent();
  };

  // Render dữ liệu ra màn hình
  return (
    <div>
      <Header className="site-layout-background">
        <Button className="add-student btnOpenDrawer" onClick={setShowDrawer}>
          <MenuUnfoldOutlined />
        </Button>
        <div className="site-layout-header-title">
          <Title level={3}>STUDENT MANAGEMENT</Title>
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
      <div className="groupsBtn-tranfer-view">
        <Button
          onClick={showGridView}
          type="primary"
          className="btn_add_up_stu"
          style={{ backgroundColor: colorActiveButtonGrid }}
        >
          View list as grid
        </Button>
        <Button
          onClick={showTableView}
          style={{ marginLeft: 20, backgroundColor: colorActiveButtonTable }}
          type="primary"
          className="btn_add_up_stu"
        >
          View list as table
        </Button>
      </div>

      {/* Bảng render thông tin các học sinh */}

      {displayTable && (
        <TableViewStudent
          currentTodos={currentTodos}
          setIdStudentUpdatess={setIdStudentUpdatess}
          handleUpdateStudent={handleUpdateStudent}
          setIdStudentDelete={setIdStudentDelete}
          handleDeleteStudent={handleDeleteStudent}
          showProfileStudent={showProfileStudent}
        />
      )}

      {displayGrid && (
        <GridViewStudent
          data={data}
          handleUpdateStudent={handleUpdateStudent}
          confirmDeleteStudentGridView={confirmDeleteStudentGridView}
          showProfileStudent={showProfileStudent}
        />
      )}

      {/* Phân trang */}
      <Pagination
        current={currentPage}
        onChange={onChangePage}
        total={students.length}
        pageSize={6}
      />
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
