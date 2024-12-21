import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './Login.css';
import { BASE_URL } from '../../config';



const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { t } = useTranslation("App");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      localStorage.setItem('token', response.data.token); 
      localStorage.setItem('userId', response.data.user._id);
      localStorage.setItem('username', response.data.user.realName);
      localStorage.setItem('role', response.data.user.role); // 'user' ou 'admin'

      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // User does not exist
        alert(t('userNotFoundPleaseSignUp'));
      } else {
        console.error(t('loginFailed'), error);
        alert(t('invalidCredentials'));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('logIn')}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            onChange={handleChange}
            required
          />
          <button type="submit">{t('logIn')}</button>
        </form>
        <div className="auth-footer">
          <p>
            {t('noAccount')} <a href="/signup">{t('signUp')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
