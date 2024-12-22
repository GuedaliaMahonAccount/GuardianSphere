import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../Login/Login.css';
import './SignUpAdmin.css';
import { BASE_URL } from '../../config';

const SignupAdmin = () => {
    const [formData, setFormData] = useState({
        realName: '',
        email: '',
        password: '',
        anonymousName: '',
        photo: '',
        organization: '',
        secter: '',
    });
    const [errors, setErrors] = useState({ email: '', anonymousName: '' });
    const [generatedCode, setGeneratedCode] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation("App");

    const secterOptions = [
        { value: 'emergency_medicine', label: t('emergencyMedicine') },
        { value: 'surgery', label: t('surgery') },
        { value: 'mental_health', label: t('mentalHealth') },
        { value: 'nursing', label: t('nursing') },
        { value: 'police', label: t('police') },
        { value: 'firefighters', label: t('firefighters') },
        { value: 'army', label: t('army') },
        { value: 'navy', label: t('navy') },
        { value: 'air_force', label: t('airForce') },
        { value: 'veterans', label: t('veterans') },
        { value: 'special_education', label: t('specialEducation') },
        { value: 'social_work', label: t('socialWork') },
        { value: 'refugee_support', label: t('refugeeSupport') },
        { value: 'content_moderation', label: t('contentModeration') },
        { value: 'disaster_relief', label: t('disasterRelief') },
        { value: 'human_rights', label: t('humanRights') },
        { value: 'mental_health_advocacy', label: t('mentalHealthAdvocacy') },
        { value: 'journalism', label: t('journalism') },
        { value: 'animal_rescue', label: t('animalRescue') },
        { value: 'other', label: t('other') },
    ];

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

        if (!formData.organization || !formData.secter) {
            alert(t('fillAllFields'));
            return;
        }

        const payload = {
            ...formData,
            contacted: 0,
            points: 0,
            signaledcount: 0,
            banned: false,
            role: 'admin',
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/user/signup-admin`, payload);

            // Display the generated code
            setGeneratedCode(response.data.code);
        } catch (error) {
            if (error.response && error.response.data.message === 'Email already exists') {
                setErrors((prev) => ({ ...prev, email: t('emailTaken') }));
            } else {
                console.error(t('signupFailed'), error);
                alert(t('signupError'));
            }
        }
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    const defaultAvatar = "/Pictures/default-avatar.png";

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">{t('signUpAdmin')}</h2>
                {generatedCode ? (
                    <div className="generated-code-section">
                        <h3>{t('yourGeneratedCode')}</h3>
                        <p className="generated-code">{generatedCode}</p>
                        <p>{t('copyCodeInstruction')}</p>
                        <button className="go-home-button" onClick={handleGoHome}>
                            {t('goToHome')}
                        </button>
                    </div>
                ) : (
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
                        <input
                            type="text"
                            name="organization"
                            placeholder={t('organization')}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="secter"
                            value={formData.secter}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('selectSecter')}</option>
                            {secterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button type="submit">{t('signUp')}</button>
                    </form>
                )}
                <div className="auth-footer">
                    <p>
                        {t('alreadyAccount')} <a href="/login">{t('logIn')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupAdmin;
