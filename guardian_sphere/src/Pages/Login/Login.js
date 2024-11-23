import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; // Importation pour les traductions

const Login = () => {
  const { t } = useTranslation('Login'); // Utilisation du namespace 'Login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);

    navigate('/home');
  };

  return (
    <div className="login-container">
      <h2>{t('title')}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">{t('emailLabel')}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">{t('passwordLabel')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="login-button">{t('loginButton')}</button>
      </form>
    </div>
  );
};

export default Login;
