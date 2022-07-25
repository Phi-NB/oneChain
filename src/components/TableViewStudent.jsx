import React from "react";
import {
  Popconfirm,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

function TableViewStudent(props) {
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
            onClick={() => props.setIdStudentUpdatess(record)}
            onConfirm={() => props.handleUpdateStudent(record)}
          >
            <EditOutlined className="icon-handle" />
          </Popconfirm>
          <Popconfirm
            title="Sure to delete?"
            onClick={() => props.setIdStudentDelete(record)}
            onConfirm={() => {
              props.handleDeleteStudent(record);
            }}
          >
            <DeleteOutlined className="icon-handle" />
          </Popconfirm>
          <Popconfirm
            title="Sure to see?"
            onClick={() => props.setIdStudentDelete(record)}
            onConfirm={() => {
              props.showProfileStudent(record);
            }}
          >
            <EyeOutlined className="icon-handle" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const data = props.currentTodos.map((student, index) => {
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

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      style={{ marginBottom: 40 }}
    />
  );
}

export default TableViewStudent;
