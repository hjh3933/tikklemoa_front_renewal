import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Profile from "../components/Profile";
import PwUpdate from "../components/PwUpdate";

const Mypage = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <Header></Header>

      {toggle ? <Profile setToggle={setToggle} /> : <PwUpdate setToggle={setToggle} />}
      <Footer></Footer>
    </>
  );
};

export default Mypage;
