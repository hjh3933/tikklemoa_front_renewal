import { Link, useNavigate } from "react-router-dom";
import "../styles/header.scss";
import { useEffect, useState } from "react";

const Header = () => {
  // state
  const [token, setToken] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [img, setImg] = useState(null);
  const [badge, setBadge] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken !== null) {
      // 로그인 상태
      setNickname(localStorage.getItem("nickname"));
      if (localStorage.getItem("img") === "default.img") {
        setImg(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        );
      } else {
        setImg(localStorage.getItem("img"));
      }
      setBadge(localStorage.getItem("badge"));
    }
  }, []);

  // 로그아웃
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    // + 메인 페이지로 이동
    navigate("/");
    window.location.reload();
  };
  return (
    <>
      {/* <h2>header</h2> */}
      <div className="headerBox">
        <div className="logoBox">
          <Link to={"/community"} className="logo">
            TIKKLE MOA
          </Link>
        </div>
        <div className="navBox">
          <Link to={"/community"} className="community">
            COMMUNITY
          </Link>
          {token === null ? (
            <Link to={"/"} className="login">
              LOGIN
            </Link>
          ) : (
            <>
              <Link to={"/calendar"} className="calendar">
                CALENDAR
              </Link>
              <Link to={"/setting"} className="setting">
                SETTING
              </Link>
              <div className="logout" onClick={logout}>
                LOGOUT
              </div>
              <img src={img} alt="프로필이미지" className="profileImg" />
              <Link to={"/profile"} className="profile">
                {nickname}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
