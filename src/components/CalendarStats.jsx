import { useState } from "react";
import "../styles/calendarStats.scss";
import CalendarStatsContent from "./CalendarStatsContent";

const CalendarStats = ({ setToggle }) => {
  return (
    <>
      <div className="CalendarStats">
        <div className="Title">CALENDAR STATS</div>
        <div className="calendarContentBox">
          <CalendarStatsContent />
          <div className="CalBtnBox">
            <div onClick={() => setToggle(true)}>관리</div>
            <div onClick={() => setToggle(false)} className="nowSelected">
              통계
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarStats;
