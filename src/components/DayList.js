import React from 'react';
import DayListItem from './DayListItem';
export default function DayList(props) {
  const dayItems = props.days.map((d, i) => {
    return <DayListItem key={i} name={d.name} spots={d.spots} selected={d.name === props.value} setDay={props.onChange}  /> 
  });
  return (
    <ul>{dayItems}</ul>
  );
}