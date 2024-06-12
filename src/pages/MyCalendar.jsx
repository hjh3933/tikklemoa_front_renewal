import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CalendarSet from "../components/CalendarSet";
import CalendarStats from "../components/CalendarStats";

const MyCalendar = () => {
  const [toggle, setToggle] = useState(true);
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
