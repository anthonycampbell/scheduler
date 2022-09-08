export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  let appointments = [];
  const dayObject = state.days.find(d => d.name === day);
  dayObject ? appointments = dayObject.appointments : null;
  const ret = [];
  for (const a of appointments){
    ret.push(state.appointments[a])
  }
  return ret;
}