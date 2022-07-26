import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Button,
  Typography,
  message
} from "antd";
import { useCookies } from "react-cookie";
import getDataUsers, { updateDataUser } from "../services/user.js";

const { Title } = Typography;
const success = (mess) => {
    message.success(mess);
  };
  
  const error = (mess) => {
    message.error(mess);
  };

function ModalDisplayIUpdateUser(props) {
  const [cookieUser, setCookieUser] = useCookies(["user"]);


  const onFinish = async (data) => {
    const dataUser = await getDataUsers();
    const user = dataUser.filter((element) => {
      return element.code === data.code || element.email === data.email;
    });
    if (user.length === 1) {
      if (!data.citizenId) {
        data.citizenId = "";
      }
      if (!data.hometouwn) {
        data.hometouwn = "";
      }
      if (!data.phone) {
        data.phone = "";
      }
      if (!data.username) {
        data.username = "";
      }
      await updateDataUser(
        data,
        cookieUser.user,
        user[0].password,
        user[0].image,
        !user[0].dateJoin ? "" : user[0].dateJoin
      );
      props.form.resetFields();
      success("Update student success");
      props.getDataUser();
      props.onCancel()
    } else {
      error("Student code or email already exist");
    }
  };

  const onFinishFailed = () => {};

  return (
    <div>
      <Modal
        title="Edit Profile User"
        visible={props.visible}
        onCancel={props.onCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        forceRender
      >
        <Form
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
                <Title level={5}>Username</Title>
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
                  <Input placeholder="Username" />
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
                <Title level={5}>Name</Title>
                <Form.Item name="username">
                  <Input placeholder="Name" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Gender</Title>
                <Form.Item name="gender">
                  <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form.Item>
            </div>
            <div className="formAddUpdateStudent-item">
              <Form.Item>
                <Title level={5}>Date of birth</Title>
                <Form.Item name="dateOfBirth">
                  <DatePicker format={"YYYY/MM/DD"} />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Hometouwn</Title>
                <Form.Item name="hometouwn">
                  <Input placeholder="Hometown" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Citizen ID</Title>
                <Form.Item name="citizenId">
                  <Input placeholder="ID" type="number" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Phone number</Title>
                <Form.Item name="phone">
                  <Input placeholder="Phone" type="number" />
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            {
              <Button
                type="primary"
                htmlType="submit"
                className="btn_add_up_stu"
              >
                UPDATE
              </Button>
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalDisplayIUpdateUser;
