import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Pour la traduction
import { BASE_URL } from '../../config';
import './UnbanPage.css'; // Importation du fichier CSS

const UnbanPage = () => {
  const { userId } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
  const [status, setStatus] = useState('loading'); // Statut de la requête
  const { t } = useTranslation("Unban"); // Hook pour les traductions
  const navigate = useNavigate();

  useEffect(() => {
    const unbanUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/unban/${userId}`, {
          method: 'GET',
        });

        if (response.ok) {
          setStatus('success');
        } else {
          const errorData = await response.json();
          setStatus('error');
          console.error('Error unbanning user:', errorData.message);
        }
      } catch (error) {
        console.error('Error unbanning user:', error);
        setStatus('error');
      }
    };

    unbanUser();
  }, [userId]);

  const handleBack = () => {
    navigate('/home'); // Redirige vers le tableau de bord ou une autre page admin
  };

  return (
    <div className="unban-container">
      {status === 'loading' && <h2>{t('unban.loading')}</h2>}
      {status === 'success' && (
        <>
          <h2>{t('unban.success')}</h2>
          <button className="unban-button" onClick={handleBack}>
            {t('unban.back')}
          </button>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>{t('unban.error')}</h2>
          <p>{t('unban.tryAgain')}</p>
          <button className="unban-button" onClick={handleBack}>
            {t('unban.back')}
          </button>
        </>
      )}
    </div>
  );
};

export default UnbanPage;
