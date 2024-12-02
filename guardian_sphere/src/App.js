import React, { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from "./Reducers/index.js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layout.js";
import Loader from "./components/Loader/Loader.js"; // probably this is where you 
import Login from './Pages/Login/Login';
import Signup from './Pages/SignUp/SignUp.js'; // Import Signup component
import Home from './Pages/Home/Home';
import Groups from './Pages/Groups/Groups';
import FollowUp from './Pages/FollowUp/FollowUp';
import Videos from './Pages/Videos/Videos';
import Doctors from './Pages/Doctors/Doctors';
import Assistance from './Pages/Assistance/Assistance.js';
import Loading from './components/Loading/Loading.js'; // ייבוא רכיב ה-Loading

// Define the ProtectedRoute component
function ProtectedRoute({ element, redirectTo = '/login' }) {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for token
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
}

function App() {

  // calling loading screen for 2 seconds. you can delete it and use it somewhere else if you want. -yuval.
  const [isLoading, setIsLoading] = useState(true); // מצב לבקרת טעינה

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // מכניס את האפליקציה למצב של "לא בטעינה"
    }, 2000); // מחכה 2 שניות לפני שמסיים את הטעינה
    return () => clearTimeout(timer); // מנקה את הטיימר
  }, []);

  if (isLoading) {
    return <Loading />; // מציג את רכיב הטעינה
  }

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="694902841176-5v6uv9tbmla2qeip29r5u86kqsbhpkcn.apps.googleusercontent.com">
        <Suspense fallback={<Loader />}>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Redirect to login page if no route matches */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/home"
                  element={<ProtectedRoute element={<Home />} />}
                />
                <Route
                  path="/groups"
                  element={<ProtectedRoute element={<Groups />} />}
                />
                <Route
                  path="/follow-up"
                  element={<ProtectedRoute element={<FollowUp />} />}
                />
                <Route
                  path="/videos"
                  element={<ProtectedRoute element={<Videos />} />}
                />
                <Route
                  path="/doctors"
                  element={<ProtectedRoute element={<Doctors />} />}
                />
                <Route
                  path="/assistance"
                  element={<ProtectedRoute element={<Assistance />} />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        </Suspense>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
