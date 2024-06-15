import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Profile from "../components/Profile";
import PwUpdate from "../components/PwUpdate";
import MyBoardContent from "../components/MyBoardContent";
import MyPostContent from "../components/MyPostContent";
import { useLocation, useNavigate } from "react-router-dom";

const Mypage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialToggle = searchParams.get("toggle") !== "false";
  const initialToggle2 = searchParams.get("toggle2") !== "false";

  const [toggle, setToggle] = useState(initialToggle);
  const [toggle2, setToggle2] = useState(initialToggle2);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("로그인 회원만 이용할 수 있습니다");
      navigate(`/login`);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("toggle", toggle);
    params.set("toggle2", toggle2);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [toggle, toggle2, navigate, location.pathname]);

  return (
    <>
      <Header></Header>
      <div className="MyPage">
        <div className="MyPageBox">
          {toggle ? <Profile setToggle={setToggle} /> : <PwUpdate setToggle={setToggle} />}
          {toggle2 ? (
            <MyBoardContent setToggle2={setToggle2} />
          ) : (
            <MyPostContent setToggle2={setToggle2} />
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Mypage;
