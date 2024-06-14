import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Profile from "../components/Profile";
import PwUpdate from "../components/PwUpdate";
import MyBoardContent from "../components/MyBoardContent";

const Mypage = () => {
  const [toggle, setToggle] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  return (
    <>
      <Header></Header>
      <div className="MyPage">
        <div className="MyPageBox">
          {toggle ? <Profile setToggle={setToggle} /> : <PwUpdate setToggle={setToggle} />}
          {toggle2 ? <MyBoardContent /> : <PwUpdate setToggle={setToggle} />}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Mypage;
