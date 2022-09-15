export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

export default function reducer(state, action) {
  switch (action.type) {
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const day = state.days.filter((d) => d.name === state.day)[0] //get the selected day object
      const appointmentObjects = day.appointments.map((id) => { return appointments[id] });
      const spots = appointmentObjects.reduce((prev, curr) => {
        if (curr.interview === null) {
          return prev + 1;
        }
        return prev + 0;
      }, 0);
      day.spots = spots
      return { ...state, appointments }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}