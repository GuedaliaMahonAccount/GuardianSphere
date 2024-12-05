const ADD_TREATMENT = "ADD_TREATMENT";
const TOGGLE_CHECK = "TOGGLE_CHECK";
const DELETE_TREATMENT = "DELETE_TREATMENT";
const UPDATE_TREATMENT = "UPDATE_TREATMENT";

const initialState = {
  treatments: []
};

function generateDates(startDate, endDate, frequency) {
  const start = new Date(startDate);
  let end = endDate ? new Date(endDate) : null;

  // If no endDate is given, we can default to a certain range.
  // For example, if no endDate, generate fixed periods as before.
  // Otherwise, generate all intervals up to endDate.
  if (!end) {
    // If end is not provided, default to a fixed number of checks:
    // This is optional. You can decide what to do in this scenario.
    if (frequency === "daily") {
      end = new Date(start);
      end.setDate(end.getDate() + 6); // 7 days total
    } else if (frequency === "weekly") {
      end = new Date(start);
      end.setDate(end.getDate() + (4 * 7 - 1)); // 4 weeks
    } else if (frequency === "monthly") {
      end = new Date(start.getFullYear(), start.getMonth() + 2, start.getDate());
    }
  }

  const dates = [];

  if (frequency === "daily") {
    // Generate every day between start and end inclusive
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push({
        date: d.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "weekly") {
    // Generate every 7 days between start and end inclusive
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      dates.push({
        date: d.toISOString().split("T")[0],
        done: false
      });
    }
  } else if (frequency === "monthly") {
    // Generate same day of month until end date
    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      dates.push({
        date: d.toISOString().split("T")[0],
        done: false
      });
    }
  }

  return dates;
}

export default function followReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TREATMENT: {
      const { name, description, startDate, endDate, frequency } = action.payload;
      const checks = generateDates(startDate, endDate, frequency);
      const newTreatment = {
        id: Date.now(),
        name,
        description,
        startDate,
        endDate,
        frequency,
        checks
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
