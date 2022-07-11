import React from 'react';
import Login from '../views/Login/Login.jsx'
import Register from '../views/Register/Register.jsx'
import Home from '../views/home/Home.jsx'


const routesConfig = 
[
    {
        component: <Login />,
        path: '/',
        private: false,
    },
    {
        component: <Login />,
        path: '/login',
        private: false,
    },
    {
        component: <Register />,
        path: '/register',
        private: false,
    },
    {
        component: <Home />,
        path: '/home',
        private: true,
    }, 
]

export default routesConfig