import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    realName: '',
    email: '',
    password: '',
    anonymousName: '',
    photo: '',
  });
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_ORIGIN;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send signup request
      await axios.post(`${BASE_URL}/api/user/signup`, formData);

      // Log in automatically after signup
      const loginResponse = await axios.post(`${BASE_URL}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save token, userId, and username to localStorage
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('userId', loginResponse.data.user._id);
      localStorage.setItem('username', loginResponse.data.user.realName); 
      
      navigate('/home');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="realName"
            placeholder="Real Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="anonymousName"
            placeholder="Anonymous Name (Optional)"
            onChange={handleChange}
          />
          <input type="file" onChange={handlePhotoUpload} />
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
