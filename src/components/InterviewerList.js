import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import 'components/InterviewerList.scss';
import PropTypes from 'prop-types';

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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;