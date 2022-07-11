import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routesConfig from './configs/routes.js'
import PrivateRouter from './components/PriviteRouter.jsx'



function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          {
            routesConfig.map((route, index) => {
              return (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    route.private === true ? (
                      <PrivateRouter>{route.component}</PrivateRouter>
                    ) : (
                      route.component
                    )
                  }
                ></Route>
              )
            })
          }
        </Routes>
      </BrowserRouter>
  );
}

export default App;
