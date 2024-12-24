import React, { useState, useEffect } from 'react';
import './FollowUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faTimes, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

// Import the API functions for communicating with the server
import { getByUsername, createTreatment, updateTreatment, deleteTreatment, toggleCheck } from './followUpReq';

const FollowUp = () => {
  const { t } = useTranslation("FollowUp");
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state.follow);
  const [newTreatments, setNewTreatments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [editingTreatmentId, setEditingTreatmentId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAddDays, setEditAddDays] = useState(''); // New state for "Add Days"
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const data = await getByUsername(username);
      const treatmentsArray = Array.isArray(data) ? data : [];
      dispatch({ type: "SET_TREATMENTS", payload: treatmentsArray });
    } catch (error) {
      setError("Error fetching treatments: " + error.message);
    }
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    if (!name || !description || !startDate) {
      alert(t('form_error_fill_all'));
      return;
    }

    const tempTreatment = {
      id: Date.now(),
      name,
      description,
      startDate,
      endDate,
      frequency,
      checks: generateDates(startDate, endDate, frequency),
    };

    try{
      // Send the treatment data to the server
      const username = localStorage.getItem('username'); // Get the username from localStorage
      const response = await createTreatment(username, tempTreatment);

      // If the server responds successfully, update the local state
      if (response.status === 201) {
        // Update the local state with the server's response
        dispatch({ type: "ADD_TREATMENT", payload: response.data });
      }
    } catch(error){
      console.error("Error adding treatment:", error);
    alert("Failed to add treatment. Please try again.");
    }

    //reset and close the form
    setNewTreatments([...newTreatments, tempTreatment]);

    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setFrequency('daily');

    fetchTreatments();
    setShowForm(false); // Hide form after submission
  };

  const generateDates = (startDate, endDate, frequency) => {
    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : null;

    if (!end) {
      if (frequency === "daily") {
        end = new Date(start);
        end.setDate(end.getDate() + 6);
      } else if (frequency === "weekly") {
        end = new Date(start);
        end.setDate(end.getDate() + (4 * 7 - 1));
      } else if (frequency === "monthly") {
        end = new Date(start.getFullYear(), start.getMonth() + 2, start.getDate());
      }
    }

    const dates = [];
    if (frequency === "daily") {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push({ date: d.toISOString().split("T")[0], done: false });
      }
    } else if (frequency === "weekly") {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        dates.push({ date: d.toISOString().split("T")[0], done: false });
      }
    } else if (frequency === "monthly") {
      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        dates.push({ date: d.toISOString().split("T")[0], done: false });
      }
    }
    return dates;
  };

  const handleEditTreatment = (treatment) => {
    setEditingTreatmentId(treatment.id);
    setEditName(treatment.name);
    setEditDescription(treatment.description);
    setEditAddDays(0); // Reset "Add Days" field when entering edit mode
  };

  const handleSaveEdit = async (treatmentId) => {
    if (!editName || !editDescription) {
      alert(t('form_error_fill_all'));
      return;
    }
    try {
      // Update the treatment in the backend
      const updatedTreatment = await updateTreatment(treatmentId, {
        name: editName,
        description: editDescription,
        date: parseInt(editAddDays) || 0, // Send the "Add Days" value to the server
      });

      // Update the local state
      const updatedTreatments = [...treatments, ...newTreatments].map((treatment) =>
        treatment.id === treatmentId ? {
          ...treatment,
          name: editName,
          description: editDescription,
          startDate: updatedTreatment.startDate, // Update startDate if changed
          endDate: updatedTreatment.endDate, // Update endDate if changed
        } : treatment
      );

      // Update the Redux state
      dispatch({ type: "SET_TREATMENTS", payload: updatedTreatments });

      // Reset edit state
      setEditingTreatmentId(null);
      setEditName('');
      setEditDescription('');
      setEditAddDays(''); // Reset "Add Days" field after saving
    } catch (error) {
      setError("Error updating treatment: " + error.message);
    }

    fetchTreatments();
  };

  const handleCancelEdit = () => {
    setEditingTreatmentId(null);
    setEditName('');
    setEditDescription('');
    setEditAddDays(''); // Reset "Add Days" field when canceling
  };

  const handleDeleteTreatment = async (treatmentId) => {
    try {
      await deleteTreatment(treatmentId);
      dispatch({ type: "DELETE_TREATMENT", payload: { treatmentId } });
    } catch (error) {
      alert("Need to save before");
      setError("Error deleting treatment: " + error.message);
    }

    fetchTreatments();
  };

  return (
    <div className="followup-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <button onClick={() => setShowForm(!showForm)} className="new-treatment-button">
        <FontAwesomeIcon icon={faPlus} /> {t("new_treatment")}
      </button>
      <h2>{t("followup_title")}</h2>
      <p>{t("followup_description")}</p>

      {showForm && (
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
            <label htmlFor="treatmentEndDate">{t("form_endDate")}:</label>
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
      )}

      <div className="treatment-table-container">
        {[...treatments, ...newTreatments].map((treatment) => (
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
                <div className="form-group">
                  <label htmlFor="addDays">{t("form_add_days")}:</label>
                  <input
                    type="number"
                    id="addDays"
                    value={editAddDays}
                    onChange={(e) => setEditAddDays(e.target.value)}
                    placeholder={t("form_add_days_placeholder")}
                    className="edit-input"
                  />
                </div>
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
                  {treatment.checks.map((check, index) => (
                    <td key={index}>
                      <input type="checkbox" checked={check.done} readOnly />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUp;