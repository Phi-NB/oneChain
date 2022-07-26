// import React, { useState } from "react";
// import { Modal, Form, Input } from "antd";

// function ModalChangePassword(props) {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//     // const submitChangePass 
  
//   return (
//     <div>
//       <Modal
//         title="Change the password"
//         visible={isModalVisible}
//         cancelButtonProps={{ style: { display: "none" } }}
//         okButtonProps={{ style: { display: "none" } }}
//       >
//         <Form
//           name="page1"
//           labelCol={{
//             span: 8,
//           }}
//           wrapperCol={{
//             span: 16,
//           }}
//           initialValues={{
//             remember: true,
//           }}
//           onFinish={submitChangePass}
//           autoComplete="off"
//         >
//           <div className="login_form">
//             <div className="login_form_item">
//               <Form.Item>
//                 <Title level={5}>Username</Title>
//                 <Form.Item
//                   name="code"
//                   rules={[
//                     () => ({
//                       validator(rule, value = "") {
//                         if (value.length > 0 && value.length < 7) {
//                           return Promise.reject("Code length 7-20");
//                         } else if (value.length === 0) {
//                           return Promise.reject("Require");
//                         } else {
//                           return Promise.resolve();
//                         }
//                       },
//                     }),
//                   ]}
//                 >
//                   <Input placeholder="Username" />
//                 </Form.Item>
//               </Form.Item>

//               <Form.Item>
//                 <Title level={5}>Password</Title>
//                 <Form.Item
//                   name="password"
//                   rules={[
//                     () => ({
//                       validator(rule, value = "") {
//                         if (value.length > 0 && value.length < 7) {
//                           return Promise.reject("Code length 7-20");
//                         } else if (value.length === 0) {
//                           return Promise.reject("Require");
//                         } else {
//                           return Promise.resolve();
//                         }
//                       },
//                     }),
//                   ]}
//                 >
//                   <Input.Password placeholder="Password" type="password" />
//                 </Form.Item>
//               </Form.Item>

//               <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                   Login
//                 </Button>
//               </Form.Item>

//               <div className="form-navigate">
//                 <span>Do not have an account?</span>
//                 <span onClick={navigateRegister} className="register">
//                   Register
//                 </span>
//               </div>
//             </div>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// export default ModalChangePassword;
