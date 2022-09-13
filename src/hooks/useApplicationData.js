import { useEffect, useReducer } from "react";
import Axios from "axios";
const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
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
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: []
  });

  const setDay = function (d) {
    dispatch({ type: SET_DAY, value: d });
  }

  function bookInterview(id, interview) {
    return Axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        return res;
      });
  }

  function cancelInterview(id) {
    return Axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        return res;
      });
  }

  useEffect(() => {
    webSocket.onopen = function (evt) {
      webSocket.send("ping");
    };
    webSocket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === "SET_INTERVIEW") {
        dispatch({ type: SET_INTERVIEW, id: parsed.id, interview: parsed.interview });
      }
    }
    return () => { webSocket.close() };
  }, [])

  useEffect(() => {
    const daysUrl = 'http://localhost:8001/api/days';
    const appointmentsURL = 'http://localhost:8001/api/appointments';
    const interviewersURL = 'http://localhost:8001/api/interviewers';
    Promise.all([Axios.get(daysUrl), Axios.get(appointmentsURL), Axios.get(interviewersURL)])
      .then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          value: {
            days: all[0].data,
            appointments: all[1].data,
            interviewers: all[2].data
          }
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;