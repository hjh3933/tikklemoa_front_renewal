import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Join from "../components/Join";
import Login from "../components/Login";

const MainPage = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <Header></Header>
      {toggle ? <Login setToggle={setToggle} /> : <Join setToggle={setToggle} />}
      <Footer></Footer>
    </>
  );
};

export default MainPage;
