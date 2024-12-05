import React, { useState } from 'react';
import './FollowUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const FollowUp = () => {
  const { t } = useTranslation("FollowUp");
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.follow);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');  // New end date state
  const [frequency, setFrequency] = useState('daily');

  const [editingTreatmentId, setEditingTreatmentId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleAddTreatment = (e) => {
    e.preventDefault();
    if (!name || !description || !startDate) {
      alert(t('form_error_fill_all'));
      return;
    }

    dispatch({
      type: "ADD_TREATMENT",
      payload: { name, description, startDate, endDate, frequency }
    });

    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setFrequency('daily');
  };

  const handleToggleCheck = (treatmentId, date) => {
    dispatch({
      type: "TOGGLE_CHECK",
      payload: { treatmentId, date }
    });
  };

  const handleDeleteTreatment = (treatmentId) => {
      dispatch({
        type: "DELETE_TREATMENT",
        payload: { treatmentId }
      });
  };

  const handleEditTreatment = (treatment) => {
    setEditingTreatmentId(treatment.id);
    setEditName(treatment.name);
    setEditDescription(treatment.description);
  };

  const handleSaveEdit = (treatmentId) => {
    if (!editName || !editDescription) {
      alert(t('form_error_fill_all'));
      return;
    }
    dispatch({
      type: "UPDATE_TREATMENT",
      payload: { treatmentId, name: editName, description: editDescription }
    });
    setEditingTreatmentId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingTreatmentId(null);
    setEditName('');
    setEditDescription('');
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

        {/* New End Date Field */}
        <div className="form-group">
          <label htmlFor="treatmentEndDate">{t("form_endDate") || "End Date"}:</label>
          <input
            type="date"
            id="treatmentEndDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
              {editingTreatmentId === treatment.id ? (
                <div className="edit-section">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={t("form_treatmentName_placeholder")}
                    className="edit-input"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={t("form_description_placeholder")}
                    className="edit-textarea"
                  />
                  <div className="action-buttons">
                    <button className="save-button" onClick={() => handleSaveEdit(treatment.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className="cancel-button" onClick={handleCancelEdit}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{treatment.name}</h3>
                  <p style={{ textAlign: 'center', marginBottom: '10px' }}>
                    {/* {treatment.description}<br/> */}
                    {/* <strong>{t("form_startDate")}:</strong> {treatment.startDate} <br/>
                    <strong>{t("form_endDate") || "End Date"}:</strong> {treatment.endDate || t("no_end_date") } */}
                  </p>
                  <div className="action-buttons">
                    <button className="icon-button edit-button" onClick={() => handleEditTreatment(treatment)}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button className="icon-button delete-button" onClick={() => handleDeleteTreatment(treatment.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </>
              )}
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
