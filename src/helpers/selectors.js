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

export function getInterview(state, interview) {
  if (!interview || !interview.interviewer || !state.interviewers[interview.interviewer] ){
    return null;
  }
  console.log(interview);
  const retInterview = {
    interviewer: {
      id: interview.interviewer,
      name: state.interviewers[interview.interviewer].name,
      avatar: state.interviewers[interview.interviewer].avatar
    },
    student: interview.student
  };
  return retInterview;
}