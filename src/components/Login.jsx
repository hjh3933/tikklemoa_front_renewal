import { Link, useNavigate } from "react-router-dom";
import "../styles/login.scss";
import { useRef, useState } from "react";
import axios from "axios";

const Login = ({ setToggle }) => {
  const navigate = useNavigate();
  // ref
  const useridRef = useRef();
  const userpwRef = useRef();

  // 로그인
  const loginUser = async () => {
    if (useridRef.current.value.trim() == "") {
      useridRef.current.focus();
      return alert("아이디를 입력하세요");
    }
    if (userpwRef.current.value.trim() == "") {
      userpwRef.current.focus();
      return alert("비밀번호를 입력하세요");
    }
    // 로그인
    const data = {
      userid: useridRef.current.value,
      userpw: userpwRef.current.value,
    };
    const res = await axios.post(process.env.REACT_APP_API_SERVER + "/auth/signin", data);
    // console.log(res.data);
    if (res.data.result) {
      alert(res.data.msg);
      // 로그인 성공, user정보 로컬스토리지에 저장
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", res.data.nickname);
      localStorage.setItem("img", res.data.img);
      localStorage.setItem("badge", res.data.badge);

      navigate("/?page=1");
      window.location.reload();
    } else {
      alert(res.data.msg);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loginUser();
    }
  };

  return (
    <div className="Login">
      {/* <h2>Login 폼</h2> */}
      <div className="loginBox">
        <div className="inputBox">
          <div className="leftBox">
            <div className="idInput">
              <div>ID</div>
            </div>
            <div className="pwInput">
              <div>PW</div>
            </div>
          </div>
          <div className="rightBox">
            <div className="idInput">
              <input type="text" name="userid" id="userid" ref={useridRef} />
            </div>
            <div className="pwInput">
              <input
                type="password"
                name="userpw"
                id="userpw"
                ref={userpwRef}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <div className="loginBtn" onClick={loginUser}>
          LOGIN
        </div>
        <div className="loginOrJoin">
          <div className="getLogin" onClick={() => setToggle(true)}>
            로그인
          </div>
          <dir>|</dir>
          <div className="getJoin" onClick={() => setToggle(false)}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
