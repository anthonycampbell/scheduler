import React, { useEffect, useState } from "react";
import Axios from 'axios';
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
    interviewers: []
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
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

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

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
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
