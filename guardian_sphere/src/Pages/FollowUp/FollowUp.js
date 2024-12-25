import React, { useState, useEffect } from 'react';
import './FollowUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { getByUsername, createTreatment, updateTreatment, deleteTreatment, toggleCheck } from './followUpReq';
import { useNavigate } from 'react-router-dom';

const FollowUp = () => {
  const { t } = useTranslation('FollowUp');
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.follow);
  const [newTreatments, setNewTreatments] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    frequency: 'daily',
  });
  const [editingTreatmentId, setEditingTreatmentId] = useState(null);
  const [editFields, setEditFields] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTreatments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTreatments = async () => {
    try {
      const data = await getByUsername(username);
      dispatch({ type: 'SET_TREATMENTS', payload: data });
    } catch (error) {
      setError(`Error fetching treatments: ${error.message}`);
    }
  };

  const generateDates = (startDate, endDate, frequency) => {
    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : null;

    if (!end) {
      if (frequency === 'daily') end = new Date(start.setDate(start.getDate() + 6));
      else if (frequency === 'weekly') end = new Date(start.setDate(start.getDate() + 28));
      else if (frequency === 'monthly') end = new Date(start.setMonth(start.getMonth() + 2));
    }

    const dates = [];
    while (start <= end) {
      dates.push({ date: new Date(start).toISOString().split('T')[0], done: false });
      if (frequency === 'daily') start.setDate(start.getDate() + 1);
      else if (frequency === 'weekly') start.setDate(start.getDate() + 7);
      else if (frequency === 'monthly') start.setMonth(start.getMonth() + 1);
    }
    return dates;
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    const { name, description, startDate, endDate, frequency } = formFields;
    if (!name || !description || !startDate) {
      alert(t("form_error_fill_all"));
      return;
    }
  
    // Create a new treatment object without `_id` for MongoDB
    const newTreatment = {
      name,
      description,
      startDate,
      endDate,
      frequency,
      checks: generateDates(startDate, endDate, frequency),
    };
  
    // Temporarily add to UI
    setNewTreatments([...newTreatments, { ...newTreatment, tempId: `temp-${Date.now()}` }]);
    setFormFields({ name: "", description: "", startDate: "", endDate: "", frequency: "daily" });
  };
  
  const handleSaveTreatment = async (treatment) => {
    try {
      // Remove temporary ID before sending to backend
      const { tempId, ...treatmentToSave } = treatment;
  
      const savedTreatment = await createTreatment(username, treatmentToSave);
  
      // Add the saved treatment to Redux state
      dispatch({ type: "ADD_TREATMENT", payload: savedTreatment });
  
      // Remove the temporary treatment and replace it with the saved treatment
      setNewTreatments(newTreatments.filter((t) => t.tempId !== tempId));
      fetchTreatments();
    } catch (error) {
      setError(`Error creating treatment: ${error.message}`);
    }
  };
  
  const handleEditTreatment = (treatment) => {
    setEditingTreatmentId(treatment._id);
    setEditFields({ name: treatment.name, description: treatment.description });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTreatment = await updateTreatment(editingTreatmentId, editFields);
      dispatch({ type: 'UPDATE_TREATMENT', payload: updatedTreatment });
      setEditingTreatmentId(null);
      setEditFields({ name: '', description: '' });
      fetchTreatments();
    } catch (error) {
      setError(`Error updating treatment: ${error.message}`);
    }
  };

  const handleToggleCheck = async (treatmentId, date) => {
    try {
      const updatedTreatment = await toggleCheck(treatmentId, date);
      dispatch({ type: 'SET_UPDATED_TREATMENT', payload: updatedTreatment });
      fetchTreatments();
    } catch (error) {
      setError(`Error toggling checkbox: ${error.message}`);
    }
  };

  const handleDeleteTreatment = async (treatmentId) => {
    try {
      await deleteTreatment(treatmentId);
      dispatch({ type: 'DELETE_TREATMENT', payload: treatmentId });
      fetchTreatments();
    } catch (error) {
      setError(`Error deleting treatment: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingTreatmentId(null);
    setEditFields({ name: '', description: '' });
  }

  return (
    <div className="followup-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <h2>{t("followup_title")}</h2>
      <p>{t("followup_description")}</p>
  
      <form className="followup-form" onSubmit={handleAddTreatment}>
        <div className="form-group">
          <label htmlFor="treatmentName">{t("form_treatmentName")}:</label>
          <input
            type="text"
            id="treatmentName"
            value={formFields.name}
            onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
            placeholder={t("form_treatmentName_placeholder")}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="treatmentDescription">{t("form_description")}:</label>
          <textarea
            id="treatmentDescription"
            value={formFields.description}
            onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
            placeholder={t("form_description_placeholder")}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="treatmentStartDate">{t("form_startDate")}:</label>
          <input
            type="date"
            id="treatmentStartDate"
            value={formFields.startDate}
            onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="treatmentEndDate">{t("form_endDate")}:</label>
          <input
            type="date"
            id="treatmentEndDate"
            value={formFields.endDate}
            onChange={(e) => setFormFields({ ...formFields, endDate: e.target.value })}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="treatmentFrequency">{t("form_frequency")}:</label>
          <select
            id="treatmentFrequency"
            value={formFields.frequency}
            onChange={(e) => setFormFields({ ...formFields, frequency: e.target.value })}
          >
            <option value="daily">{t("frequency_daily")}</option>
            <option value="weekly">{t("frequency_weekly")}</option>
            <option value="monthly">{t("frequency_monthly")}</option>
          </select>
        </div>
  
        <button type="submit" className="add-button">{t("add_button")}</button>
      </form>
  
      <div className="treatment-table-container">
        {[...treatments, ...newTreatments].map((treatment, index) => (
          <div key={treatment._id || `temp-${index}`} className="single-treatment-table">
            {editingTreatmentId === treatment._id ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={editFields.name}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                  placeholder={t("form_treatmentName_placeholder")}
                  className="edit-input"
                />
                <textarea
                  value={editFields.description}
                  onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                  placeholder={t("form_description_placeholder")}
                  className="edit-textarea"
                />
                <div className="action-buttons">
                  <button className="save-button" onClick={handleSaveEdit}>
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
                <div className="action-buttons">
                  <button className="icon-button edit-button" onClick={() => handleEditTreatment(treatment)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="icon-button delete-button" onClick={() => handleDeleteTreatment(treatment._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </>
            )}
            <table className="treatment-table">
              <thead>
                <tr>
                  <th>{t("table_description")}</th>
                  {treatment.checks.map((check, i) => (
                    <th key={`${check.date}-${i}`}>{check.date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{treatment.description}</td>
                  {treatment.checks.map((check, i) => (
                    <td key={`${check.date}-${i}`}>
                      <input
                        type="checkbox"
                        checked={check.done}
                        onChange={() => handleToggleCheck(treatment._id, check.date)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            {newTreatments.some((t) => t._id === treatment._id) && (
              <button className="save-button" onClick={() => handleSaveTreatment(treatment)}>
                <FontAwesomeIcon icon={faSave} /> {t("save_button")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default FollowUp;