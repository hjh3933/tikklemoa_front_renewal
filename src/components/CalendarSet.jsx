import { useState } from "react";
import "../styles/calendarSet.scss";
import CalendarMonth from "./CalendarMonth";
import CalendarDate from "./CalendarDate";

const CalendarSet = ({ setToggle }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <>
      <div className="CalendarSet">
        <div className="Title">MY CALENDAR</div>
        <div className="calendarContentBox">
          <CalendarMonth setSelectedDate={setSelectedDate} />
          <CalendarDate selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
};

export default CalendarSet;
