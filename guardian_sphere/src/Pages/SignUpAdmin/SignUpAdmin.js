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
    const navigate = useNavigate();
    const { t } = useTranslation("App");


    const secterOptions = [
        // Medical Sector
        { value: 'emergency_medicine', label: t('emergencyMedicine') },
        { value: 'surgery', label: t('surgery') },
        { value: 'mental_health', label: t('mentalHealth') },
        { value: 'nursing', label: t('nursing') },

        // Emergency Responders
        { value: 'police', label: t('police') },
        { value: 'firefighters', label: t('firefighters') },

        // Armed Forces
        { value: 'army', label: t('army') },
        { value: 'navy', label: t('navy') },
        { value: 'air_force', label: t('airForce') },
        { value: 'veterans', label: t('veterans') },

        // Educational Sector
        { value: 'special_education', label: t('specialEducation') },

        // Social Services
        { value: 'social_work', label: t('socialWork') },
        { value: 'refugee_support', label: t('refugeeSupport') },

        // Technology Sector
        { value: 'content_moderation', label: t('contentModeration') },

        // Non-Profit Sector
        { value: 'disaster_relief', label: t('disasterRelief') },
        { value: 'human_rights', label: t('humanRights') },
        { value: 'mental_health_advocacy', label: t('mentalHealthAdvocacy') },

        // Other
        { value: 'journalism', label: t('journalism') },
        { value: 'animal_rescue', label: t('animalRescue') },
        { value: 'other', label: t('other') },
    ];

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
            role: 'admin', // Explicitly set the role
        };
        console.log('Payload:', payload);


        try {
            await axios.post(`${BASE_URL}/api/user/signup`, payload);

            const loginResponse = await axios.post(`${BASE_URL}/api/user/login`, {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('userId', loginResponse.data.user._id);
            localStorage.setItem('username', loginResponse.data.user.realName);
            localStorage.setItem('role', loginResponse.data.user.role); // 'user' ou 'admin'

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
                <h2 className="auth-title">{t('signUpAdmin')}</h2>
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
