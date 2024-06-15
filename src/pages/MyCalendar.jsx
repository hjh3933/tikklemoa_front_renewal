import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CalendarSet from "../components/CalendarSet";
import CalendarStats from "../components/CalendarStats";
import "../styles/calendarSet.scss";
import "../styles/calendarStats.scss";
import { useNavigate } from "react-router-dom";

const MyCalendar = () => {
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("로그인 회원만 이용할 수 있습니다");
      navigate(`/login`);
    }
  }, [navigate]);
  return (
    <>
      <Header></Header>
      <div className="MyCalendar">
        {toggle ? <CalendarSet setToggle={setToggle} /> : <CalendarStats setToggle={setToggle} />}
      </div>
      <Footer></Footer>
    </>
  );
};

export default MyCalendar;
