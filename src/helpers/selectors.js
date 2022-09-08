export function getAppointmentsForDay(state, day) {
  let appointments = [];
  const dayObject = state.days.find(d => d.name === day);
  dayObject ? appointments = dayObject.appointments : appointments = [];
  const ret = [];
  for (const a of appointments){
    ret.push(state.appointments[a])
  }
  return ret;
}