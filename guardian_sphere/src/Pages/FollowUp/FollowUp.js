import React, { useState } from 'react';
import './FollowUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const FollowUp = () => {
  const { t } = useTranslation("FollowUp");
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.follow);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleAddTreatment = (e) => {
    e.preventDefault();
    if (!name || !description || !startDate) {
      alert(t('form_error_fill_all'));
      return;
    }

    dispatch({
      type: "ADD_TREATMENT",
      payload: { name, description, startDate, frequency }
    });

    setName('');
    setDescription('');
    setStartDate('');
    setFrequency('daily');
  };

  const handleToggleCheck = (treatmentId, date) => {
    dispatch({
      type: "TOGGLE_CHECK",
      payload: { treatmentId, date }
    });
  };

  return (
    <div className="followup-container">
      <h2>{t("followup_title")}</h2>
      <p>{t("followup_description")}</p>

      <form className="followup-form" onSubmit={handleAddTreatment}>
        <div className="form-group">
          <label htmlFor="treatmentName">{t("form_treatmentName")}:</label>
          <input
            type="text"
            id="treatmentName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("form_treatmentName_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatmentDescription">{t("form_description")}:</label>
          <textarea
            id="treatmentDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("form_description_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatmentStartDate">{t("form_startDate")}:</label>
          <input
            type="date"
            id="treatmentStartDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatmentFrequency">{t("form_frequency")}:</label>
          <select
            id="treatmentFrequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">{t("frequency_daily")}</option>
            <option value="weekly">{t("frequency_weekly")}</option>
            <option value="monthly">{t("frequency_monthly")}</option>
          </select>
        </div>

        <button type="submit" className="add-button">{t("add_button")}</button>
      </form>

      <div className="treatment-table-container">
        {treatments.length === 0 ? (
          <p>{t("no_treatments_message")}</p>
        ) : (
          treatments.map((treatment) => (
            <div key={treatment.id} className="single-treatment-table">
              {/* Display the treatment name as a heading */}
              <h3>{treatment.name}</h3>
              <table className="treatment-table">
                <thead>
                  <tr>
                    <th>{t("table_description")}</th>
                    {treatment.checks.map((check, index) => (
                      <th key={index}>{check.date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{treatment.description}</td>
                    {treatment.checks.map((check) => (
                      <td key={check.date}>
                        <input
                          type="checkbox"
                          checked={check.done}
                          onChange={() => handleToggleCheck(treatment.id, check.date)}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowUp;
