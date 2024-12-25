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
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { fetchAllUsers } from "./StatisticReq";
import "./Statistic.css";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Statistic = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("Statistic", { fallbackLng: "en" });
  const [data, setData] = useState({
    totalUsers: 0,
    contactedUsers: 0,
    averageOnTimeCompletion: 0,
    messagesSentToAI: 0,
    aiCalls: 0,
    activeGroupUsers: 0,
    resignedOrFiredPercentage: 0,
    resignedOrFiredPreviousMonth: 0,
    resignedOrFiredNextMonth: 0,
  });
  const [adminDataEntry, setAdminDataEntry] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await fetchAllUsers();
        const filteredUsers = users.filter(user => user.role === "user");
        const totalUsers = filteredUsers.length;
        const contactedUsers = filteredUsers.filter(user => user.contacted !== 0).length;

        // Fake data
        const averageOnTimeCompletion = Math.random() * 100;
        const messagesSentToAI = Math.floor(Math.random() * 1000);
        const aiCalls = Math.floor(Math.random() * 500);
        const activeGroupUsers = Math.floor(Math.random() * totalUsers);
        const resignedOrFiredPercentage = Math.random() * 10;
        const resignedOrFiredPreviousMonth = resignedOrFiredPercentage - Math.random() * 2;
        const resignedOrFiredNextMonth = resignedOrFiredPercentage + Math.random() * 2;

        // Fake admin data entry for each month
        const adminDataEntry = Array.from({ length: 12 }, (_, i) => ({
          month: `Month ${i + 1}`,
          hasData: Math.random() > 0.5,
        }));

        setData({
          totalUsers,
          contactedUsers,
          averageOnTimeCompletion,
          messagesSentToAI,
          aiCalls,
          activeGroupUsers,
          resignedOrFiredPercentage,
          resignedOrFiredPreviousMonth,
          resignedOrFiredNextMonth,
        });
        setAdminDataEntry(adminDataEntry);
      } catch (err) {
        console.error("Error fetching statistics:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) return <p>{t("error_message", { error })}</p>;

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

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: t("average_on_time_completion"),
        data: [data.averageOnTimeCompletion, 70, 80, 90],
        borderColor: "#4682B4",
        backgroundColor: "#87CEFA",
      },
    ],
  };

  const pieChartData = {
    labels: [t("messages_sent_to_ai"), t("ai_calls")],
    datasets: [
      {
        data: [data.messagesSentToAI, data.aiCalls],
        backgroundColor: ["#87CEFA", "#4682B4"],
        hoverBackgroundColor: ["#4682B4", "#87CEFA"],
      },
    ],
  };

  const groupActivityChartData = {
    labels: [t("active_group_users"), t("inactive_group_users")],
    datasets: [
      {
        label: t("group_activity"),
        data: [data.activeGroupUsers, data.totalUsers - data.activeGroupUsers],
        backgroundColor: ["#4682B4", "#F0F4F8"],
        borderColor: ["#4682B4", "#F0F4F8"],
        borderWidth: 1,
      },
    ],
  };

  const resignedPieChartData = {
    labels: [t("resigned_or_fired_this_month"), t("still_employed")],
    datasets: [
      {
        data: [data.resignedOrFiredPercentage, 100 - data.resignedOrFiredPercentage],
        backgroundColor: ["#FF6347", "#87CEFA"],
        hoverBackgroundColor: ["#FF4500", "#4682B4"],
      },
    ],
  };

  const adminDataChart = {
    labels: adminDataEntry.map(entry => entry.month),
    datasets: [
      {
        label: t("admin_data_entry"),
        data: adminDataEntry.map(entry => (entry.hasData ? 1 : 0)),
        backgroundColor: "#4682B4",
      },
    ],
  };

  return (
    <div className="statistic-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <h1>{t("statistic_title")}</h1>
      <p>{t("statistic_description")}</p>

      <div className="chart-container">
        {/* Existing Charts */}
        <div className="chart">
          <h2>{t("bar_chart_title")}</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h2>{t("line_chart_title")}</h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h2>{t("pie_chart_ai_title")}</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h2>{t("group_activity_chart_title")}</h2>
          <Bar data={groupActivityChartData} options={{ responsive: true }} />
        </div>

        {/* New Charts */}
        <div className="chart">
          <h2>{t("resigned_or_fired_title")}</h2>
          <Pie data={resignedPieChartData} options={{ responsive: true }} />
          <p>{t("previous_month")}: {data.resignedOrFiredPreviousMonth.toFixed(2)}%</p>
          <p>{t("next_month")}: {data.resignedOrFiredNextMonth.toFixed(2)}%</p>
        </div>

        <div className="chart">
          <h2>{t("admin_data_entry_chart_title")}</h2>
          <Bar data={adminDataChart} options={{ responsive: true, scales: { y: { max: 1 } } }} />
        </div>
      </div>
    </div>
  );
};

export default Statistic;
