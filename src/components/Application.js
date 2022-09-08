import React, { useEffect, useState } from "react";
import Axios from 'axios';
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = function (d) {
    setState((prev) => {
      return { ...prev, day: d }
    });
  }
  useEffect(() => {
    const daysUrl = 'http://localhost:8001/api/days';
    const appointmentsURL = 'http://localhost:8001/api/appointments';
    Promise.all([Axios.get(daysUrl), Axios.get(appointmentsURL)])
      .then((all) => {
        setState((prev) => {
          return {
            ...prev, days: all[0].data,
            appointments: all[1].data,
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
        {dailyAppointments.map((a, i) => {
          return <Appointment key={a.id} {...a} />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
