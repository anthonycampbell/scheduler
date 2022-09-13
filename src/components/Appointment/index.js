import React, { useEffect } from 'react';
import 'components/Appointment/styles.scss';
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Form from './Form';
import Show from "components/Appointment/Show";
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function cancel() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewer={props.interview.interviewer.id}
          student={props.interview.student}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onCancel={back} onConfirm={cancel} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === ERROR_SAVE && <Error message="Could not save appointment." onClose={back} />}
      {mode === ERROR_DELETE && <Error message="Could not cancel appointment." onClose={back} />}
    </article>
  )
}