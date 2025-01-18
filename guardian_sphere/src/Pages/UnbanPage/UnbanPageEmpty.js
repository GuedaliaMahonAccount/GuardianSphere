import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Pour la traduction
import { BASE_URL } from '../../config';
import './UnbanPage.css'; // Importation du fichier CSS

const BannedUsersList = () => {
  const [bannedUsers, setBannedUsers] = useState([]); // Liste des utilisateurs bannis
  const [status, setStatus] = useState('loading'); // Statut de la requête
  const { t } = useTranslation("Unban"); // Hook pour les traductions
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/banned`, {
          method: 'GET',
        });

        if (response.ok) {
          const users = await response.json();
          setBannedUsers(users);
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

  const handleUnbanRedirect = (userId) => {
    navigate(`/unban/${userId}`); // Redirige vers une page spécifique pour débloquer un utilisateur
  };

  return (
    <div className="unban-container">
      {status === 'loading' && <h2>{t('loading')}</h2>}
      {status === 'error' && <h2>{t('errorlist')}</h2>}
      {status === 'success' && (
        <>
          <h2>{t('bannedUsers')}</h2>
          {bannedUsers.length > 0 ? (
            <table className="banned-users-table">
              <thead>
                <tr>
                  <th>{t('username')}</th>
                  <th>{t('email')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="unban-button"
                        onClick={() => handleUnbanRedirect(user.id)}
                      >
                        {t('unban')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{t('noBannedUsers')}</p>
          )}
        </>
      )}
    </div>
  );
};

export default BannedUsersList;
