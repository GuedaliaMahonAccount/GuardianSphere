import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from "./Reducers/index.js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layout.js";
import Loader from "./components/Loader/Loader.js";
import Login from './Pages/Login/Login';


function App() {
  return (
    <Provider store={store}>
    <GoogleOAuthProvider clientId="694902841176-5v6uv9tbmla2qeip29r5u86kqsbhpkcn.apps.googleusercontent.com">
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          {/* <Layout> */}
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          {/* </Layout> */}
        </BrowserRouter>
      </Suspense>
    </GoogleOAuthProvider>
  </Provider>
);
}

export default App;
