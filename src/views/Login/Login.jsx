import React, { useState, useEffect } from "react";
import { Typography, message, Button, Input, Form } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "../../styles/Login.scss";
import { useNavigate } from "react-router";
import db from "../../firebase/config";
import Loading from "../../components/Loading.jsx";

const { Title } = Typography;

const success = () => {
  message.success("Login successful");
};

const error = () => {
  message.error("Account or password is not precision");
};

function Login(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  if (isLoading) {
    return <Loading />;
  }

  const submitLogin = async (data) => {
    const events = db.collection("user");
    await events.get().then((querySnapshot) => {
      const tempDoc = [];
      querySnapshot.forEach((doc) => {
        tempDoc.push({ id: doc.id, ...doc.data() });
      });
      const user = tempDoc.filter((doc) => {
        return doc.code === data.code && doc.password === data.password;
      });

      if (user.length !== 0) {
        success();
        navigate("/home");
        setCookie("user", user[0].id, 3);
      } else {
        error();
      }
    });
  };

  const navigateRegister = () => {
    navigate("/register");
  };

  const onFinishFailed = (value) => {
    error("Please enter all fields");
  };

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  return (
    <div className="login">
      <Title className="title" level={2}>
        LOGIN
      </Title>

      <Form
          name="page1"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={submitLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="login_form">
            <div className="login_form_item">
              <img src="/login.png" alt="" />
            </div>
            <div className="login_form_item">
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
                <Title level={5}>Password</Title>
                <Form.Item
                  name="password"
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
                  <Input.Password placeholder="Password" type="password" />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>

              <div className="form-navigate">
                <span>Do not have an account?</span>
                <span onClick={navigateRegister} className="register">
                  Register
                </span>
              </div>
            </div>
          </div>
        </Form>
    </div>
  );
}

export default Login;
