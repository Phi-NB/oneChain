import React, { useState } from 'react';
import { Row, Col, Card, Dropdown, Spin, Avatar, Typography, Menu, Popconfirm, Button, Empty  } from 'antd'
import {
    UserOutlined,
    MoreOutlined,
  } from "@ant-design/icons";

  const { Title } = Typography;

function GridViewStudent(props) {
  const [loading, setLoading] = useState(false);

  const menu = (element) => (
    <Menu
      items={[
        {
          label: (
            <span onClick={() => props.handleUpdateStudent(element)}>Update</span>
          ),
          key: "1",
        },
        {
          label: (
            <Popconfirm
              title="Title"
              onConfirm={() => props.confirmDeleteStudentGridView(element)}
            >
              Remove
            </Popconfirm>
          ),
          key: "3",
        },
      ]}
    />
  );
    return (
        <div className="site-card-wrapper">
          <Row gutter={42} justify="start">
            {props.data.length !== 0 ? props.data.map((element, index) => {
              return (
                <Col
                  xl={{ span: 4 }}
                  lg={{ span: 8 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  xs={{ span: 24 }}
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
                          onClick={() => props.showProfileStudent(element)}
                        >
                          View profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            }) : <Empty />}
          </Row>
        </div>
    );
}

export default GridViewStudent;