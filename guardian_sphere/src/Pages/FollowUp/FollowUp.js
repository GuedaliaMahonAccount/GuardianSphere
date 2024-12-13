import React, { useState, useEffect } from 'react';
import './FollowUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
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
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');

const nothing = error;


useEffect(() => {
  fetchTreatments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const fetchTreatments = async () => {
    try {
      const data = await getByUsername(username);
      console.log("Fetched treatments:", data); // Debugging
      const treatmentsArray = Array.isArray(data) ? data : []; // Adjusted
      dispatch({ type: "SET_TREATMENTS", payload: treatmentsArray });
    } catch (error) {
      setError("Error fetching treatments: " + error.message);
    }
  };    

  const generateDates = (startDate, endDate, frequency) => {
    console.log(nothing); 
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

    setNewTreatments([...newTreatments, tempTreatment]);

    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setFrequency('daily');

    fetchTreatments();
  };

  const handleSaveTreatment = async (treatment) => {
    try {
      const createdTreatment = await createTreatment(username, treatment);
      dispatch({ type: "ADD_TREATMENT", payload: createdTreatment });
      setNewTreatments(newTreatments.filter((t) => t.id !== treatment.id));
    } catch (error) {
      setError("Error creating treatment: " + error.message);
    }

    fetchTreatments();
  };

  const handleEditTreatment = (treatment) => {
    setEditingTreatmentId(treatment.id);
    setEditName(treatment.name);
    setEditDescription(treatment.description);
  };

  const handleSaveEdit = async (treatmentId) => {
    if (!editName || !editDescription) {
      alert(t('form_error_fill_all'));
      return;
    }
    try {
      const updatedTreatment = await updateTreatment(treatmentId, { name: editName, description: editDescription });
      dispatch({ type: "UPDATE_TREATMENT", payload: updatedTreatment });
      setEditingTreatmentId(null);
      setEditName('');
      setEditDescription('');
    } catch (error) {
      setError("Error updating treatment: " + error.message);
    }

    fetchTreatments();
  };

  const handleCancelEdit = () => {
    setEditingTreatmentId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleToggleCheck = async (treatmentId, date) => {
    try {
      // Optimistic update: Toggle locally first
      dispatch({
        type: "TOGGLE_CHECK",
        payload: { treatmentId, date },
      });
  
      // Attempt to toggle the check in the backend
      const updatedTreatment = await toggleCheck(treatmentId, date);
  
      // If successful, update the reducer with the latest backend state
      dispatch({
        type: "SET_UPDATED_TREATMENT",
        payload: updatedTreatment,
      });
      fetchTreatments();
    } catch (error) {
      // Log the error but keep the optimistic update
      console.error("Error toggling checkbox:", error.message);
      alert("Need to save before");
  
      // Optionally show a warning to the user
      setError("Could not sync with server, working offline.");
    }
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

      <div className="treatment-table-container">
  {[...treatments, ...newTreatments].map((treatment, treatmentIndex) => (
    <div key={`${treatment.id}-${treatmentIndex}`} className="single-treatment-table">
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
            <button className="save-button" onClick={() => handleSaveEdit(treatment._id)}>
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
            {treatment.checks.map((check, index) => (
              <th key={`${check.date}-${index}`}>{check.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{treatment.description}</td>
            {treatment.checks.map((check, index) => (
              <td key={`${check.date}-${index}`}>
                <input
                  type="checkbox"
                  checked={check.done}
                  onChange={() =>
                    handleToggleCheck(
                      treatment._id,
                      check.date,
                      !treatments.some((t) => t.id === treatment._id)
                    )
                  }
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {!treatments.some((t) => t.id === treatment.id) && (
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