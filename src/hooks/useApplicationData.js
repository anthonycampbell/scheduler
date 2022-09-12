import { React, useEffect, useState } from "react";
import Axios from "axios";
function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: []
  });

  const setDay = function (d) {
    setState((prev) => {
      return { ...prev, day: d }
    });
  }

  function bookInterview(id, interview) {
    return Axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then((res) => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState(prev => { return { ...prev, appointments } });
        return res;
      });
  }

  function cancelInterview(id) {
    return Axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState(prev => { return { ...prev, appointments } });
        return res;
      });
  }

  useEffect(() => {
    const daysUrl = 'http://localhost:8001/api/days';
    const appointmentsURL = 'http://localhost:8001/api/appointments';
    const interviewersURL = 'http://localhost:8001/api/interviewers';
    Promise.all([Axios.get(daysUrl), Axios.get(appointmentsURL), Axios.get(interviewersURL)])
      .then((all) => {
        setState((prev) => {
          return {
            ...prev,
            days: all[0].data,
            appointments: all[1].data,
            interviewers: all[2].data
          }
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;