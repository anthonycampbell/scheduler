import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const classes = classNames('day-list__item', {'day-list__item--selected': props.selected}, {'day-list__item--full': props.spots < 1});
  return (
    <li onClick={() => props.setDay(props.name)} className={classes}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots > 1 && `${props.spots} spots remaining`}
      {props.spots === 1 && `1 spot remaining`}
      {props.spots < 1 && `no spots remaining`} </h3>
    </li>
  );
}