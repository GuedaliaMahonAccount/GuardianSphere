import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from "./Reducers/index.js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layout.js";
import Loader from "./components/Loader/Loader.js";
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Groups from './Pages/Groups/Groups';
import FollowUp from './Pages/FollowUp/FollowUp';
import Videos from './Pages/Videos/Videos';
import Doctors from './Pages/Doctors/Doctors';
import Assistance from './Pages/Assistance/Assistance.js';


function App() {
  return (
    <Provider store={store}>
    <GoogleOAuthProvider clientId="694902841176-5v6uv9tbmla2qeip29r5u86kqsbhpkcn.apps.googleusercontent.com">
      <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Layout>
            <Routes>
              {/* Redirect to login page if no route match */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Home */}
              <Route path="/home" element={<Home />} />
              {/*Groups*/}
              <Route path="groups" element={<Groups/>}/>
              {/*FollowUp*/}
              <Route path="follow-up" element={<FollowUp/>}/>
              {/*Videos*/}
              <Route path="videos" element={<Videos/>}/>
              {/*Doctors*/}
              <Route path="doctors" element={<Doctors/>}/>
              {/*Assistance*/}
              <Route path="assistance" element={<Assistance/>}/>

              
            </Routes>
            </Layout>
          </BrowserRouter>
      </Suspense>
    </GoogleOAuthProvider>
  </Provider>
);
}

export default App;
