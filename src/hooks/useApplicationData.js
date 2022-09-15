import { useEffect, useReducer } from "react";
import Axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
function useApplicationData() {
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
    const daysUrl = '/api/days';
    const appointmentsURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';
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