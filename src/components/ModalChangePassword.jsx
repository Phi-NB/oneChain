import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import getDataUsers, { updateDataUser } from "../services/user";
import { useCookies } from "react-cookie";
import sha256 from "crypto-js/sha256";

const { Title } = Typography;

const success = (mess) => {
  message.success(mess);
};

const error = (mess) => {
  message.error(mess);
};

function ModalChangePassword(props) {
  const [cookieUser, setCookieUser] = useCookies(["user"]);
  const [form] = Form.useForm();
  const hasd = (mess, key) => {
    const ciphertext = sha256(key + mess).toString();
    return ciphertext;
  };

  const submitChangePass = async (value) => {
    if (props.user.password !== hasd("phi", value.oldPassword)) {
      error("Old password not exactly");
    } else {
      if (value.confirmNewPassword !== value.newPassword) {
        error("New password does not match confirm new password");
      } else {
        // if (!props.user.citizenId) {
        //   props.user.citizenId = "";
        // }
        // if (!props.user.hometouwn) {
        //   props.user.hometouwn = "";
        // }
        // if (!props.user.phone) {
        //   props.user.phone = "";
        // }
        // if (!props.user.username) {
        //   props.user.username = "";
        // }
        // if (!props.user.dateOfBirth) {
        //   props.user.dateOfBirth = "";
        // }
        // if (!props.user.gender) {
        //   props.user.gender = "";
        // }

        await updateDataUser(
          props.user,
          cookieUser.user,
          value.newPassword,
          props.user.image ? props.user.image : ""
        );
        form.resetFields();
        success("Update password success");
        props.getDataUser();
        props.onCancel();
      }
    }
  };

  return (
    <div>
      <Modal
        title="Change the password"
        onCancel={props.onCancel}
        visible={props.displayModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="modalChangePass"
      >
        <Form
          name="changePassword"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={submitChangePass}
          autoComplete="off"
          form={form}
        >
          <div className="login_form">
            <div className="login_form_item">
              <Form.Item>
                <Title level={5}>Old Password</Title>
                <Form.Item
                  name="oldPassword"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length > 0 && value.length < 7) {
                          return Promise.reject("Old assword length 7-20");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Old Password" type="password" />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Title level={5}>New Password</Title>
                <Form.Item
                  name="newPassword"
                  rules={[
                    () => ({
                      validator(rule, value = "") {
                        if (value.length > 0 && value.length < 7) {
                          return Promise.reject("New Password length 7-20");
                        } else if (value.length === 0) {
                          return Promise.reject("Require");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Password" type="password" />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Title level={5}>Confirm New Password</Title>
                <Form.Item
                  name="confirmNewPassword"
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
                  <Input.Password
                    placeholder="Confirm New Password"
                    type="password"
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Change
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalChangePassword;
