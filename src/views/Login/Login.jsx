import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "../../styles/Login.scss";
import { useNavigate } from "react-router";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import db from "../../firebase/config";
import Loading from '../../components/Loading.jsx'

const { Title } = Typography;

const success = () => {
  message.success("Login successful");
};

const error = () => {
  message.error("Login failed");
};

function Login(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  })

  if(isLoading) {
    return <Loading />
  }

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    code: Yup.string()
      .min(7, "Username length 7-20")
      .max(20, "Username length 7-20")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password length 8-20")
      .max(20, "Password length 8-20")
      .required("Required"),
  });

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

      <Formik
        validationSchema={DisplayingErrorMessagesSchema}
        initialValues={{
          code: "",
          password: "",
        }}
        onSubmit={submitLogin}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="form_control">
              <p>Username</p>
              <Field name="code" type="text" placeholder="Username" />
              {touched.code && errors.code && (
                <div className="message_erro">{errors.code}</div>
              )}
            </div>
            <div className="form_control">
              <p>Password</p>
              <Field name="password" type="password" placeholder="Password" />
              {touched.password && errors.password && (
                <div className="message_erro">{errors.password}</div>
              )}
            </div>
            <button type="submit">Submit</button>
            <div className="form-navigate">
              <span>Do not have an account?</span>
              <span onClick={navigateRegister} className="register">
                Register
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
