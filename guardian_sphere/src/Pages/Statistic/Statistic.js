import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { fetchAllUsers } from "./StatisticReq"; // Assurez-vous que le chemin est correct
import "./Statistic.css";
import Loading from "../../components/Loading/Loading"; // Assurez-vous que le chemin est correct
import { useNavigate } from "react-router-dom";

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistic = () => {
  const  navigate = useNavigate(); // Hook de navigation
  const { t } = useTranslation("Statistic", { fallbackLng: "en" }); // Gestion des traductions
  const [data, setData] = useState({ totalUsers: 0, contactedUsers: 0 }); // État pour les données
  const [isLoading, setIsLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Début du chargement
      try {
        const users = await fetchAllUsers(); // Récupérer tous les utilisateurs
        
        // Filtrer uniquement les utilisateurs avec le rôle 'user'
        const filteredUsers = users.filter(user => user.role === 'user');
        
        const totalUsers = filteredUsers.length; // Nombre total d'utilisateurs
        const contactedUsers = filteredUsers.filter(user => user.contacted !== 0).length; // Nombre d'utilisateurs contactés
  
        setData({ totalUsers, contactedUsers }); // Mettre à jour les statistiques
      } catch (err) {
        console.error("Error fetching statistics:", err.message);
        setError(err.message); // Capturer l'erreur
      } finally {
        setIsLoading(false); // Fin du chargement
      }
    };
  
    fetchData();
  }, []);
  

  if (isLoading) {
    return <Loading />; // מציג את רכיב הטעינה
  }
  if (error) return <p>{t("error_message", { error })}</p>; // Message d'erreur si nécessaire

  // Données pour le graphique en barres
  const barChartData = {
    labels: [t("total_users"), t("contacted_users")],
    datasets: [
      {
        label: t("user_statistics"),
        data: [data.totalUsers, data.contactedUsers],
        backgroundColor: ["#4682B4", "#87CEFA"],
        borderColor: ["#4682B4", "#87CEFA"],
        borderWidth: 1,
      },
    ],
  };

  // Données pour les graphiques circulaires (camembert et doughnut)
  const pieChartData = {
    labels: [t("contacted_users"), t("non_contacted_users")],
    datasets: [
      {
        data: [data.contactedUsers, data.totalUsers - data.contactedUsers],
        backgroundColor: ["#87CEFA", "#F0F4F8"],
        hoverBackgroundColor: ["#4682B4", "#F0F4F8"],
      },
    ],
  };

  return (
    <div className="statistic-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <h1>{t("statistic_title")}</h1>
      <p>{t("statistic_description")}</p>

      <div className="chart-container">
        <div className="chart">
          <h2>{t("bar_chart_title")}</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h2>{t("pie_chart_title")}</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h2>{t("doughnut_chart_title")}</h2>
          <Doughnut data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Statistic;
