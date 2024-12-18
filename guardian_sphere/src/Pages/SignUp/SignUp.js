import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../Login/Login.css';
import { BASE_URL } from '../../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    realName: '',
    email: '',
    password: '',
    anonymousName: '',
    photo: '',
  });
  const [errors, setErrors] = useState({ email: '', anonymousName: '' });

  const navigate = useNavigate();
  const { t } = useTranslation("Home");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' || name === 'anonymousName') {
      try {
        const response = await axios.post(`${BASE_URL}/api/user/check-availability`, {
          [name]: value,
        });

        if (name === 'email' && response.data.emailExists) {
          setErrors((prev) => ({ ...prev, email: t('emailTaken') }));
        } else if (name === 'anonymousName' && response.data.usernameExists) {
          setErrors((prev) => ({ ...prev, anonymousName: t('usernameTaken') }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      } catch (error) {
        console.error(t('checkFailed'), error);
      }
    }
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
    if (errors.email || errors.anonymousName) {
      alert(t('fixErrorsBeforeSubmitting'));
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/user/signup`, formData);

      const loginResponse = await axios.post(`${BASE_URL}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('userId', loginResponse.data.user._id);
      localStorage.setItem('username', loginResponse.data.user.realName);

      navigate('/home');
    } catch (error) {
      console.error(t('signupFailed'), error);
      alert(t('signupError'));
    }
  };

  const defaultAvatar = "/Pictures/default-avatar.png";

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('signUp')}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="photo-upload">
            <label htmlFor="photo-input" className="photo-container">
              <img
                src={formData.photo || defaultAvatar}
                alt="profile"
                className="user-avatar"
              />
            </label>
            <input
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>
          <input
            type="text"
            name="realName"
            placeholder={t('realName')}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="anonymousName"
            placeholder={t('anonymousName')}
            onChange={handleChange}
          />
          {errors.anonymousName && <p className="error-text">{errors.anonymousName}</p>}
          <button type="submit">{t('signUp')}</button>
        </form>
        <div className="auth-footer">
          <p>
            {t('alreadyAccount')} <a href="/login">{t('logIn')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
