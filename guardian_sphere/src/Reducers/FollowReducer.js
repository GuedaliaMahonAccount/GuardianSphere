const ADD_TREATMENT = "ADD_TREATMENT";
const TOGGLE_CHECK = "TOGGLE_CHECK";
const DELETE_TREATMENT = "DELETE_TREATMENT";
const UPDATE_TREATMENT = "UPDATE_TREATMENT";

const initialState = {
  treatments: []
};

function generateDates(startDate, frequency) {
  const start = new Date(startDate);
  const dates = [];

  if (frequency === "daily") {
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      dates.push({
        date: newDate.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "weekly") {
    for (let i = 0; i < 4; i++) {
      const newDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7);
      dates.push({
        date: newDate.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "monthly") {
    for (let i = 0; i < 3; i++) {
      const newDate = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
      dates.push({
        date: newDate.toISOString().split("T")[0],
        done: false
      });
    }
  }

  return dates;
}

export default function followReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TREATMENT: {
      const newTreatment = {
        id: Date.now(),
        name: action.payload.name,
        description: action.payload.description,
        startDate: action.payload.startDate,
        frequency: action.payload.frequency,
        checks: generateDates(action.payload.startDate, action.payload.frequency)
      };
      return {
        ...state,
        treatments: [...state.treatments, newTreatment]
      };
    }

    case TOGGLE_CHECK: {
      return {
        ...state,
        treatments: state.treatments.map((treatment) => {
          if (treatment.id === action.payload.treatmentId) {
            return {
              ...treatment,
              checks: treatment.checks.map((c) =>
                c.date === action.payload.date ? { ...c, done: !c.done } : c
              )
            };
          }
          return treatment;
        })
      };
    }

    case DELETE_TREATMENT: {
      return {
        ...state,
        treatments: state.treatments.filter(
          (treatment) => treatment.id !== action.payload.treatmentId
        )
      };
    }

    case UPDATE_TREATMENT: {
      return {
        ...state,
        treatments: state.treatments.map((treatment) => {
          if (treatment.id === action.payload.treatmentId) {
            return {
              ...treatment,
              name: action.payload.name,
              description: action.payload.description
            };
          }
          return treatment;
        })
      };
    }

    default:
      return state;
  }
}
