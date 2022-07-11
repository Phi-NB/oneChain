import React from "react";
import { Typography, message } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "../../styles/Login.scss";
import { useNavigate } from "react-router";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import db from "../../firebase/config";

const { Title } = Typography;

const success = () => {
  message.success("Create new successful students");
};

const error = (mes) => {
  message.error(mes);
};

function Register(props) {
  const navigate = useNavigate();

  // validate các trường trong form
  const DisplayingErrorMessagesSchema = Yup.object().shape({
    code: Yup.string()
      .min(7, "Code length 7-20")
      .max(20, "Code length 7-20")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password length 8-20")
      .max(20, "Password length 8-20")
      .required("Required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    email: Yup.string().email("Invalid email address").required("Required"),
    sex: Yup.string().required("Required"),
  });

  // đăng ký tài khoản
  const submitRegister = async (data) => {
    const events = db.collection("user");
    await events.get().then((querySnapshot) => {
      const tempDoc = [];
      querySnapshot.forEach((doc) => {
        tempDoc.push({ id: doc.id, ...doc.data() });
      });
      const user = tempDoc.filter((doc) => {
        return doc.code === data.code;
      });
      console.log(user);

      if (user.length === 0) {
        if (data) {
          db.collection("user").add({
            code: data.code,
            sex: data.sex,
            email: data.email,
            password: data.password,
          });
          success();
        } else {
          error("Create account failed");
        }
      } else {
        error("Account already exists");
      }
    });
  };

  // điều hướng về trang login
  const navigateLogin = () => {
    navigate("/login");
  };

  // trả lại JSX
  return (
    <div className="login">
      <Title className="title" level={2}>
        REGISTER
      </Title>
      <Formik
        validationSchema={DisplayingErrorMessagesSchema}
        initialValues={{
          code: "",
          password: "",
          confirmPassword: "",
          sex: "",
          email: "",
        }}
        onSubmit={submitRegister}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="form_control">
              <p>Code</p>
              <Field name="code" type="text" placeholder="Code" />
              {touched.code && errors.code && (
                <div className="message_erro">{errors.code}</div>
              )}
            </div>
            <div className="form_control">
              <p>Sex</p>
              <div className="form_control_sex">
                <label>
                  <span>Male</span>
                  <Field
                    type="radio"
                    name="sex"
                    value="Nam"
                    style={{ marginLeft: 4 }}
                  />
                </label>
                <label style={{ marginLeft: 16 }}>
                  <span>Female</span>
                  <Field
                    type="radio"
                    name="sex"
                    value="Nữ"
                    style={{ marginLeft: 4 }}
                  />
                </label>
              </div>
              {touched.sex && errors.sex && (
                <div className="message_erro">{errors.sex}</div>
              )}
            </div>
            <div className="form_control">
              <p>Email</p>
              <Field name="email" type="email" placeholder="Email" />
              {touched.email && errors.email && (
                <div className="message_erro">{errors.email}</div>
              )}
            </div>
            <div className="form_control">
              <p>Password</p>
              <Field name="password" type="password" placeholder="Password" />
              {touched.password && errors.password && (
                <div className="message_erro">{errors.password}</div>
              )}
            </div>
            <div className="form_control">
              <p>Confirm Password</p>
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="message_erro">{errors.confirmPassword}</div>
              )}
            </div>
            <button type="submit">Register</button>
            <div className="form-navigate">
              <span>Do not have an account?</span>
              <span onClick={navigateLogin} className="register">
                Login
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
