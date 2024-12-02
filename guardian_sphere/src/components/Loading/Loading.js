import React from 'react';
import { useTranslation } from 'react-i18next'; // ייבוא של useTranslation
import './Loading.css';

const Loading = () => {
    const { t } = useTranslation("Loading"); // שימוש ב-t כדי לגשת לתרגום
  
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h1 className="loading-text">{t('loading')}</h1> {/* כאן צריך להופיע הטקסט המתורגם */}
      </div>
    );
  };

export default Loading;
