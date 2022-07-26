import React, { useState, useEffect } from "react";
import { Typography, message, Button, Input, Form } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "../../styles/Login.scss";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading.jsx";
import getDataUser, {
  addDataUser,
} from "../../services/user.js";


const { Title } = Typography;

const success = () => {
  message.success("Create new successful students");
};

const error = (mes) => {
  message.error(mes);
};

function Register(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [page1, setPage1] = useState(true);
  const [page2, setPage2] = useState(false);
  const [valuePage1, setValuePage1] = useState({});
  const [formPage1] = Form.useForm();
  const [formPage2] = Form.useForm();
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  if (isLoading) {
    return <Loading />;
  }

  // đăng ký tài khoản
  const addAccount = async (data) => {
    const require = await getDataUser();

    const user = require.filter((doc) => {
      return doc.code === data.code || doc.email === data.email;
    });

    if (user.length === 0) {
      if (data) {
        try {
          await addDataUser(data);
        } catch {}
        success();
        navigate("/login");
      } else {
        error("Create account failed");
      }
    } else {
      error("Code or email already exists");
    }
  };

  // điều hướng về trang login
  const navigateLogin = () => {
    navigate("/login");
  };

  const navigatePage2 = () => {
    setPage1(false);
    setPage2(true);
  };

  const navigatePage1 = () => {
    setPage1(true);
    setPage2(false);
  };
  const onFinish = (value) => {
    setValuePage1({ ...value });
    navigatePage2();
  };

  const onFinish2 = async (value) => {
    if (value.password !== value.confirmPassword) {
      error("Password does not match Confirm Password");
    } else {
      const dataRequest = { ...value, ...valuePage1 };
      console.log(dataRequest);
      await addAccount(dataRequest);
    }
  };

  const onFinishFailed = (value) => {
    error("Please enter all fields");
  };

  const backToPage1 = () => {
    navigatePage1();
    formPage1.setFieldsValue({
      code: valuePage1.code,
      email: valuePage1.email,
    })
  };

  // trả lại JSX
  return (
    <div className="login">
      <Title className="title" level={2}>
        REGISTER
      </Title>
      {page1 && (
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={formPage1}
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
                <Button type="primary" htmlType="submit">
                  Next
                </Button>
              </Form.Item>

              <div className="form-navigate">
                <span>Do not have an account?</span>
                <span onClick={navigateLogin} className="register">
                  Login
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}

      {page2 && (
        <Form
          name="page2"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish2}
          onFinishFailed={onFinishFailed}
          form={formPage2}
          autoComplete="off"
        >
          <div className="login_form">
            <div className="login_form_item">
              <img src="/login.png" alt="" />
            </div>
            <div className="login_form_item">
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
                  <Input placeholder="Password" type="password" />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Title level={5}>Confirm Password</Title>
                <Form.Item
                  name="confirmPassword"
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
                  <Input placeholder="Confirm Password" type="password" />
                </Form.Item>
              </Form.Item>

              <div className="group_btn_regis">
                <Button onClick={backToPage1} type="primary">
                  Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </div>

              <div className="form-navigate">
                <span>Do have an account?</span>
                <span onClick={navigateLogin} className="register">
                  Login
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}

export default Register;
