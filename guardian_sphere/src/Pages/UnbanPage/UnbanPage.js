import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Pour la traduction
import { BASE_URL } from '../../config';
import './UnbanPage.css'; // Importation du fichier CSS

const UnbanPageEmpty = () => {
  const [bannedUsers, setBannedUsers] = useState([]); // Liste des utilisateurs bannis
  const [status, setStatus] = useState('loading'); // Statut de la requête
  const { t } = useTranslation("Unban"); // Hook pour les traductions
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/banned`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setBannedUsers(data); // Mettre à jour la liste des utilisateurs bannis
          setStatus('success');
        } else {
          setStatus('error');
          console.error('Error fetching banned users');
        }
      } catch (error) {
        console.error('Error fetching banned users:', error);
        setStatus('error');
      }
    };

    fetchBannedUsers();
  }, []);

  const handleUnbanClick = (userId) => {
    navigate(`/unban/${userId}`); // Redirige vers la page unban/:userid
  };

  const handleBack = () => {
    navigate('/home'); // Redirige vers la page d'accueil
  };

  return (
    <div className="unban-container">
      <h1>{t('title')}</h1>
      {status === 'loading' && <p>{t('loading')}</p>}
      {status === 'error' && (
        <>
          <p>{t('error')}</p>
          <button onClick={handleBack}>{t('back')}</button>
        </>
      )}
      {status === 'success' && (
        <>
          {bannedUsers.length === 0 ? (
            <p>{t('noBannedUsers')}</p>
          ) : (
            <ul className="banned-users-list">
              {bannedUsers.map((user) => (
                <li
                  key={user.id}
                  className="banned-user-item"
                  onClick={() => handleUnbanClick(user.id)}
                >
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
          <button className="unban-button" onClick={handleBack}>
            {t('back')}
          </button>
        </>
      )}
    </div>
  );
};

export default UnbanPageEmpty;
