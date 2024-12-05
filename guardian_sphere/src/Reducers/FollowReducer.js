const ADD_TREATMENT = "ADD_TREATMENT";
const TOGGLE_CHECK = "TOGGLE_CHECK";

const initialState = {
  treatments: []
};

function generateDates(startDate, frequency) {
  const start = new Date(startDate);
  const dates = [];

  if (frequency === "daily") {
    // Generate 7 consecutive daily checks
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      dates.push({
        date: newDate.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "weekly") {
    // Generate one check per week for 4 weeks
    for (let i = 0; i < 4; i++) {
      const newDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7);
      dates.push({
        date: newDate.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "monthly") {
    // Generate one check per month for 3 months
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

    default:
      return state;
  }
}
