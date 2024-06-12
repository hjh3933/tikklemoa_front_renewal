import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../styles/calendarSet.scss";
import "../styles/calendarMonth.scss";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CalendarMonth = ({ setSelectedDate, dateData }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}`;
  const formattedSelectedDate = `${year}-${month}-${day}`;

  // 관리
  const themes = ["none", "purple", "green", "blue", "red"];

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState(formattedDate);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  const [setting, setSetting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // setting 관련 state
  const [theme, setTheme] = useState("");
  const [lone, setLone] = useState("");
  const [ltwo, setLtwo] = useState("");
  const [lthree, setLthree] = useState("");
  const [priceView, setPriceView] = useState(false);

  // 마운트 될 때 이번달 데이터 + setting 가져오는 함수
  const getMonth = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_SERVER}/getMonth/${date}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const resSet = await axios.get(`${process.env.REACT_APP_API_SERVER}/getSetting`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      // console.log(res.data);
      // console.log(resSet.data);

      // state 설정
      setMonthData(res.data);
      setSetting(resSet.data);
      setTheme(res.data.theme);
      setLone(res.data.lone);
      setLtwo(res.data.ltwo);
      setLthree(res.data.lthree);
      setPriceView(res.data.priceView);
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
    if (setting) {
      setTheme(setting.theme);
      setLone(setting.lone);
      setLtwo(setting.ltwo);
      setLthree(setting.lthree);
      setPriceView(setting.priceView);
    }
  }, [setting]);

  useEffect(() => {
    // 컴포넌트를 숨기고 데이터를 가져옴
    const fetchDataAndLoadStyles = async () => {
      await getMonth();
      setSelectedDate(formattedSelectedDate);

      // 데이터 로드 후 100ms 후에 컴포넌트를 표시
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    };

    fetchDataAndLoadStyles();
  }, []);

  useEffect(() => {
    getMonth();
  }, [dateData]);

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
      const tileYear = date.getFullYear();
      const tileMonth = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
      const tileDay = date.getDate();
      const tileDateStr = `${tileYear}-${String(tileMonth).padStart(2, "0")}-${String(
        tileDay
      ).padStart(2, "0")}`;

      // 해당 날짜와 일치하는 monthData를 찾음
      const matchingData = monthData.find((data) => data.date === tileDateStr);
      // if (!matchingData) return `react-calendar__tile react-calendar__tile--none`;
      if (matchingData) {
        const { lone, ltwo, lthree, theme, priceView } = setting;
      }

      if (!matchingData) return `react-calendar__tile react-calendar__tile--${theme}none`;
      const { dateTotal } = matchingData;

      if (theme === "none") return `react-calendar__tile react-calendar__tile--${theme}`;
      if (dateTotal <= lone) {
        return `react-calendar__tile react-calendar__tile--${theme}lone`;
      } else if (dateTotal <= ltwo) {
        return `react-calendar__tile react-calendar__tile--${theme}ltwo`;
      } else if (dateTotal <= lthree) {
        return `react-calendar__tile react-calendar__tile--${theme}lthree`;
      } else {
        return `react-calendar__tile react-calendar__tile--${theme}more`;
      }
    }
    return null;
  };

  // const tileContent = ({ date }) => {
  //   const today = new Date();
  //   if (
  //     date.getFullYear() === today.getFullYear() &&
  //     date.getMonth() === today.getMonth() &&
  //     date.getDate() === today.getDate()
  //   ) {
  //     return <div style={{ fontWeight: "bold" }}>Today</div>;
  //   }
  //   return null;
  // };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const tileYear = date.getFullYear();
      const tileMonth = date.getMonth() + 1;
      const tileDay = date.getDate();
      const tileDateStr = `${tileYear}-${String(tileMonth).padStart(2, "0")}-${String(
        tileDay
      ).padStart(2, "0")}`;

      const matchingData = monthData.find((data) => data.date === tileDateStr);
      if (!matchingData) return null;

      const { totalMinus, totalPlus, dateTotal } = matchingData;
      const { priceView } = setting;

      if (priceView) {
        return (
          <div className="tile-content">
            <div className="total_minus">Total Minus: {totalMinus}</div>
            <div className="total_plus">Total Plus: {totalPlus}</div>
            <div className="date_total">Date Total: {dateTotal}</div>
          </div>
        );
      }
    }
    return null;
  };

  const handleUpdateSettings = async () => {
    if (Number(lone) >= Number(ltwo) || Number(ltwo) >= Number(lthree)) {
      alert("테마 기준값을 올바르게 설정해주세요.");
      return;
    }
    const updatedSettings = {
      id: setting.id,
      theme,
      Lone: Number(lone),
      Ltwo: Number(ltwo),
      Lthree: Number(lthree),
      priceView,
    };

    const storedToken = localStorage.getItem("token");
    try {
      await axios.patch(`${process.env.REACT_APP_API_SERVER}/updateSetting`, updatedSettings, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      alert("설정이 업데이트되었습니다.");
      setIsModalOpen(false);
      getMonth(); // 업데이트 후 데이터를 다시 불러옵니다.
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("설정을 업데이트하는 중 오류 발생:", error);
        alert("설정을 업데이트하는 중 오류가 발생했습니다.");
      }
    }
  };

  //
  useEffect(() => {
    if (!isModalOpen && setting) {
      // 모달이 닫힐 때 input 초기화
      setTheme(setting.theme);
      setLone(setting.lone);
      setLtwo(setting.ltwo);
      setLthree(setting.lthree);
      setPriceView(setting.priceView);
    }
  }, [isModalOpen, setting]);

  return (
    <>
      <div className={`CalendarMonth ${isLoaded ? "loaded" : "loading"}`}>
        <div className="setting" onClick={() => setIsModalOpen(true)}>
          <i className="material-icons">settings</i>
        </div>
        <div className="react_calendar">
          <Calendar
            onChange={onChange}
            value={date}
            onActiveStartDateChange={onActiveStartDateChange}
            tileClassName={tileClassName}
            tileContent={tileContent}
          />
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
              <h2>Settings</h2>
              <div className="theme">
                <div className="theme_title">테마</div>
                {themes.map((the) => (
                  <div key={the}>
                    <input
                      type="radio"
                      id={the}
                      name="theme"
                      value={the}
                      checked={the === theme}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                    <label htmlFor={the}>{the}</label>
                  </div>
                ))}
              </div>
              <div className="priceLevel">
                <div className="priceLevel_title">가격 기준</div>
                <input
                  type="number"
                  name="lone"
                  value={lone}
                  onChange={(e) => setLone(e.target.value)}
                />
                <input
                  type="number"
                  name="ltwo"
                  value={ltwo}
                  onChange={(e) => setLtwo(e.target.value)}
                />
                <input
                  type="number"
                  name="lthree"
                  value={lthree}
                  onChange={(e) => setLthree(e.target.value)}
                />
              </div>
              <div className="priceView">
                <div className="priceView_title">일별 총계 표시</div>
                <input
                  type="radio"
                  id="priceView-true"
                  name="priceView"
                  value="true"
                  checked={priceView === true}
                  onChange={() => setPriceView(true)}
                />
                <label htmlFor="priceView-true">true</label>

                <input
                  type="radio"
                  id="priceView-false"
                  name="priceView"
                  value="false"
                  checked={priceView === false}
                  onChange={() => setPriceView(false)}
                />
                <label htmlFor="priceView-false">false</label>
              </div>
              <div className="btnBox">
                <div className="insertBtn" onClick={handleUpdateSettings}>
                  수정
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarMonth;
