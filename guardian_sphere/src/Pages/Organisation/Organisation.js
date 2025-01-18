import React, { useState } from "react";
import "./Organisation.css";
import { useTranslation } from "react-i18next";

const Organisation = () => {
  const { t } = useTranslation("Organisation", { fallbackLng: "en" });
  const [rows, setRows] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [yearlySummary, setYearlySummary] = useState({});
  const [error, setError] = useState(null);

  const addRow = () => {
    setRows([...rows, { name: "", reason: "", month: "", year: "", id: Date.now() }]);
  };

  const updateRow = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    calculateSummary(updatedRows);
  };

  const calculateSummary = (data) => {
    const monthly = {};
    const yearly = {};

    data.forEach(({ month, year }) => {
      if (month && year) {
        const key = `${month}-${year}`;
        monthly[key] = (monthly[key] || 0) + 1;
        yearly[year] = (yearly[year] || 0) + 1;
      }
    });

    setMonthlySummary(monthly);
    setYearlySummary(yearly);
  };

  const handleSubmit = async () => {
    try {
      // Mock API call
      const response = await fetch("/api/save-dismissals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      if (!response.ok) throw new Error("Failed to save data.");
      alert(t("data_saved_successfully"));
    } catch (err) {
      console.error(err);
      setError(t("error_message", { error: err.message }));
    }
  };

  return (
    <div className="organisation-container">
      <h1>{t("organisation_title")}</h1>
      <p>{t("organisation_description")}</p>

      <button onClick={addRow} className="add-row-button">{t("add_row")}</button>

      {error && <p className="error-message">{error}</p>}

      <table className="organisation-table">
        <thead>
          <tr>
            <th>{t("employee_name")}</th>
            <th>{t("dismissal_reason")}</th>
            <th>{t("month")}</th>
            <th>{t("year")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  placeholder={t("employee_name_placeholder")}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.reason}
                  onChange={(e) => updateRow(row.id, "reason", e.target.value)}
                  placeholder={t("dismissal_reason_placeholder")}
                />
              </td>
              <td>
                <select
                  value={row.month}
                  onChange={(e) => updateRow(row.id, "month", e.target.value)}
                >
                  <option value="">{t("select_month")}</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {t(`month_${i + 1}`)}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={row.year}
                  onChange={(e) => updateRow(row.id, "year", e.target.value)}
                  placeholder={t("year_placeholder")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-container">
        <h2>{t("monthly_summary_title")}</h2>
        <ul>
          {Object.entries(monthlySummary).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>

        <h2>{t("yearly_summary_title")}</h2>
        <ul>
          {Object.entries(yearlySummary).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleSubmit} className="submit-button">{t("submit")}</button>
    </div>
  );
};

export default Organisation;
