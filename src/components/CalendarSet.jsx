import { useState } from "react";
import "../styles/calendarSet.scss";
import CalendarMonth from "./CalendarMonth";
import CalendarDate from "./CalendarDate";

const CalendarSet = ({ setToggle }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateData, setDateData] = useState([]);
  return (
    <>
      <div className="CalendarSet">
        <div className="Title">MY CALENDAR</div>
        <div className="calendarContentBox">
          <CalendarMonth setSelectedDate={setSelectedDate} dateData={dateData} />
          <CalendarDate selectedDate={selectedDate} dateData={dateData} setDateData={setDateData} />
          <div className="CalBtnBox">
            <div onClick={() => setToggle(true)} className="nowSelected">
              관리
            </div>
            <div onClick={() => setToggle(false)}>통계</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarSet;
