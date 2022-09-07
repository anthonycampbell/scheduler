import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import 'components/InterviewerList.scss';

function InterviewerList(props) {
  const itvwrs = props.interviewers.map((interviewer, i) => {
    return <InterviewerListItem
      key={i}
      avatar={interviewer.avatar}
      name={interviewer.name}
      setInterviewer={() => props.onChange(interviewer.id)} 
      selected={props.value === interviewer.id} />
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {itvwrs}
      </ul>
    </section>
  );
}
export default InterviewerList;