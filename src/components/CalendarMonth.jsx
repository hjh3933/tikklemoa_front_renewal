import { useEffect, useState } from "react";
import "../styles/calendarSet.scss";
import "../styles/calendarMonth.scss";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CalendarMonth = ({ setSelectedDate }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}`;
  const formattedSelectedDate = `${year}-${month}-${day}`;

  // state
  const navigate = useNavigate();
  const [date, setDate] = useState(formattedDate);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  console.log("new Date>>", date);

  // 마운트 될 때 이번달 데이터 가져오는 함수
  const getMonth = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_SERVER}/getMonth/${date}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      console.log(res.data);
      setMonthData(res.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("캘린더를 불러오는 중 오류 발생:", error);
        alert("캘린더를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    getMonth();
    // 처음엔 오늘날짜로 설정
    setSelectedDate(formattedSelectedDate);
  }, []);

  useEffect(() => {
    getMonth();
  }, [date]);

  const onChange = async (newDate) => {
    const today = newDate;
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}`;
    const formattedSelectedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedSelectedDate);
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    const year = activeStartDate.getFullYear();
    const month = String(activeStartDate.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${year}-${month}`;
    const formattedSelectedDate = `${year}-${month}-01`;
    setDate(formattedDate);
    setActiveStartDate(activeStartDate);
    setSelectedDate(formattedSelectedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const currentDate = new Date(); // 현재 날짜를 가져옴
      const currentMonth = currentDate.getMonth(); // 현재 달을 가져옴
      const day = date.getDate();
      // day별로 비용을 가져와서 5가지 기준으로 구분
      // 각각의 class를 리턴, class는 state로 관리해서 색깔 선택 가능하도록 설정
      // if문은 설정값 기준으로 하기
      const month = date.getMonth();
      // 중요!! 실제로는 변경, 달 기준이 아니라 수입, 지출 내역 없으면 class 추가 없이 return 하도록 함
      if (month != currentMonth) return;

      if (day <= 9) {
        return "react-calendar__tile react-calendar__tile--red1";
      } else if (day <= 15) {
        return "react-calendar__tile react-calendar__tile--red2";
      } else if (day <= 31) {
        return "react-calendar__tile react-calendar__tile--red3";
      }
    }
    return null;
  };

  const tileContent = ({ date }) => {
    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return <div style={{ fontWeight: "bold" }}>Today</div>;
    }
    return null;
  };

  return (
    <>
      <div className="CalendarMonth">
        <div className="react_calendar">
          <Calendar
            onChange={onChange}
            value={date}
            onActiveStartDateChange={onActiveStartDateChange}
            tileClassName={tileClassName}
            tileContent={tileContent}
          />
        </div>
      </div>
    </>
  );
};

export default CalendarMonth;
